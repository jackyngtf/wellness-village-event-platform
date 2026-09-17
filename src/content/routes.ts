export const locales = ["en", "zh-hk"] as const;

export type Locale = (typeof locales)[number];

export const routeIds = [
  "home",
  "programme",
  "visit",
  "brands",
  "guidebook",
  "privacy",
] as const;

export type RouteId = (typeof routeIds)[number];

export interface PageContent {
  readonly title: string;
  readonly intro: string;
}

interface RouteDefinition {
  readonly id: RouteId;
  readonly segment: string;
  readonly label: Record<Locale, string>;
}

export interface PublicRoute extends RouteDefinition {
  readonly href: string;
}

const routeDefinitions: readonly RouteDefinition[] = [
  { id: "home", segment: "", label: { en: "Home", "zh-hk": "首頁" } },
  {
    id: "programme",
    segment: "programme",
    label: { en: "Programme", "zh-hk": "節目" },
  },
  { id: "visit", segment: "visit", label: { en: "Visit", "zh-hk": "到訪" } },
  {
    id: "brands",
    segment: "brands",
    label: { en: "Brands", "zh-hk": "品牌" },
  },
  {
    id: "guidebook",
    segment: "guidebook",
    label: { en: "Guidebook", "zh-hk": "Guidebook" },
  },
  {
    id: "privacy",
    segment: "privacy",
    label: { en: "Privacy", "zh-hk": "私隱" },
  },
];

export const navigationRouteIds = [
  "home",
  "programme",
  "visit",
  "brands",
  "guidebook",
] as const satisfies readonly RouteId[];

export const pageContent = {
  en: {
    home: {
      title: "A quieter way to plan a day of wellbeing.",
      intro:
        "This fictional, bilingual reference experience demonstrates a guided event journey using only local synthetic content and no live service.",
    },
    programme: {
      title: "A programme designed around the shape of a day.",
      intro:
        "Explore date-aware sessions across multi-day, midnight-boundary, paid, free and intentionally unclassified states; the public reference uses fictional records by default.",
    },
    visit: {
      title: "Plan the practical details before setting out.",
      intro:
        "A fictional venue plan brings arrival guidance, accessibility notes and a simple text-first floor guide into one dependable place.",
    },
    brands: {
      title: "Meet the fictional makers shaping this demo village.",
      intro:
        "Synthetic brand stories demonstrate editorial grouping without reproducing client identities, logos, campaign artwork or protected copy.",
    },
    guidebook: {
      title: "What the Guidebook contributes—and what remains private.",
      intro:
        "This explanation preserves the editorial role of a Guidebook while intentionally excluding every original page, image, font and protected passage.",
    },
    privacy: {
      title: "A local demonstration with no personal-data collection.",
      intro:
        "The reference shell has no form, analytics, tracker, credential or live destination; all visible records are fictional and stored locally.",
    },
  },
  "zh-hk": {
    home: {
      title: "以更從容的方式，規劃身心健康體驗。",
      intro:
        "這個虛構的雙語參考體驗，以純本機合成內容示範連貫的活動旅程，亦不連接任何即時服務。",
    },
    programme: {
      title: "按一天的節奏，探索合適節目。",
      intro:
        "探索以日期為本的活動，了解系統如何處理跨日、香港時間午夜邊界、收費、免費及刻意保留未分類的狀態；公開參考版本預設使用虛構記錄。",
    },
    visit: {
      title: "出發之前，先整理實用到訪資料。",
      intro:
        "虛構場地指南把抵達方式、無障礙提示及清晰的文字樓層指引集中於一處，方便讀者安心規劃。",
    },
    brands: {
      title: "認識構成示範村落的虛構品牌。",
      intro:
        "合成品牌故事示範清晰的編輯分組方式，並不重製任何客戶身分、標誌、宣傳作品或受保護文案。",
    },
    guidebook: {
      title: "說明 Guidebook 的作用與保留界線。",
      intro:
        "本頁保留 Guidebook 在內容架構中的編輯角色，同時刻意排除所有原有頁面、圖像、字體及受保護段落。",
    },
    privacy: {
      title: "不收集個人資料的本機示範。",
      intro:
        "這個參考介面不設表格、分析工具、追蹤器、憑證或即時資料目的地；所有可見記錄均屬虛構並儲存於本機。",
    },
  },
} as const satisfies Record<Locale, Record<RouteId, PageContent>>;

function buildManifest(locale: Locale): readonly PublicRoute[] {
  return routeDefinitions.map((route) => ({
    ...route,
    href: route.segment ? `/${locale}/${route.segment}` : `/${locale}`,
  }));
}

export const publicRouteManifest: Record<Locale, readonly PublicRoute[]> = {
  en: buildManifest("en"),
  "zh-hk": buildManifest("zh-hk"),
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getRoute(locale: Locale, routeId: RouteId): PublicRoute {
  const route = publicRouteManifest[locale].find(({ id }) => id === routeId);
  if (!route) throw new Error(`Missing route: ${locale}/${routeId}`);
  return route;
}

export function getRouteHref(locale: Locale, routeId: RouteId): string {
  return getRoute(locale, routeId).href;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "zh-hk" : "en";
}
