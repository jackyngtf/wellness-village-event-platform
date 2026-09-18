# Search discoverability

## Discovery is a separate evidence layer

Cloudflare analytics measures delivery at the website edge and application runtime. Google Search Console measures a different question: how Google discovered, indexed and surfaced the site in search. Neither should be used as a substitute for the other, and neither proves event attendance, conversion or business impact.

## Production discovery endpoints

Read-only checks on 18 September 2026 confirmed that the production site served:

- a `robots.txt` that allowed public routes, excluded `/api/` and identified the sitemap; and
- a sitemap with 12 locale URLs: six routes in Traditional Chinese and English, with `zh-HK`, `en` and `x-default` alternate links.

The public snapshots are retained as [robots.txt](../evidence/search-discoverability/robots.txt) and [sitemap.xml](../evidence/search-discoverability/sitemap.xml) so the implementation remains inspectable if the campaign domain is retired.

These endpoints prove what the website exposed at capture time. They do not, by themselves, prove that Google fetched, accepted or indexed every URL. The synthetic runnable reference also deliberately uses `noindex`; it is a local portfolio demo, not a replacement campaign site.

## Verified Search Console property

An authorised read-only Chrome inspection on 18 September confirmed the pre-existing `wellnessvillagehk.com` Domain property and verified-owner status. The property had been added on 21 August 2026. No property was created, no sitemap was submitted and no DNS or Search Console setting was changed during portfolio curation.

The retained [sanitised Search Console record](../evidence/search-discoverability/search-console-summary.json) excludes the account identity, screenshots, permission listings and raw low-volume queries.

## Event-aligned Web Search performance

The Search results Performance report was filtered to Web Search and the inclusive calendar dates 30 August–10 September 2026:

| Metric | Verified property result |
| --- | ---: |
| Clicks | 112 |
| Impressions | 362 |
| Displayed CTR | 30.9% |
| Average position | 3.5 |

Search Console uses Pacific Time for non-24-hour performance dates. These 12 calendar labels were selected to mirror the Hong Kong event dates, so this is an **event-aligned PT window**, not an exact `Asia/Hong_Kong` hour-for-hour interval. The daily rows are retained in the sanitised record with that timezone boundary.

The strongest observed landing-page row was the Traditional Chinese home route, `/zh-hk`, with 98 clicks and 315 impressions. This is a page-grouped observation, not a share calculation: Google aggregates property and page dimensions differently, so page rows should not be summed back to the property totals. Query rows remain private because the table included low-volume searches.

## Indexing, sitemap and structured-data snapshots

These are later operational snapshots, not metrics from the PT performance window:

| Search Console report | Snapshot | Observed result | Interpretation boundary |
| --- | --- | --- | --- |
| Sitemaps | Last read 14 September 2026 | Submitted 21 August; status `Success`; 12 discovered pages and 0 videos | Confirms Google's submitted-sitemap record, not permanent indexing |
| Page indexing, sitemap scope | Updated 14 September 2026 | 6 of 12 submitted URLs indexed; 6 not indexed | The six excluded URLs were reported as one `noindex`, one 404 and four discovered but not yet indexed; the report does not establish a root-cause audit |
| Event enhancement | Updated 16 September 2026 | 1 valid item and 0 invalid items | Optional improvement notices remained for `offers`, `performer` and `organizer` |
| Core Web Vitals | Updated 16 September 2026 | Insufficient 90-day field data for mobile and desktop | No real-user Core Web Vitals result is claimed |
| HTTPS | Updated 11 September 2026 | 1 HTTPS URL and 0 non-HTTPS URLs in the report | This summary is not treated as a crawl of every route |

Index coverage is therefore reported as a dated state, not as “all pages indexed” or a final outcome. Search performance is also not converted into visits, attendance or broad SEO success; average position is property-level and can be shaped by query mix, location, device and search context.

Official references: [Performance report](https://support.google.com/webmasters/answer/7576553?hl=en), [Performance data and aggregation](https://support.google.com/webmasters/answer/17011364?hl=en), [Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en), [Page indexing report](https://support.google.com/webmasters/answer/7440203?hl=en) and [Core Web Vitals report](https://support.google.com/webmasters/answer/9205520?hl=en).

## Practical lesson

Search measurement worked because ownership verification and sitemap submission existed before the event. The useful portfolio story is not merely that technical SEO files were present: the source chain can now be followed from the production endpoints, through Google's submitted-sitemap and indexing reports, to an aggregate event-aligned performance window. The remaining gaps—PT versus HKT boundaries, incomplete index coverage and insufficient field-performance data—stay visible rather than being converted into stronger claims.
