export interface LocalisedFixtureText {
  readonly en: string;
  readonly "zh-hk": string;
}

export type DemoEventPrice =
  | { readonly kind: "free" }
  | { readonly kind: "paid"; readonly amount: number; readonly currency: "HKD" }
  | { readonly kind: "unclassified" };

export interface DemoEvent {
  readonly fixtureKind: "synthetic";
  readonly eventId: string;
  readonly title: LocalisedFixtureText;
  readonly summary: LocalisedFixtureText;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly timeZone: "Asia/Hong_Kong";
  readonly location: LocalisedFixtureText;
  readonly category: "movement" | "rest" | "making" | null;
  readonly price: DemoEventPrice;
  readonly registrationUrl: string;
  readonly contactEmail: string;
}

export const demoEvents = [
  {
    fixtureKind: "synthetic",
    eventId: "demo-mindful-movement-01",
    title: {
      en: "Mindful Movement Demo",
      "zh-hk": "正念律動示範",
    },
    summary: {
      en: "A gentle fictional session for testing a free, same-day listing.",
      "zh-hk": "以溫和的虛構課節，示範免費及同日舉行的活動資料。",
    },
    startsAt: "2030-06-01T10:00:00+08:00",
    endsAt: "2030-06-01T11:00:00+08:00",
    timeZone: "Asia/Hong_Kong",
    location: { en: "Garden Room", "zh-hk": "花園室" },
    category: "movement",
    price: { kind: "free" },
    registrationUrl: "https://events.example.com/demo-mindful-movement-01",
    contactEmail: "movement@programme.example.com",
  },
  {
    fixtureKind: "synthetic",
    eventId: "demo-slow-weekend-02",
    title: {
      en: "Slow Weekend Studio",
      "zh-hk": "慢活週末工作室",
    },
    summary: {
      en: "A fictional paid residency spanning several Hong Kong calendar days.",
      "zh-hk": "跨越多個香港曆日的虛構收費駐留體驗。",
    },
    startsAt: "2030-06-01T18:00:00+08:00",
    endsAt: "2030-06-03T09:30:00+08:00",
    timeZone: "Asia/Hong_Kong",
    location: { en: "North Studio", "zh-hk": "北面工作室" },
    category: "making",
    price: { kind: "paid", amount: 360, currency: "HKD" },
    registrationUrl: "https://bookings.example.com/demo-slow-weekend-02",
    contactEmail: "studio@programme.example.com",
  },
  {
    fixtureKind: "synthetic",
    eventId: "demo-midnight-listening-03",
    title: {
      en: "Midnight Listening Room",
      "zh-hk": "午夜聆聽室",
    },
    summary: {
      en: "A one-hour fictional session crossing the HKT midnight boundary.",
      "zh-hk": "一節跨越香港時間午夜邊界的一小時虛構活動。",
    },
    startsAt: "2030-06-01T23:30:00+08:00",
    endsAt: "2030-06-02T00:30:00+08:00",
    timeZone: "Asia/Hong_Kong",
    location: { en: "Quiet Hall", "zh-hk": "靜心廳" },
    category: "rest",
    price: { kind: "free" },
    registrationUrl: "https://night.example.com/demo-midnight-listening-03",
    contactEmail: "listening@programme.example.com",
  },
  {
    fixtureKind: "synthetic",
    eventId: "demo-open-listing-04",
    title: {
      en: "Open Studio Listing",
      "zh-hk": "開放工作室項目",
    },
    summary: {
      en: "A deliberately incomplete fictional record that remains visibly unclassified.",
      "zh-hk": "刻意保留部分未知資料的虛構記錄，並清楚標示為未分類。",
    },
    startsAt: "2030-06-02T14:00:00+08:00",
    endsAt: "2030-06-02T15:15:00+08:00",
    timeZone: "Asia/Hong_Kong",
    location: { en: "Workshop Table", "zh-hk": "工作坊長桌" },
    category: null,
    price: { kind: "unclassified" },
    registrationUrl: "https://open.example.com/demo-open-listing-04",
    contactEmail: "unknown@programme.example.com",
  },
] as const satisfies readonly DemoEvent[];
