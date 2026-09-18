<!-- section:hero -->
# Wellness Village Event Platform

[**English**](README.md) · [繁體中文](README.zh-Hant.md)

![MacBook and iPhone views of the English Wellness Village experience moving through event orientation, programme discovery, brand stories and the contact journey.](docs/media/responsive-scroll-walkthrough.gif)

[View the static, reduced-motion cover](docs/media/portfolio-hero.png) · [Download the H.264 walkthrough](docs/media/responsive-scroll-walkthrough.mp4)

**An evidence-first bilingual event platform that transformed a 184-page Guidebook, verified brand research, live booking data and privacy requirements into a production visitor experience.**

I was the sole developer and led the product direction, evidence model, bilingual UX, full-stack implementation, Cloudflare delivery and release operations. The client supplied the campaign assets, Guidebook, design guide and factual approvals. Agent assistance accelerated research organisation, implementation and verification; product judgement, client facts, privacy decisions and release authority remained human-owned.

> **Portfolio edition.** This is a curated, sanitised case study and runnable reference implementation, intentionally separate from the private production repository and history. It excludes credentials, personal data, private handover material and source assets that cannot be redistributed. It is **source-available, not open-source**: no permission to copy, modify, redistribute or commercially deploy the original code is granted. See the [notice](NOTICE.md) and [asset policy](ASSET_POLICY.md).

[Visit the live campaign site](https://www.wellnessvillagehk.com/) — this time-limited URL may later be retired. The documentary media and runnable demo in this repository are the durable record.

[Open the case-study index](docs/case-study/README.md) · [Trace headline claims in the evidence index](docs/case-study/10-evidence-index.md)

<!-- section:at-a-glance -->
## At a glance

| | |
| --- | --- |
| **Context** | A bilingual, time-limited Wellness Village event at Central Market, Hong Kong |
| **Public event scale** | 12 days across three floors, with 50+ brands and 30+ workshops and experiences reported by ELLE Hong Kong |
| **My ownership** | Sole developer: product framing, information architecture, evidence rules, UX, asset preparation, public-source research, full-stack implementation, integrations, Cloudflare delivery and release checks |
| **Human and client authority** | Client confirmations, privacy decisions, factual approvals and final release go/no-go |
| **Delivery cadence** | First reviewable home-server MVP on 5 August; working production URL shared on 20 August, before the 21 August internal target; public event opened on 30 August |
| **Delivered experience** | Shared English and Traditional Chinese information architecture across orientation, programme, visit, brand and Guidebook journeys |
| **Core stack** | Next.js, React, TypeScript, Zod, OpenNext, Cloudflare Workers, Queues, R2, Durable Objects, Turnstile and Google Sheets API |
| **Production evidence** | 108,443 edge requests, 4,322 HTML page views and 4.34 GB delivered in the event window; cost and metric boundaries are documented below |
| **Search evidence** | A verified Domain property recorded 112 Web Search clicks from 362 impressions (30.9% CTR; average position 3.5) in the PT date range aligned to the 12 event calendar dates |
| **Portfolio status** | Post-event curated edition; synthetic demo data and no production credentials are required for local use |
| **Reuse status** | Source-available for review; no software licence or reuse permission is granted |

<!-- section:event-context -->
## A campaign-sized delivery, not a microsite exercise

[ELLE Hong Kong's event introduction](https://www.elle.com.hk/life/wellness-village-elle-hong-kong-issmen) records a 12-day Wellness Village at Central Market from 30 August to 10 September 2026, spanning G/F, 1/F and 2/F, with more than 50 selected brands, more than 30 workshops and experiences, and free market entry. ELLE Hong Kong and IŚSMEN presented the event.

That public scale explains why content authority, current schedules, bilingual orientation, privacy and release operations mattered. It does not prove attendance, conversion, commercial return or that the website caused the event's outcome. [Read the full context and role boundary](docs/case-study/01-context-and-role.md).

<!-- section:delivery-timeline -->
## From brief to live operation

On 5 August, the project group confirmed that I would lead and deliver the website, with a 21 August internal launch target. Before the production domain had been purchased, I deployed the first reviewable MVP from my home server later that evening. That preview turned the brief into a concrete product conversation while the client remained focused on organising the event.

From 12 to 19 August, the review loop incorporated the current 184-page Guidebook, supplied design material, The Ground event acquisition, formal written Chinese and UX feedback, brand-source verification and production-domain preparation. The domain was registered on 19 August. A working public production URL was shared on 20 August—one day before the internal target—while smaller corrections and operational hardening continued before the event opened on 30 August.

![Delivery evolution from the formal brief and first home-server MVP through production release, event operation and post-event evidence capture.](docs/diagrams/delivery-evolution.svg)

The same-day MVP was a **reviewable vertical slice**, not a one-prompt production claim. [Read the full delivery chronology](docs/case-study/delivery-timeline.md) · [Inspect its sanitised evidence boundary](docs/evidence/delivery-timeline/) · [View the Traditional Chinese diagram](docs/diagrams/delivery-evolution.zh-Hant.svg)

<!-- section:choose-perspective -->
## Choose your perspective

| Perspective | What you will learn | Start here |
| --- | --- | --- |
| **Delivery and ownership** | How a sole developer moved from an ambiguous brief and temporary home-server preview to an on-time public release and event support | [From brief to live operation](docs/case-study/delivery-timeline.md) |
| **Visitor experience** | How a first-time visitor moves from orientation to an activity, preparation, venue support and continued discovery | [Guided visitor journey](docs/case-study/03-visitor-journey.md) |
| **Client and operations** | How the website works with The Ground and Google Sheets without taking ownership away from either operational system | [The Ground interface](docs/case-study/04-the-ground-event-interface.md) · [Queue-to-Sheets interface](docs/case-study/05-queue-to-sheets-interface.md) |
| **AI-enabled delivery** | How evidence boundaries, bounded Agent briefs and human review turned fragmented inputs into verified implementation | [Evidence-first Agent workflow](docs/case-study/02-evidence-first-agent-workflow.md) |
| **Production and economics** | What the event-window traffic, Cloudflare billing boundary, direct domain cost and search evidence actually establish | [Production economics](docs/case-study/07-production-economics-and-observability.md) · [Search discoverability](docs/case-study/08-search-discoverability.md) |
| **Technical evidence** | How each headline claim maps to selected code, tests, diagrams and decision records | [Evidence index](docs/case-study/10-evidence-index.md) |

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

<!-- section:production-evidence -->
## Production evidence: workload and cost control

Authorised read-only Cloudflare analytics captured a bounded event window rather than a vanity total:

| Observed layer | Event-window result | Interpretation |
| --- | ---: | --- |
| Edge requests | 108,443 | Documents, assets, crawlers and threats—not visitors |
| HTML page views | 4,322 | Successful HTML responses—not distinct people |
| Response bytes | 4.34 GB | Traffic delivered at the edge |
| Cached response bytes | 78.5% | Most delivered bytes were served from cache |
| Worker invocations | approximately 35,600 | Requests reaching the OpenNext runtime; adaptive data may be sampled |

The complete **12 August–11 September 2026 Cloudflare account billing period** showed **US$0.00 in usage charges**, with all displayed usage inside included quantities. That is an account-level overage result, not a claim that the project or account cost nothing: Workers Paid was active, the account can contain other services, and engineering labour and third-party systems sit outside that dashboard. The directly attributable domain registration was **US$11.08 for one year through Porkbun**; renewal pricing is not claimed.

[Read the production economics chapter](docs/case-study/07-production-economics-and-observability.md) · [Inspect the aggregate event record](docs/evidence/production-metrics/event-window-aggregates.json) · [Inspect the billing and domain record](docs/evidence/production-metrics/billing-and-domain-summary.json) · [View the measurement-boundary diagram](docs/diagrams/production-measurement-boundaries.svg)

<!-- section:search-discoverability -->
## Search discoverability: verified outcomes, bounded interpretation

A read-only capture on 18 September 2026 confirmed a production `robots.txt` that allowed public routes, excluded `/api/` and identified the sitemap. The sitemap exposed 12 locale URLs—six routes in English and Traditional Chinese—with `en`, `zh-HK` and `x-default` alternates.

The authorised Chrome session also exposed the pre-existing, verified Google Search Console Domain property. For **30 August–10 September 2026 inclusive in Search Console's Pacific Time calendar**, Web Search recorded **112 clicks from 362 impressions**, a displayed **30.9% CTR** and **3.5 average position**. The dates mirror the 12 Hong Kong event calendar dates; they are not an exact HKT-hour window.

The submitted sitemap was last read successfully on 14 September and exposed 12 URLs. Google's same-day sitemap-scoped index snapshot showed **6 indexed and 6 not indexed**. Core Web Vitals had insufficient 90-day field data, so no real-user performance score is claimed.

[Read the discoverability chapter](docs/case-study/08-search-discoverability.md) · [Inspect the sanitised Search Console record](docs/evidence/search-discoverability/search-console-summary.json) · [Inspect the retained endpoint snapshots](docs/evidence/search-discoverability/)

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
| **End-to-end delivery** | Used a same-day home-server vertical slice to start review, then independently carried the product through evidence gathering, client feedback, domain transition, production release and event support | [Delivery timeline](docs/case-study/delivery-timeline.md) · [Sanitised chronology](docs/evidence/delivery-timeline/) |
| **Product strategy** | Framed the product around source authority, visitor jobs, client workflow and a proportionate public edition | [Context and role](docs/case-study/01-context-and-role.md) · [Case-study index](docs/case-study/README.md) |
| **UX and accessibility** | Designed one bilingual, mobile-first path with stable anchors, text alternatives, keyboard support and honest failure states | [Visitor journey](docs/case-study/03-visitor-journey.md) · [Guided-home implementation and tests](src/features/home/) |
| **Agent orchestration** | Defined the evidence hierarchy, bounded briefs, review loops and human release authority | [Agent workflow](docs/agent-workflow/evidence-first-workflow.md) · [Public Agent rules](AGENTS.md) · [Reconstructed brief](docs/agent-workflow/reconstructed-mvp-brief.md) |
| **TypeScript and Next.js** | Converted evidence into typed bilingual content and App Router experiences | [Application routes and tests](src/app/) · [Typed content and tests](src/content/) |
| **API and data modelling** | Built bounded runtime schemas, privacy-filtered provider contracts, HKT date logic and deterministic categories | [The Ground integration and tests](src/integrations/the-ground/) · [Programme modelling and tests](src/features/programme/) · [Evidence index](docs/case-study/10-evidence-index.md) |
| **Cloudflare delivery** | Packaged the full-stack Next.js runtime for Workers with R2 caching, Durable Object revalidation and dry-run checks | [Delivery chapter](docs/case-study/06-cloudflare-delivery.md) · [OpenNext configuration](open-next.config.ts) · [Wrangler configuration](wrangler.jsonc) |
| **Observability and cost control** | Separated edge traffic, runtime usage, verified search outcomes, billing-cycle overage, direct domain spend and public rate cards without turning requests into visitors or shared-account charges into project cost | [Production economics](docs/case-study/07-production-economics-and-observability.md) · [Sanitised evidence](docs/evidence/) · [Measurement diagram](docs/diagrams/production-measurement-boundaries.svg) |
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
docs/case-study/                    evidence-backed product, delivery and technical chapters
docs/agent-workflow/                workflow, reconstructed brief and release gates
docs/decisions/                     architecture decision records
docs/diagrams/                      rendered SVGs and inspectable Mermaid sources
docs/evidence/                      sanitised delivery, production and discovery records
docs/media/                         approved documentary portfolio media
```

Use the [evidence index](docs/case-study/10-evidence-index.md) to move from a public claim to its implementation, tests and limiting decision.

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

[Review the security boundary](SECURITY.md) · [Inspect the public release checklist](docs/agent-workflow/release-checklist.md) · [Read lessons and limitations](docs/case-study/09-lessons-and-limitations.md)

<!-- section:limitations -->
## Deliberate exclusions and limitations

- The live campaign URL is time-limited and may be retired; repository media and the synthetic runnable demo are the durable record.
- The Ground feed is a bounded public integration. This repository documents no long-term partner access or availability guarantee.
- A warm in-memory snapshot covers only a short upstream interruption; it is not a durable cache or reliability commitment.
- Queue delivery and deduplication reduce ordinary retry duplicates but do not create a distributed transaction guarantee. Retention, withdrawal and dead-letter recovery remain human operational responsibilities.
- Google Sheets is suitable for this bounded client workflow, not a general-purpose transactional datastore.
- Edge requests, page views and Worker invocations measure different layers and are not visitor or attendance counts. The Cloudflare billing record is account-level, while the Porkbun registration is a direct project cost.
- Search Console performance dates use PT. The 30 August–10 September selection mirrors the event calendar dates but is not an exact HKT-hour window; the 6-of-12 indexing result is a 14 September snapshot, not a guarantee of permanent coverage.
- Search Console had insufficient 90-day Core Web Vitals field data for mobile and desktop, so no real-user performance result is claimed.
- No unmeasured business, delivery-speed or long-term reliability outcome is claimed.
- The original Guidebook PDF and page archive, client fonts, campaign source assets, production identifiers, credentials, personal data, private correspondence and raw Agent transcripts are excluded.
- This repository is source-available for portfolio review but deliberately carries no software licence. Public visibility grants no permission to copy, modify, redistribute or commercially deploy its original code.

See the [notice](NOTICE.md), [asset policy](ASSET_POLICY.md), [security policy](SECURITY.md) and [full limitations chapter](docs/case-study/09-lessons-and-limitations.md).

<!-- section:contact -->
## Contact

If you need to turn fragmented source material, live operational data and real-world constraints into a reliable product experience, connect with me on [LinkedIn](https://www.linkedin.com/in/jackyng-tf/).
