import { describe, expect, it } from "vitest";

import {
  SHEET_HEADERS,
  parseContactSubmission,
  submissionToRow,
} from "./submission";
import { syntheticSubmission } from "./test-fixture";

describe("contact submission contract", () => {
  it("preserves the exact verified 14-column A:N order", () => {
    expect(SHEET_HEADERS).toEqual([
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
    expect(submissionToRow(parseContactSubmission(syntheticSubmission))).toEqual(
      SHEET_HEADERS.map((header) => syntheticSubmission[header]),
    );
  });

  it.each([
    ["unknown key", { ...syntheticSubmission, extra: "not admitted" }],
    ["missing key", Object.fromEntries(Object.entries(syntheticSubmission).slice(1))],
    ["invalid UUID", { ...syntheticSubmission, submission_id: "not-a-uuid" }],
    ["mismatched timestamps", { ...syntheticSubmission, submitted_at_hkt: "2030-06-20T10:03:05.000+08:00" }],
    ["invalid display name", { ...syntheticSubmission, display_name: "Other" }],
    ["invalid email", { ...syntheticSubmission, email: "casey.example.com" }],
    ["invalid phone", { ...syntheticSubmission, phone: "call me" }],
    ["unsupported locale", { ...syntheticSubmission, locale: "zh" }],
    ["query in source", { ...syntheticSubmission, source_page: "/en/visit?email=casey" }],
    ["fragment in source", { ...syntheticSubmission, source_page: "/en/visit#contact" }],
    ["false consent", { ...syntheticSubmission, consent: false }],
    ["wrong consent version", { ...syntheticSubmission, consent_version: "other" }],
    ["wrong purpose", { ...syntheticSubmission, purpose: "other" }],
    ["false marketing flag", { ...syntheticSubmission, marketing_opt_in: false }],
  ])("rejects %s", (_label, value) => {
    expect(() => parseContactSubmission(value)).toThrow(
      "invalid contact submission",
    );
  });
});
