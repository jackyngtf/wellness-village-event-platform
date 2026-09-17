import type { Metadata } from "next";

import { PageIntro } from "@/components/page-intro";
import { SiteShell } from "@/components/site-shell";
import { buildPageMetadata } from "@/content/metadata";
import { pageContent, type Locale } from "@/content/routes";

const privacyCopy = {
  en: {
    eyebrow: "DEMO PRIVACY BOUNDARY",
    note: "The browser demo renders no contact form, and native collection is disabled by default.",
    statementEyebrow: "CURRENT DEMO BEHAVIOUR",
    statementTitle: "No contact data is collected by the default demo.",
    statementBody:
      "Pages are rendered from versioned local TypeScript fixtures. The repository includes a fail-closed API reference, but the interface exposes no form and the endpoint remains unavailable unless the privacy version, Turnstile configuration and Cloudflare Queue binding are all explicitly enabled.",
    facts: [
      ["Personal data", "Not requested or stored"],
      ["Contact API", "Present in source; disabled by default"],
      ["Google credentials", "Consumer-only; absent from the website"],
      ["Environment files", "Not required"],
      ["Outbound data requests", "None in the default demo"],
      ["Fixture contacts", "Reserved example.com addresses only"],
      ["Production resource IDs", "Not included"],
    ],
    distinctionEyebrow: "IMPORTANT DISTINCTION",
    distinctionTitle: "This page is a technical demo statement, not a copied privacy notice.",
    distinctionBody:
      "The included reference shows explicit purpose and consent, bounded server-side validation, abuse controls, asynchronous delivery and consumer-only credentials. A real deployment would still require an approved privacy notice, configured resources, retention and withdrawal procedures, monitoring and operator ownership.",
    contactLabel: "Fictional reference contact",
    contact: "privacy@reference.example.com",
  },
  "zh-hk": {
    eyebrow: "示範私隱界線",
    note: "瀏覽器示範不會顯示聯絡表格，而原生資料收集亦預設停用。",
    statementEyebrow: "目前示範行為",
    statementTitle: "預設示範不會收集聯絡資料。",
    statementBody:
      "所有頁面均由納入版本管理的本機 TypeScript 測試資料產生。儲存庫雖包含 fail-closed API 參考實作，但介面不會顯示表格；除非私隱版本、Turnstile 設定及 Cloudflare Queue binding 全部明確啟用，否則端點維持不可使用。",
    facts: [
      ["個人資料", "不會要求或儲存"],
      ["聯絡 API", "原始碼內包含；預設停用"],
      ["Google 憑證", "只限 consumer 使用；網站不會取得"],
      ["環境設定檔", "毋須提供"],
      ["對外資料請求", "預設示範不會發出"],
      ["測試資料聯絡方式", "只採用保留的 example.com 地址"],
      ["正式環境資源識別碼", "不包含"],
    ],
    distinctionEyebrow: "重要區別",
    distinctionTitle: "本頁屬技術示範聲明，並非複製任何私隱通知。",
    distinctionBody:
      "本參考實作展示明確目的與同意、具大小限制的伺服器端驗證、防濫用控制、非同步傳送，以及僅限 consumer 使用的憑證。實際部署仍須具備經批准的私隱通知、已設定的資源、資料保留與撤回程序、監察及明確營運責任。",
    contactLabel: "虛構參考聯絡方式",
    contact: "privacy@reference.example.com",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "privacy");
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = pageContent[locale].privacy;
  const copy = privacyCopy[locale];

  return (
    <SiteShell currentRoute="privacy" locale={locale}>
      <PageIntro
        eyebrow={copy.eyebrow}
        title={content.title}
        intro={content.intro}
        aside={<p className="context-note">{copy.note}</p>}
      />

      <section className="section-block section-block--paper">
        <div className="site-container privacy-statement-grid">
          <div>
            <p className="eyebrow">{copy.statementEyebrow}</p>
            <h2>{copy.statementTitle}</h2>
            <p>{copy.statementBody}</p>
          </div>
          <dl className="privacy-facts">
            {copy.facts.map(([term, value]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="privacy-distinction">
        <div className="site-container privacy-distinction__grid">
          <div>
            <p className="eyebrow eyebrow--light">{copy.distinctionEyebrow}</p>
            <h2>{copy.distinctionTitle}</h2>
          </div>
          <div>
            <p>{copy.distinctionBody}</p>
            <dl className="reference-contact">
              <dt>{copy.contactLabel}</dt>
              <dd>{copy.contact}</dd>
            </dl>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
