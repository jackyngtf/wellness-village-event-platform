# Lessons and limitations

## How to read the evidence

This portfolio does not use one metric as a proxy for overall success. It applies four different evidence levels to four different questions:

| Evidence level | Question it can answer | Evidence used here | What it cannot establish |
| --- | --- | --- | --- |
| **Delivery record** | Was a reviewable and then production product delivered against the recorded milestones? | Sanitised chronology, timestamped private project records and domain registration evidence | How much faster Agent assistance made the work |
| **Implementation verification** | Do defined content, date, integration, privacy and failure-path behaviours work as specified? | Typed contracts, automated tests, builds, browser QA, accessibility checks and dry runs | Permanent third-party availability or every possible real-world condition |
| **Production observation** | What workload, cost boundary and search state were observed during bounded periods? | Cloudflare analytics and billing, domain invoice, production endpoints and Search Console | Unique visitors, attendance, conversion, ROI or causation |
| **User and business outcome** | Did the experience improve comprehension, satisfaction, registration or client productivity? | No controlled baseline or user study was retained | No outcome claim is made at this level |

This separation keeps a verified technical success from being silently promoted into an unmeasured UX or commercial success.

## What transferred beyond this event

### Give the Agent an evidence system

A long prompt is not a substitute for source authority. The useful control surface was a source register, explicit unknowns, typed contracts, acceptance criteria and verification evidence. Agent speed became valuable only after those boundaries were visible.

### Make the product reviewable before optimising the environment

The home-server preview shortened the path from an ambiguous brief to a concrete client conversation before the production domain existed. Its value was not that production should be self-hosted; it was that preview infrastructure and production infrastructure served different stages. The final release then moved behind the custom domain and Cloudflare runtime with the required privacy, integration and operational controls.

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

## What would strengthen a future iteration

The current record is strong on delivery, implementation and production operation. A future campaign could add outcome evidence without collecting unnecessary personal data:

1. **Task-based usability sessions before launch.** Ask representative first-time visitors to explain the event, find a suitable activity, identify whether booking is required and locate arrival guidance. Record task completion, time, wrong turns and qualitative confusion; compare the revised flow with the original information sources rather than relying on preference alone.
2. **Privacy-safe journey measurement.** Count aggregate programme views, outbound hand-offs to The Ground and successful contact-intent acceptance without recording form values in analytics. Define the denominator and consent basis before implementation.
3. **Content-operation measures.** Record how long a verified programme or brand correction takes to reach the website, how often updates require client clarification and whether source conflicts are caught before publication.
4. **Longer-lived performance evidence.** If the site remains active long enough, review field Core Web Vitals and route-level performance instead of treating lab checks or insufficient Search Console data as real-user results.
5. **Independent review.** Have a designer, accessibility reviewer or another engineer repeat selected visitor tasks and technical checks to reduce sole-author blind spots.

These are proposed measurements, not missing results retroactively inferred from the event.

## Limitations

- The Ground feed used a public endpoint, not a formal partner API documented in this repository.
- A warm-instance snapshot can cover a short upstream failure but does not provide a durable availability guarantee.
- Google Sheets is an appropriate operating destination for this bounded workflow, not a general transactional database.
- At-least-once Queue delivery plus deduplication is not distributed exactly-once delivery.
- Read-before-append deduplication, retention, withdrawal and DLQ recovery still require bounded operation and human ownership.
- The public documentary media preserves the delivered interface, but campaign imagery inside it remains subject to the approved portfolio scope.
- The reconstructed prompt explains a bounded starting brief; it is not a verbatim historical record or a claim that one prompt built the product.
- The public delivery timeline is a sanitised chronology supported partly by private project correspondence. The messages, participant identities, quotations and attachments remain excluded from the repository.
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
