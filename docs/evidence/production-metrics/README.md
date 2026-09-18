# Sanitised production-metrics evidence

This directory preserves a public, aggregate record of the Wellness Village event-window workload. It exists so the portfolio can retain inspectable operational evidence after the time-limited campaign URL or account dashboards are no longer available.

## Source and capture

- Capture date: 18 September 2026
- Source: authorised read-only Cloudflare GraphQL Analytics API queries
- Zone reporting window: UTC daily roll-ups from 30 August through 10 September 2026, inclusive
- Worker and storage reporting window: 30 August 2026 00:00 through 11 September 2026 00:00 in `Asia/Hong_Kong`
- Public record: [`event-window-aggregates.json`](event-window-aggregates.json)
- Billing and direct-cost record: [`billing-and-domain-summary.json`](billing-and-domain-summary.json)

The retained JSON contains aggregate counts only. It excludes account and zone identifiers, Worker and Queue names, IP addresses, paths, query strings, user-level data, personal submissions, billing identifiers and message-level lead volumes.

The second JSON file combines two separately verified cost facts without merging their scopes: the complete 12 August–11 September 2026 Cloudflare **account** billing period recorded US$0.00 in usage charges, while an authenticated Porkbun invoice recorded US$11.08 for the domain's first year. Workers Paid was active; zero usage charge is therefore not presented as zero account or project cost. Shared-account invoice totals without project-attributable line items are excluded, and abbreviated dashboard values remain explicitly labelled as rounded rather than converted into falsely precise integers.

## Metric boundaries

- **Edge requests** count HTTP requests at Cloudflare's edge. They include HTML, scripts, styles, images, crawlers and threats; they are not people or visits.
- **HTML page views** are Cloudflare's count of successful HTML responses. They are a more useful page-consumption signal than total requests, but still do not prove a distinct human audience.
- **Worker invocations** count the application-runtime layer. They differ from edge requests because cached assets and other edge-handled traffic do not necessarily invoke the Worker.
- **R2 object count and bytes** are a latest storage snapshot within the window, not a monthly GB-month invoice calculation.
- `workersInvocationsAdaptive` is an adaptive dataset. The retained Worker totals are labelled approximate because sampled analytics can be estimated.

Cloudflare documents that Free-plan HTTP traffic can include legitimate users, crawlers and threats, that one page view can generate many requests, and that a page view is a successful HTML response. See [Zone Analytics](https://developers.cloudflare.com/analytics/account-and-zone-analytics/zone-analytics/) and [GraphQL sampling](https://developers.cloudflare.com/analytics/graphql-api/sampling/).

## Deliberate exclusions

Daily unique-IP values are not published or added together as a visitor total. The same person or automated client can appear on multiple days, and IP address is not a stable person-level identity.

Exact Queue operation counts are retained outside this public edition because they could be used to infer confidential lead volume. The case study states only the supported rate-card position: the observed workload sat below the applicable included allowance.

Account-level billing-cycle values are not used as project-specific traffic. The event-window file supplies the project-scoped analytics; the billing file supplies only the account's included-usage and overage position. The Porkbun amount is retained because its invoice directly identifies the project domain, while all identifying invoice and payment fields are removed.

No traffic metric is presented as evidence of event attendance, registration conversion, commercial return or causation.
