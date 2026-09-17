import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

const preVerificationKeyPrefix = "portfolio-contact:pre:" as const;
const postVerificationKey = "portfolio-contact:submit" as const;
const maxIpLength = 64;

export interface ContactRateLimiter {
  limit(options: Readonly<{ key: string }>): Promise<{ success: boolean }>;
}

export type RateLimitOutcome = "allowed" | "limited" | "unavailable";

function isRateLimiter(value: unknown): value is ContactRateLimiter {
  return (
    typeof value === "object" &&
    value !== null &&
    "limit" in value &&
    typeof value.limit === "function"
  );
}

export function hasRequiredRateLimiterBindings(environment: unknown): boolean {
  return (
    typeof environment === "object" &&
    environment !== null &&
    "PORTFOLIO_CONTACT_PRE_RATE_LIMITER" in environment &&
    isRateLimiter(environment.PORTFOLIO_CONTACT_PRE_RATE_LIMITER) &&
    "PORTFOLIO_CONTACT_RATE_LIMITER" in environment &&
    isRateLimiter(environment.PORTFOLIO_CONTACT_RATE_LIMITER)
  );
}

export async function preflightInterestRateLimiters(): Promise<boolean> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return hasRequiredRateLimiterBindings(env);
  } catch {
    return false;
  }
}

function isValidIpv4(value: string): boolean {
  const parts = value.split(".");
  return (
    parts.length === 4 &&
    parts.every(
      (part) =>
        /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255,
    )
  );
}

function isValidIpv6(value: string): boolean {
  if (!value.includes(":") || !/^[0-9a-f:.]+$/i.test(value)) return false;
  try {
    return new URL(`http://[${value}]/`).hostname.includes(":");
  } catch {
    return false;
  }
}

export function getPreVerificationRateLimitKey(
  request: Request,
): string | null {
  const ip = request.headers.get("cf-connecting-ip")?.trim() ?? "";
  if (
    ip.length === 0 ||
    ip.length > maxIpLength ||
    (!isValidIpv4(ip) && !isValidIpv6(ip))
  ) {
    return null;
  }
  return `${preVerificationKeyPrefix}${ip}`;
}

async function resolveLimiter(
  binding: "PORTFOLIO_CONTACT_PRE_RATE_LIMITER" | "PORTFOLIO_CONTACT_RATE_LIMITER",
): Promise<ContactRateLimiter | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const candidate = env[binding];
    return isRateLimiter(candidate) ? candidate : null;
  } catch {
    return null;
  }
}

export async function checkPreVerificationRateLimit(
  request: Request,
): Promise<RateLimitOutcome> {
  const key = getPreVerificationRateLimitKey(request);
  if (!key) return "unavailable";
  const limiter = await resolveLimiter("PORTFOLIO_CONTACT_PRE_RATE_LIMITER");
  if (!limiter) return "unavailable";

  try {
    return (await limiter.limit({ key })).success ? "allowed" : "limited";
  } catch {
    return "unavailable";
  }
}

export async function checkPostVerificationRateLimit(): Promise<RateLimitOutcome> {
  const limiter = await resolveLimiter("PORTFOLIO_CONTACT_RATE_LIMITER");
  if (!limiter) return "unavailable";

  try {
    return (await limiter.limit({ key: postVerificationKey })).success
      ? "allowed"
      : "limited";
  } catch {
    return "unavailable";
  }
}
