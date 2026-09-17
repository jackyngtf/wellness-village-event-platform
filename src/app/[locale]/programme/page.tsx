import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageIntro } from "@/components/page-intro";
import { SiteShell } from "@/components/site-shell";
import { buildPageMetadata } from "@/content/metadata";
import {
  getAlternateLocale,
  getRouteHref,
  pageContent,
  type Locale,
} from "@/content/routes";
import { ProgrammeExplorer } from "@/features/programme/programme-explorer";
import {
  buildProgrammeHref,
  parseProgrammeFilters,
  toProgrammeSearchParams,
} from "@/features/programme/programme-filters";
import { getTheGroundEventCatalog } from "@/integrations/the-ground/server";
import { DEMO_REFERENCE_NOW_ISO } from "@fixtures/demo/the-ground-provider";

const programmeCopy = {
  en: {
    eyebrow: "PROGRAMME INTERFACE",
    note: "Synthetic by default · explicit HKT (+08:00) · no network required",
    sectionEyebrow: "ORGANISATION-SCOPED INTERFACE",
    preparationEyebrow: "BEFORE YOU GO",
    preparationTitle: "Preparation belongs beside the decision.",
    preparationIntro:
      "These generic notes are part of the fictional reference experience. They are not venue instructions for a real event.",
    tips: [
      ["Confirm the date boundary", "One session crosses midnight in Hong Kong time, while another spans several calendar days."],
      ["Read the price state", "Free, paid and unknown are kept distinct; an absent value is never silently presented as free."],
      ["Keep booking ownership visible", "Every demo event uses a clearly labelled reserved example.com destination. Only verified live records can hand booking to a canonical The Ground event page."],
      ["Check what is unknown", "The unclassified record remains visibly incomplete instead of receiving an invented category or price."],
    ],
    continue: "Continue to the fictional venue plan",
  },
  "zh-hk": {
    eyebrow: "活動介面",
    note: "預設採用合成資料 · 明確香港時間（+08:00）· 無需網絡",
    sectionEyebrow: "按機構範圍建立的介面",
    preparationEyebrow: "出發前準備",
    preparationTitle: "準備資料應與活動決定並列。",
    preparationIntro:
      "以下一般提示屬於虛構參考體驗，並非任何真實活動的場地指示。",
    tips: [
      ["確認日期邊界", "其中一節跨越香港時間午夜，另一節則橫跨多個曆日。"],
      ["閱讀收費狀態", "免費、收費及未知狀態清楚分開；欠缺資料時不會被默認為免費。"],
      ["清楚顯示報名責任", "所有示範活動均使用清楚標示的保留 example.com 目的地；只有經核實的即時記錄，方可把報名交回標準 The Ground 活動頁面。"],
      ["留意未知資料", "未分類記錄會維持清楚的不完整狀態，不會獲指派虛構類型或價格。"],
    ],
    continue: "繼續查看虛構場地規劃",
  },
} as const;

const programmeQueryKeys = [
  "temporal",
  "date",
  "category",
  "location",
  "price",
  "booking",
] as const;

function serialiseRawProgrammeQuery(
  query: Record<string, string | readonly string[] | undefined>,
): string | null {
  if (
    Object.keys(query).some(
      (key) => !programmeQueryKeys.some((allowed) => allowed === key),
    )
  ) {
    return null;
  }

  const search = new URLSearchParams();
  for (const key of programmeQueryKeys) {
    const value = query[key];
    if (Array.isArray(value)) return null;
    if (typeof value === "string" && value.length > 0) search.set(key, value);
  }
  return search.toString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "programme");
}

export default async function ProgrammePage({
  params,
  searchParams = Promise.resolve({}),
}: {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<
    Record<string, string | readonly string[] | undefined>
  >;
}) {
  const { locale } = await params;
  const rawSearchParams = await searchParams;
  const content = pageContent[locale].programme;
  const copy = programmeCopy[locale];
  const result = await getTheGroundEventCatalog().catch(() => null);
  const events = result?.data.events ?? [];
  const filters = parseProgrammeFilters(rawSearchParams, events);
  const canonicalQuery = toProgrammeSearchParams(filters).toString();
  if (serialiseRawProgrammeQuery(rawSearchParams) !== canonicalQuery) {
    redirect(
      `/${locale}/programme${canonicalQuery ? `?${canonicalQuery}` : ""}#programme-results`,
    );
  }
  const now =
    result?.mode === "demo" ? DEMO_REFERENCE_NOW_ISO : new Date().toISOString();
  const alternateLocaleHref = buildProgrammeHref(
    getAlternateLocale(locale),
    filters,
  );

  return (
    <SiteShell
      alternateLocaleHref={alternateLocaleHref}
      currentRoute="programme"
      locale={locale}
    >
      <PageIntro
        eyebrow={copy.eyebrow}
        title={content.title}
        intro={content.intro}
        aside={<p className="context-note">{copy.note}</p>}
      />

      <section
        className="section-block section-block--paper"
        id="programme"
        aria-labelledby="programme-heading"
      >
        <div className="site-container">
          <p className="eyebrow">{copy.sectionEyebrow}</p>
          <h2 className="section-title" id="programme-heading">
            {locale === "en"
              ? "One source, useful programme decisions."
              : "單一資料來源，支援清晰的活動決定。"}
          </h2>
          <ProgrammeExplorer
            locale={locale}
            result={result}
            filters={filters}
            now={now}
          />
        </div>
      </section>

      <section
        className="section-block section-block--sage"
        id="preparation"
        aria-labelledby="preparation-heading"
      >
        <div className="site-container preparation-grid">
          <div className="preparation-intro">
            <p className="eyebrow">{copy.preparationEyebrow}</p>
            <h2 id="preparation-heading">{copy.preparationTitle}</h2>
            <p>{copy.preparationIntro}</p>
            <Link
              className="text-link"
              href={`${getRouteHref(locale, "visit")}#visit`}
            >
              {copy.continue}
            </Link>
          </div>
          <ol className="preparation-list">
            {copy.tips.map(([title, body], index) => (
              <li key={title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SiteShell>
  );
}
