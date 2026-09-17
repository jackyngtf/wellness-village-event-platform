# Context, constraints and role

## Product context

Wellness Village was a bilingual, time-limited event at Central Market in Hong Kong. The website had to orient visitors before and during the event while its inputs continued to evolve.

The starting material was not one clean product database. It included a 184-page editorial Guidebook, campaign artwork, venue information, public brand records, The Ground event listings, registration rules and privacy requirements. Those sources had different owners, purposes, authority and rates of change. The central product problem was therefore not simply to publish pages; it was to decide what the interface could say, which system remained authoritative and what should happen when evidence was absent or stale.

## My ownership

I owned the translation from that ambiguity into a working product and its technical delivery:

- product framing and information architecture;
- the evidence hierarchy and rules for unsupported claims;
- the mobile-first visitor journey and bilingual UX;
- full-stack implementation, typed content and third-party integrations;
- the Cloudflare Workers architecture, deployment work and release checks;
- privacy-gated visitor-interest delivery to the client's existing Google Sheets workflow; and
- Agent briefs, review loops, test strategy and verification evidence.

The Agent accelerated source inventory, candidate extraction, research organisation, implementation drafts, refactoring, tests and documentation. I remained accountable for product and technical judgement. Client confirmations and approvals, privacy decisions and the final release go/no-go remained human-owned; the Agent never had approval or release authority.

## Constraints that shaped the product

- Visitors could arrive with no knowledge of the event or website structure.
- Live session data and registration remained authoritative on an external platform.
- Editorial copy could not be promoted into unsupported operational facts.
- The client did not need a new database or CRM solely for a small lead-capture workflow.
- English and Traditional Chinese routes needed the same information architecture rather than two unrelated sites.
- Credentials, personal data, private correspondence and unlicensed source media could not become part of a public portfolio repository.
- The public portfolio later needed to survive without the event URL, production credentials or redistributable source media.

## Evidence standard

Delivery claims are tied to observable behaviour: coherent bilingual routes, a guided mobile journey, typed and bounded integrations, honest failure states, privacy gates, successful production builds, browser QA and release evidence. This case study does not convert those checks into unmeasured conversion, productivity, reliability or business-impact claims.

## Related evidence

- Implementation: [bilingual application routes](../../src/app/) and [typed content](../../src/content/)
- Tests: [route checks](../../src/app/) and [content-contract checks](../../src/content/)
- Diagram: [system overview SVG](../diagrams/system-overview.svg) and [Mermaid source](../diagrams/system-overview.mmd)
- Decision record: [Guidebook content boundaries](../decisions/004-guidebook-content-boundaries.md) and [Workers runtime](../decisions/002-workers-not-static-pages.md)
