import { describe, expect, it } from "vitest";

import { demoBrands } from "./brands";
import { demoEvents } from "./events";
import { demoTheGroundProviderEvents } from "./the-ground-provider";

function isReservedExampleUrl(value: string) {
  const hostname = new URL(value).hostname;
  return hostname === "example.com" || hostname.endsWith(".example.com");
}

describe("public demo fixtures", () => {
  it("contains only explicitly synthetic records and reserved example contacts", () => {
    for (const event of demoEvents) {
      expect(event.fixtureKind).toBe("synthetic");
      expect(event.eventId).toMatch(/^demo-/);
      expect(isReservedExampleUrl(event.registrationUrl)).toBe(true);
      expect(event.contactEmail).toMatch(/@(?:[a-z0-9-]+\.)*example\.com$/);
    }

    for (const brand of demoBrands) {
      expect(brand.fixtureKind).toBe("synthetic");
      expect(brand.brandId).toMatch(/^demo-/);
      expect(isReservedExampleUrl(brand.website)).toBe(true);
      expect(brand.contactEmail).toMatch(/@(?:[a-z0-9-]+\.)*example\.com$/);
    }

    for (const event of demoTheGroundProviderEvents) {
      expect(event.id).toMatch(/^demo-/);
      expect(event.companyId).toBe(424242);
      expect(event.providerContact).toMatch(
        /@(?:[a-z0-9-]+\.)*example\.com$/,
      );
      if (event.imageSrc) expect(isReservedExampleUrl(event.imageSrc)).toBe(true);
    }
    expect(
      new Set(demoTheGroundProviderEvents.map(({ companyId }) => companyId)),
    ).toEqual(new Set([424242]));

    const serialisedFixtures = JSON.stringify({
      demoBrands,
      demoEvents,
      demoTheGroundProviderEvents,
    });
    expect(serialisedFixtures).not.toMatch(
      /gmail\.com|outlook\.com|cloudflare|googleapis|sheetId|accountId|queueName/i,
    );
  });

  it("covers multi-day, HKT midnight-boundary, paid, free and unknown states", () => {
    const priceKinds = new Set(demoEvents.map((event) => event.price.kind));
    expect(priceKinds).toEqual(new Set(["free", "paid", "unclassified"]));

    expect(
      demoEvents.some(
        ({ startsAt, endsAt }) =>
          startsAt.slice(0, 10) < endsAt.slice(0, 10) &&
          Date.parse(endsAt) - Date.parse(startsAt) >= 24 * 60 * 60 * 1000,
      ),
    ).toBe(true);

    expect(
      demoEvents.some(
        ({ startsAt, endsAt }) =>
          startsAt.endsWith("+08:00") &&
          endsAt.endsWith("+08:00") &&
          startsAt.slice(0, 10) !== endsAt.slice(0, 10) &&
          Date.parse(endsAt) - Date.parse(startsAt) <= 2 * 60 * 60 * 1000,
      ),
    ).toBe(true);

    expect(demoEvents.some(({ category }) => category === null)).toBe(true);
  });
});
