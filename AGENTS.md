# AGENTS.md

## Purpose

This curated public repository is both a runnable reference implementation and an evidence-backed portfolio case study. Keep it useful without private context: preserve technical accuracy, privacy, human ownership and the distinction between historical production facts, current demo behaviour and future work.

Treat every Agent output as a draft until its source, implementation or observable verification supports it. The Agent may accelerate inventory, research, implementation, tests and documentation. Product direction, source authority, client decisions, privacy boundaries, architecture and release approval remain human-owned.

## Source hierarchy

Use the narrowest authoritative source for each claim:

1. The Ground organisation-scoped public catalogue is authoritative for live event times, prices, public availability and canonical registration destinations.
2. Client-approved venue and campaign records are authoritative for address, arrival guidance, maps and approved campaign presentation.
3. The Guidebook supports editorial profiles, campaign narrative, four pillars and page ranges. It is not a live timetable or evidence of a physical booth, sponsorship, attendance or booking state.
4. First-party public brand sources may verify an official destination or identity, but they do not establish organiser endorsement or campaign participation.
5. The current public implementation and tests establish demo behaviour. Historical production claims also need an explicit case-study source note or decision record.

When evidence is insufficient, use `Unknown`, pending or unavailable, or omit the value. Never infer a fact from layout, imagery, nearby copy, title similarity or search-result similarity.

## Public-repository boundary

- This is a sanitised public edition with an independent history, not a copy of the private production repository or its Git history.
- Use synthetic fixtures and neutral identifiers in code, tests, examples, screenshots of demo data and documentation. Never use production-shaped values as “examples”.
- Do not add a production organisation identifier, Cloudflare account ID, Queue name, Worker name, Sheet ID, private URL, credential, personal record, client correspondence, raw Agent transcript or private filesystem path.
- Never add the original Guidebook PDF, Guidebook page archive, client fonts or campaign source assets. No rights record changes this exclusion.
- Other third-party material may be added only when its redistribution rights are recorded in [ASSET_POLICY.md](ASSET_POLICY.md).
- Documentary screenshots must come from the real application. Generated or redrawn interface pixels must not be presented as product evidence.
- Keep software-licence approval separate from media and client-rights approval. Do not call the repository open-source or add a final `LICENSE` without owner approval.
- Remote repository creation, push and publication require an explicit owner instruction after the [public-edition release checklist](docs/agent-workflow/release-checklist.md) passes.

## Data and privacy rules

- Keep Google credentials and the destination Sheet identifier inside the private Queue consumer only. They must never enter the browser, website Worker, fixtures, logs or documentation.
- Resolve the collection feature gate, published privacy version, Turnstile configuration, Queue destination and both required rate-limiter bindings before reading submitted personal data.
- Require JSON, bounded bodies, strict runtime schemas, server-side Turnstile verification, rate limits and a non-forwarding honeypot path.
- Minimise the Queue payload and retain a stable logical submission ID. Treat Queue delivery as at-least-once and use idempotent convergence for ordinary retries; do not claim distributed exactly-once delivery.
- For a genuine non-honeypot submission, `202 Accepted` follows awaited Queue acceptance. A honeypot decoy deliberately receives the same `202` without enqueueing; neither path means synchronous persistence to Google Sheets.
- Never log submission bodies, names, contact details, tokens, Sheet IDs, credentials or Queue payloads.
- Fail closed when a privacy, verification, rate-limit, Queue or consumer-secret dependency is missing or invalid.

## The Ground integration rules

- Describe the source as an **organisation-scoped public catalogue** or **organisation-scoped public integration**. Do not imply documented partner status.
- Keep access server-only, configuration-scoped, feature-flagged and replaceable. Public fixtures must use a neutral organisation identifier.
- Fetch upcoming and past feeds within finite limits: at most 50 records per page, 20 pages per feed, an eight-second request timeout and a 2 MiB response ceiling.
- Validate response and pagination schemas at runtime. Admit only the documented public event contract; exclude provider contacts, members, coaches and provider-only state.
- Convert timestamps explicitly to `Asia/Hong_Kong` / HKT (`+08:00`). Keep absolute event phase separate from occupied Hong Kong calendar dates, including midnight and multi-day boundaries. Never depend on the deployment host timezone.
- Generate only canonical HTTPS registration links, deduplicate by event ID and preserve deterministic sorting and categories.
- Cache the normalised catalogue for five minutes. Use only a last valid warm snapshot on an upstream failure; on a cold failure show an honest unavailable state and a direct The Ground hand-off.
- Keep The Ground as the booking authority. Do not create a second hand-maintained timetable or booking system.

## Agent workflow

Follow the seven-stage loop in [Evidence-first Agent workflow](docs/agent-workflow/evidence-first-workflow.md):

1. Inventory sources, owners, rights and freshness.
2. Bound claims by recording what each source can and cannot establish.
3. Model content with source status and explicit unsupported states.
4. Brief the smallest coherent vertical slice with non-goals and acceptance checks.
5. Harden every external interface at its trust boundary.
6. Verify observable outcomes with checks proportionate to the changed behaviour.
7. Curate only public evidence that passes rights, privacy and accuracy gates.

Before changing behaviour, state the source boundary and user-visible acceptance criteria, inspect the relevant implementation and tests, make the narrowest coherent change, and update the case study or decision records only when their claims remain evidenced. Record unresolved source or client decisions separately; do not silently choose for the owner.

## Implementation and verification

- Keep synthetic mode as the no-secret default. Live The Ground and Queue/Sheets behaviour must remain explicit opt-ins.
- Read the repository's installed Next.js guidance before changing framework-specific code; do not rely on remembered APIs.
- Keep integration adapters, runtime schemas and private consumers separate from presentation components.
- Add meaningful regression coverage for substantive behaviour changes, trust-boundary failures and time/date edges.
- Run checks proportionate to the change. Before claiming the runnable reference is ready, run `npm run lint`, `npm run typecheck`, `npm run test` and `npm run build`.
- Run browser QA when routes, navigation, responsive layout, keyboard behaviour, accessibility or live-integration presentation changes.
- Validate local links, bilingual Mermaid pairs and architecture claims after documentation changes.
- Never report a build, deployment, smoke check, accessibility result or user outcome as passing unless that exact result was observed. Do not turn technical checks into unmeasured conversion, productivity, SLA or ROI claims.

## Bilingual documentation style

- Lead with the decision or outcome, distinguish history from demo behaviour, then link to stable relative evidence paths without line anchors.
- Keep `README.md` as the canonical English landing page and `README.zh-Hant.md` as a substantial formal written Traditional Chinese companion readable in Hong Kong and Taiwan.
- Translate meaning rather than syntax. Keep brand names, APIs, paths and technical identifiers unchanged where translation would alter the evidence.
- Preserve parity across languages for claims, section structure, diagrams, links, media, limitations and publication boundaries.
- Use unsuffixed documentation and media for English and `-zh-Hant` for Traditional Chinese. The production route name `/zh-hk` does not change the documentation language tag.
- Label reconstructed prompts and retrospective diagrams honestly. Never present reconstructed, edited or sanitised material as a verbatim transcript.
