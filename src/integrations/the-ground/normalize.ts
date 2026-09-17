import type { TheGroundProviderEvent } from "./schema";
import { parseTheGroundOrganizationId } from "./config";
import type {
  HktDateTime,
  TheGroundEvent,
  TheGroundEventPrice,
} from "./types";

const HKT_OFFSET_MS = 8 * 60 * 60 * 1_000;
const PUBLIC_DEMO_IMAGE_HOST = "media.example.com";
const PUBLIC_DEMO_IMAGE_PATH_PREFIX = "/the-ground-demo/";
const PUBLIC_DEMO_BOOKING_ORIGIN = "https://bookings.example.com";

export function toHktDateTime(value: string): HktDateTime {
  const instant = Date.parse(value);
  if (!Number.isFinite(instant)) {
    throw new RangeError("Cannot convert an invalid date-time to HKT.");
  }

  const wallClock = new Date(instant + HKT_OFFSET_MS)
    .toISOString()
    .slice(0, 19);
  return `${wallClock}+08:00`;
}

function normalizeImageUrl(value: string | null): string | null {
  if (!value) return null;

  const url = new URL(value);
  return url.protocol === "https:" &&
    url.hostname === PUBLIC_DEMO_IMAGE_HOST &&
    url.pathname.startsWith(PUBLIC_DEMO_IMAGE_PATH_PREFIX)
    ? url.toString()
    : null;
}

function normalizePrice(event: TheGroundProviderEvent): TheGroundEventPrice {
  if (!event.hasPayment) return { kind: "free" };

  const match = event.paymentDetails?.match(
    /^\s*(\d+(?:\.\d+)?)\s+([A-Z]{3})\s*$/,
  );
  if (match) {
    const amount = Number(match[1]);
    if (Number.isFinite(amount)) {
      return {
        kind: "paid",
        amount,
        currency: match[2],
        sourceDisplay: event.paymentDetails ?? "",
      };
    }
  }

  return {
    kind: "unknown",
    sourceDisplay:
      event.paymentDetails ??
      (event.price === null ? null : String(event.price)),
  };
}

function normalizeTheGroundEvent(
  event: TheGroundProviderEvent,
  registrationUrl: string,
): TheGroundEvent {
  const availability = event.shouldPublicRSVP
    ? {
        visibility: "public" as const,
        capacity: event.capacity,
        joinedCount: event.joinedCount,
      }
    : {
        visibility: "hidden" as const,
        capacity: null,
        joinedCount: null,
      };

  return {
    source: "the-ground",
    eventId: event.id,
    title: event.name,
    startsAt: toHktDateTime(event.startDate),
    endsAt: toHktDateTime(event.endDate),
    location: event.location || null,
    imageUrl: normalizeImageUrl(event.imageSrc),
    registrationUrl,
    price: normalizePrice(event),
    registration: {
      isOpen: event.isJoinOpen,
      deadline: event.joinDeadline ? toHktDateTime(event.joinDeadline) : null,
    },
    availability,
  };
}

export function normalizeDemoTheGroundEvent(
  event: TheGroundProviderEvent,
): TheGroundEvent {
  return normalizeTheGroundEvent(
    event,
    `${PUBLIC_DEMO_BOOKING_ORIGIN}/the-ground-demo/${encodeURIComponent(event.id)}`,
  );
}

export function normalizeVerifiedLiveTheGroundEvent(
  event: TheGroundProviderEvent,
  expectedOrganizationId: string,
): TheGroundEvent {
  const organizationId = parseTheGroundOrganizationId(expectedOrganizationId);
  if (String(event.companyId) !== organizationId) {
    throw new RangeError(
      "Cannot normalise a live event outside the verified organisation.",
    );
  }

  return normalizeTheGroundEvent(
    event,
    `https://www.theground.io/events/public/${encodeURIComponent(event.id)}`,
  );
}
