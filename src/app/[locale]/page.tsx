import type { Metadata } from "next";
import Link from "next/link";

import { DemoEventList } from "@/components/demo-event-list";
import { SiteShell } from "@/components/site-shell";
import { buildPageMetadata } from "@/content/metadata";
import {
  getRouteHref,
  pageContent,
  type Locale,
} from "@/content/routes";
import { VisitorJourney } from "@/features/home/visitor-journey";
import { demoEvents } from "@fixtures/demo/events";

const homeCopy = {
  en: {
    eyebrow: "A LOCAL-ONLY EVENT REFERENCE",
    primary: "Explore the synthetic programme",
    secondary: "Understand the Guidebook boundary",
    visualLabel: "Original neutral geometry representing movement and pause",
    visualTop: "HONG KONG TIME · 2030",
    visualWords: ["MOVE", "REST", "NOTICE"],
    facts: [
      ["Mode", "Synthetic by default"],
      ["Dates", "1–3 June 2030"],
      ["Time zone", "Asia/Hong_Kong"],
      ["Network", "Not required"],
    ],
    previewEyebrow: "A SMALL, DELIBERATE FIXTURE SET",
    previewTitle: "The programme begins with honest states.",
    previewIntro:
      "These first records show how time, location and price can remain legible without implying that the fictional activity is live or bookable.",
    viewAll: "View every demo event",
    continuationEyebrow: "CONTINUE THE JOURNEY",
    continuationTitle: "Editorial context sits beside practical planning.",
    continuationBody:
      "Fictional brand stories demonstrate discovery. The Guidebook route explains an evidence boundary without reproducing the protected publication.",
    brands: "Meet the fictional brands",
    guidebook: "Read the Guidebook explanation",
  },
  "zh-hk": {
    eyebrow: "純本機活動參考版本",
    primary: "瀏覽合成節目",
    secondary: "了解 Guidebook 內容界線",
    visualLabel: "以原創中性幾何圖形表達律動與停頓",
    visualTop: "香港時間 · 2030",
    visualWords: ["律動", "休息", "留意"],
    facts: [
      ["模式", "預設採用合成資料"],
      ["日期", "2030 年 6 月 1 至 3 日"],
      ["時區", "Asia/Hong_Kong"],
      ["網絡", "毋須連線"],
    ],
    previewEyebrow: "精簡而有目的的測試資料",
    previewTitle: "節目由如實呈現不同狀態開始。",
    previewIntro:
      "首批記錄示範如何清楚呈現時間、地點及收費，同時不會令人誤以為虛構活動正在舉行或可供預約。",
    viewAll: "查看全部示範活動",
    continuationEyebrow: "延續探索旅程",
    continuationTitle: "編輯脈絡與實用規劃並列呈現。",
    continuationBody:
      "虛構品牌故事示範探索方式；Guidebook 頁面則說明證據界線，而不重製受保護的原有刊物。",
    brands: "認識虛構品牌",
    guidebook: "閱讀 Guidebook 說明",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = pageContent[locale].home;
  const copy = homeCopy[locale];

  return (
    <SiteShell currentRoute="home" locale={locale}>
      <section className="home-hero">
        <div className="site-container home-hero__grid">
          <div className="home-hero__copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{content.title}</h1>
            <p className="hero-lede">{content.intro}</p>
            <div className="button-row">
              <Link
                className="button-link button-link--primary"
                href={getRouteHref(locale, "programme")}
              >
                {copy.primary}
              </Link>
              <Link
                className="button-link button-link--quiet"
                href={getRouteHref(locale, "guidebook")}
              >
                {copy.secondary}
              </Link>
            </div>
          </div>

          <div
            className="demo-field"
            role="img"
            aria-label={copy.visualLabel}
          >
            <span className="demo-field__top">{copy.visualTop}</span>
            <div className="demo-field__orbit" aria-hidden="true" />
            <p className="demo-field__words" aria-hidden="true">
              {copy.visualWords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </p>
            <span className="demo-field__bottom">01 / 03</span>
          </div>
        </div>

        <div className="site-container">
          <dl className="fact-band">
            {copy.facts.map(([term, value]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <VisitorJourney locale={locale} />

      <section className="section-block section-block--paper">
        <div className="site-container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">{copy.previewEyebrow}</p>
              <h2>{copy.previewTitle}</h2>
            </div>
            <div>
              <p>{copy.previewIntro}</p>
              <Link
                className="text-link"
                href={`${getRouteHref(locale, "programme")}#programme`}
              >
                {copy.viewAll}
              </Link>
            </div>
          </div>
          <DemoEventList events={demoEvents.slice(0, 2)} locale={locale} />
        </div>
      </section>

      <section className="continuation-panel">
        <div className="site-container continuation-panel__grid">
          <div>
            <p className="eyebrow eyebrow--light">{copy.continuationEyebrow}</p>
            <h2>{copy.continuationTitle}</h2>
          </div>
          <div>
            <p>{copy.continuationBody}</p>
            <div className="button-row">
              <Link
                className="button-link button-link--light"
                href={getRouteHref(locale, "brands")}
              >
                {copy.brands}
              </Link>
              <Link
                className="button-link button-link--outline-light"
                href={getRouteHref(locale, "guidebook")}
              >
                {copy.guidebook}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
