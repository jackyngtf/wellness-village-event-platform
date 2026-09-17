import { describe, expect, it } from "vitest";

import {
  buildProgrammeHref,
  type ProgrammeFilters,
} from "./programme-filters";

describe("programme locale route state", () => {
  it("builds a minimal locale href from validated filters only", () => {
    const filters: ProgrammeFilters = {
      temporal: "upcoming",
      date: null,
      category: "pilates-fitness",
      location: "loc_5Lit55Kw",
      price: "free",
      booking: "open",
    };

    expect(buildProgrammeHref("en", filters)).toBe(
      "/en/programme?temporal=upcoming&category=pilates-fitness&location=loc_5Lit55Kw&price=free&booking=open#programme-results",
    );
    expect(buildProgrammeHref("zh-hk", { ...filters, temporal: "all" })).toBe(
      "/zh-hk/programme?category=pilates-fitness&location=loc_5Lit55Kw&price=free&booking=open#programme-results",
    );
  });
});
