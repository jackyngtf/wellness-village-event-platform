import {
  createExecutionContext,
  createMessageBatch,
  getQueueResult,
} from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";

import { createQueueHandler } from "./index";
import { syntheticSubmission } from "./test-fixture";

const env = {
  GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON: "consumer-only-synthetic-secret",
  GOOGLE_SHEET_ID: "replace-with-approved-sheet-id",
  GOOGLE_SHEET_RANGE: "Contacts!A:N",
} satisfies GeneratedEnv;

function batchWith(...bodies: unknown[]) {
  return createMessageBatch(
    "portfolio-demo-contact-submissions",
    bodies.map((body, index) => ({
      id: `message-${index + 1}`,
      timestamp: new Date("2030-06-20T02:03:04.000Z"),
      body,
      attempts: 1,
    })),
  );
}

const quietLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe("contact Sheet Queue handler", () => {
  it("collapses same-batch duplicates and acknowledges both after one append", async () => {
    const append = vi.fn().mockResolvedValue(undefined);
    const handler = createQueueHandler({
      logger: quietLogger,
      acquireAuthorization: async () => "example-access-token",
      readSubmissionIds: async () => new Set(),
      appendRows: append,
    });
    const batch = batchWith(syntheticSubmission, syntheticSubmission);
    const ctx = createExecutionContext();

    await handler(batch, env, ctx);
    const result = await getQueueResult(batch, ctx);

    expect(append).toHaveBeenCalledOnce();
    expect(append.mock.calls[0]?.[0].rows).toHaveLength(1);
    expect(result.explicitAcks).toEqual(["message-1", "message-2"]);
    expect(result.retryMessages).toEqual([]);
  });

  it("acknowledges IDs already in column A without appending", async () => {
    const append = vi.fn();
    const handler = createQueueHandler({
      logger: quietLogger,
      acquireAuthorization: async () => "example-access-token",
      readSubmissionIds: async () =>
        new Set([syntheticSubmission.submission_id]),
      appendRows: append,
    });
    const batch = batchWith(syntheticSubmission);
    const ctx = createExecutionContext();

    await handler(batch, env, ctx);
    const result = await getQueueResult(batch, ctx);

    expect(append).not.toHaveBeenCalled();
    expect(result.explicitAcks).toEqual(["message-1"]);
  });

  it("converges after an append commits but the response times out", async () => {
    let committed = false;
    const append = vi.fn().mockImplementation(async () => {
      committed = true;
      throw new Error("timeout after commit");
    });
    const dependencies = {
      logger: quietLogger,
      acquireAuthorization: async () => "example-access-token",
      readSubmissionIds: async () =>
        committed ? new Set([syntheticSubmission.submission_id]) : new Set<string>(),
      appendRows: append,
    };
    const firstHandler = createQueueHandler(dependencies);
    const firstBatch = batchWith(syntheticSubmission);
    const firstCtx = createExecutionContext();
    await firstHandler(firstBatch, env, firstCtx);
    expect((await getQueueResult(firstBatch, firstCtx)).retryMessages).toEqual([
      { msgId: "message-1" },
    ]);

    const secondHandler = createQueueHandler(dependencies);
    const secondBatch = batchWith(syntheticSubmission);
    const secondCtx = createExecutionContext();
    await secondHandler(secondBatch, env, secondCtx);
    const secondResult = await getQueueResult(secondBatch, secondCtx);

    expect(append).toHaveBeenCalledOnce();
    expect(secondResult.explicitAcks).toEqual(["message-1"]);
    expect(secondResult.retryMessages).toEqual([]);
  });

  it.each([
    ["OAuth", { acquireAuthorization: async () => { throw new Error("oauth unavailable"); } }],
    ["Sheets read", { readSubmissionIds: async () => { throw new Error("sheets unavailable"); } }],
    ["Sheets append", { appendRows: async () => { throw new Error("append unavailable"); } }],
  ])("retries unconfirmed messages after %s failure", async (_label, change) => {
    const handler = createQueueHandler({
      logger: quietLogger,
      acquireAuthorization: async () => "example-access-token",
      readSubmissionIds: async () => new Set(),
      appendRows: async () => undefined,
      ...change,
    });
    const batch = batchWith(syntheticSubmission);
    const ctx = createExecutionContext();

    await handler(batch, env, ctx);
    const result = await getQueueResult(batch, ctx);
    expect(result.retryMessages).toEqual([
      { msgId: "message-1" },
    ]);
  });

  it("retries invalid messages so configured max_retries can move them to the DLQ", async () => {
    const handler = createQueueHandler({ logger: quietLogger });
    const batch = batchWith({ invalid: true });
    const ctx = createExecutionContext();

    await handler(batch, env, ctx);
    const result = await getQueueResult(batch, ctx);

    expect(result.retryMessages).toEqual([
      { msgId: "message-1" },
    ]);
    expect(result.explicitAcks).toEqual([]);
  });

  it("logs event names, counts and status only", async () => {
    const entries: unknown[] = [];
    const logger = {
      info: (value: unknown) => entries.push(value),
      warn: (value: unknown) => entries.push(value),
      error: (value: unknown) => entries.push(value),
    };
    const handler = createQueueHandler({
      logger,
      acquireAuthorization: async () => "example-access-token",
      readSubmissionIds: async () => new Set(),
      appendRows: async () => {
        throw Object.assign(
          new Error(
            `failed ${syntheticSubmission.submission_id} ${syntheticSubmission.email} ${syntheticSubmission.phone}`,
          ),
          { status: 503 },
        );
      },
    });
    const batch = batchWith(syntheticSubmission);
    const ctx = createExecutionContext();

    await handler(batch, env, ctx);
    await getQueueResult(batch, ctx);
    const serialised = JSON.stringify(entries);

    expect(serialised).toContain("contact_sheet_batch_retry");
    expect(serialised).toContain("503");
    expect(serialised).not.toContain(syntheticSubmission.submission_id);
    expect(serialised).not.toContain(syntheticSubmission.email);
    expect(serialised).not.toContain(syntheticSubmission.phone);
    expect(serialised).not.toContain(env.GOOGLE_SHEET_ID);
    expect(serialised).not.toContain(env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON);
    expect(serialised).not.toContain("failed");
  });
});
