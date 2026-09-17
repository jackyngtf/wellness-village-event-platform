import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { SiteShell } from "@/components/site-shell";
import { buildPageMetadata } from "@/content/metadata";
import {
  getRouteHref,
  pageContent,
  type Locale,
} from "@/content/routes";

const visitCopy = {
  en: {
    eyebrow: "FICTIONAL VENUE GUIDE",
    note: "Harbour Exchange Hall is fictional and must not be used for travel.",
    detailsEyebrow: "ARRIVAL SEQUENCE",
    detailsTitle: "Useful detail first; decoration second.",
    detailsIntro:
      "The text guide remains complete without a map image and separates confirmed demo facts from explicit unknowns.",
    addressTitle: "Demo address",
    address: "18 Example Promenade, Harbour District, Hong Kong (fictional)",
    hoursTitle: "Demo opening hours",
    hours: "10:00–20:00 HKT · 1–3 June 2030",
    accessTitle: "Accessibility note",
    access:
      "Step-free entry is represented for layout testing only. Verify real access arrangements with the actual venue before travel.",
    unknownTitle: "What remains unknown",
    unknown:
      "Transport changes, crowd conditions and live venue notices are intentionally unavailable in this local demo.",
    floorEyebrow: "TEXT-FIRST FLOOR GUIDE",
    floorTitle: "A diagram that does not depend on protected artwork.",
    floors: [
      ["02", "Quiet Hall", "Rest and midnight-boundary demo session"],
      ["01", "North Studio", "Multi-day studio and making sessions"],
      ["G", "Garden Room", "Welcome point and movement session"],
    ],
    programme: "Return to the programme",
  },
  "zh-hk": {
    eyebrow: "虛構場地指南",
    note: "Harbour Exchange Hall 純屬虛構，不應用作任何實際行程。",
    detailsEyebrow: "抵達次序",
    detailsTitle: "先呈現實用資料，再考慮裝飾。",
    detailsIntro:
      "文字指南毋須依賴地圖圖像也能完整閱讀，並把已確認的示範資料與明確未知項目分開。",
    addressTitle: "示範地址",
    address: "香港海港區示例海濱道 18 號（虛構）",
    hoursTitle: "示範開放時間",
    hours: "2030 年 6 月 1 至 3 日，香港時間 10:00–20:00",
    accessTitle: "無障礙提示",
    access:
      "無梯級入口只用作版面測試。實際出發前，必須向真實場地核實無障礙安排。",
    unknownTitle: "仍然未知的資料",
    unknown: "交通變動、人流情況及即時場地通告刻意不納入這個純本機示範。",
    floorEyebrow: "文字優先的樓層指南",
    floorTitle: "不依賴受保護作品的示意圖。",
    floors: [
      ["02", "靜心廳", "休息及午夜邊界示範課節"],
      ["01", "北面工作室", "跨日工作室及創作課節"],
      ["G", "花園室", "迎賓處及律動課節"],
    ],
    programme: "返回節目",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "visit");
}

export default async function VisitPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = pageContent[locale].visit;
  const copy = visitCopy[locale];

  return (
    <SiteShell currentRoute="visit" locale={locale}>
      <PageIntro
        eyebrow={copy.eyebrow}
        title={content.title}
        intro={content.intro}
        aside={<p className="context-note context-note--clay">{copy.note}</p>}
      />

      <section
        className="section-block section-block--paper"
        id="visit"
        aria-labelledby="visit-heading"
      >
        <div className="site-container visit-grid">
          <div className="visit-intro">
            <p className="eyebrow">{copy.detailsEyebrow}</p>
            <h2 id="visit-heading">{copy.detailsTitle}</h2>
            <p>{copy.detailsIntro}</p>
          </div>

          <dl className="visit-details">
            <div>
              <dt>{copy.addressTitle}</dt>
              <dd>{copy.address}</dd>
            </div>
            <div>
              <dt>{copy.hoursTitle}</dt>
              <dd>{copy.hours}</dd>
            </div>
            <div>
              <dt>{copy.accessTitle}</dt>
              <dd>{copy.access}</dd>
            </div>
            <div>
              <dt>{copy.unknownTitle}</dt>
              <dd>{copy.unknown}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section-block section-block--clay">
        <div className="site-container floor-guide-grid">
          <div>
            <p className="eyebrow eyebrow--light">{copy.floorEyebrow}</p>
            <h2>{copy.floorTitle}</h2>
            <Link
              className="text-link text-link--light"
              href={`${getRouteHref(locale, "programme")}#programme`}
            >
              {copy.programme}
            </Link>
          </div>
          <figure className="floor-guide">
            {copy.floors.map(([floor, name, description]) => (
              <div className="floor-guide__row" key={floor}>
                <strong>{floor}</strong>
                <span>{name}</span>
                <small>{description}</small>
              </div>
            ))}
            <figcaption>
              {locale === "en"
                ? "Original CSS geometry · synthetic venue"
                : "原創 CSS 幾何圖形 · 合成場地"}
            </figcaption>
          </figure>
        </div>
      </section>
    </SiteShell>
  );
}
