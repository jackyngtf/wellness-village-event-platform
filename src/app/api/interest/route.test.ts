import { describe, expect, it, vi } from "vitest";

import {
  createInterestPostHandler,
  type InterestRouteDependencies,
} from "./route";
import {
  portfolioConsentVersion,
  portfolioContactPurpose,
} from "@/features/interest/schema";

const validBody = {
  submissionId: "018f47a2-6b4d-7c8e-9f10-1234567890ab",
  familyName: "Ng",
  givenName: "Casey",
  email: "casey.ng@example.com",
  phone: "+1 202-555-0147",
  locale: "en",
  consent: true,
  turnstileToken: "portfolio-demo-token",
  website: "",
} as const;

function jsonRequest(
  body: unknown = validBody,
  options: { referer?: string; contentType?: string; ip?: string } = {},
): Request {
  return new Request("https://portfolio.example.com/api/interest", {
    method: "POST",
    headers: {
      "content-type": options.contentType ?? "application/json; charset=utf-8",
      "cf-connecting-ip": options.ip ?? "192.0.2.10",
      ...(options.referer ? { referer: options.referer } : {}),
    },
    body: JSON.stringify(body),
  });
}

function setup(
  changes: Partial<InterestRouteDependencies> = {},
): {
  handler: (request: Request) => Promise<Response>;
  send: ReturnType<typeof vi.fn>;
  verify: ReturnType<typeof vi.fn>;
  preLimit: ReturnType<typeof vi.fn>;
  postLimit: ReturnType<typeof vi.fn>;
} {
  const send = vi.fn().mockResolvedValue(undefined);
  const verify = vi.fn().mockResolvedValue(true);
  const preLimit = vi.fn().mockResolvedValue("allowed");
  const postLimit = vi.fn().mockResolvedValue("allowed");
  const dependencies: InterestRouteDependencies = {
    getConfig: () => ({
      enabled: true,
      turnstile: {
        siteverifyCredential: "example-turnstile-credential",
        expectedAction: "portfolio_contact_submit",
        expectedHostname: "portfolio.example.com",
      },
    }),
    getQueue: async () => ({ send }),
    preflightRateLimiters: async () => true,
    checkPreVerificationRateLimit: preLimit,
    checkPostVerificationRateLimit: postLimit,
    verifyTurnstile: verify,
    now: () => new Date("2030-06-20T02:03:04.000Z"),
    ...changes,
  };

  return {
    handler: createInterestPostHandler(dependencies),
    send,
    verify,
    preLimit,
    postLimit,
  };
}

describe("POST /api/interest", () => {
  it("does not read the body when collection is disabled", async () => {
    const request = jsonRequest();
    const { handler } = setup({ getConfig: () => ({ enabled: false }) });

    expect((await handler(request)).status).toBe(503);
    expect(request.bodyUsed).toBe(false);
  });

  it("does not read the body when the Queue binding is missing", async () => {
    const request = jsonRequest();
    const { handler } = setup({ getQueue: async () => null });

    expect((await handler(request)).status).toBe(503);
    expect(request.bodyUsed).toBe(false);
  });

  it("rejects a missing post limiter before body read or verification", async () => {
    const request = jsonRequest();
    const { handler, send, verify, preLimit, postLimit } = setup({
      preflightRateLimiters: async () => false,
    });

    expect((await handler(request)).status).toBe(503);
    expect(request.bodyUsed).toBe(false);
    expect(preLimit).not.toHaveBeenCalled();
    expect(postLimit).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("accepts JSON only", async () => {
    const { handler } = setup();
    const response = await handler(
      jsonRequest(validBody, { contentType: "text/plain" }),
    );

    expect(response.status).toBe(415);
  });

  it("rejects declared and streamed bodies above 8 KiB", async () => {
    const { handler } = setup();
    const declared = jsonRequest();
    declared.headers.set("content-length", "8193");
    expect((await handler(declared)).status).toBe(413);

    const streamed = jsonRequest({ ...validBody, website: "x".repeat(8_192) });
    expect((await handler(streamed)).status).toBe(413);
  });

  it("applies the fail-closed per-IP limit before reading the body", async () => {
    const request = jsonRequest();
    const { handler, verify } = setup({
      checkPreVerificationRateLimit: async () => "limited",
    });

    expect((await handler(request)).status).toBe(429);
    expect(request.bodyUsed).toBe(false);
    expect(verify).not.toHaveBeenCalled();
  });

  it("fails closed when the pre-verification limiter is unavailable", async () => {
    const { handler } = setup({
      checkPreVerificationRateLimit: async () => "unavailable",
    });
    expect((await handler(jsonRequest())).status).toBe(503);
  });

  it("validates the strict public schema", async () => {
    const { handler, verify } = setup();
    const response = await handler(
      jsonRequest({ ...validBody, consent: "true", extra: "not admitted" }),
    );

    expect(response.status).toBe(400);
    expect(verify).not.toHaveBeenCalled();
  });

  it("requires Turnstile before Queue send", async () => {
    const { handler, send, postLimit } = setup({
      verifyTurnstile: async () => false,
    });

    expect((await handler(jsonRequest())).status).toBe(403);
    expect(postLimit).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("applies the fail-closed route limit after Turnstile", async () => {
    const { handler, send, verify } = setup({
      checkPostVerificationRateLimit: async () => "limited",
    });

    expect((await handler(jsonRequest())).status).toBe(429);
    expect(verify).toHaveBeenCalledOnce();
    expect(send).not.toHaveBeenCalled();
  });

  it("fails closed when the post-verification limiter is unavailable", async () => {
    const { handler, send } = setup({
      checkPostVerificationRateLimit: async () => "unavailable",
    });
    expect((await handler(jsonRequest())).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns indistinguishable 202 for a filled honeypot without forwarding", async () => {
    const { handler, send } = setup();
    const response = await handler(
      jsonRequest({ ...validBody, website: "automated visitor" }),
    );

    expect(response.status).toBe(202);
    expect(send).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ ok: true, status: "accepted" });
  });

  it("stores only a same-origin source pathname and the exact 14-field contract", async () => {
    const { handler, send } = setup();
    const response = await handler(
      jsonRequest(validBody, {
        referer:
          "https://portfolio.example.com/en/visit?email=private%40example.com#form",
      }),
    );

    expect(response.status).toBe(202);
    expect(send).toHaveBeenCalledOnce();
    const [message, options] = send.mock.calls[0] ?? [];
    expect(Object.keys(message)).toEqual([
      "submission_id",
      "submitted_at_utc",
      "submitted_at_hkt",
      "last_name",
      "first_name",
      "display_name",
      "email",
      "phone",
      "locale",
      "source_page",
      "consent",
      "consent_version",
      "purpose",
      "marketing_opt_in",
    ]);
    expect(message).toMatchObject({
      submission_id: validBody.submissionId,
      submitted_at_utc: "2030-06-20T02:03:04.000Z",
      submitted_at_hkt: "2030-06-20T10:03:04.000+08:00",
      last_name: "Ng",
      first_name: "Casey",
      display_name: "Casey Ng",
      source_page: "/en/visit",
      consent: true,
      consent_version: portfolioConsentVersion,
      purpose: portfolioContactPurpose,
      marketing_opt_in: true,
    });
    expect(options).toEqual({ contentType: "json" });
  });

  it("uses unknown for cross-origin, malformed or overlong source metadata", async () => {
    const { handler, send } = setup();
    await handler(
      jsonRequest(validBody, {
        referer: "https://other.example.com/path?email=casey%40example.com",
      }),
    );

    expect(send.mock.calls[0]?.[0]).toMatchObject({ source_page: "unknown" });
  });

  it("returns non-success when Queue persistence fails", async () => {
    const send = vi.fn().mockRejectedValue(new Error("provider detail"));
    const { handler } = setup({ getQueue: async () => ({ send }) });

    expect((await handler(jsonRequest())).status).toBe(502);
  });

  it("returns 202 only after awaited Queue acceptance", async () => {
    let acceptQueue: (() => void) | undefined;
    const send = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          acceptQueue = resolve;
        }),
    );
    const { handler } = setup({ getQueue: async () => ({ send }) });

    const responsePromise = handler(jsonRequest());
    let settled = false;
    void responsePromise.then(() => {
      settled = true;
    });
    await vi.waitFor(() => expect(send).toHaveBeenCalledOnce());
    expect(settled).toBe(false);

    acceptQueue?.();
    const response = await responsePromise;
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ ok: true, status: "accepted" });
  });
});
