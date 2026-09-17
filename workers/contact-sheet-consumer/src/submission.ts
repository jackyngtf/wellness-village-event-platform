import { z } from "zod";

export const SHEET_HEADERS = [
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
] as const;

export const portfolioConsentVersion = "portfolio-demo-contact-v1" as const;
export const portfolioContactPurpose =
  "portfolio-demo-contact-interest" as const;

const phoneSchema = z
  .string()
  .min(1)
  .max(32)
  .refine((value) => {
    const digits = value.match(/\d/g)?.length ?? 0;
    return /^[+\d().\-\s]+$/.test(value) && digits >= 6 && digits <= 20;
  });

const contactSubmissionSchema = z
  .strictObject({
    submission_id: z.uuid(),
    submitted_at_utc: z.iso.datetime({ offset: true }),
    submitted_at_hkt: z.iso.datetime({ offset: true }),
    last_name: z.string().min(1).max(80),
    first_name: z.string().min(1).max(80),
    display_name: z.string().min(1).max(161),
    email: z.email().max(254),
    phone: phoneSchema,
    locale: z.enum(["en", "zh-hk"]),
    source_page: z
      .string()
      .min(1)
      .max(200)
      .refine(
        (value) =>
          value === "unknown" ||
          (value.startsWith("/") && !value.includes("?") && !value.includes("#")),
      ),
    consent: z.literal(true),
    consent_version: z.literal(portfolioConsentVersion),
    purpose: z.literal(portfolioContactPurpose),
    marketing_opt_in: z.literal(true),
  })
  .superRefine((value, context) => {
    if (
      !value.submitted_at_utc.endsWith("Z") ||
      !value.submitted_at_hkt.endsWith("+08:00") ||
      Date.parse(value.submitted_at_utc) !== Date.parse(value.submitted_at_hkt)
    ) {
      context.addIssue({ code: "custom", message: "timestamp mismatch" });
    }
    const expectedDisplayName =
      value.locale === "zh-hk"
        ? `${value.last_name}${value.first_name}`
        : `${value.first_name} ${value.last_name}`;
    if (value.display_name !== expectedDisplayName) {
      context.addIssue({ code: "custom", message: "display name mismatch" });
    }
  });

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
export type SheetCell = string | boolean;

export function parseContactSubmission(value: unknown): ContactSubmission {
  const result = contactSubmissionSchema.safeParse(value);
  if (!result.success) throw new Error("invalid contact submission");
  return result.data;
}

export function submissionToRow(
  submission: ContactSubmission,
): SheetCell[] {
  return SHEET_HEADERS.map((header) => submission[header]);
}
