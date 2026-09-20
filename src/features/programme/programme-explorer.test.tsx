import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type {
  TheGroundCatalogResult,
  TheGroundEvent,
} from "@/integrations/the-ground/types";

import { parseProgrammeFilters } from "./programme-filters";
import { ProgrammeExplorer } from "./programme-explorer";

const demoEvent: TheGroundEvent = {
  source: "the-ground",
  eventId: "demo-harbour-flow-01",
  title: "Harbour Light Flow",
  startsAt: "2030-06-01T10:00:00+08:00",
  endsAt: "2030-06-01T11:00:00+08:00",
  location: "Garden Room",
  imageUrl: null,
  registrationUrl:
    "https://bookings.example.com/the-ground-demo/demo-harbour-flow-01",
  price: { kind: "free" },
  registration: { isOpen: true, deadline: null },
  availability: { visibility: "public", capacity: 20, joinedCount: 4 },
};

const liveEvent: TheGroundEvent = {
  ...demoEvent,
  eventId: "verified-live-event",
  registrationUrl:
    "https://www.theground.io/events/public/verified-live-event",
};

function result(
  freshness: TheGroundCatalogResult["freshness"],
  event: TheGroundEvent = freshness === "demo" ? demoEvent : liveEvent,
): TheGroundCatalogResult {
  return {
    mode: freshness === "demo" ? "demo" : "live",
    freshness,
    fetchedAt: "2030-05-20T00:00:00.000Z",
    data: { events: [event] },
  };
}

describe("bilingual programme explorer", () => {
  it.each([
    ["en", "HKD", 49.5, "HK$49.50"],
    ["zh-hk", "HKD", 49.5, "HK$49.50"],
    ["en", "JPY", 49.5, "JP¥50"],
    ["zh-hk", "JPY", 49.5, "¥50"],
    ["en", "KWD", 1.234, "KWD\u00a01.234"],
    ["zh-hk", "KWD", 1.234, "KWD\u00a01.234"],
  ] as const)(
    "renders native %s/%s currency precision in the event card",
    (locale, currency, amount, expected) => {
      const paidEvent: TheGroundEvent = {
        ...liveEvent,
        price: {
          kind: "paid",
          amount,
          currency,
          sourceDisplay: `${amount} ${currency}`,
        },
      };
      const html = renderToStaticMarkup(
        <ProgrammeExplorer
          locale={locale}
          result={result("fresh", paidEvent)}
          filters={parseProgrammeFilters({}, [paidEvent])}
          now="2030-05-20T00:00:00.000Z"
        />,
      );

      expect(html).toContain(`<dd>${expected}</dd>`);
    },
  );

  it("renders URL-backed controls and an external booking hand-off in English", () => {
    const filters = parseProgrammeFilters({}, [demoEvent]);
    const html = renderToStaticMarkup(
      <ProgrammeExplorer
        locale="en"
        result={result("demo")}
        filters={filters}
        now="2030-05-20T00:00:00.000Z"
      />,
    );

    expect(html).toContain("Synthetic programme data");
    expect(html).toContain("Today");
    expect(html).toContain("Exact date");
    expect(html).toContain("Category");
    expect(html).toContain("Location");
    expect(html).toContain("Price");
    expect(html).toContain("Booking state");
    expect(html).toContain("temporal=upcoming");
    expect(html).toContain(
      'href="https://bookings.example.com/the-ground-demo/demo-harbour-flow-01"',
    );
    expect(html).toContain("Open synthetic booking example");
    expect(html).not.toContain(
      "https://www.theground.io/events/public/demo-harbour-flow-01",
    );
    expect(html).not.toContain('href="https://www.theground.io/"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer noopener"');
  });

  it("preserves a valid temporal shortcut when the GET form adds another filter", () => {
    const filters = parseProgrammeFilters({ temporal: "upcoming" }, [demoEvent]);
    const html = renderToStaticMarkup(
      <ProgrammeExplorer
        locale="en"
        result={result("demo")}
        filters={filters}
        now="2030-05-20T00:00:00.000Z"
      />,
    );

    expect(html).toContain(
      '<input type="hidden" name="temporal" value="upcoming"/>',
    );
  });

  it("renders equivalent formal Traditional Chinese controls", () => {
    const html = renderToStaticMarkup(
      <ProgrammeExplorer
        locale="zh-hk"
        result={result("demo")}
        filters={parseProgrammeFilters({}, [demoEvent])}
        now="2030-05-20T00:00:00.000Z"
      />,
    );

    expect(html).toContain("合成節目資料");
    expect(html).toContain("今天");
    expect(html).toContain("指定日期");
    expect(html).toContain("活動分類");
    expect(html).toContain("地點");
    expect(html).toContain("收費");
    expect(html).toContain("報名狀態");
    expect(html).toContain("開啟合成報名示例");
  });

  it("uses canonical The Ground destinations and provider wording for verified live data", () => {
    const html = renderToStaticMarkup(
      <ProgrammeExplorer
        locale="en"
        result={result("fresh")}
        filters={parseProgrammeFilters({}, [liveEvent])}
        now="2030-05-20T00:00:00.000Z"
      />,
    );

    expect(html).toContain(
      'href="https://www.theground.io/events/public/verified-live-event"',
    );
    expect(html).toContain("Continue to The Ground to book");
    expect(html).not.toContain("Open synthetic booking example");
  });

  it("labels a warm fallback as stale and keeps the provider hand-off visible", () => {
    const html = renderToStaticMarkup(
      <ProgrammeExplorer
        locale="en"
        result={result("stale")}
        filters={parseProgrammeFilters({}, [liveEvent])}
        now="2030-05-20T00:00:00.000Z"
      />,
    );

    expect(html).toContain("Showing the last verified snapshot");
    expect(html).toContain('href="https://www.theground.io/"');
  });

  it("shows honest unavailability without synthetic substitution in a failed live request", () => {
    const html = renderToStaticMarkup(
      <ProgrammeExplorer
        locale="en"
        result={null}
        filters={parseProgrammeFilters({}, [])}
        now="2030-05-20T00:00:00.000Z"
      />,
    );

    expect(html).toContain("Live programme unavailable");
    expect(html).toContain("Open The Ground directly");
    expect(html).not.toContain("Synthetic programme data");
  });
});
