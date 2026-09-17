import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteShell } from "./site-shell";

describe("SiteShell locale switch", () => {
  it("makes the skip-link target programmatically focusable", () => {
    const html = renderToStaticMarkup(
      <SiteShell currentRoute="home" locale="en">
        <p>Home</p>
      </SiteShell>,
    );

    expect(html).toContain('href="#main-content"');
    expect(html).toContain('<main id="main-content" tabindex="-1">');
  });

  it("uses a canonical programme override with filters and the results anchor", () => {
    const html = renderToStaticMarkup(
      <SiteShell
        currentRoute="programme"
        locale="zh-hk"
        alternateLocaleHref="/en/programme?temporal=upcoming&category=pilates-fitness&location=loc_5Lit55Kw#programme-results"
      >
        <p>Programme</p>
      </SiteShell>,
    );

    expect(html).toContain(
      'href="/en/programme?temporal=upcoming&amp;category=pilates-fitness&amp;location=loc_5Lit55Kw#programme-results"',
    );
    expect(html).toContain('data-navigation="full-document"');
  });

  it("keeps the existing route-only switch for every route without an override", () => {
    const html = renderToStaticMarkup(
      <SiteShell currentRoute="brands" locale="en">
        <p>Brands</p>
      </SiteShell>,
    );

    expect(html).toContain('href="/zh-hk/brands"');
  });
});
