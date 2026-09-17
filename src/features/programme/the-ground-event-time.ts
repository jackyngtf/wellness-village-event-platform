interface EventWindow {
  readonly startsAt: string;
  readonly endsAt: string;
}

export type EventPhase = "upcoming" | "live" | "past" | "invalid";
export type EventCalendarBucket = "today" | "upcoming" | "past" | "invalid";

const HKT_OFFSET_MS = 8 * 60 * 60 * 1_000;
const DAY_MS = 24 * 60 * 60 * 1_000;

function parseInstant(value: string | number | Date): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

function parseWindow(event: EventWindow) {
  const startsAt = parseInstant(event.startsAt);
  const endsAt = parseInstant(event.endsAt);
  return Number.isFinite(startsAt) &&
    Number.isFinite(endsAt) &&
    endsAt > startsAt
    ? { startsAt, endsAt }
    : null;
}

function hktDateKeyFromEpoch(epochMs: number): string {
  return new Date(epochMs + HKT_OFFSET_MS).toISOString().slice(0, 10);
}

function parseHktDateKey(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const epochMs = Date.parse(`${value}T00:00:00+08:00`);
  return Number.isFinite(epochMs) && hktDateKeyFromEpoch(epochMs) === value
    ? epochMs
    : null;
}

export function getEventPhase(
  event: EventWindow,
  now: string | number | Date,
): EventPhase {
  const window = parseWindow(event);
  const nowMs = parseInstant(now);
  if (!window || !Number.isFinite(nowMs)) return "invalid";
  if (nowMs < window.startsAt) return "upcoming";
  if (nowMs < window.endsAt) return "live";
  return "past";
}

export function getEventHktDateRange(
  event: EventWindow,
): Readonly<{ startsOn: string; endsOn: string }> | null {
  const window = parseWindow(event);
  if (!window) return null;

  return {
    startsOn: hktDateKeyFromEpoch(window.startsAt),
    // Intervals are end-exclusive, so midnight belongs only to the prior day.
    endsOn: hktDateKeyFromEpoch(window.endsAt - 1),
  };
}

export function doesEventOccurOnHktDate(
  event: EventWindow,
  dateKey: string,
): boolean {
  const window = parseWindow(event);
  const dateStart = parseHktDateKey(dateKey);
  if (!window || dateStart === null) return false;

  const dateEnd = dateStart + DAY_MS;
  return window.startsAt < dateEnd && window.endsAt > dateStart;
}

export function getEventCalendarBucket(
  event: EventWindow,
  now: string | number | Date,
): EventCalendarBucket {
  const range = getEventHktDateRange(event);
  const nowMs = parseInstant(now);
  if (!range || !Number.isFinite(nowMs)) return "invalid";

  const today = hktDateKeyFromEpoch(nowMs);
  if (range.startsOn <= today && range.endsOn >= today) return "today";
  return range.startsOn > today ? "upcoming" : "past";
}
