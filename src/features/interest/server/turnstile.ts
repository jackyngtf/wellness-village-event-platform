import "server-only";

import { z } from "zod";

const siteverifyUrl =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const siteverifyTimeoutMs = 5_000;
const maxSiteverifyResponseBytes = 64 * 1_024;

export const portfolioTurnstileAction = "portfolio_contact_submit" as const;

export interface TurnstileServerConfig {
  readonly siteverifyCredential: string;
  readonly expectedAction: typeof portfolioTurnstileAction;
  readonly expectedHostname: string;
}

const siteverifyResponseSchema = z
  .object({
    success: z.boolean(),
    action: z.string().optional(),
    hostname: z.string().optional(),
  })
  .passthrough();

async function readBoundedJson(response: Response): Promise<unknown> {
  const declaredLength = response.headers.get("content-length")?.trim();
  if (
    declaredLength &&
    /^\d+$/.test(declaredLength) &&
    Number(declaredLength) > maxSiteverifyResponseBytes
  ) {
    throw new Error("provider response rejected");
  }
  if (!response.body) throw new Error("provider response rejected");

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxSiteverifyResponseBytes) {
      await reader.cancel().catch(() => undefined);
      throw new Error("provider response rejected");
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
}

export interface VerifyTurnstileOptions {
  readonly config: TurnstileServerConfig;
  readonly request: Request;
  readonly token: string;
  readonly fetcher?: typeof fetch;
}

/** Server-side verification fails closed and never logs token/provider detail. */
export async function verifyTurnstileToken({
  config,
  request,
  token,
  fetcher = globalThis.fetch,
}: Readonly<VerifyTurnstileOptions>): Promise<boolean> {
  const normalizedToken = token.trim();
  if (normalizedToken.length === 0 || normalizedToken.length > 2_048) {
    return false;
  }

  const body = new URLSearchParams();
  body.set("secret", config.siteverifyCredential);
  body.set("response", normalizedToken);
  const remoteIp = request.headers.get("cf-connecting-ip")?.trim() ?? "";
  if (remoteIp.length > 0 && remoteIp.length <= 64) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetcher(siteverifyUrl, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(siteverifyTimeoutMs),
    });
    if (!response.ok) return false;

    const parsed = siteverifyResponseSchema.safeParse(
      await readBoundedJson(response),
    );
    return (
      parsed.success &&
      parsed.data.success &&
      parsed.data.action === config.expectedAction &&
      parsed.data.hostname === config.expectedHostname
    );
  } catch {
    return false;
  }
}
