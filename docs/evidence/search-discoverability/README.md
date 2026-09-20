# Search and indexing records

[**English**](README.md) · [繁體中文](README.zh-Hant.md)

This directory keeps read-only snapshots of the production search endpoints captured on 18 September 2026:

- [`robots.txt`](robots.txt) allowed public crawling, excluded `/api/` and identified the sitemap.
- [`sitemap.xml`](sitemap.xml) contained 12 canonical locale URLs: six routes in Traditional Chinese and English, with `zh-HK`, `en` and `x-default` alternates.
- [`search-console-summary.json`](search-console-summary.json) preserves authorised, aggregate Search Console performance, sitemap, indexing and enhancement results without account identity or raw low-volume queries.

The snapshots establish what the production website served at capture time. They do not prove that Google fetched, accepted or indexed every URL.

An authorised read-only Chrome inspection confirmed the pre-existing verified Domain property. For the inclusive 30 August–10 September 2026 calendar dates in Search Console's Pacific Time reporting basis, Web Search recorded 112 clicks, 362 impressions, a displayed 30.9% CTR and 3.5 average position. The selected dates mirror the Hong Kong event calendar but are not an exact HKT-hour window.

The submitted sitemap was last read successfully on 14 September, with 12 discovered pages. The sitemap-scoped Page indexing snapshot on that date showed 6 indexed and 6 not indexed. These are dated Google reports, not permanent coverage guarantees. Core Web Vitals had insufficient 90-day field data for both mobile and desktop, so no real-user performance result is claimed.

No property was created, no sitemap was submitted and no DNS or Search Console setting was changed during curation. Account identifiers, screenshots, permission listings and raw low-volume query rows remain excluded.

See the official [Performance report](https://support.google.com/webmasters/answer/7576553?hl=en), [Performance data and aggregation](https://support.google.com/webmasters/answer/17011364?hl=en), [Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en), [Page indexing report](https://support.google.com/webmasters/answer/7440203?hl=en) and [Core Web Vitals report](https://support.google.com/webmasters/answer/9205520?hl=en).

Continue with the [Search Console and indexing chapter](../../case-study/08-search-discoverability.md) or inspect the [search-discovery lifecycle](../../diagrams/search-discovery-lifecycle.svg).
