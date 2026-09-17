import { describe, expect, it } from "vitest";

import {
  doesEventOccurOnHktDate,
  getEventCalendarBucket,
  getEventPhase,
  getEventHktDateRange,
} from "./the-ground-event-time";

const daytimeEvent = {
  startsAt: "2030-06-01T10:00:00+08:00",
  endsAt: "2030-06-01T11:00:00+08:00",
} as const;

describe("The Ground event time in Hong Kong", () => {
  it("uses exact [start, end) boundaries for phase", () => {
    expect(getEventPhase(daytimeEvent, "2030-06-01T01:59:59.999Z")).toBe(
      "upcoming",
    );
    expect(getEventPhase(daytimeEvent, "2030-06-01T02:00:00.000Z")).toBe(
      "live",
    );
    expect(getEventPhase(daytimeEvent, "2030-06-01T03:00:00.000Z")).toBe(
      "past",
    );
  });

  it("keeps an event that ended earlier today in Today while labelling it past", () => {
    const now = "2030-06-01T08:00:00.000Z";

    expect(getEventPhase(daytimeEvent, now)).toBe("past");
    expect(getEventCalendarBucket(daytimeEvent, now)).toBe("today");
  });

  it("changes calendar bucket at Hong Kong midnight regardless of host timezone", () => {
    expect(
      getEventCalendarBucket(daytimeEvent, "2030-05-31T15:59:59.999Z"),
    ).toBe("upcoming");
    expect(
      getEventCalendarBucket(daytimeEvent, "2030-06-01T16:00:00.000Z"),
    ).toBe("past");
  });

  it("includes every occupied HKT date for overnight and multi-day events", () => {
    const overnight = {
      startsAt: "2030-06-01T23:30:00+08:00",
      endsAt: "2030-06-02T00:30:00+08:00",
    } as const;
    const multiDay = {
      startsAt: "2030-06-01T18:00:00+08:00",
      endsAt: "2030-06-04T09:30:00+08:00",
    } as const;

    expect(doesEventOccurOnHktDate(overnight, "2030-06-01")).toBe(true);
    expect(doesEventOccurOnHktDate(overnight, "2030-06-02")).toBe(true);
    expect(doesEventOccurOnHktDate(overnight, "2030-06-03")).toBe(false);
    expect(doesEventOccurOnHktDate(multiDay, "2030-06-03")).toBe(true);
    expect(getEventHktDateRange(multiDay)).toEqual({
      startsOn: "2030-06-01",
      endsOn: "2030-06-04",
    });
  });

  it("does not assign an event to a date it only touches at midnight", () => {
    const endsAtMidnight = {
      startsAt: "2030-06-01T22:00:00+08:00",
      endsAt: "2030-06-02T00:00:00+08:00",
    } as const;

    expect(doesEventOccurOnHktDate(endsAtMidnight, "2030-06-01")).toBe(true);
    expect(doesEventOccurOnHktDate(endsAtMidnight, "2030-06-02")).toBe(false);
    expect(getEventHktDateRange(endsAtMidnight)).toEqual({
      startsOn: "2030-06-01",
      endsOn: "2030-06-01",
    });
  });

  it("fails safely for invalid timestamps and invalid calendar dates", () => {
    const invalid = { startsAt: "not-a-date", endsAt: "still-not-a-date" };

    expect(getEventPhase(invalid, "2030-06-01T00:00:00Z")).toBe("invalid");
    expect(getEventCalendarBucket(invalid, "2030-06-01T00:00:00Z")).toBe(
      "invalid",
    );
    expect(doesEventOccurOnHktDate(invalid, "2030-06-01")).toBe(false);
    expect(doesEventOccurOnHktDate(daytimeEvent, "2030-02-30")).toBe(false);
    expect(getEventHktDateRange(invalid)).toBeNull();
  });
});
