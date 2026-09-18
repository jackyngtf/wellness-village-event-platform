# From brief to live operation

The delivery strategy was to make the product reviewable before every production dependency was ready, then use real evidence and client feedback to harden it for the event. The result was not a one-prompt build: it was a rapid vertical slice followed by two weeks of content, integration, UX, privacy and release work.

## A bounded delivery timeline

| Date | Milestone | What it demonstrates |
| --- | --- | --- |
| **5 August 2026** | The project group confirmed sole development responsibility and an internal 21 August launch target. A first reviewable MVP was deployed from a home server later that evening, before a production domain had been purchased. | Ambiguous requirements were turned into a concrete interface quickly enough for useful client review. The preview was a vertical slice, not the final production system. |
| **12–14 August** | The current 184-page Guidebook and design material entered the review loop. The home-server preview demonstrated the programme route with The Ground event acquisition, followed by Guidebook-reader, formal written Chinese, spacing, navigation and brand-treatment feedback. | Real sources and observable screens replaced assumptions; client clarification was reserved for facts and decisions that could not be responsibly inferred. |
| **19 August** | The production domain was registered and the content evidence pass continued, including the brand-destination audit. | Infrastructure procurement and content verification were completed after the review loop had already begun, rather than blocking the first product conversation. |
| **20 August** | A working production URL was shared for review. The client indicated that the site was substantially accepted while a small change remained. | The public release was available one day before the 21 August internal target. This is an on-time release claim, not a claim that every later refinement had stopped. |
| **21–29 August** | Search discovery, copy and image corrections, venue-map details, contact handling and operational hardening continued before opening day. | Release was treated as an operational transition, not the end of product work. |
| **30 August–10 September** | The site supported the public event window at Central Market. | The product moved from delivery into time-bound event operation and support. |
| **18 September** | Post-event Cloudflare, billing and Search Console evidence was captured through authorised read-only access for this portfolio edition. | Workload, cost position and discoverability could be reported with explicit measurement boundaries rather than retrospective estimates. |

## Delivery evolution

![Delivery timeline from the first client brief and a home-server MVP to production release, event operation and post-event evidence capture.](../diagrams/delivery-evolution.svg)

[Inspect the Mermaid source](../diagrams/delivery-evolution.mmd) · [Read the sanitised timeline evidence note](../evidence/delivery-timeline/)

## Why the home-server stage mattered

The temporary `wvillage.nulltf.dev` environment was a client-review surface, not the production architecture. It allowed the first experience to be discussed before domain procurement and production configuration were complete. The historical preview URL is not treated as durable portfolio evidence; the repository's documentary media, diagrams and runnable synthetic demo preserve the work after that environment or the campaign URL becomes unavailable.

The sequencing separated two questions that are often confused:

1. **Is the product direction concrete enough to review?** The home-server MVP answered this first.
2. **Is the system ready for a public event?** The following integration, privacy, reliability, deployment and release work answered this separately.

## Collaboration model

The client supplied approved campaign images, the Guidebook PDF, the design guide and factual decisions. I was the sole developer: I shaped the product, prepared print-oriented assets for the web, researched public brand sources, built the bilingual interface and integrations, deployed the system and supported release operations. I escalated ambiguous facts instead of turning routine research into client work, allowing the organising team to stay focused on the event.

Agent assistance accelerated source inventory, research organisation, implementation drafts, refactoring, tests and documentation. It did not own client facts, product judgement, privacy decisions or release authority.

## Claim boundaries

- The same-day MVP establishes speed to a reviewable vertical slice, not completion of the production platform.
- The 20 August milestone establishes that a working public release preceded the stated 21 August target; minor changes continued afterwards.
- The chronology does not establish hours worked, productivity uplift, conversion, attendance, revenue, SLA performance or business causation.
- Private project correspondence supports several milestones but is excluded from this repository. No chat transcript, participant identity, contact detail, voice note or private link is reproduced.

## Related evidence

- Context: [role and source boundaries](01-context-and-role.md)
- Agent method: [evidence-first Agent workflow](02-evidence-first-agent-workflow.md)
- Production evidence: [economics and observability](07-production-economics-and-observability.md) and [search discoverability](08-search-discoverability.md)
- Public evidence note: [sanitised delivery chronology](../evidence/delivery-timeline/)
