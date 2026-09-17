import Link from "next/link";

import {
  getAlternateLocale,
  getRoute,
  getRouteHref,
  navigationRouteIds,
  type Locale,
  type RouteId,
} from "@/content/routes";

const shellCopy = {
  en: {
    skip: "Skip to main content",
    demoLabel: "Synthetic reference",
    demoNote: "Synthetic by default · live integrations are opt-in · no personal data",
    navLabel: "Primary navigation",
    switchLanguage: "閱讀繁體中文版本",
    switchShort: "繁中",
    footerTitle: "A deliberately bounded public reference.",
    footerBody:
      "Built with fictional records, system fonts and original CSS geometry. No production identifiers, client media or required network dependency are included.",
    privacy: "Demo privacy boundary",
  },
  "zh-hk": {
    skip: "跳至主要內容",
    demoLabel: "合成參考版本",
    demoNote: "預設採用合成資料 · 即時整合須明確啟用 · 不含個人資料",
    navLabel: "主要導覽",
    switchLanguage: "Read the English version",
    switchShort: "EN",
    footerTitle: "界線清晰的公開參考版本。",
    footerBody:
      "本示範採用虛構記錄、系統字體及原創 CSS 幾何圖形，不包含任何正式環境識別資料、客戶媒體或必要網絡依賴。",
    privacy: "示範私隱界線",
  },
} as const;

export function SiteShell({
  alternateLocaleHref,
  children,
  currentRoute,
  locale,
}: Readonly<{
  alternateLocaleHref?: string;
  children: React.ReactNode;
  currentRoute: RouteId;
  locale: Locale;
}>) {
  const copy = shellCopy[locale];
  const alternateLocale = getAlternateLocale(locale);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>

      <div className="demo-strip" role="note">
        <div className="site-container demo-strip__inner">
          <strong>{copy.demoLabel}</strong>
          <span>{copy.demoNote}</span>
        </div>
      </div>

      <header className="site-header">
        <div className="site-container site-header__inner">
          <Link className="wordmark" href={getRouteHref(locale, "home")}>
            <span>WELLNESS</span>
            <span>VILLAGE</span>
            <small>{locale === "en" ? "REFERENCE" : "參考版本"}</small>
          </Link>

          <nav aria-label={copy.navLabel}>
            <ul className="site-nav">
              {navigationRouteIds.map((routeId) => {
                const route = getRoute(locale, routeId);
                return (
                  <li key={route.id}>
                    <Link
                      href={route.href}
                      aria-current={currentRoute === route.id ? "page" : undefined}
                    >
                      {route.label[locale]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {alternateLocaleHref ? (
            <a
              className="language-link"
              href={alternateLocaleHref}
              hrefLang={alternateLocale === "en" ? "en" : "zh-HK"}
              lang={alternateLocale === "en" ? "en" : "zh-HK"}
              aria-label={copy.switchLanguage}
              data-navigation="full-document"
            >
              {copy.switchShort}
            </a>
          ) : (
            <Link
              className="language-link"
              href={getRouteHref(alternateLocale, currentRoute)}
              hrefLang={alternateLocale === "en" ? "en" : "zh-HK"}
              lang={alternateLocale === "en" ? "en" : "zh-HK"}
              aria-label={copy.switchLanguage}
            >
              {copy.switchShort}
            </Link>
          )}
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="site-container site-footer__grid">
          <div>
            <p className="eyebrow">PORTFOLIO REFERENCE</p>
            <p className="site-footer__title">{copy.footerTitle}</p>
          </div>
          <p className="site-footer__body">{copy.footerBody}</p>
          <Link className="footer-link" href={getRouteHref(locale, "privacy")}>
            {copy.privacy}
          </Link>
        </div>
      </footer>
    </>
  );
}
