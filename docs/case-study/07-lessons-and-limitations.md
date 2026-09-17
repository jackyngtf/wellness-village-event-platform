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

## Limitations

- The Ground feed used a public endpoint, not a formal partner API documented in this repository.
- A warm-instance snapshot can cover a short upstream failure but does not provide a durable availability guarantee.
- Google Sheets is an appropriate operating destination for this bounded workflow, not a general transactional database.
- At-least-once Queue delivery plus deduplication is not distributed exactly-once delivery.
- Read-before-append deduplication, retention, withdrawal and DLQ recovery still require bounded operation and human ownership.
- The public documentary media preserves the delivered interface, but campaign imagery inside it remains subject to the approved portfolio scope.
- The reconstructed prompt explains a bounded starting brief; it is not a verbatim historical record or a claim that one prompt built the product.
- No conversion uplift, productivity percentage, reliability SLA or business ROI is claimed without measurement.
- The live event URL may eventually be retired; the media and runnable demo are the durable record.

## Related evidence

- Implementation: [public Agent rules](../../AGENTS.md) and [public-edition release checklist](../agent-workflow/release-checklist.md)
- Tests: [application checks](../../src/) and [consumer checks](../../workers/contact-sheet-consumer/)
- Diagram: [architecture diagram index](../diagrams/README.md)
- Decision record: [live event source](../decisions/001-the-ground-is-the-live-source.md), [Workers runtime](../decisions/002-workers-not-static-pages.md), [Queue before Sheets](../decisions/003-queue-before-google-sheets.md) and [Guidebook boundaries](../decisions/004-guidebook-content-boundaries.md)
