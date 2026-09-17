import { describe, expect, it } from "vitest";

import {
  interestSubmissionSchema,
  portfolioConsentVersion,
  portfolioContactPurpose,
} from "./schema";

const validSubmission = {
  submissionId: "018f47a2-6b4d-7c8e-9f10-1234567890ab",
  familyName: "Ng",
  givenName: "Casey",
  email: "casey.ng@example.com",
  phone: "+1 202-555-0147",
  locale: "en",
  consent: true,
  turnstileToken: "portfolio-demo-turnstile-token",
  website: "",
} as const;

describe("interestSubmissionSchema", () => {
  it("publishes neutral consent and purpose identifiers", () => {
    expect(portfolioConsentVersion).toBe("portfolio-demo-contact-v1");
    expect(portfolioContactPurpose).toBe("portfolio-demo-contact-interest");
  });

  it("accepts the bounded synthetic public contract", () => {
    expect(interestSubmissionSchema.parse(validSubmission)).toEqual(
      validSubmission,
    );
  });

  it.each([
    ["invalid UUID", { submissionId: "not-a-uuid" }],
    ["empty family name", { familyName: "" }],
    ["empty given name", { givenName: "" }],
    ["invalid email", { email: "casey.example.com" }],
    ["invalid phone", { phone: "call me" }],
    ["too few phone digits", { phone: "+1 23" }],
    ["unsupported locale", { locale: "zh" }],
    ["truthy consent", { consent: "true" }],
    ["empty Turnstile token", { turnstileToken: "" }],
    ["oversized Turnstile token", { turnstileToken: "x".repeat(2_049) }],
  ])("rejects %s", (_label, change) => {
    expect(
      interestSubmissionSchema.safeParse({ ...validSubmission, ...change })
        .success,
    ).toBe(false);
  });

  it("rejects unknown object keys", () => {
    expect(
      interestSubmissionSchema.safeParse({
        ...validSubmission,
        unexpected: "not admitted",
      }).success,
    ).toBe(false);
  });
});
