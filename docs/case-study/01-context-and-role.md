# A deadline, scattered inputs and one developer

[**English**](01-context-and-role.md) · [繁體中文](01-context-and-role.zh-Hant.md)

On 5 August, Wellness Village had an event concept, campaign material and an internal target of 21 August, but no production domain or finished product specification. I was asked to turn the available material into the website and was the sole developer from the first preview through launch support.

## The starting point

The visitor-facing information was spread across several places. Brand stories lived in a 184-page print Guidebook. Current activity times and registration lived on The Ground. The client also supplied campaign artwork, a design guide, venue material and factual clarifications. Public brand pages could help with link research, but they could not confirm participation in the event.

That meant the first job was not choosing a framework. It was deciding which source should answer each visitor question, and what the website should say when current information could not be confirmed.

[ELLE Hong Kong's event introduction](https://www.elle.com.hk/life/wellness-village-elle-hong-kong-issmen) describes the public setting: a 12-day event presented by ELLE Hong Kong and IŚSMEN across three floors of Central Market, with more than 50 brands and more than 30 workshops and experiences.

## What I owned

| Contributor | Responsibility |
| --- | --- |
| **Client and organising team** | Supplied approved campaign images, the Guidebook, design material, event-operation details, factual clarifications and final approvals while organising the event itself. |
| **Jacky Ng — sole developer** | Planned the visitor journey, prepared print material for the web, researched public sources, structured the bilingual content, built the application and integrations, set up Cloudflare and supported launch. |
| **Agent assistance** | Helped organise source material and candidate research, draft or refactor code, write tests and check documentation. I reviewed the output before using it. |

I made the product, architecture and release decisions. The client retained factual and privacy approval. The Agent had no independent approval or deployment authority.

## Starting with a page the client could use

Rather than wait for the domain and every detail, I put a small vertical slice on my home server later on 5 August. It was not the finished site; it was a real page the client could open, scroll and comment on. That made questions about hierarchy, tone and navigation easier to discuss than an abstract brief.

Over the following two weeks I replaced the early content with the current Guidebook and design material, added the bilingual routes and external integrations, and worked through UX feedback. I researched routine public information myself and returned to the organising team only when a fact was unclear or required their approval, so their attention could remain on the event.

## What reached launch

- A matching English and Traditional Chinese information architecture;
- a guided path from event orientation to programme, preparation and venue planning;
- 48 searchable Guidebook profiles under four themes;
- current programme browsing backed by The Ground, with registration remaining there;
- a contact path from the public form through Cloudflare Queue to Google Sheets; and
- a full-stack Cloudflare Workers deployment with release checks and event support.

The production URL was shared on 20 August, one day before the internal target. Smaller corrections and launch work continued before the event opened on 30 August, including map updates, search setup, privacy checks and runtime hardening.

After the event, I prepared screenshots, walkthroughs and this synthetic public reconstruction so the work can still be explored if the campaign URL is retired.

## Source note

The dated sequence is summarised in the [delivery record](delivery-timeline.md). This repository can show the resulting routes, integration boundaries, tests and cleaned-up production figures. It does not contain private messages, licensed source assets or visitor records, and it does not turn traffic into a claim about attendance, conversion or commercial return.

Next: [how I turned the Guidebook into usable content](02-guidebook-and-agent-workflow.md) · [system overview](../diagrams/system-overview.svg) · [architecture decisions](../decisions/README.md)
