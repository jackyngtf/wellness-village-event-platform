import { describe, expect, it, vi } from "vitest";

import {
  portfolioTurnstileAction,
  verifyTurnstileToken,
  type TurnstileServerConfig,
} from "./turnstile";

const config: TurnstileServerConfig = {
  siteverifyCredential: "example-turnstile-credential",
  expectedAction: portfolioTurnstileAction,
  expectedHostname: "portfolio.example.com",
};

const request = new Request("https://portfolio.example.com/api/interest", {
  headers: { "cf-connecting-ip": "192.0.2.10" },
});

function siteverifyResponse(
  value: unknown,
  init: ResponseInit = {},
): Response {
  return Response.json(value, init);
}

describe("verifyTurnstileToken", () => {
  it("accepts only the expected action and hostname", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      siteverifyResponse({
        success: true,
        action: portfolioTurnstileAction,
        hostname: "portfolio.example.com",
      }),
    );

    await expect(
      verifyTurnstileToken({
        config,
        request,
        token: "verified-token",
        fetcher,
      }),
    ).resolves.toBe(true);

    const [, init] = fetcher.mock.calls[0] ?? [];
    expect(init?.method).toBe("POST");
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(String(init?.body)).toContain("response=verified-token");
    expect(String(init?.body)).toContain("remoteip=192.0.2.10");
  });

  it.each([
    ["action mismatch", { success: true, action: "other", hostname: "portfolio.example.com" }],
    ["hostname mismatch", { success: true, action: portfolioTurnstileAction, hostname: "other.example.com" }],
    ["provider rejection", { success: false, action: portfolioTurnstileAction, hostname: "portfolio.example.com" }],
    ["malformed response", { success: "true", action: portfolioTurnstileAction, hostname: "portfolio.example.com" }],
  ])("fails closed on %s", async (_label, payload) => {
    await expect(
      verifyTurnstileToken({
        config,
        request,
        token: "untrusted-token",
        fetcher: vi.fn<typeof fetch>().mockResolvedValue(siteverifyResponse(payload)),
      }),
    ).resolves.toBe(false);
  });

  it("fails closed on timeout or upstream failure without exposing details", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("secret-bearing upstream detail"));

    await expect(
      verifyTurnstileToken({ config, request, token: "token", fetcher }),
    ).resolves.toBe(false);
  });

  it("rejects oversized provider responses", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response("x".repeat(65_537), {
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(
      verifyTurnstileToken({ config, request, token: "token", fetcher }),
    ).resolves.toBe(false);
  });
});
