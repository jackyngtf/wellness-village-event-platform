import Link from "next/link";

import type { Locale } from "@/content/routes";

const journeyCopy = {
  en: {
    eyebrow: "YOUR VISIT, IN SEQUENCE",
    title: "Three useful decisions before the day begins.",
    intro:
      "Move from discovery to preparation and arrival without having to learn the site structure first.",
    steps: [
      {
        title: "Choose from the programme",
        body: "Compare clear time, category and price states before deciding what fits.",
        label: "Explore the programme",
        href: "programme#programme",
      },
      {
        title: "Prepare before setting out",
        body: "Check what to bring, the timing boundary and what remains unknown.",
        label: "Read preparation notes",
        href: "programme#preparation",
      },
      {
        title: "Confirm the visit plan",
        body: "Review the fictional venue, arrival sequence and accessible text guide.",
        label: "Plan the visit",
        href: "visit#visit",
      },
    ],
  },
  "zh-hk": {
    eyebrow: "依次規劃到訪旅程",
    title: "活動開始之前，先作出三個實用決定。",
    intro: "由探索、準備到抵達，毋須先理解網站架構，也能循序找到所需資料。",
    steps: [
      {
        title: "從節目中作出選擇",
        body: "先比較時間、類型及收費狀態，再判斷哪項活動適合自己。",
        label: "瀏覽節目",
        href: "programme#programme",
      },
      {
        title: "出發前做好準備",
        body: "確認所需物品、時間邊界，以及仍然未知的資料。",
        label: "閱讀準備提示",
        href: "programme#preparation",
      },
      {
        title: "確認到訪安排",
        body: "查看虛構場地、抵達次序及無障礙文字指引。",
        label: "規劃到訪",
        href: "visit#visit",
      },
    ],
  },
} as const;

export function VisitorJourney({ locale }: { readonly locale: Locale }) {
  const copy = journeyCopy[locale];

  return (
    <section className="journey-section" aria-labelledby="journey-title">
      <div className="site-container journey-grid">
        <div className="journey-intro">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="journey-title">{copy.title}</h2>
          <p>{copy.intro}</p>
        </div>

        <ol className="journey-list">
          {copy.steps.map((step, index) => (
            <li key={step.href}>
              <span className="journey-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              <Link href={`/${locale}/${step.href}`}>{step.label}</Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
