# Search discoverability

## Discovery is a separate evidence layer

Cloudflare analytics measures delivery at the website edge and application runtime. Google Search Console measures a different question: how Google discovered, indexed and surfaced the site in search. Neither should be used as a substitute for the other, and neither proves event attendance or business impact.

## Production discovery endpoints

Read-only checks on 18 September 2026 confirmed that the production site served:

- a `robots.txt` that allowed public routes, excluded `/api/` and identified the sitemap; and
- a sitemap with 12 locale URLs: six routes in Traditional Chinese and English, with `zh-HK`, `en` and `x-default` alternate links.

The public snapshots are retained as [robots.txt](../evidence/search-discoverability/robots.txt) and [sitemap.xml](../evidence/search-discoverability/sitemap.xml) so the implementation remains inspectable if the campaign domain is retired.

These endpoints prove what the website exposed at capture time. They do not prove that Google fetched, accepted or indexed every URL. The synthetic runnable reference also deliberately uses `noindex`; it is a local portfolio demo, not a replacement campaign site.

## Search Console evidence boundary

The authorised account available during curation exposed no verified Search Console property. No property was created, no sitemap was submitted and no DNS record was changed as part of this portfolio work. Organic clicks, impressions, CTR, average position and indexed-page totals are therefore not claimed.

This matters because Google's Sitemaps report lists only sitemaps submitted through Search Console or its API; a sitemap discovered from `robots.txt` can still be used by Google without appearing in that report. The Page indexing report, when available for a verified property, is the appropriate source for Google's indexing status.

Official references: [Performance report](https://support.google.com/webmasters/answer/7576553?hl=en), [Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en) and [Page indexing report](https://support.google.com/webmasters/answer/7440203?hl=en).

## Measurement plan for a future event

Search Console should be verified before launch and reviewed in three explicit windows:

| Window | Question |
| --- | --- |
| Pre-launch | Did Google discover the canonical bilingual routes before the event? |
| Event dates | Which queries and landing pages generated search impressions and clicks while the event was active? |
| Post-event | Did useful pages continue to be discovered, and should the campaign site redirect, archive or remain available? |

A public portfolio summary should normally use only aggregate clicks, impressions and indexed canonical pages, optionally split by locale landing route. Raw low-volume queries, account screenshots and user-level exports should remain private.

## Practical lesson

Technical SEO should be part of the launch checklist, while Search Console verification should be treated as an operational dependency rather than a post-event reporting task. The honest result for this edition is therefore twofold: the bilingual discovery endpoints are evidenced, while Google search outcomes remain unmeasured.
