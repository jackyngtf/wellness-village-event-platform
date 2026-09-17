import { z } from "zod";

import { readBoundedJson } from "./bounded-json";
import { parseRetryAfterSeconds, UpstreamRequestError } from "./errors";
import type { SheetCell } from "./submission";

export type AppendRowsInput = Readonly<{
  authorizationCredential: string;
  spreadsheetId: string;
  range: string;
  rows: SheetCell[][];
}>;
export type ReadSubmissionIdsInput = Omit<AppendRowsInput, "rows">;

const googleSheetsTimeoutMs = 15_000;
const maxGoogleSheetsResponseBytes = 1_024 * 1_024;
const maxRetainedSubmissionIds = 100_000;

const idColumnResponseSchema = z.strictObject({
  range: z.string().optional(),
  majorDimension: z.literal("COLUMNS").optional(),
  values: z.array(z.array(z.string())).max(1).optional(),
});

export function getSubmissionIdRange(appendRange: string): string {
  const separator = appendRange.lastIndexOf("!");
  if (separator <= 0 || appendRange.slice(separator + 1) !== "A:N") {
    throw new UpstreamRequestError("Google Sheets range is not supported");
  }
  return `${appendRange.slice(0, separator)}!A:A`;
}

function sheetsValueUrl(spreadsheetId: string, range: string): URL {
  return new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`,
  );
}

function sheetsAppendUrl(spreadsheetId: string, range: string): URL {
  return new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append`,
  );
}

export async function readSubmissionIds(
  input: ReadSubmissionIdsInput,
  fetchApi: typeof fetch = globalThis.fetch,
): Promise<ReadonlySet<string>> {
  const url = sheetsValueUrl(
    input.spreadsheetId,
    getSubmissionIdRange(input.range),
  );
  url.searchParams.set("majorDimension", "COLUMNS");
  url.searchParams.set("valueRenderOption", "UNFORMATTED_VALUE");

  let response: Response;
  try {
    response = await fetchApi(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${input.authorizationCredential}`,
      },
      signal: AbortSignal.timeout(googleSheetsTimeoutMs),
    });
  } catch (cause) {
    throw new UpstreamRequestError("Google Sheets request failed", { cause });
  }
  if (!response.ok) {
    throw new UpstreamRequestError("Google Sheets request failed", {
      status: response.status,
      retryAfterSeconds: parseRetryAfterSeconds(
        response.headers.get("retry-after"),
      ),
    });
  }

  const payload = await readBoundedJson(response, {
    maxBytes: maxGoogleSheetsResponseBytes,
    invalidMessage: "Google Sheets response was too large",
  });
  const parsed = idColumnResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new UpstreamRequestError("Google Sheets response was invalid");
  }
  const column = parsed.data.values?.[0] ?? [];
  const ids = column.filter(
    (value) => value.length > 0 && value !== "submission_id",
  );
  if (ids.length > maxRetainedSubmissionIds) {
    throw new UpstreamRequestError(
      "Google Sheets response contained too many submission IDs",
    );
  }
  return new Set(ids);
}

export async function appendRows(
  input: AppendRowsInput,
  fetchApi: typeof fetch = globalThis.fetch,
): Promise<void> {
  if (getSubmissionIdRange(input.range).length === 0) {
    throw new UpstreamRequestError("Google Sheets range is not supported");
  }
  const url = sheetsAppendUrl(input.spreadsheetId, input.range);
  url.searchParams.set("valueInputOption", "RAW");
  url.searchParams.set("insertDataOption", "INSERT_ROWS");

  let response: Response;
  try {
    response = await fetchApi(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${input.authorizationCredential}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ majorDimension: "ROWS", values: input.rows }),
      signal: AbortSignal.timeout(googleSheetsTimeoutMs),
    });
  } catch (cause) {
    throw new UpstreamRequestError("Google Sheets request failed", { cause });
  }
  if (!response.ok) {
    throw new UpstreamRequestError("Google Sheets request failed", {
      status: response.status,
      retryAfterSeconds: parseRetryAfterSeconds(
        response.headers.get("retry-after"),
      ),
    });
  }
}
