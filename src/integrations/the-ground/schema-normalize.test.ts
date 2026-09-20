import { describe, expect, it } from "vitest";

import {
  normalizeDemoTheGroundEvent,
  normalizeVerifiedLiveTheGroundEvent,
} from "./normalize";
import { theGroundEventPageSchema } from "./schema";

function providerEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: "demo-harbour-flow-01",
    name: "Harbour Light Flow",
    companyId: 424242,
    startDate: "2030-06-01T02:00:00.000Z",
    endDate: "2030-06-01T03:00:00.000Z",
    location: "Garden Room",
    capacity: 18,
    joinedCount: 4,
    shouldPublicRSVP: true,
    price: "0",
    paymentDetails: null,
    imageSrc:
      "https://media.example.com/the-ground-demo/demo-harbour-flow-01.webp",
    hasPayment: false,
    joinDeadline: "2030-06-01T01:30:00.000Z",
    isJoinOpen: true,
    providerContact: "private-person@example.com",
    coaches: [{ name: "Not public" }],
    internalState: "draft-shadow",
    ...overrides,
  };
}

function providerPage(event: Record<string, unknown>) {
  return {
    data: [event],
    meta: {
      page: 1,
      pageSize: 50,
      total: 1,
      pageCount: 1,
      hasNextPage: false,
      nextPage: null,
    },
  };
}

describe("The Ground public schema and normalizer", () => {
  it("admits only the bounded provider contract and strips provider-only fields", () => {
    const parsed = theGroundEventPageSchema.parse(
      providerPage(providerEvent()),
    );
    const event = normalizeDemoTheGroundEvent(parsed.data[0]);
    const parsedSerialised = JSON.stringify(parsed);
    const publicSerialised = JSON.stringify(event);

    expect(event).toEqual(
      expect.objectContaining({
        source: "the-ground",
        eventId: "demo-harbour-flow-01",
        title: "Harbour Light Flow",
        startsAt: "2030-06-01T10:00:00+08:00",
        endsAt: "2030-06-01T11:00:00+08:00",
        registrationUrl:
          "https://bookings.example.com/the-ground-demo/demo-harbour-flow-01",
      }),
    );
    expect(parsedSerialised).not.toMatch(
      /private-person|providerContact|coaches|internalState|draft-shadow/,
    );
    expect(publicSerialised).not.toMatch(/companyId|424242/);
  });

  it("keeps only allow-listed HTTPS images with the exact demo path prefix", () => {
    const allowed = normalizeDemoTheGroundEvent(
      theGroundEventPageSchema.parse(providerPage(providerEvent())).data[0],
    );
    const wrongHost = normalizeDemoTheGroundEvent(
      theGroundEventPageSchema.parse(
        providerPage(
          providerEvent({
            imageSrc:
              "https://unrelated.example.com/the-ground-demo/image.webp",
          }),
        ),
      ).data[0],
    );
    const wrongPath = normalizeDemoTheGroundEvent(
      theGroundEventPageSchema.parse(
        providerPage(
          providerEvent({ imageSrc: "https://media.example.com/private/a.webp" }),
        ),
      ).data[0],
    );

    expect(allowed.imageUrl).toContain("media.example.com/the-ground-demo/");
    expect(wrongHost.imageUrl).toBeNull();
    expect(wrongPath.imageUrl).toBeNull();
  });

  it("rejects timestamps without an explicit offset and impossible windows", () => {
    expect(() =>
      theGroundEventPageSchema.parse(
        providerPage(providerEvent({ startDate: "2030-06-01T10:00:00" })),
      ),
    ).toThrow();
    expect(() =>
      theGroundEventPageSchema.parse(
        providerPage(
          providerEvent({
            startDate: "2030-06-01T03:00:00.000Z",
            endDate: "2030-06-01T02:00:00.000Z",
          }),
        ),
      ),
    ).toThrow();
  });

  it.each([
    "2030-02-30T10:00:00Z",
    "June 1, 2030 10:00:00 +08:00",
    "2030/06/01 10:00:00+08:00",
    "2030-06-01T10:00:00+24:00",
  ])("rejects non-RFC3339 or impossible timestamp %s", (startDate) => {
    expect(() =>
      theGroundEventPageSchema.parse(
        providerPage(providerEvent({ startDate })),
      ),
    ).toThrow();
  });

  it("accepts valid UTC and numeric-offset RFC3339 timestamps", () => {
    expect(() =>
      theGroundEventPageSchema.parse(
        providerPage(
          providerEvent({
            startDate: "2030-06-01T02:00:00Z",
            endDate: "2030-06-01T11:00:00+08:00",
            joinDeadline: "2030-06-01T09:30:00+08:00",
          }),
        ),
      ),
    ).not.toThrow();
  });

  it.each([
    ["2000-01-01T00:00:00Z", "2100-01-01T00:00:00Z"],
    ["2028-01-01T12:00:00+08:00", "2029-01-01T04:00:00.001Z"],
  ])(
    "rejects upstream windows beyond 366 elapsed days (%s to %s)",
    (startDate, endDate) => {
      expect(() =>
        theGroundEventPageSchema.parse(
          providerPage(providerEvent({ startDate, endDate })),
        ),
      ).toThrow(/366/);
    },
  );

  it.each([
    "2029-01-01T04:00:00Z",
    "2029-01-01T03:59:59.999Z",
  ])("accepts the leap-year duration boundary ending at %s", (endDate) => {
    expect(() =>
      theGroundEventPageSchema.parse(
        providerPage(
          providerEvent({
            startDate: "2028-01-01T12:00:00+08:00",
            endDate,
          }),
        ),
      ),
    ).not.toThrow();
  });

  it("requires provider organisation membership and bounds public location labels", () => {
    const missingCompany = Object.fromEntries(
      Object.entries(providerEvent()).filter(([key]) => key !== "companyId"),
    );

    expect(() =>
      theGroundEventPageSchema.parse(providerPage(missingCompany)),
    ).toThrow();
    expect(() =>
      theGroundEventPageSchema.parse(
        providerPage(providerEvent({ location: "界".repeat(120) })),
      ),
    ).not.toThrow();
    expect(() =>
      theGroundEventPageSchema.parse(
        providerPage(providerEvent({ location: "界".repeat(121) })),
      ),
    ).toThrow();

    const parsed = theGroundEventPageSchema.parse(
      providerPage(providerEvent()),
    );
    expect(() =>
      normalizeVerifiedLiveTheGroundEvent(parsed.data[0], "434343"),
    ).toThrow(/verified organisation/);
  });

  it("normalises free, paid and unknown price states without guessing", () => {
    const parse = (overrides: Record<string, unknown>) =>
      normalizeDemoTheGroundEvent(
        theGroundEventPageSchema.parse(
          providerPage(providerEvent(overrides)),
        ).data[0],
      ).price;

    expect(parse({ hasPayment: false })).toEqual({ kind: "free" });
    expect(
      parse({
        hasPayment: true,
        price: "240",
        paymentDetails: "240 HKD",
      }),
    ).toEqual({
      kind: "paid",
      amount: 240,
      currency: "HKD",
      sourceDisplay: "240 HKD",
    });
    expect(
      parse({ hasPayment: true, price: null, paymentDetails: "Ask provider" }),
    ).toEqual({ kind: "unknown", sourceDisplay: "Ask provider" });
  });
});
