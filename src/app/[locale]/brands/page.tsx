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
import { demoBrands } from "@fixtures/demo/brands";

const brandCopy = {
  en: {
    eyebrow: "FICTIONAL BRAND DIRECTORY",
    note: "Names, stories, contacts and domains are synthetic.",
    directoryEyebrow: "FOUR EDITORIAL PROFILES",
    directoryTitle: "A directory shaped by stories, not logos.",
    source: "Reserved domain",
    contact: "Example contact",
    continueEyebrow: "EDITORIAL CONTEXT",
    continueTitle: "See why the Guidebook is explained, not reproduced.",
    continueBody:
      "The public reference can demonstrate source boundaries and content architecture without carrying forward protected pages or campaign assets.",
    continue: "Open the Guidebook explanation",
  },
  "zh-hk": {
    eyebrow: "虛構品牌目錄",
    note: "所有名稱、故事、聯絡資料及網域均為合成內容。",
    directoryEyebrow: "四個編輯專題",
    directoryTitle: "以故事而非標誌組成的目錄。",
    source: "保留網域",
    contact: "示例聯絡資料",
    continueEyebrow: "編輯脈絡",
    continueTitle: "了解為何只說明 Guidebook，而不重製原刊物。",
    continueBody:
      "公開參考版本能示範資料來源界線及內容架構，而毋須沿用受保護頁面或宣傳資產。",
    continue: "開啟 Guidebook 說明",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "brands");
}

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = pageContent[locale].brands;
  const copy = brandCopy[locale];

  return (
    <SiteShell currentRoute="brands" locale={locale}>
      <PageIntro
        eyebrow={copy.eyebrow}
        title={content.title}
        intro={content.intro}
        aside={<p className="context-note">{copy.note}</p>}
      />

      <section className="section-block section-block--paper">
        <div className="site-container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">{copy.directoryEyebrow}</p>
              <h2>{copy.directoryTitle}</h2>
            </div>
          </div>

          <ol className="brand-list">
            {demoBrands.map((brand, index) => (
              <li key={brand.brandId}>
                <span className="brand-list__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="brand-list__identity">
                  <p>{brand.pillar[locale]}</p>
                  <h3>{brand.name}</h3>
                </div>
                <p className="brand-list__story">{brand.story[locale]}</p>
                <dl className="brand-list__meta">
                  <div>
                    <dt>{copy.source}</dt>
                    <dd>{new URL(brand.website).hostname}</dd>
                  </div>
                  <div>
                    <dt>{copy.contact}</dt>
                    <dd>{brand.contactEmail}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="editorial-bridge">
        <div className="site-container editorial-bridge__grid">
          <p className="eyebrow">{copy.continueEyebrow}</p>
          <div>
            <h2>{copy.continueTitle}</h2>
            <p>{copy.continueBody}</p>
            <Link
              className="button-link button-link--primary"
              href={getRouteHref(locale, "guidebook")}
            >
              {copy.continue}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
