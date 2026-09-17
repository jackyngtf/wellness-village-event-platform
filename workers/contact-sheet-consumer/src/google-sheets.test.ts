import { describe, expect, it, vi } from "vitest";

import { appendRows, readSubmissionIds } from "./google-sheets";
import { submissionToRow } from "./submission";
import { syntheticSubmission } from "./test-fixture";

const input = {
  authorizationCredential: "example-access-token",
  spreadsheetId: "replace-with-approved-sheet-id",
  range: "Contacts!A:N",
} as const;

describe("Google Sheets adapter", () => {
  it("reads only column A submission IDs with a bounded request", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (request) => {
      const url = new URL(String(request));
      expect(decodeURIComponent(url.pathname)).toContain(
        "/spreadsheets/replace-with-approved-sheet-id/values/Contacts!A:A",
      );
      expect(url.searchParams.get("majorDimension")).toBe("COLUMNS");
      expect(url.searchParams.get("valueRenderOption")).toBe(
        "UNFORMATTED_VALUE",
      );
      return Response.json({
        majorDimension: "COLUMNS",
        values: [["submission_id", syntheticSubmission.submission_id]],
      });
    });

    await expect(readSubmissionIds(input, fetcher)).resolves.toEqual(
      new Set([syntheticSubmission.submission_id]),
    );
  });

  it("appends the fixed A:N row contract with ROWS and RAW semantics", async () => {
    const row = submissionToRow(syntheticSubmission);
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (request, init) => {
      const url = new URL(String(request));
      expect(url.pathname).toBe(
        "/v4/spreadsheets/replace-with-approved-sheet-id/values/Contacts!A%3AN:append",
      );
      expect(url.pathname).not.toContain("%3Aappend");
      expect(url.searchParams.get("valueInputOption")).toBe("RAW");
      expect(url.searchParams.get("insertDataOption")).toBe("INSERT_ROWS");
      expect(init?.method).toBe("POST");
      expect(JSON.parse(String(init?.body))).toEqual({
        majorDimension: "ROWS",
        values: [row],
      });
      return new Response(null, { status: 200 });
    });

    await expect(appendRows({ ...input, rows: [row] }, fetcher)).resolves.toBe(
      undefined,
    );
  });

  it("encodes a quoted sheet range without encoding the append custom verb", async () => {
    const range = "'Contact Leads'!A:N";
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (request) => {
      const url = new URL(String(request));
      expect(url.pathname).toBe(
        `/v4/spreadsheets/replace-with-approved-sheet-id/values/${encodeURIComponent(range)}:append`,
      );
      expect(url.pathname).not.toContain("%3Aappend");
      expect(url.searchParams.get("valueInputOption")).toBe("RAW");
      return new Response(null, { status: 200 });
    });

    await expect(
      appendRows(
        { ...input, range, rows: [submissionToRow(syntheticSubmission)] },
        fetcher,
      ),
    ).resolves.toBeUndefined();
  });

  it("rejects non-A:N ranges and malformed or oversized reads", async () => {
    await expect(
      readSubmissionIds(
        { ...input, range: "Contacts!A:Z" },
        vi.fn<typeof fetch>(),
      ),
    ).rejects.toThrow("range is not supported");

    await expect(
      readSubmissionIds(
        input,
        vi.fn<typeof fetch>().mockResolvedValue(
          new Response("x".repeat(1_048_577), {
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    ).rejects.toThrow("response was too large");
  });

  it("surfaces OAuth or Sheets failures for Queue redelivery", async () => {
    await expect(
      readSubmissionIds(
        input,
        vi
          .fn<typeof fetch>()
          .mockResolvedValue(Response.json({}, { status: 503 })),
      ),
    ).rejects.toThrow("Google Sheets request failed");
  });
});
