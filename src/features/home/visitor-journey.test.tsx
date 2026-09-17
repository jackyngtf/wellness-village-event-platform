import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProgrammePage from "@/app/[locale]/programme/page";
import VisitPage from "@/app/[locale]/visit/page";
import { VisitorJourney } from "./visitor-journey";

describe("the guided visitor journey", () => {
  it.each(["en", "zh-hk"] as const)(
    "links %s visitors to working programme, preparation and visit anchors",
    async (locale) => {
      const journeyHtml = renderToStaticMarkup(
        <VisitorJourney locale={locale} />,
      );
      const programmeHtml = renderToStaticMarkup(
        await ProgrammePage({ params: Promise.resolve({ locale }) }),
      );
      const visitHtml = renderToStaticMarkup(
        await VisitPage({ params: Promise.resolve({ locale }) }),
      );

      expect(journeyHtml).toContain(
        `href="/${locale}/programme#programme"`,
      );
      expect(journeyHtml).toContain(
        `href="/${locale}/programme#preparation"`,
      );
      expect(journeyHtml).toContain(`href="/${locale}/visit#visit"`);

      expect(programmeHtml).toContain('id="programme"');
      expect(programmeHtml).toContain('id="preparation"');
      expect(visitHtml).toContain('id="visit"');
    },
  );
});
