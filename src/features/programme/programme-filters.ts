import type { TheGroundEvent } from "@/integrations/the-ground/types";
import type { Locale } from "@/content/routes";

import {
  getProgrammeEventCategoryIds,
  programmeEventCategoryIds,
  type ProgrammeEventCategoryId,
} from "./event-categories";
import {
  doesEventOccurOnHktDate,
  getEventCalendarBucket,
  getEventHktDateRange,
  getEventPhase,
} from "./the-ground-event-time";

export type ProgrammeTemporalFilter =
  | "all"
  | "today"
  | "upcoming"
  | "past";
export type ProgrammePriceFilter = "all" | "free" | "paid" | "unknown";
export type ProgrammeBookingFilter = "all" | "open" | "closed";

export interface ProgrammeFilters {
  readonly temporal: ProgrammeTemporalFilter;
  readonly date: string | null;
  readonly category: ProgrammeEventCategoryId | "all";
  readonly location: string | "all";
  readonly price: ProgrammePriceFilter;
  readonly booking: ProgrammeBookingFilter;
}

type RawSearchParams = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

const temporalValues = new Set<ProgrammeTemporalFilter>([
  "all",
  "today",
  "upcoming",
  "past",
]);
const priceValues = new Set<ProgrammePriceFilter>([
  "all",
  "free",
  "paid",
  "unknown",
]);
const bookingValues = new Set<ProgrammeBookingFilter>([
  "all",
  "open",
  "closed",
]);
const categoryValues = new Set<ProgrammeEventCategoryId | "all">([
  "all",
  "other",
  ...programmeEventCategoryIds,
]);

function scalar(value: string | readonly string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

function hktDateAfter(dateKey: string): string {
  const epoch = Date.parse(`${dateKey}T00:00:00+08:00`);
  return new Date(epoch + 8 * 60 * 60 * 1_000 + 24 * 60 * 60 * 1_000)
    .toISOString()
    .slice(0, 10);
}

export function getProgrammeEventDates(
  events: readonly TheGroundEvent[],
): readonly string[] {
  const dates = new Set<string>();
  for (const event of events) {
    const range = getEventHktDateRange(event);
    if (!range) continue;
    for (
      let dateKey = range.startsOn;
      dateKey <= range.endsOn;
      dateKey = hktDateAfter(dateKey)
    ) {
      dates.add(dateKey);
    }
  }
  return [...dates].sort();
}

export function toLocationKey(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return `loc_${btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")}`;
}

export function getProgrammeFilterOptions(events: readonly TheGroundEvent[]) {
  const locationsByKey = new Map<string, string>();
  for (const event of events) {
    if (!event.location) continue;
    const key = toLocationKey(event.location);
    if (key && !locationsByKey.has(key)) locationsByKey.set(key, event.location);
  }

  return {
    dates: getProgrammeEventDates(events),
    locations: [...locationsByKey]
      .map(([key, label]) => ({ key, label }))
      .sort((left, right) => left.label.localeCompare(right.label, "en")),
  } as const;
}

export function parseProgrammeFilters(
  raw: RawSearchParams,
  events: readonly TheGroundEvent[],
): ProgrammeFilters {
  const options = getProgrammeFilterOptions(events);
  const availableDates = new Set(options.dates);
  const availableLocations = new Set(options.locations.map(({ key }) => key));
  const rawDate = scalar(raw.date);
  const date = rawDate && availableDates.has(rawDate) ? rawDate : null;
  const rawTemporal = scalar(raw.temporal) as ProgrammeTemporalFilter | null;
  const rawCategory = scalar(raw.category) as
    | ProgrammeEventCategoryId
    | "all"
    | null;
  const rawLocation = scalar(raw.location);
  const rawPrice = scalar(raw.price) as ProgrammePriceFilter | null;
  const rawBooking = scalar(raw.booking) as ProgrammeBookingFilter | null;

  return {
    temporal:
      date || !rawTemporal || !temporalValues.has(rawTemporal)
        ? "all"
        : rawTemporal,
    date,
    category:
      rawCategory && categoryValues.has(rawCategory) ? rawCategory : "all",
    location:
      rawLocation && availableLocations.has(rawLocation) ? rawLocation : "all",
    price: rawPrice && priceValues.has(rawPrice) ? rawPrice : "all",
    booking:
      rawBooking && bookingValues.has(rawBooking) ? rawBooking : "all",
  };
}

export function toProgrammeSearchParams(
  filters: ProgrammeFilters,
): URLSearchParams {
  const search = new URLSearchParams();
  if (filters.temporal !== "all") search.set("temporal", filters.temporal);
  if (filters.date) search.set("date", filters.date);
  if (filters.category !== "all") search.set("category", filters.category);
  if (filters.location !== "all") search.set("location", filters.location);
  if (filters.price !== "all") search.set("price", filters.price);
  if (filters.booking !== "all") search.set("booking", filters.booking);
  return search;
}

export function buildProgrammeHref(
  locale: Locale,
  filters: ProgrammeFilters,
): string {
  const query = toProgrammeSearchParams(filters).toString();
  return `/${locale}/programme${query ? `?${query}` : ""}#programme-results`;
}

function matchesTemporal(
  event: TheGroundEvent,
  temporal: ProgrammeTemporalFilter,
  now: string | number | Date,
): boolean {
  if (temporal === "all") return true;
  if (temporal === "today") {
    return getEventCalendarBucket(event, now) === "today";
  }
  return getEventPhase(event, now) === temporal;
}

function actionFirstComparison(
  left: TheGroundEvent,
  right: TheGroundEvent,
  now: string | number | Date,
): number {
  const rank = { live: 0, upcoming: 1, past: 2, invalid: 3 } as const;
  const leftPhase = getEventPhase(left, now);
  const rightPhase = getEventPhase(right, now);
  const phaseDifference = rank[leftPhase] - rank[rightPhase];
  if (phaseDifference) return phaseDifference;

  const primaryDifference =
    leftPhase === "past"
      ? Date.parse(right.endsAt) - Date.parse(left.endsAt)
      : Date.parse(left.startsAt) - Date.parse(right.startsAt);
  if (primaryDifference) return primaryDifference;

  if (leftPhase === "live" || leftPhase === "upcoming") {
    const bookingDifference =
      Number(right.registration.isOpen) - Number(left.registration.isOpen);
    if (bookingDifference) return bookingDifference;
  }

  return left.eventId.localeCompare(right.eventId);
}

export function filterAndSortProgrammeEvents(
  events: readonly TheGroundEvent[],
  filters: ProgrammeFilters,
  now: string | number | Date,
): readonly TheGroundEvent[] {
  return events
    .filter((event) => {
      if (!matchesTemporal(event, filters.temporal, now)) return false;
      if (filters.date && !doesEventOccurOnHktDate(event, filters.date)) {
        return false;
      }
      if (
        filters.category !== "all" &&
        !getProgrammeEventCategoryIds(event.title).includes(filters.category)
      ) {
        return false;
      }
      if (
        filters.location !== "all" &&
        (!event.location || toLocationKey(event.location) !== filters.location)
      ) {
        return false;
      }
      if (filters.price !== "all" && event.price.kind !== filters.price) {
        return false;
      }
      if (
        filters.booking !== "all" &&
        event.registration.isOpen !== (filters.booking === "open")
      ) {
        return false;
      }
      return true;
    })
    .sort((left, right) => actionFirstComparison(left, right, now));
}
