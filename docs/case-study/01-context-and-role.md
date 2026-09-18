# Context and my role

## What the project needed

Wellness Village was a bilingual, time-limited event at Central Market in Hong Kong. The website needed to help people understand the event before visiting and find useful information while they were there.

The material did not arrive as one product database. It included a 184-page Guidebook, campaign artwork, venue information, public brand pages, The Ground event listings, registration details and privacy requirements. Each source covered a different part of the project. The main product decision was therefore practical: decide which source to use for each type of information, and show a clear unavailable state when current information could not be confirmed.

## Event background

[ELLE Hong Kong's event introduction](https://www.elle.com.hk/life/wellness-village-elle-hong-kong-issmen) describes Wellness Village at Central Market from 30 August to 10 September 2026. It reports a 12-day event across G/F, 1/F and 2/F, with more than 50 local and international brands, more than 30 workshops and experiences, and free entry to the market area. ELLE Hong Kong and IŚSMEN presented the event.

Those figures explain the scale and setting. They do not tell us how many people attended, how many registered through the website or what commercial return the event achieved.

## What I handled

I was the sole developer. My work included:

- planning the page structure and visitor journey;
- deciding how to handle missing or unconfirmed information;
- designing the mobile and bilingual experience;
- preparing supplied print material for the web, including removing print-production marks;
- checking public brand links and asking the client only when a fact was unclear or required their approval;
- building the Next.js application and third-party integrations;
- setting up the Cloudflare Workers deployment and release checks;
- connecting the contact form to the client's Google Sheet without exposing Google credentials; and
- using an Agent for selected research, coding and testing tasks, then reviewing the output.

The client made the final factual and privacy approvals. I made the product and technical decisions and handled the release. The Agent had no approval or release access.

## Who did what

| Contributor | What they handled |
| --- | --- |
| **Client and organising team** | Supplied approved campaign images, the Guidebook, brand and design material, event-operation details, factual clarifications and final approvals. Their main focus remained organising the event. |
| **Jacky Ng — sole developer** | Researched public information, prepared web assets and structured content, designed the visitor journey, built the application and integrations, deployed it and supported the launch. |
| **Agent assistance** | Helped organise source material and candidate research, draft and refactor code, write tests and check documentation. I reviewed the output before it was used. |

This arrangement meant the organising team did not need to answer routine research or implementation questions. I only returned to them for facts that were unclear or required client approval.

## Constraints that affected the design

- Some visitors would arrive without knowing the event or the website structure.
- Brand profiles were fixed content from the Guidebook; programme times and registration came from The Ground.
- The client did not need a new database or CRM for a small contact form.
- English and Traditional Chinese needed the same page structure.
- Credentials, personal data, private messages and licensed source material could not be included in the public portfolio.
- The public version needed to remain useful if the campaign domain was later retired.
- The first client review had to begin before the production domain was purchased, so I used a temporary home-server preview.

## What the records show

The repository can show the bilingual routes, programme and contact integrations, failure states, tests, builds, browser checks and dated production figures. It cannot show a measured increase in conversion, productivity, long-term reliability or business return because those comparisons were not collected.

## Related material

- Implementation: [bilingual application routes](../../src/app/) and [content modules](../../src/content/)
- Tests: [route checks](../../src/app/) and [content checks](../../src/content/)
- Diagram: [system overview](../diagrams/system-overview.svg) and [Mermaid source](../diagrams/system-overview.mmd)
- Delivery: [from brief to launch](delivery-timeline.md) and the [cleaned-up timeline note](../evidence/delivery-timeline/)
- Decisions: [Guidebook content](../decisions/004-guidebook-content-boundaries.md) and [Cloudflare runtime](../decisions/002-workers-not-static-pages.md)
