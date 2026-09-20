import type { Locale } from "@/content/routes";
import type {
  TheGroundCatalogResult,
  TheGroundEvent,
} from "@/integrations/the-ground/types";

import {
  getProgrammeEventCategoryIds,
  programmeEventCategories,
} from "./event-categories";
import {
  buildProgrammeHref,
  filterAndSortProgrammeEvents,
  getProgrammeFilterOptions,
  type ProgrammeFilters,
  type ProgrammeTemporalFilter,
} from "./programme-filters";
import { getEventPhase } from "./the-ground-event-time";

const THE_GROUND_PUBLIC_URL = "https://www.theground.io/";

const copy = {
  en: {
    statusDemo: "Synthetic programme data",
    statusFresh: "Live catalogue",
    statusStale: "Showing the last verified snapshot",
    demoNote:
      "Fictional local records demonstrate the interface without contacting a provider.",
    freshNote:
      "Times, prices and booking state came from the organisation-scoped public catalogue.",
    staleNote:
      "The provider could not be refreshed. Verify current details on The Ground before acting.",
    provider: "Open The Ground directly",
    shortcuts: "Time shortcuts",
    all: "All",
    today: "Today",
    upcoming: "Upcoming",
    past: "Past",
    exactDate: "Exact date",
    category: "Category",
    location: "Location",
    price: "Price",
    booking: "Booking state",
    free: "Free",
    paid: "Paid",
    unknown: "Unknown",
    open: "Open",
    closed: "Closed",
    apply: "Apply filters",
    clear: "Clear filters",
    results: "programme items",
    live: "Live now",
    ended: "Ended",
    later: "Upcoming",
    hkt: "Hong Kong time (HKT)",
    noLocation: "Location pending",
    availabilityHidden: "Capacity not published",
    places: "published places",
    book: "Continue to The Ground to book",
    view: "View details on The Ground",
    demoBook: "Open synthetic booking example",
    demoView: "View synthetic event example",
    external: "opens in a new tab",
    noResults: "No programme items match this combination.",
    unavailable: "Live programme unavailable",
    unavailableBody:
      "The provider could not be reached and no last-valid warm snapshot exists. No synthetic timetable has been substituted.",
  },
  "zh-hk": {
    statusDemo: "合成節目資料",
    statusFresh: "即時活動目錄",
    statusStale: "現正顯示上次核實的快照",
    demoNote: "本頁以本機虛構記錄示範介面，不會連接活動供應者。",
    freshNote: "時間、費用及報名狀態來自按機構範圍取得的公開活動目錄。",
    staleNote: "暫時未能更新供應者資料；採取行動前，請先於 The Ground 核實最新詳情。",
    provider: "直接開啟 The Ground",
    shortcuts: "時間捷徑",
    all: "全部",
    today: "今天",
    upcoming: "即將舉行",
    past: "已結束",
    exactDate: "指定日期",
    category: "活動分類",
    location: "地點",
    price: "收費",
    booking: "報名狀態",
    free: "免費",
    paid: "收費",
    unknown: "未知",
    open: "開放報名",
    closed: "已停止報名",
    apply: "套用篩選",
    clear: "清除篩選",
    results: "項活動",
    live: "現正進行",
    ended: "已結束",
    later: "即將舉行",
    hkt: "香港時間（HKT）",
    noLocation: "地點待定",
    availabilityHidden: "名額未有公開",
    places: "個公開名額",
    book: "前往 The Ground 報名",
    view: "前往 The Ground 查看詳情",
    demoBook: "開啟合成報名示例",
    demoView: "查看合成活動示例",
    external: "將於新分頁開啟",
    noResults: "未有活動符合這組篩選條件。",
    unavailable: "即時節目暫時未能載入",
    unavailableBody:
      "供應者暫時未能連線，而且沒有上次有效的暖快照。本頁不會以合成時間表取代即時資料。",
  },
} as const;

function temporalHref(
  locale: Locale,
  filters: ProgrammeFilters,
  temporal: ProgrammeTemporalFilter,
) {
  return buildProgrammeHref(locale, { ...filters, temporal, date: null });
}

function formatDateTime(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-HK" : "zh-HK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Hong_Kong",
  }).format(new Date(value));
}

function categoryLabel(event: TheGroundEvent, locale: Locale): string {
  const ids = getProgrammeEventCategoryIds(event.title);
  const labels = ids.map((id) => {
    if (id === "other") return locale === "en" ? "Other" : "其他";
    return programmeEventCategories.find((category) => category.id === id)?.name[
      locale
    ];
  });
  return labels.filter(Boolean).join(" · ");
}

function priceLabel(event: TheGroundEvent, locale: Locale): string {
  const dictionary = copy[locale];
  if (event.price.kind === "free") return dictionary.free;
  if (event.price.kind === "unknown") return dictionary.unknown;

  return new Intl.NumberFormat(locale === "en" ? "en-HK" : "zh-HK", {
    style: "currency",
    currency: event.price.currency,
  }).format(event.price.amount);
}

function EventCard({
  event,
  index,
  locale,
  mode,
  now,
}: Readonly<{
  event: TheGroundEvent;
  index: number;
  locale: Locale;
  mode: TheGroundCatalogResult["mode"];
  now: string | number | Date;
}>) {
  const dictionary = copy[locale];
  const phase = getEventPhase(event, now);
  const phaseLabel =
    phase === "live"
      ? dictionary.live
      : phase === "past"
        ? dictionary.ended
        : dictionary.later;
  const capacity =
    event.availability.visibility === "public" &&
    event.availability.capacity !== null
      ? `${event.availability.capacity} ${dictionary.places}`
      : dictionary.availabilityHidden;
  const actionLabel =
    mode === "demo"
      ? event.registration.isOpen
        ? dictionary.demoBook
        : dictionary.demoView
      : event.registration.isOpen
        ? dictionary.book
        : dictionary.view;

  return (
    <li className="programme-card">
      <span className="programme-card__index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="programme-card__body">
        <div className="programme-card__heading">
          <div>
            <p className="programme-card__category">
              {categoryLabel(event, locale)}
            </p>
            <h3>{event.title}</h3>
          </div>
          <span className={`phase-chip phase-chip--${phase}`}>{phaseLabel}</span>
        </div>

        <dl className="programme-card__meta">
          <div>
            <dt>{dictionary.hkt}</dt>
            <dd>
              <time dateTime={event.startsAt}>
                {formatDateTime(event.startsAt, locale)}
              </time>
              <span aria-hidden="true"> — </span>
              <time dateTime={event.endsAt}>
                {formatDateTime(event.endsAt, locale)}
              </time>
            </dd>
          </div>
          <div>
            <dt>{dictionary.location}</dt>
            <dd>{event.location ?? dictionary.noLocation}</dd>
          </div>
          <div>
            <dt>{dictionary.price}</dt>
            <dd>{priceLabel(event, locale)}</dd>
          </div>
          <div>
            <dt>{dictionary.booking}</dt>
            <dd>
              {event.registration.isOpen ? dictionary.open : dictionary.closed}
              <small>{capacity}</small>
            </dd>
          </div>
        </dl>

        <a
          className="button-link button-link--primary programme-card__action"
          href={event.registrationUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          {actionLabel}
          <span className="sr-only">, {dictionary.external}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </li>
  );
}

export function ProgrammeExplorer({
  locale,
  result,
  filters,
  now,
}: Readonly<{
  locale: Locale;
  result: TheGroundCatalogResult | null;
  filters: ProgrammeFilters;
  now: string | number | Date;
}>) {
  const dictionary = copy[locale];

  if (!result) {
    return (
      <section
        className="programme-unavailable"
        id="programme-results"
        aria-labelledby="programme-unavailable-title"
      >
        <p className="eyebrow">THE GROUND HAND-OFF</p>
        <h2 id="programme-unavailable-title">{dictionary.unavailable}</h2>
        <p>{dictionary.unavailableBody}</p>
        <a
          className="button-link button-link--primary"
          href={THE_GROUND_PUBLIC_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          {dictionary.provider} <span aria-hidden="true">↗</span>
          <span className="sr-only">, {dictionary.external}</span>
        </a>
      </section>
    );
  }

  const events = result.data.events;
  const options = getProgrammeFilterOptions(events);
  const filtered = filterAndSortProgrammeEvents(events, filters, now);
  const status =
    result.freshness === "demo"
      ? dictionary.statusDemo
      : result.freshness === "stale"
        ? dictionary.statusStale
        : dictionary.statusFresh;
  const statusNote =
    result.freshness === "demo"
      ? dictionary.demoNote
      : result.freshness === "stale"
        ? dictionary.staleNote
        : dictionary.freshNote;

  return (
    <div className="programme-explorer">
      <aside
        className={`programme-status programme-status--${result.freshness}`}
        aria-label={status}
      >
        <div>
          <strong>{status}</strong>
          <p>{statusNote}</p>
        </div>
        {result.freshness === "stale" ? (
          <a
            href={THE_GROUND_PUBLIC_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            {dictionary.provider} <span aria-hidden="true">↗</span>
            <span className="sr-only">, {dictionary.external}</span>
          </a>
        ) : null}
      </aside>

      <nav className="programme-shortcuts" aria-label={dictionary.shortcuts}>
        {(
          ["all", "today", "upcoming", "past"] as const satisfies readonly ProgrammeTemporalFilter[]
        ).map((temporal) => (
          <a
            aria-current={
              filters.temporal === temporal && !filters.date
                ? "page"
                : undefined
            }
            href={temporalHref(locale, filters, temporal)}
            key={temporal}
          >
            {dictionary[temporal]}
          </a>
        ))}
      </nav>

      <form
        className="programme-filter-form"
        action={`/${locale}/programme#programme-results`}
        method="get"
      >
        {filters.temporal !== "all" && !filters.date ? (
          <input type="hidden" name="temporal" value={filters.temporal} />
        ) : null}
        <label>
          <span>{dictionary.exactDate}</span>
          <input
            type="date"
            name="date"
            defaultValue={filters.date ?? ""}
            min={options.dates[0]}
            max={options.dates.at(-1)}
          />
        </label>
        <label>
          <span>{dictionary.category}</span>
          <select name="category" defaultValue={filters.category}>
            <option value="all">{dictionary.all}</option>
            {programmeEventCategories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name[locale]}
              </option>
            ))}
            <option value="other">{locale === "en" ? "Other" : "其他"}</option>
          </select>
        </label>
        <label>
          <span>{dictionary.location}</span>
          <select name="location" defaultValue={filters.location}>
            <option value="all">{dictionary.all}</option>
            {options.locations.map((location) => (
              <option value={location.key} key={location.key}>
                {location.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{dictionary.price}</span>
          <select name="price" defaultValue={filters.price}>
            <option value="all">{dictionary.all}</option>
            <option value="free">{dictionary.free}</option>
            <option value="paid">{dictionary.paid}</option>
            <option value="unknown">{dictionary.unknown}</option>
          </select>
        </label>
        <label>
          <span>{dictionary.booking}</span>
          <select name="booking" defaultValue={filters.booking}>
            <option value="all">{dictionary.all}</option>
            <option value="open">{dictionary.open}</option>
            <option value="closed">{dictionary.closed}</option>
          </select>
        </label>
        <div className="programme-filter-form__actions">
          <button className="button-link button-link--primary" type="submit">
            {dictionary.apply}
          </button>
          <a className="button-link button-link--quiet" href={`/${locale}/programme#programme-results`}>
            {dictionary.clear}
          </a>
        </div>
      </form>

      <section id="programme-results" aria-labelledby="programme-results-title">
        <div className="programme-results-heading">
          <p className="eyebrow">ACTION-FIRST ORDER</p>
          <h2 id="programme-results-title">
            {filtered.length} {dictionary.results}
          </h2>
        </div>
        {filtered.length ? (
          <ol className="programme-list">
            {filtered.map((event, index) => (
              <EventCard
                event={event}
                index={index}
                locale={locale}
                mode={result.mode}
                now={now}
                key={event.eventId}
              />
            ))}
          </ol>
        ) : (
          <p className="programme-no-results">{dictionary.noResults}</p>
        )}
      </section>
    </div>
  );
}
