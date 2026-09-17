import { UpstreamRequestError } from "./errors";

export async function readBoundedJson(
  response: Response,
  options: Readonly<{ maxBytes: number; invalidMessage: string }>,
): Promise<unknown> {
  const declaredLength = response.headers.get("content-length")?.trim();
  if (
    declaredLength &&
    /^\d+$/.test(declaredLength) &&
    Number(declaredLength) > options.maxBytes
  ) {
    throw new UpstreamRequestError(options.invalidMessage);
  }
  if (!response.body) throw new UpstreamRequestError(options.invalidMessage);

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > options.maxBytes) {
      await reader.cancel().catch(() => undefined);
      throw new UpstreamRequestError(options.invalidMessage);
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(
      new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }).decode(bytes),
    ) as unknown;
  } catch (cause) {
    throw new UpstreamRequestError(options.invalidMessage, { cause });
  }
}
