import { z } from "zod";

export const portfolioConsentVersion = "portfolio-demo-contact-v1" as const;
export const portfolioContactPurpose =
  "portfolio-demo-contact-interest" as const;

const phoneSchema = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .refine((value) => {
    const digitCount = value.match(/\d/g)?.length ?? 0;
    return /^[+\d().\-\s]+$/.test(value) && digitCount >= 6 && digitCount <= 20;
  }, "Enter a valid phone number.");

/**
 * The public contract is intentionally small and strict. Family and given
 * names stay separate, and consent is the literal boolean true rather than a
 * truthy value. Public examples use reserved example.com contact details.
 */
export const interestSubmissionSchema = z
  .object({
    submissionId: z.uuid(),
    familyName: z.string().trim().min(1).max(80),
    givenName: z.string().trim().min(1).max(80),
    email: z.email().trim().max(254),
    phone: phoneSchema,
    locale: z.enum(["en", "zh-hk"]),
    consent: z.literal(true),
    turnstileToken: z.string().trim().min(1).max(2_048),
    website: z.string().max(200).default(""),
  })
  .strict();

export type InterestSubmission = z.infer<typeof interestSubmissionSchema>;
