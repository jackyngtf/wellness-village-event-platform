# Lessons and limitations

## What transferred beyond this event

### Give the Agent an evidence system

A long prompt is not a substitute for source authority. The useful control surface was a source register, explicit unknowns, typed contracts, acceptance criteria and verification evidence. Agent speed became valuable only after those boundaries were visible.

### Design hand-offs, not duplicated ownership

The website improved discovery while The Ground kept booking authority. The Queue separated the public request from Google latency while Google Sheets stayed the client's operating surface. R2 and Durable Objects handled application caching, not contact records. Each system had one clear responsibility.

### Small systems still need failure semantics

Short-lived campaigns can still leak credentials, fabricate stale information or lose submissions. Body limits, runtime schemas, timeouts, cache fallbacks, stable IDs, retries, deduplication and dead-letter handling were proportionate safeguards.

### A portfolio repo is a product of its own

The useful public artefact is not a dump of private history. It is a new, auditable edition containing selected code, synthetic fixtures, approved documentary media, decisions, limitations and a path to run without secrets.

### Verification has a scope

A passing content test proves a content invariant, a build proves buildability and a smoke check proves an observed response. None should be stretched into a business outcome or long-term reliability claim. Keeping those scopes explicit made the release record more credible.

### Separate workload, allowance and spend

Edge requests, HTML page views, Worker invocations, included quantities, usage charges and invoices answer different questions. The useful cost story was not “the site was free”; it was that the architecture kept the observed workload inside included Cloudflare quantities, while the direct first-year domain cost was independently evidenced and fixed subscriptions, shared-account services, labour and external systems remained separate.

### Treat search measurement as a launch dependency

Serving a valid bilingual sitemap and `robots.txt` makes discovery possible; it does not prove indexing or organic performance. The pre-event Search Console verification and sitemap submission made a bounded post-event readout possible. The important discipline is to retain the report timezone, aggregation mode and snapshot dates instead of turning a verified dashboard into stronger claims than it supports.

## Limitations

- The Ground feed used a public endpoint, not a formal partner API documented in this repository.
- A warm-instance snapshot can cover a short upstream failure but does not provide a durable availability guarantee.
- Google Sheets is an appropriate operating destination for this bounded workflow, not a general transactional database.
- At-least-once Queue delivery plus deduplication is not distributed exactly-once delivery.
- Read-before-append deduplication, retention, withdrawal and DLQ recovery still require bounded operation and human ownership.
- The public documentary media preserves the delivered interface, but campaign imagery inside it remains subject to the approved portfolio scope.
- The reconstructed prompt explains a bounded starting brief; it is not a verbatim historical record or a claim that one prompt built the product.
- Cloudflare event analytics include crawlers and threats, and adaptive Worker datasets may be sampled. Requests, page views and runtime invocations are not people, visits or attendance.
- Cloudflare billing evidence is account-level and can include other workloads. It establishes a zero usage charge for one complete billing period, not a project-only invoice or total cost of ownership.
- The first-year Porkbun domain registration is directly attributable; future renewal prices are not claimed.
- Search Console performance dates use PT. The selected 30 August–10 September dates mirror the Hong Kong event calendar but do not reproduce the exact HKT-hour window.
- Search Console property totals and page-grouped rows use different aggregation rules, while the 6-of-12 sitemap indexing result is a 14 September snapshot rather than permanent coverage.
- Mobile and desktop Core Web Vitals lacked enough 90-day field data, so no real-user performance result is claimed.
- No conversion uplift, productivity percentage, reliability SLA or business ROI is claimed without measurement.
- The live event URL may eventually be retired; the media and runnable demo are the durable record.

## Related evidence

- Implementation: [public Agent rules](../../AGENTS.md) and [public-edition release checklist](../agent-workflow/release-checklist.md)
- Tests: [application checks](../../src/) and [consumer checks](../../workers/contact-sheet-consumer/)
- Diagram: [architecture diagram index](../diagrams/README.md)
- Production evidence: [economics and observability](07-production-economics-and-observability.md) and [search discoverability](08-search-discoverability.md)
- Decision record: [live event source](../decisions/001-the-ground-is-the-live-source.md), [Workers runtime](../decisions/002-workers-not-static-pages.md), [Queue before Sheets](../decisions/003-queue-before-google-sheets.md) and [Guidebook boundaries](../decisions/004-guidebook-content-boundaries.md)
