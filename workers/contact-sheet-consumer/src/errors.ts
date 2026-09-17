const maxQueueRetryDelaySeconds = 43_200;

export class UpstreamRequestError extends Error {
  readonly status?: number;
  readonly retryAfterSeconds?: number;

  constructor(
    message: string,
    options: Readonly<{
      status?: number;
      retryAfterSeconds?: number;
      cause?: unknown;
    }> = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "UpstreamRequestError";
    this.status = options.status;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

export function parseRetryAfterSeconds(
  value: string | null,
  now = Date.now(),
): number | undefined {
  if (!value) return undefined;
  const numeric = Number(value);
  const seconds = Number.isFinite(numeric)
    ? numeric
    : (Date.parse(value) - now) / 1_000;
  if (!Number.isFinite(seconds)) return undefined;
  return Math.min(
    maxQueueRetryDelaySeconds,
    Math.max(0, Math.ceil(seconds)),
  );
}

export function getUpstreamErrorMetadata(error: unknown): Readonly<{
  status?: number;
  retryAfterSeconds?: number;
}> {
  if (
    typeof error === "object" &&
    error !== null &&
    !(error instanceof UpstreamRequestError)
  ) {
    const status =
      "status" in error && typeof error.status === "number"
        ? error.status
        : undefined;
    const retryAfterSeconds =
      "retryAfterSeconds" in error &&
      typeof error.retryAfterSeconds === "number"
        ? error.retryAfterSeconds
        : undefined;
    return {
      ...(status === undefined ? {} : { status }),
      ...(retryAfterSeconds === undefined ? {} : { retryAfterSeconds }),
    };
  }
  if (!(error instanceof UpstreamRequestError)) return {};
  return {
    ...(error.status === undefined ? {} : { status: error.status }),
    ...(error.retryAfterSeconds === undefined
      ? {}
      : { retryAfterSeconds: error.retryAfterSeconds }),
  };
}
