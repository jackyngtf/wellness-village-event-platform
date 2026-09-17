<!-- section:hero -->
# Wellness Village Event Platform

[**English**](README.md) · [繁體中文](README.zh-Hant.md)

![MacBook and iPhone views of the English Wellness Village experience moving through event orientation, programme discovery, brand stories and the contact journey.](docs/media/responsive-scroll-walkthrough.gif)

[View the static, reduced-motion cover](docs/media/portfolio-hero.png) · [Download the H.264 walkthrough](docs/media/responsive-scroll-walkthrough.mp4)

**An evidence-first bilingual event platform that transformed a 184-page Guidebook, verified brand research, live booking data and privacy requirements into a production visitor experience.**

I led the product direction, evidence model, bilingual UX, full-stack implementation, Cloudflare delivery and release operations. Agent assistance accelerated research organisation, implementation and verification; product judgement, client facts, privacy decisions and release authority remained human-owned.

> **Portfolio edition.** This is a curated, sanitised case study and runnable reference implementation, intentionally separate from the private production repository and history. It excludes credentials, personal data, private handover material and source assets that cannot be redistributed.

[Visit the live campaign site](https://www.wellnessvillagehk.com/) — this time-limited URL may later be retired. The documentary media and runnable demo in this repository are the durable record.

[Open the case-study index](docs/case-study/README.md) · [Trace headline claims in the evidence index](docs/case-study/08-evidence-index.md)

<!-- section:at-a-glance -->
## At a glance

| | |
| --- | --- |
| **Context** | A bilingual, time-limited Wellness Village event at Central Market, Hong Kong |
| **My ownership** | Product framing, information architecture, evidence rules, UX, full-stack implementation, integrations, Cloudflare delivery and release checks |
| **Human and client authority** | Client confirmations, privacy decisions, factual approvals and final release go/no-go |
| **Delivered experience** | Shared English and Traditional Chinese information architecture across orientation, programme, visit, brand and Guidebook journeys |
| **Core stack** | Next.js, React, TypeScript, Zod, OpenNext, Cloudflare Workers, Queues, R2, Durable Objects, Turnstile and Google Sheets API |
| **Portfolio status** | Post-event curated edition; synthetic demo data and no production credentials are required for local use |

<!-- section:choose-perspective -->
## Choose your perspective

| Perspective | What you will learn | Start here |
| --- | --- | --- |
| **Visitor experience** | How a first-time visitor moves from orientation to an activity, preparation, venue support and continued discovery | [Guided visitor journey](docs/case-study/03-visitor-journey.md) |
| **Client and operations** | How the website works with The Ground and Google Sheets without taking ownership away from either operational system | [The Ground interface](docs/case-study/04-the-ground-event-interface.md) · [Queue-to-Sheets interface](docs/case-study/05-queue-to-sheets-interface.md) |
| **AI-enabled delivery** | How evidence boundaries, bounded Agent briefs and human review turned fragmented inputs into verified implementation | [Evidence-first Agent workflow](docs/case-study/02-evidence-first-agent-workflow.md) |
| **Technical evidence** | How each headline claim maps to selected code, tests, diagrams and decision records | [Evidence index](docs/case-study/08-evidence-index.md) |

<!-- section:problem -->
## The starting problem

There was no single clean specification or product database. The inputs were a 184-page editorial Guidebook, campaign material, public brand records, live listings on The Ground, venue guidance, registration constraints and privacy requirements—each with a different owner, purpose and rate of change.

The product therefore had to solve four connected problems:

1. distinguish verified facts from editorial language, assumptions and missing information;
2. orient visitors who did not already understand the event or website structure;
3. make current sessions discoverable while The Ground retained booking authority; and
4. deliver approved contact interest to the client's existing Google Sheets workflow without exposing Google credentials to the browser or website Worker.

[Read the context, constraints and role](docs/case-study/01-context-and-role.md)

<!-- section:delivered-outcomes -->
## Three delivered proof stories

| Proof story | Delivered outcome | Inspect the evidence |
| --- | --- | --- |
| **Guidebook → 48 profiles and verified destinations** | Visual review established four pillars and 48 exact two-page profiles. All 48 received client-confirmed Instagram destinations; 29 also received independently verified official websites, while 19 retained no website action instead of a guessed link. | [Understand the case study](docs/case-study/02-evidence-first-agent-workflow.md) · [Inspect the decision](docs/decisions/004-guidebook-content-boundaries.md) · [Inspect the sanitised audit](src/content/guidebook-audit.ts) · [Inspect its tests](src/content/guidebook-audit.test.ts) |
| **The Ground → date-aware discovery and canonical booking** | A server-only, privacy-filtered integration separates exact event phase from Hong Kong calendar dates and preserves deterministic discovery. Verified live records hand registration to the canonical The Ground page; the default synthetic demo uses clearly labelled reserved `example.com` destinations. | [Understand the case study](docs/case-study/04-the-ground-event-interface.md) · [Inspect the decision](docs/decisions/001-the-ground-is-the-live-source.md) · [Inspect implementation and tests](src/features/programme/) |
| **Form → Queue → private Worker → Google Sheets** | The public route validates a minimal contract; genuine non-honeypot submissions are queued, while a non-public consumer isolates Google credentials, deduplicates stable submission IDs and appends raw values to the client-owned Sheet. A genuine `202 Accepted` follows awaited Queue acceptance; honeypot decoys deliberately receive the same `202` without enqueueing. Neither path means completed Sheet persistence. | [Understand the case study](docs/case-study/05-queue-to-sheets-interface.md) · [Inspect the decision](docs/decisions/003-queue-before-google-sheets.md) · [Inspect implementation and tests](workers/contact-sheet-consumer/) |

<!-- section:system-overview -->
## System overview

![System overview separating verified editorial content, The Ground event discovery and the privacy-gated Queue-to-Sheets path within the Cloudflare runtime.](docs/diagrams/system-overview.svg)

[View the rendered system overview](docs/diagrams/system-overview.svg) · [Inspect the Mermaid source](docs/diagrams/system-overview.mmd)

The experience brings three evidence paths together without blurring their authority: curated Guidebook content supports discovery; The Ground owns live event and booking records; and approved contact interest moves asynchronously through a private credential boundary. OpenNext runs the Next.js application on Cloudflare Workers. R2 and Durable Objects are Next.js cache and revalidation infrastructure, not lead storage.

<!-- section:visitor-perspective -->
## Visitor perspective: one connected journey

The interface begins with orientation and next actions rather than internal content ownership. A visitor can:

1. understand the event;
2. find an activity and see whether booking is required;
3. review preparation guidance before leaving;
4. find the venue, arrival notes, map and text alternative; and
5. continue into brand stories and the digital Guidebook.

Stable bilingual anchors, persistent mobile navigation, clear external hand-offs and honest empty or unavailable states keep the journey usable without inventing a second schedule.

[View the rendered visitor journey](docs/diagrams/visitor-journey.svg) · [Inspect the Mermaid source](docs/diagrams/visitor-journey.mmd)

<!-- section:client-operations-perspective -->
## Client and operations perspective: improve the hand-offs

**The Ground remains the operational authority in verified live mode.** The website adds orientation, classification and date-aware discovery, then sends each verified live booking action to the canonical provider page. Synthetic demo actions stay on reserved `example.com` destinations and are labelled as examples. If fresh live data cannot be established, the interface uses a valid warm snapshot or shows an honest unavailable state with a deliberate direct platform route.

[View the rendered event interface](docs/diagrams/the-ground-event-interface.svg) · [Inspect the Mermaid source](docs/diagrams/the-ground-event-interface.mmd)

**Google Sheets remains the client-owned operating destination.** The website does not introduce a general-purpose database or CRM for this bounded workflow. Cloudflare Queue separates the visitor response from Google latency, and the private single-writer consumer owns credentials, controlled retries and deduplication.

[View the rendered Queue-to-Sheets sequence](docs/diagrams/queue-to-sheets-sequence.svg) · [Inspect the Mermaid source](docs/diagrams/queue-to-sheets-sequence.mmd)

<!-- section:ai-delivery-perspective -->
## AI-enabled delivery perspective: assistance inside an evidence system

The Agent accelerated the work; it did not own the product judgement.

| Human-owned | Agent-assisted | Acceptance evidence |
| --- | --- | --- |
| Product direction, source authority, UX, architecture, privacy boundaries and release approval | Source inventory, candidate extraction, research organisation, implementation drafts, refactoring, test generation and documentation | Typed contracts, source audits, automated tests, browser and accessibility QA, production builds and read-only release checks |

The public workflow is explicit: **Inventory → Bound claims → Model content → Brief vertical slice → Harden interfaces → Verify outcomes → Curate public evidence.** The example MVP brief is reconstructed, edited and sanitised because the original work evolved through research, client decisions and implementation; it is not presented as a verbatim first prompt.

[Read the complete workflow](docs/agent-workflow/evidence-first-workflow.md) · [Inspect the reconstructed MVP brief](docs/agent-workflow/reconstructed-mvp-brief.md) · [Read the public Agent rules](AGENTS.md)

[View the rendered Guidebook evidence pipeline](docs/diagrams/guidebook-content-pipeline.svg) · [Inspect the Mermaid source](docs/diagrams/guidebook-content-pipeline.mmd)

<!-- section:decisions -->
## Key decisions and trade-offs

| Decision | Why | Deliberate trade-off |
| --- | --- | --- |
| [The Ground owns live schedule and booking authority](docs/decisions/001-the-ground-is-the-live-source.md) | Avoids two conflicting operational records while letting the website improve discovery | The bounded public integration needs explicit limits and an honest fallback when fresh data is unavailable |
| [Use OpenNext on Cloudflare Workers](docs/decisions/002-workers-not-static-pages.md) | Server rendering, API routes, server-only integrations, Queues and revalidation require a Worker runtime | More delivery configuration than a static export |
| [Queue before Google Sheets](docs/decisions/003-queue-before-google-sheets.md) | Isolates Google credentials and absorbs destination latency or temporary failure | Visitor confirmation is asynchronous; monitoring and dead-letter recovery remain operational duties |
| [Keep Guidebook claims editorial](docs/decisions/004-guidebook-content-boundaries.md) | Enables structured bilingual discovery without turning print inclusion into live participation or availability | Every operational claim needs separate current evidence |

<!-- section:capability-evidence -->
## Capability-to-evidence matrix

| Capability | Evidence of ownership and delivery | Inspect |
| --- | --- | --- |
| **Product strategy** | Framed the product around source authority, visitor jobs, client workflow and a proportionate public edition | [Context and role](docs/case-study/01-context-and-role.md) · [Case-study index](docs/case-study/README.md) |
| **UX and accessibility** | Designed one bilingual, mobile-first path with stable anchors, text alternatives, keyboard support and honest failure states | [Visitor journey](docs/case-study/03-visitor-journey.md) · [Guided-home implementation and tests](src/features/home/) |
| **Agent orchestration** | Defined the evidence hierarchy, bounded briefs, review loops and human release authority | [Agent workflow](docs/agent-workflow/evidence-first-workflow.md) · [Public Agent rules](AGENTS.md) · [Reconstructed brief](docs/agent-workflow/reconstructed-mvp-brief.md) |
| **TypeScript and Next.js** | Converted evidence into typed bilingual content and App Router experiences | [Application routes and tests](src/app/) · [Typed content and tests](src/content/) |
| **API and data modelling** | Built bounded runtime schemas, privacy-filtered provider contracts, HKT date logic and deterministic categories | [The Ground integration and tests](src/integrations/the-ground/) · [Programme modelling and tests](src/features/programme/) · [Evidence index](docs/case-study/08-evidence-index.md) |
| **Cloudflare delivery** | Packaged the full-stack Next.js runtime for Workers with R2 caching, Durable Object revalidation and dry-run checks | [Delivery chapter](docs/case-study/06-cloudflare-delivery.md) · [OpenNext configuration](open-next.config.ts) · [Wrangler configuration](wrangler.jsonc) |
| **Privacy** | Gated personal-data processing, isolated Google credentials and excluded payloads from application logs | [Queue-to-Sheets chapter](docs/case-study/05-queue-to-sheets-interface.md) · [Public producer and tests](src/features/interest/) · [Private consumer and tests](workers/contact-sheet-consumer/) |
| **Reliability** | Used bounded fetches, runtime validation, explicit fallbacks, stable IDs, retries, deduplication and release evidence | [Release checklist](docs/agent-workflow/release-checklist.md) · [Integration tests](src/integrations/the-ground/) · [Consumer tests](workers/contact-sheet-consumer/) |
| **Bilingual product delivery** | Kept English and Traditional Chinese routes, documentary media and public documentation structurally aligned | [Application routes and tests](src/app/) · [Visitor journey](docs/case-study/03-visitor-journey.md) · [Media documentation](docs/media/README.md) |

<!-- section:repository-map -->
## Repository map

```text
src/app/                            bilingual routes and public API boundary
src/content/                        typed editorial content and evidence status
src/features/home/                  guided visitor journey
src/features/programme/             date, category, sorting and filter logic
src/features/interest/              form validation and Queue producer
src/integrations/the-ground/        bounded server-only event adapter
workers/contact-sheet-consumer/     private Queue consumer and Sheets adapter
fixtures/demo/                      synthetic events and brands only
docs/case-study/                    eight evidence-backed chapters
docs/agent-workflow/                workflow, reconstructed brief and release gates
docs/decisions/                     architecture decision records
docs/diagrams/                      rendered SVGs and inspectable Mermaid sources
docs/media/                         approved documentary portfolio media
```

Use the [evidence index](docs/case-study/08-evidence-index.md) to move from a public claim to its implementation, tests and limiting decision.

<!-- section:run-locally -->
## Run locally

The reference app defaults to synthetic data. It does not need production credentials, a live provider or an `.env.local` file.

**Synthetic local mode requires no production resources.** It keeps The Ground access and native contact collection disabled and uses only synthetic fixtures.

```sh
npm install
npm run dev
```

Run the complete local application gate with:

```sh
npm run check
```

Build and inspect the neutral Cloudflare Worker configuration without deploying:

```sh
npm run cf:typegen
npm run cf:typegen:check
npm run cf:build
npm run cf:dry-run
npm run cf:preview
```

`cf:dry-run` always rebuilds before running `wrangler deploy --dry-run`; it does not upload or deploy. `cf:preview` passes `wrangler.preview.jsonc` to both the supported OpenNext build and OpenNext preview commands, explicitly builds with the direct revalidation queue, and uses preview's local default without `--remote`. Normal builds retain R2 incremental caching and Durable Object revalidation. The website configuration contains no Google credential or Sheet secret.

A real deployment is future, owner-authorised work. It first requires the R2 cache bucket, revalidation Durable Object migration, contact Queue/consumer/dead-letter Queue, distinct rate-limit namespaces and approved runtime settings described in the [Cloudflare delivery chapter](docs/case-study/06-cloudflare-delivery.md).

Cloudflare currently recommends vinext for greenfield Next.js projects. This portfolio keeps OpenNext to reproduce the evidenced delivered architecture; it is not a blanket recommendation for new projects. Cloudflare Pages remains a historical static alternative, not the delivered runtime.

Inspect the disabled-by-default contact pipeline independently with:

```sh
npm run test -- src/features/interest src/app/api/interest
npm run contact-consumer:typegen
npm run contact-consumer:typegen:check
npm run contact-consumer:test
npm run contact-consumer:typecheck
npm run contact-consumer:dry-run
```

These commands use synthetic `example.com` values and local doubles; they do not call real Cloudflare, Turnstile or Google services. The separate [consumer guide](workers/contact-sheet-consumer/README.md) explains its secret boundary and single-writer trade-off.

Live The Ground access and native interest collection are separate, explicit opt-ins. Secret values remain outside source control, and missing optional configuration fails closed rather than changing the demo default.

The optional live catalogue reads `THE_GROUND_LIVE_ENABLED` and `THE_GROUND_ORGANIZATION_ID` on the server only. Copy [`.env.example`](.env.example) only when testing with an authorised positive numeric organisation identifier; never commit the populated value. If live mode is requested with an invalid or missing identifier, configuration fails instead of silently switching to demo records.

<!-- section:reliability-privacy-accessibility -->
## Reliability, privacy and accessibility

| Area | Evidence-backed controls |
| --- | --- |
| **Reliability** | Bounded upstream pagination, time and byte limits; runtime schemas; explicit warm-snapshot or unavailable states; Queue retry, deduplication and dead-letter handling; staged build and release checks |
| **Privacy** | Feature and configuration gates before request-body processing; strict minimal payloads; server-side Turnstile; Google credentials only in the private consumer; no personal fields in application logs; `RAW` Sheet writes |
| **Accessibility** | Shared bilingual structure; semantic headings and landmarks; keyboard paths; visible focus; touch-target and overflow checks; map text alternative; reduced-motion static media; browser and automated accessibility QA |

[Review the security boundary](SECURITY.md) · [Inspect the public release checklist](docs/agent-workflow/release-checklist.md) · [Read lessons and limitations](docs/case-study/07-lessons-and-limitations.md)

<!-- section:limitations -->
## Deliberate exclusions and limitations

- The live campaign URL is time-limited and may be retired; repository media and the synthetic runnable demo are the durable record.
- The Ground feed is a bounded public integration. This repository documents no long-term partner access or availability guarantee.
- A warm in-memory snapshot covers only a short upstream interruption; it is not a durable cache or reliability commitment.
- Queue delivery and deduplication reduce ordinary retry duplicates but do not create a distributed transaction guarantee. Retention, withdrawal and dead-letter recovery remain human operational responsibilities.
- Google Sheets is suitable for this bounded client workflow, not a general-purpose transactional datastore.
- No unmeasured business, delivery-speed or long-term reliability outcome is claimed.
- The original Guidebook PDF and page archive, client fonts, campaign source assets, production identifiers, credentials, personal data, private correspondence and raw Agent transcripts are excluded.
- No software licence is included; licence selection and any remote publication require separate owner approval.

See the [asset policy](ASSET_POLICY.md), [security policy](SECURITY.md) and [full limitations chapter](docs/case-study/07-lessons-and-limitations.md).

<!-- section:contact -->
## Contact

If you need to turn fragmented source material, live operational data and real-world constraints into a reliable product experience, connect with me on [LinkedIn](https://www.linkedin.com/in/jackyng-tf/).
