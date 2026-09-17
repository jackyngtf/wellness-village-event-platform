import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
  portfolioConsentVersion,
  portfolioContactPurpose,
  type InterestSubmission,
} from "../schema";

const maxSourcePathLength = 200;

export const queueFieldOrder = [
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

export interface InterestQueuePayload {
  readonly submission_id: string;
  readonly submitted_at_utc: string;
  readonly submitted_at_hkt: string;
  readonly last_name: string;
  readonly first_name: string;
  readonly display_name: string;
  readonly email: string;
  readonly phone: string;
  readonly locale: "en" | "zh-hk";
  readonly source_page: string;
  readonly consent: true;
  readonly consent_version: typeof portfolioConsentVersion;
  readonly purpose: typeof portfolioContactPurpose;
  readonly marketing_opt_in: true;
}

export interface InterestSubmissionsQueue {
  send(
    message: InterestQueuePayload,
    options: Readonly<{ contentType: "json" }>,
  ): Promise<unknown>;
}

function isInterestQueue(value: unknown): value is InterestSubmissionsQueue {
  return (
    typeof value === "object" &&
    value !== null &&
    "send" in value &&
    typeof value.send === "function"
  );
}

export async function getInterestSubmissionsQueue(): Promise<InterestSubmissionsQueue | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const queue = env.PORTFOLIO_CONTACT_SUBMISSIONS_QUEUE;
    return isInterestQueue(queue) ? queue : null;
  } catch {
    return null;
  }
}

/** Persist only a same-origin pathname, never a query or fragment. */
export function getSourcePage(request: Request): string {
  const referer = request.headers.get("referer");
  if (!referer) return "unknown";

  try {
    const requestUrl = new URL(request.url);
    const sourceUrl = new URL(referer);
    if (
      sourceUrl.origin !== requestUrl.origin ||
      sourceUrl.pathname.length === 0 ||
      sourceUrl.pathname.length > maxSourcePathLength
    ) {
      return "unknown";
    }
    return sourceUrl.pathname;
  } catch {
    return "unknown";
  }
}

function toHongKongTimestamp(now: Date): string {
  const hkt = new Date(now.getTime() + 8 * 60 * 60 * 1_000);
  return `${hkt.toISOString().slice(0, -1)}+08:00`;
}

export function createInterestQueuePayload(
  submission: InterestSubmission,
  options: Readonly<{ now: Date; sourcePage: string }>,
): InterestQueuePayload {
  const displayName =
    submission.locale === "zh-hk"
      ? `${submission.familyName}${submission.givenName}`
      : `${submission.givenName} ${submission.familyName}`;

  return {
    submission_id: submission.submissionId,
    submitted_at_utc: options.now.toISOString(),
    submitted_at_hkt: toHongKongTimestamp(options.now),
    last_name: submission.familyName,
    first_name: submission.givenName,
    display_name: displayName,
    email: submission.email,
    phone: submission.phone,
    locale: submission.locale,
    source_page: options.sourcePage,
    consent: true,
    consent_version: portfolioConsentVersion,
    purpose: portfolioContactPurpose,
    marketing_opt_in: true,
  };
}
