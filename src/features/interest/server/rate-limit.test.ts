import { describe, expect, it, vi } from "vitest";

import {
  getPreVerificationRateLimitKey,
  hasRequiredRateLimiterBindings,
} from "./rate-limit";

function requestWithIp(ip?: string): Request {
  return new Request("https://portfolio.example.com/api/interest", {
    headers: ip ? { "cf-connecting-ip": ip } : {},
  });
}

describe("pre-verification rate-limit identity", () => {
  it.each(["192.0.2.10", "2001:db8::10"])(
    "uses a validated edge IP for %s",
    (ip) => {
      expect(getPreVerificationRateLimitKey(requestWithIp(ip))).toBe(
        `portfolio-contact:pre:${ip}`,
      );
    },
  );

  it.each([undefined, "", "999.1.1.1", "not-an-ip", "x".repeat(65)])(
    "fails closed for invalid edge identity %s",
    (ip) => {
      expect(getPreVerificationRateLimitKey(requestWithIp(ip))).toBeNull();
    },
  );
});

describe("rate-limit binding preflight", () => {
  it("requires both limiter bindings without consuming either quota", () => {
    const preLimiter = {
      limit: vi.fn().mockResolvedValue({ success: true }),
    };
    const postLimiter = {
      limit: vi.fn().mockResolvedValue({ success: true }),
    };

    expect(
      hasRequiredRateLimiterBindings({
        PORTFOLIO_CONTACT_PRE_RATE_LIMITER: preLimiter,
        PORTFOLIO_CONTACT_RATE_LIMITER: postLimiter,
      }),
    ).toBe(true);
    expect(
      hasRequiredRateLimiterBindings({
        PORTFOLIO_CONTACT_PRE_RATE_LIMITER: preLimiter,
      }),
    ).toBe(false);
    expect(
      hasRequiredRateLimiterBindings({
        PORTFOLIO_CONTACT_RATE_LIMITER: postLimiter,
      }),
    ).toBe(false);
    expect(preLimiter.limit).not.toHaveBeenCalled();
    expect(postLimiter.limit).not.toHaveBeenCalled();
  });
});
