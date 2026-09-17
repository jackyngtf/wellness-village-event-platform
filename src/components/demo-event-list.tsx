import type { DemoEvent } from "@fixtures/demo/events";

import type { Locale } from "@/content/routes";

const eventCopy = {
  en: {
    category: "Type",
    time: "Time in HKT",
    location: "Fictional location",
    price: "Price state",
    source: "Reserved demo host",
    categories: {
      movement: "Movement",
      rest: "Rest",
      making: "Making",
      unknown: "Unclassified",
    },
    free: "Free",
    unclassified: "Unknown",
    spanning: "Spans Hong Kong calendar dates",
  },
  "zh-hk": {
    category: "類型",
    time: "香港時間",
    location: "虛構地點",
    price: "收費狀態",
    source: "保留示範網域",
    categories: {
      movement: "律動",
      rest: "休息",
      making: "創作",
      unknown: "未分類",
    },
    free: "免費",
    unclassified: "未知",
    spanning: "跨越香港曆日",
  },
} as const;

function formatDateTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-HK" : "zh-HK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Hong_Kong",
  }).format(new Date(value));
}

function getPriceLabel(event: DemoEvent, locale: Locale) {
  const copy = eventCopy[locale];
  if (event.price.kind === "free") return copy.free;
  if (event.price.kind === "unclassified") return copy.unclassified;

  return new Intl.NumberFormat(locale === "en" ? "en-HK" : "zh-HK", {
    style: "currency",
    currency: event.price.currency,
    maximumFractionDigits: 0,
  }).format(event.price.amount);
}

export function DemoEventList({
  events,
  locale,
}: Readonly<{ events: readonly DemoEvent[]; locale: Locale }>) {
  const copy = eventCopy[locale];

  return (
    <ol className="event-list">
      {events.map((event, index) => {
        const category = event.category ?? "unknown";
        const crossesDate =
          event.startsAt.slice(0, 10) !== event.endsAt.slice(0, 10);

        return (
          <li className="event-row" key={event.eventId}>
            <div className="event-row__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="event-row__body">
              <div className="event-row__heading">
                <div>
                  <p className="event-row__category">
                    {copy.categories[category]}
                  </p>
                  <h2>{event.title[locale]}</h2>
                </div>
                <span className="synthetic-chip">SYNTHETIC</span>
              </div>
              <p className="event-row__summary">{event.summary[locale]}</p>
              <dl className="event-meta">
                <div>
                  <dt>{copy.time}</dt>
                  <dd>
                    <time dateTime={event.startsAt}>
                      {formatDateTime(event.startsAt, locale)}
                    </time>
                    <span aria-hidden="true"> — </span>
                    <time dateTime={event.endsAt}>
                      {formatDateTime(event.endsAt, locale)}
                    </time>
                    {crossesDate ? (
                      <small className="event-meta__note">{copy.spanning}</small>
                    ) : null}
                  </dd>
                </div>
                <div>
                  <dt>{copy.location}</dt>
                  <dd>{event.location[locale]}</dd>
                </div>
                <div>
                  <dt>{copy.price}</dt>
                  <dd>{getPriceLabel(event, locale)}</dd>
                </div>
                <div>
                  <dt>{copy.source}</dt>
                  <dd>{new URL(event.registrationUrl).hostname}</dd>
                </div>
              </dl>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
