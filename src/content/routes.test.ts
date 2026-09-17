import { describe, expect, it } from "vitest";

import {
  locales,
  pageContent,
  publicRouteManifest,
  type Locale,
} from "./routes";

const expectedInformationArchitecture = [
  ["home", ""],
  ["programme", "programme"],
  ["visit", "visit"],
  ["brands", "brands"],
  ["guidebook", "guidebook"],
  ["privacy", "privacy"],
] as const;

describe("bilingual route and content parity", () => {
  it("keeps English and Traditional Chinese on one information architecture", () => {
    expect(locales).toEqual(["en", "zh-hk"]);

    for (const locale of locales) {
      expect(
        publicRouteManifest[locale].map(({ id, segment }) => [id, segment]),
      ).toEqual(expectedInformationArchitecture);
    }
  });

  it("provides substantive visible page copy for every route in both locales", () => {
    for (const locale of locales) {
      for (const [routeId] of expectedInformationArchitecture) {
        const content = pageContent[locale as Locale][routeId];

        expect(content.title.trim().length).toBeGreaterThan(12);
        expect(content.intro.trim().length).toBeGreaterThan(40);
      }
    }
  });
});
