import { describe, expect, it } from "vitest";

import {
  getProgrammeEventCategoryIds,
  programmeEventCategories,
} from "./event-categories";

describe("fictional reviewed programme categories", () => {
  it("keeps the five editorial categories in a stable order", () => {
    expect(programmeEventCategories.map(({ id }) => id)).toEqual([
      "yoga-flow",
      "pilates-fitness",
      "sound-mind-therapy",
      "lifestyle-holistic",
      "community-culture",
    ]);
  });

  it.each([
    ["Harbour Light Flow", ["yoga-flow"]],
    ["Lantern Core Studio", ["pilates-fitness"]],
    ["Tidal Listening Reset", ["sound-mind-therapy"]],
    ["Paper Garden Ritual", ["lifestyle-holistic"]],
    ["Common Table Reading Circle", ["community-culture"]],
  ] as const)("classifies the reviewed fictional phrase %s", (title, expected) => {
    expect(getProgrammeEventCategoryIds(title)).toEqual(expected);
  });

  it("normalises Unicode width and punctuation without broad keyword guessing", () => {
    expect(getProgrammeEventCategoryIds("Harbour—Light Ｆｌｏｗ")).toEqual([
      "yoga-flow",
    ]);
    expect(getProgrammeEventCategoryIds("A story about flowing water")).toEqual([
      "other",
    ]);
  });

  it("supports narrow reviewed aliases", () => {
    expect(getProgrammeEventCategoryIds("Quiet Tide Session")).toEqual([
      "sound-mind-therapy",
    ]);
    expect(getProgrammeEventCategoryIds("Quiet coastal session")).toEqual([
      "other",
    ]);
  });

  it("returns multi-category results in stable editorial order", () => {
    expect(
      getProgrammeEventCategoryIds(
        "Common Table Reading Circle + Harbour Light Flow + Tidal Listening Reset",
      ),
    ).toEqual([
      "yoga-flow",
      "sound-mind-therapy",
      "community-culture",
    ]);
  });

  it("keeps unsupported and empty titles visible under other", () => {
    expect(getProgrammeEventCategoryIds("Open Studio Listing")).toEqual([
      "other",
    ]);
    expect(getProgrammeEventCategoryIds("   ")).toEqual(["other"]);
  });
});
