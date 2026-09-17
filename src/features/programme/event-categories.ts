export const programmeEventCategoryIds = [
  "yoga-flow",
  "pilates-fitness",
  "sound-mind-therapy",
  "lifestyle-holistic",
  "community-culture",
] as const;

export type ProgrammeEventCategoryId =
  | (typeof programmeEventCategoryIds)[number]
  | "other";

interface ProgrammeEventCategory {
  readonly id: (typeof programmeEventCategoryIds)[number];
  readonly name: Readonly<{ en: string; "zh-hk": string }>;
  readonly reviewedPhrases: readonly string[];
  readonly reviewedAliases: readonly string[];
}

export const programmeEventCategories: readonly ProgrammeEventCategory[] = [
  {
    id: "yoga-flow",
    name: { en: "Yoga & Flow", "zh-hk": "瑜伽與流動" },
    reviewedPhrases: ["Harbour Light Flow"],
    reviewedAliases: ["Harbour Flow Session"],
  },
  {
    id: "pilates-fitness",
    name: { en: "Pilates & Fitness", "zh-hk": "普拉提與體能" },
    reviewedPhrases: ["Lantern Core Studio"],
    reviewedAliases: ["Lantern Core Session"],
  },
  {
    id: "sound-mind-therapy",
    name: { en: "Sound & Mind Therapy", "zh-hk": "聲音與身心療癒" },
    reviewedPhrases: ["Tidal Listening Reset"],
    reviewedAliases: ["Quiet Tide Session"],
  },
  {
    id: "lifestyle-holistic",
    name: { en: "Lifestyle & Holistic", "zh-hk": "生活美學與身心體驗" },
    reviewedPhrases: ["Paper Garden Ritual"],
    reviewedAliases: ["Paper Garden Session"],
  },
  {
    id: "community-culture",
    name: { en: "Community & Culture", "zh-hk": "社群與文化" },
    reviewedPhrases: ["Common Table Reading Circle"],
    reviewedAliases: ["Common Table Circle"],
  },
];

function normalizeReviewedText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsReviewedPhrase(title: string, phrase: string): boolean {
  const normalizedPhrase = normalizeReviewedText(phrase);
  return (
    normalizedPhrase.length > 0 &&
    ` ${title} `.includes(` ${normalizedPhrase} `)
  );
}

export function getProgrammeEventCategoryIds(
  title: string,
): readonly ProgrammeEventCategoryId[] {
  const normalizedTitle = normalizeReviewedText(title);
  if (!normalizedTitle) return ["other"];

  const matched = programmeEventCategories
    .filter((category) =>
      [...category.reviewedPhrases, ...category.reviewedAliases].some(
        (phrase) => containsReviewedPhrase(normalizedTitle, phrase),
      ),
    )
    .map(({ id }) => id);

  return matched.length ? matched : ["other"];
}
