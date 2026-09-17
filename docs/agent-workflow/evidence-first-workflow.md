# Evidence-first Agent workflow

## Why this workflow existed

The hard part was not generating components. It was deciding what the product was allowed to say when its inputs had different owners, purposes, levels of authority and rates of change.

The Agent accelerated inventory, candidate extraction, research organisation, implementation drafts, refactoring, tests and documentation inside a human-owned evidence system. Product direction, source authority, client decisions, privacy boundaries, architecture and release approval remained human-owned.

## Seven-stage loop

**Inventory → Bound claims → Model content → Brief vertical slice → Harden interfaces → Verify outcomes → Curate public evidence**

Each stage leaves an inspectable output for the next stage. If evidence is insufficient, the loop records `Unknown`, pending or unavailable instead of filling the gap.

## 1. Inventory

Record every source before designing the interface:

- what it is and who controls it;
- whether it is editorial, operational, legal or technical evidence;
- how quickly it becomes stale;
- whether it may be republished; and
- where it conflicts with or defers to another source.

**Project example:** the inventory separated a 184-page Guidebook, approved venue records, first-party public brand sources, The Ground event records and privacy requirements before any one source was turned into product copy. See [context, constraints and role](../case-study/01-context-and-role.md).

## 2. Bound claims

For every source, state both what it can establish and what it cannot establish alone:

| Source | It can establish | It cannot establish alone |
| --- | --- | --- |
| Guidebook | Editorial profiles, campaign narrative, four pillars and page ranges | Live session status, physical booths, sponsorship or booking availability |
| The Ground | Event times, prices, public availability and registration destinations | Campaign narrative, venue operations or participation outside its records |
| Approved venue and campaign records | Address, visitor guidance, map and approved presentation | Unrecorded brand or event claims |
| First-party public brand sources | Official destination and identity evidence | Organiser endorsement or campaign participation |

**Project example:** The Ground retained live schedule and booking authority while Guidebook inclusion stayed editorial; the site did not promote either source beyond its evidence boundary. See [ADR 001](../decisions/001-the-ground-is-the-live-source.md) and [ADR 004](../decisions/004-guidebook-content-boundaries.md).

## 3. Model content

Translate supported evidence into typed content that retains source status, publication state and explicit unsupported states. Keep editorial profiles, live events, registration state, venue guidance and bilingual interface copy as distinct concepts rather than one unqualified content pool.

**Project example:** visual review established four Guidebook pillars and 48 exact two-page profiles. Client confirmation supported 48 Instagram destinations; independent first-party verification supported 29 official websites, while 19 profiles correctly retained no website action. See the [Agent-workflow case-study chapter](../case-study/02-evidence-first-agent-workflow.md) and [Guidebook pipeline diagram](../diagrams/guidebook-content-pipeline.svg).

## 4. Brief vertical slice

Give the Agent a bounded starting brief containing:

- the audience and product job;
- the source hierarchy and human decision owners;
- required routes and bilingual behaviour;
- explicit interface and data non-goals;
- privacy and secret-handling boundaries; and
- objective, user-visible acceptance checks.

Ask for the smallest coherent executable model, not a final production system. List unresolved source or client decisions separately from completed behaviour.

**Project example:** the [reconstructed MVP brief](reconstructed-mvp-brief.md) bounded a mobile-first path through orientation, activities, preparation, venue guidance and Guidebook discovery without claiming to be the verbatim first prompt.

## 5. Harden interfaces

For each external boundary, answer four questions:

1. What is accepted?
2. How is it validated and bounded?
3. What is stored or forwarded?
4. What does the user see when it fails?

**Project example:** The Ground access became an organisation-scoped, server-only adapter with bounded pagination, an eight-second timeout, a 2 MiB ceiling, runtime schemas, explicit HKT conversion, a five-minute cache and honest warm/cold failure states. See [The Ground interface chapter](../case-study/04-the-ground-event-interface.md) and [interface diagram](../diagrams/the-ground-event-interface.svg).

The same questions governed visitor submissions: privacy and configuration gates, including both limiter bindings, precede body reads; a genuine non-honeypot 8 KiB-bounded strict payload is enqueued with a stable ID; and a separate consumer owns Google credentials, an exact 14-field contract, retry, deduplication and DLQ handling. For that genuine path, `202 Accepted` follows awaited Queue acceptance. A honeypot decoy deliberately receives the same `202` without enqueueing, so the status alone is not evidence that a message entered the Queue. See [Queue-to-Sheets chapter](../case-study/05-queue-to-sheets-interface.md) and [ADR 003](../decisions/003-queue-before-google-sheets.md).

## 6. Verify outcomes

Match each claim to the cheapest decisive evidence. A content test proves a content invariant; a build proves buildability; browser QA proves an observed interface behaviour; a smoke check proves only the response that was observed.

The release sequence was inspect → test → build → dry run → preview → deploy → read-only smoke checks. Record exactly what ran, the result and any uncertainty. Never stretch technical checks into a conversion, productivity, SLA or ROI claim.

**Project example:** the delivered runtime was verified as OpenNext on Cloudflare Workers, with R2 incremental caching and Durable Object revalidation kept distinct from lead handling. See [Cloudflare delivery](../case-study/06-cloudflare-delivery.md) and [ADR 002](../decisions/002-workers-not-static-pages.md).

## 7. Curate public evidence

Create a new, sanitised public edition rather than exporting private history. Include only reviewed implementation, synthetic fixtures, approved documentary media, concise decisions, limitations and reproducible checks. Exclude credentials, production identifiers, personal data, private correspondence, raw Agent transcripts and material without redistribution rights.

**Project example:** the portfolio edition uses an independent publication boundary, an [evidence index](../case-study/08-evidence-index.md) and a [public-edition release checklist](release-checklist.md) so useful evidence can survive after the campaign URL is retired.

## Working rule

Agent-generated output is a proposal, not authority. Advance to the next stage only when the current output is supported by evidence or an identified human decision owner. If later evidence changes a claim, return to the earliest affected stage and update the model, implementation, tests and public narrative together.
