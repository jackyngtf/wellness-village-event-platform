import { interestSubmissionSchema } from "@/features/interest/schema";
import {
  getInterestServerConfig,
  type InterestServerConfig,
} from "@/features/interest/server/config";
import {
  createInterestQueuePayload,
  getInterestSubmissionsQueue,
  getSourcePage,
  type InterestSubmissionsQueue,
} from "@/features/interest/server/queue";
import {
  checkPostVerificationRateLimit,
  checkPreVerificationRateLimit,
  preflightInterestRateLimiters,
  type RateLimitOutcome,
} from "@/features/interest/server/rate-limit";
import {
  verifyTurnstileToken,
  type VerifyTurnstileOptions,
} from "@/features/interest/server/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxRequestBodyBytes = 8_192;
const responseHeaders = { "cache-control": "no-store" } as const;

type ReadJsonResult =
  | Readonly<{ ok: true; value: unknown }>
  | Readonly<{ ok: false; status: 400 | 413 }>;

async function readBoundedJson(request: Request): Promise<ReadJsonResult> {
  const contentLength = request.headers.get("content-length")?.trim();
  if (
    contentLength &&
    /^\d+$/.test(contentLength) &&
    Number(contentLength) > maxRequestBodyBytes
  ) {
    return { ok: false, status: 413 };
  }
  if (!request.body) return { ok: false, status: 400 };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxRequestBodyBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, status: 413 };
      }
      chunks.push(value);
    }

    const body = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return {
      ok: true,
      value: JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(body),
      ),
    };
  } catch {
    return { ok: false, status: 400 };
  }
}

function jsonResponse(
  status: number,
  body: Readonly<{ ok: boolean; status: string }>,
  headers: Readonly<Record<string, string>> = {},
): Response {
  return Response.json(body, {
    status,
    headers: { ...responseHeaders, ...headers },
  });
}

const acceptedResponse = () =>
  jsonResponse(202, { ok: true, status: "accepted" });

export interface InterestRouteDependencies {
  readonly getConfig: () => InterestServerConfig;
  readonly getQueue: () => Promise<InterestSubmissionsQueue | null>;
  readonly preflightRateLimiters: () => Promise<boolean>;
  readonly checkPreVerificationRateLimit: (
    request: Request,
  ) => Promise<RateLimitOutcome>;
  readonly checkPostVerificationRateLimit: () => Promise<RateLimitOutcome>;
  readonly verifyTurnstile: (
    options: VerifyTurnstileOptions,
  ) => Promise<boolean>;
  readonly now: () => Date;
}

const defaultDependencies: InterestRouteDependencies = {
  getConfig: getInterestServerConfig,
  getQueue: getInterestSubmissionsQueue,
  preflightRateLimiters: preflightInterestRateLimiters,
  checkPreVerificationRateLimit,
  checkPostVerificationRateLimit,
  verifyTurnstile: verifyTurnstileToken,
  now: () => new Date(),
};

export function createInterestPostHandler(
  dependencies: InterestRouteDependencies = defaultDependencies,
): (request: Request) => Promise<Response> {
  return async function post(request: Request): Promise<Response> {
    const config = dependencies.getConfig();
    if (!config.enabled) {
      return jsonResponse(503, { ok: false, status: "unavailable" });
    }

    const queue = await dependencies.getQueue();
    if (!queue) {
      return jsonResponse(503, { ok: false, status: "unavailable" });
    }

    if (!(await dependencies.preflightRateLimiters())) {
      return jsonResponse(503, { ok: false, status: "unavailable" });
    }

    const contentType =
      request.headers
        .get("content-type")
        ?.split(";", 1)[0]
        .trim()
        .toLowerCase() ?? "";
    if (contentType !== "application/json") {
      return jsonResponse(415, { ok: false, status: "invalid_request" });
    }

    const preLimit =
      await dependencies.checkPreVerificationRateLimit(request);
    if (preLimit === "limited") {
      return jsonResponse(
        429,
        { ok: false, status: "try_later" },
        { "retry-after": "10" },
      );
    }
    if (preLimit === "unavailable") {
      return jsonResponse(503, { ok: false, status: "unavailable" });
    }

    const input = await readBoundedJson(request);
    if (!input.ok) {
      return jsonResponse(input.status, {
        ok: false,
        status: "invalid_request",
      });
    }
    const parsed = interestSubmissionSchema.safeParse(input.value);
    if (!parsed.success) {
      return jsonResponse(400, { ok: false, status: "invalid_request" });
    }

    const verified = await dependencies.verifyTurnstile({
      config: config.turnstile,
      request,
      token: parsed.data.turnstileToken,
    });
    if (!verified) {
      return jsonResponse(403, { ok: false, status: "verification_failed" });
    }

    const postLimit = await dependencies.checkPostVerificationRateLimit();
    if (postLimit === "limited") {
      return jsonResponse(
        429,
        { ok: false, status: "try_later" },
        { "retry-after": "10" },
      );
    }
    if (postLimit === "unavailable") {
      return jsonResponse(503, { ok: false, status: "unavailable" });
    }

    if (parsed.data.website !== "") return acceptedResponse();

    const payload = createInterestQueuePayload(parsed.data, {
      now: dependencies.now(),
      sourcePage: getSourcePage(request),
    });
    try {
      await queue.send(payload, { contentType: "json" });
    } catch {
      return jsonResponse(502, { ok: false, status: "delivery_failed" });
    }

    return acceptedResponse();
  };
}

export const POST = createInterestPostHandler();
