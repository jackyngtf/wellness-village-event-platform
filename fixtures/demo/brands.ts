import type { LocalisedFixtureText } from "./events";

export interface DemoBrand {
  readonly fixtureKind: "synthetic";
  readonly brandId: string;
  readonly name: string;
  readonly pillar: LocalisedFixtureText;
  readonly story: LocalisedFixtureText;
  readonly website: string;
  readonly contactEmail: string;
}

export const demoBrands = [
  {
    fixtureKind: "synthetic",
    brandId: "demo-quiet-current",
    name: "Quiet Current Studio",
    pillar: { en: "Rest", "zh-hk": "休息" },
    story: {
      en: "A fictional sound practice exploring pauses, attention and shared quiet.",
      "zh-hk": "以聲音探索停頓、專注與共同安靜時刻的虛構創作單位。",
    },
    website: "https://quiet-current.example.com",
    contactEmail: "hello@quiet-current.example.com",
  },
  {
    fixtureKind: "synthetic",
    brandId: "demo-field-and-fold",
    name: "Field & Fold",
    pillar: { en: "Movement", "zh-hk": "律動" },
    story: {
      en: "A fictional movement studio turning everyday gestures into gentle routines.",
      "zh-hk": "把日常動作轉化為溫和練習的虛構律動工作室。",
    },
    website: "https://field-and-fold.example.com",
    contactEmail: "studio@field-and-fold.example.com",
  },
  {
    fixtureKind: "synthetic",
    brandId: "demo-common-table",
    name: "Common Table Lab",
    pillar: { en: "Nourishment", "zh-hk": "滋養" },
    story: {
      en: "A fictional food lab using seasonal ingredients to prompt conversation.",
      "zh-hk": "以時令食材開展交流的虛構飲食實驗室。",
    },
    website: "https://common-table.example.com",
    contactEmail: "kitchen@common-table.example.com",
  },
  {
    fixtureKind: "synthetic",
    brandId: "demo-soft-corner-press",
    name: "Soft Corner Press",
    pillar: { en: "Reflection", "zh-hk": "反思" },
    story: {
      en: "A fictional small press making field notes for slower observation.",
      "zh-hk": "製作慢觀察札記的虛構小型出版單位。",
    },
    website: "https://soft-corner.example.com",
    contactEmail: "notes@soft-corner.example.com",
  },
] as const satisfies readonly DemoBrand[];
