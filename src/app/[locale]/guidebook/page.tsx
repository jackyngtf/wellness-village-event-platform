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

const guidebookCopy = {
  en: {
    eyebrow: "EDITORIAL SOURCE BOUNDARY",
    note: "Explanation only · no original pages or downloadable publication",
    roleEyebrow: "WHAT THIS ROUTE DEMONSTRATES",
    roleTitle: "Context can be preserved without copying the source.",
    roleBody:
      "In the delivered product, an editorial Guidebook helped readers move from a broad campaign idea into deeper stories. This synthetic route demonstrates that information role—not the publication itself.",
    includedTitle: "Included in this reference",
    included: [
      "The distinction between editorial context and a live programme",
      "A bilingual explanation of the content journey",
      "A clear statement that inclusion does not prove attendance, sponsorship or a physical booth",
      "An explicit rights and provenance boundary",
    ],
    excludedTitle: "Intentionally excluded",
    excluded: [
      "The original Guidebook PDF and every page image",
      "Client or third-party photography, illustration and campaign artwork",
      "Licensed or client-supplied fonts",
      "Protected passages, brand profiles and publication design",
    ],
    processEyebrow: "EVIDENCE-FIRST CONTENT FLOW",
    processTitle: "Four decisions keep the explanation honest.",
    process: [
      ["Identify", "Record what the editorial source can establish."],
      ["Bound", "Separate story context from live time, price and booking state."],
      ["Replace", "Use fictional local records where runnable examples are needed."],
      ["Disclose", "Label reconstructed, edited and synthetic material at the point of use."],
    ],
    brands: "Return to fictional brands",
  },
  "zh-hk": {
    eyebrow: "編輯資料來源界線",
    note: "只作說明 · 不含原有頁面或可下載刊物",
    roleEyebrow: "本頁示範的內容",
    roleTitle: "毋須複製原始資料，也能保留必要脈絡。",
    roleBody:
      "在已交付產品中，編輯 Guidebook 協助讀者由整體企劃概念深入了解各個故事。這個合成頁面只示範其資訊角色，並不重現刊物本身。",
    includedTitle: "本參考版本包含",
    included: [
      "編輯脈絡與即時節目之間的明確區別",
      "以雙語說明內容探索旅程",
      "清楚指出刊物收錄並不證明出席、贊助或設有實體攤位",
      "明確的權利及來源界線",
    ],
    excludedTitle: "刻意排除",
    excluded: [
      "原有 Guidebook PDF 及所有頁面圖像",
      "客戶或第三方攝影、插圖及宣傳作品",
      "獲授權或由客戶提供的字體",
      "受保護段落、品牌專題及刊物設計",
    ],
    processEyebrow: "證據優先的內容流程",
    processTitle: "四項決定維持說明的誠實界線。",
    process: [
      ["識別", "記錄編輯資料來源實際能夠支持的事項。"],
      ["界定", "把故事脈絡與即時時間、價格及預約狀態分開。"],
      ["替換", "需要可執行例子時，採用虛構本機記錄。"],
      ["披露", "在使用位置清楚標示重構、編輯及合成材料。"],
    ],
    brands: "返回虛構品牌",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "guidebook");
}

export default async function GuidebookPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = pageContent[locale].guidebook;
  const copy = guidebookCopy[locale];

  return (
    <SiteShell currentRoute="guidebook" locale={locale}>
      <PageIntro
        eyebrow={copy.eyebrow}
        title={content.title}
        intro={content.intro}
        aside={<p className="context-note context-note--clay">{copy.note}</p>}
      />

      <section className="section-block section-block--forest">
        <div className="site-container guidebook-role-grid">
          <div className="guidebook-mark" aria-hidden="true">
            <span>G</span>
            <span>REF</span>
          </div>
          <div>
            <p className="eyebrow eyebrow--light">{copy.roleEyebrow}</p>
            <h2>{copy.roleTitle}</h2>
            <p>{copy.roleBody}</p>
          </div>
        </div>
      </section>

      <section className="section-block section-block--paper">
        <div className="site-container boundary-columns">
          <div>
            <p className="boundary-symbol" aria-hidden="true">+</p>
            <h2>{copy.includedTitle}</h2>
            <ul>
              {copy.included.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="boundary-symbol" aria-hidden="true">−</p>
            <h2>{copy.excludedTitle}</h2>
            <ul>
              {copy.excluded.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-block section-block--sage">
        <div className="site-container process-grid">
          <div>
            <p className="eyebrow">{copy.processEyebrow}</p>
            <h2>{copy.processTitle}</h2>
            <Link
              className="text-link"
              href={getRouteHref(locale, "brands")}
            >
              {copy.brands}
            </Link>
          </div>
          <ol className="process-list">
            {copy.process.map(([title, body], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SiteShell>
  );
}
