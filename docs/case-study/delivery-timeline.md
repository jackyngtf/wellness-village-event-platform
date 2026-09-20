# Delivery record

[**English**](delivery-timeline.md) · [繁體中文](delivery-timeline.zh-Hant.md)

On 5 August, the project had a direction and an internal target but no production domain. Instead of waiting for every detail, I put a small working version on my home server that day. The client could react to a real page while I spent the following two weeks completing the content, integrations, UX changes, privacy checks and production setup.

## Delivery timeline

| Date | Milestone | Why it mattered |
| --- | --- | --- |
| **5 August 2026** | The project group confirmed that I would develop the site and set an internal 21 August target. I put the first reviewable MVP on my home server later that day, before the production domain had been purchased. | The client could respond to a real interface instead of an abstract brief. It was still an early slice, not the final site. |
| **12–14 August** | I added the current 184-page Guidebook and design material, demonstrated the programme route with The Ground data and worked through feedback on the Guidebook reader, written Chinese, spacing, navigation and brand presentation. | The review moved onto real content and screens. I returned to the client only for facts or decisions I could not confirm myself. |
| **19 August** | The production domain was registered while I continued checking brand destinations and content. | The first review did not have to wait for domain purchase and production setup. |
| **20 August** | I shared a working production URL. The site was largely accepted, with a small change still outstanding. | The production URL was available one day before the 21 August internal target. Smaller changes continued afterwards. |
| **21–26 August** | I continued with search setup, copy and image corrections, venue-map details, contact handling and launch checks. | Sharing the URL was a release milestone, not the end of the work. |
| **27 August** | The site briefly returned Cloudflare Error 1102 after reaching a Worker resource limit. I moved the shared account to Workers Paid, reduced CPU-heavy request paths and checked the runtime again. | The incident established a more suitable paid baseline and prompted application work before the public event. It would be inaccurate to credit either change on its own. |
| **28–29 August** | I continued runtime hardening, visitor guidance and final launch corrections. | The last changes were completed before the event opened on 30 August. |
| **30 August–10 September** | The site was in use during the public event at Central Market. | The project moved into event support. |
| **18 September** | I reviewed Cloudflare, billing and Search Console through authorised read-only access while preparing this portfolio. | This supplied dated traffic, cost and search figures instead of later estimates. |

## Delivery evolution

![Delivery timeline from the first client brief and a home-server MVP to production release, event operation and post-event evidence capture.](../diagrams/delivery-evolution.svg)

[Inspect the Mermaid source](../diagrams/delivery-evolution.mmd) · [Read the sanitised timeline evidence note](../evidence/delivery-timeline/)

## Why the home-server preview was useful

The temporary home-server environment was for client review, not the final hosting setup. It let us discuss the first experience before domain purchase and production configuration were complete. The preview itself is not the lasting record; the screenshots, diagrams and runnable demo in this repository fill that role.

The sequencing separated two questions that are often confused:

1. **Is the product direction concrete enough to review?** The home-server MVP answered this first.
2. **Is the system ready for a public event?** The following integration, privacy, reliability, deployment and release work answered this separately.

## Who handled what

The client supplied approved campaign images, the Guidebook PDF, the design guide and factual decisions. I was the sole developer: I shaped the product, prepared print-oriented assets for the web, researched public brand sources, built the bilingual interface and integrations, deployed the system and supported release operations. I escalated ambiguous facts instead of turning routine research into client work, allowing the organising team to stay focused on the event.

Agent assistance helped with source lists, research organisation, code drafts, refactoring, tests and documentation. I reviewed the output and retained the product, privacy and release decisions.

## Source and limits

- The same-day MVP establishes speed to a reviewable vertical slice, not completion of the production platform.
- The 20 August milestone establishes that a working public release preceded the stated 21 August target; minor changes continued afterwards.
- The 27 August record establishes a brief Error 1102 incident, a move to Workers Paid and CPU-reduction work. It does not isolate which change contributed what share of the recovery.
- The chronology does not establish hours worked, productivity uplift, conversion, attendance, revenue, SLA performance or business causation.
- Private project correspondence supports several milestones but is excluded from this repository. No chat transcript, participant identity, contact detail, voice note or private link is reproduced.

## Related material

- Context: [role and source boundaries](01-context-and-role.md)
- Agent use: [Guidebook and Agent workflow](02-guidebook-and-agent-workflow.md)
- Production: [traffic and cost](07-production-economics-and-observability.md) and [Search Console](08-search-discoverability.md)
- Public timeline note: [cleaned-up delivery chronology](../evidence/delivery-timeline/)
