import { describe, expect, it } from "vitest";

import type { TheGroundEvent } from "@/integrations/the-ground/types";

import {
  filterAndSortProgrammeEvents,
  getProgrammeFilterOptions,
  parseProgrammeFilters,
  toLocationKey,
  toProgrammeSearchParams,
} from "./programme-filters";

function event(
  eventId: string,
  title: string,
  startsAt: TheGroundEvent["startsAt"],
  endsAt: TheGroundEvent["endsAt"],
  overrides: Partial<TheGroundEvent> = {},
): TheGroundEvent {
  return {
    source: "the-ground",
    eventId,
    title,
    startsAt,
    endsAt,
    location: "Garden Room",
    imageUrl: null,
    registrationUrl: `https://www.theground.io/events/public/${eventId}`,
    price: { kind: "free" },
    registration: { isOpen: true, deadline: null },
    availability: { visibility: "hidden", capacity: null, joinedCount: null },
    ...overrides,
  };
}

const now = "2030-06-01T03:00:00.000Z";
const events = [
  event(
    "past-old",
    "Paper Garden Ritual",
    "2030-05-31T09:00:00+08:00",
    "2030-05-31T10:00:00+08:00",
  ),
  event(
    "past-recent",
    "Common Table Reading Circle",
    "2030-06-01T08:00:00+08:00",
    "2030-06-01T09:00:00+08:00",
    { location: "Quiet Hall", registration: { isOpen: false, deadline: null } },
  ),
  event(
    "live",
    "Harbour Light Flow + Tidal Listening Reset",
    "2030-06-01T10:00:00+08:00",
    "2030-06-01T12:00:00+08:00",
    { location: "Quiet Hall" },
  ),
  event(
    "upcoming-closed",
    "Lantern Core Studio",
    "2030-06-01T13:00:00+08:00",
    "2030-06-01T14:00:00+08:00",
    {
      price: { kind: "paid", amount: 180, currency: "HKD", sourceDisplay: "180 HKD" },
      registration: { isOpen: false, deadline: null },
    },
  ),
  event(
    "upcoming-open",
    "Open Studio Listing",
    "2030-06-01T13:00:00+08:00",
    "2030-06-01T14:00:00+08:00",
    { price: { kind: "unknown", sourceDisplay: null } },
  ),
] as const;

describe("programme URL filters and action-first order", () => {
  it("orders live, upcoming chronologically with booking as a tie-breaker, then recent past", () => {
    const filters = parseProgrammeFilters({}, events);

    expect(
      filterAndSortProgrammeEvents(events, filters, now).map(
        ({ eventId }) => eventId,
      ),
    ).toEqual([
      "live",
      "upcoming-open",
      "upcoming-closed",
      "past-recent",
      "past-old",
    ]);
  });

  it("ignores invalid or repeated query values and serialises only canonical state", () => {
    const filters = parseProgrammeFilters(
      {
        temporal: ["today", "past"],
        date: "2030-02-30",
        category: "invented",
        location: "not-a-location",
        price: "gift",
        booking: "maybe",
      },
      events,
    );

    expect(filters).toEqual({
      temporal: "all",
      date: null,
      category: "all",
      location: "all",
      price: "all",
      booking: "all",
    });
    expect(toProgrammeSearchParams(filters).toString()).toBe("");
  });

  it("combines exact occupied HKT date, category, location, price and booking filters", () => {
    const overnight = event(
      "overnight",
      "Harbour Light Flow",
      "2030-06-01T23:30:00+08:00",
      "2030-06-02T00:30:00+08:00",
      { location: "Quiet Hall" },
    );
    const pool = [...events, overnight];
    const filters = parseProgrammeFilters(
      {
        date: "2030-06-02",
        category: "yoga-flow",
        location: toLocationKey("Quiet Hall"),
        price: "free",
        booking: "open",
      },
      pool,
    );

    expect(
      filterAndSortProgrammeEvents(pool, filters, now).map(
        ({ eventId }) => eventId,
      ),
    ).toEqual(["overnight"]);
    expect(toProgrammeSearchParams(filters).toString()).toBe(
      `date=2030-06-02&category=yoga-flow&location=${toLocationKey("Quiet Hall")}&price=free&booking=open`,
    );
  });

  it("keeps Today separate from absolute past phase", () => {
    const filters = parseProgrammeFilters({ temporal: "today" }, events);

    expect(
      filterAndSortProgrammeEvents(events, filters, now).map(
        ({ eventId }) => eventId,
      ),
    ).toEqual([
      "live",
      "upcoming-open",
      "upcoming-closed",
      "past-recent",
    ]);
  });

  it("derives bounded URL option keys from the admitted catalogue", () => {
    const locations = getProgrammeFilterOptions(events).locations;
    expect(locations).toEqual([
      { key: toLocationKey("Garden Room"), label: "Garden Room" },
      { key: toLocationKey("Quiet Hall"), label: "Quiet Hall" },
    ]);
    expect(locations.every(({ key }) => /^[A-Za-z0-9_-]+$/.test(key))).toBe(
      true,
    );
  });

  it("creates reversible Unicode-safe location keys without punctuation collisions", () => {
    const labels = ["A+B", "A B", "中環"] as const;
    const keys = labels.map(toLocationKey);

    expect(new Set(keys).size).toBe(labels.length);
    expect(keys.every((key) => /^loc_[A-Za-z0-9_-]+$/.test(key))).toBe(true);
    expect(
      keys.map((key) =>
        Buffer.from(key.slice("loc_".length), "base64url").toString("utf8"),
      ),
    ).toEqual(labels);
  });

  it.each(["A+B", "A B", "中環"])(
    "filters only the intended %s location",
    (location) => {
      const pool = [
        event(
          "plus",
          "Open Studio Listing",
          "2030-06-02T10:00:00+08:00",
          "2030-06-02T11:00:00+08:00",
          { location: "A+B" },
        ),
        event(
          "space",
          "Open Studio Listing",
          "2030-06-02T10:00:00+08:00",
          "2030-06-02T11:00:00+08:00",
          { location: "A B" },
        ),
        event(
          "central",
          "Open Studio Listing",
          "2030-06-02T10:00:00+08:00",
          "2030-06-02T11:00:00+08:00",
          { location: "中環" },
        ),
      ];
      const filters = parseProgrammeFilters(
        { location: toLocationKey(location) },
        pool,
      );

      expect(
        filterAndSortProgrammeEvents(pool, filters, now).map(
          ({ eventId }) => eventId,
        ),
      ).toEqual([
        location === "A+B" ? "plus" : location === "A B" ? "space" : "central",
      ]);
    },
  );
});
