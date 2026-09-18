# Running the site on Cloudflare

## Why I used Workers

The production site is a Next.js application packaged by OpenNext and run on Cloudflare Workers. A static Pages-only deployment would not cover the server-rendered routes, API routes, server-side integrations, Queue binding and cache revalidation used by this project.

![System overview showing the three data paths and the Cloudflare runtime.](../diagrams/system-overview.svg)

## What each part does

- OpenNext adapts the Next.js request, route and asset model to the Worker runtime.
- Static assets are served as deployment assets.
- R2 stores the Next.js incremental cache.
- A Durable Object coordinates cache revalidation across Worker isolates.
- The server-only The Ground adapter acquires and normalises public event data.
- The website Worker produces approved contact messages to a Cloudflare Queue.
- A separate private consumer Worker performs Google OAuth, deduplication and Sheet appends.

R2 and the Durable Object support the application cache. They do not store contact submissions. Personal data follows a separate website Worker → Queue → private consumer → Google Sheets path, and Google credentials exist only in the consumer Worker.

The public edition removes account-specific identifiers, defaults to synthetic fixtures and keeps live integrations opt-in.

## Configuration in this public repository

The checked-in configuration shows the same arrangement without including production account details:

- [`open-next.config.ts`](../../open-next.config.ts) selects the R2 incremental-cache override and OpenNext's supported Durable Object queue override for normal builds.
- [`wrangler.jsonc`](../../wrangler.jsonc) declares static assets, the Worker self-reference, R2 cache, `DOQueueHandler`, the neutral contact Queue producer and two example rate-limit namespaces. Both optional live integrations remain off.
- [`wrangler.preview.jsonc`](../../wrangler.preview.jsonc) is for local preview. `npm run cf:preview` passes that file to the OpenNext build and preview commands, sets `OPEN_NEXT_LOCAL_PREVIEW=true` and uses the local default without `--remote`. The preview file has no contact Queue, rate-limit or revalidation Durable Object binding.
- [`worker-configuration.d.ts`](../../worker-configuration.d.ts) is reproducibly generated from the website config. The hand-written optional contact Queue and rate-limiter contracts remain at the application boundary so a missing binding continues to fail closed without an unsafe cast.

Synthetic local mode requires no production resources. It uses synthetic content, disabled integrations and Wrangler's local binding implementations. `npm run cf:build` and `npm run cf:dry-run` assemble and validate a neutral bundle; a successful dry run does not create resources, upload a version or deploy a Worker.

Before a real deployment, the target account needs an R2 cache bucket; the contact Queue, private consumer and dead-letter Queue; separate rate-limit namespace IDs; the Worker self-reference binding; and the `DOQueueHandler` migration. The hostname, consent version, Turnstile secret and optional The Ground organisation ID also need to be configured before the live features are enabled. Google credentials and Sheet settings belong only to the private consumer Worker.

## Current framework guidance

Cloudflare currently recommends [vinext for new Next.js applications](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) and keeps an [OpenNext guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) for existing applications. This portfolio keeps OpenNext because that is what the delivered site used. It is not a general recommendation for a new project.

## How I released it

I used several checks because no single green command covers the whole release:

| Stage | What it establishes |
| --- | --- |
| Inspect source, diff and configuration | The intended code and binding boundary are the ones under review |
| Lint, type checks and focused tests | Static rules and tested behavioural contracts pass |
| Next.js production build and OpenNext bundle | The application can be assembled for the target runtime |
| Wrangler dry run | The Worker bundle and declared configuration can be prepared without deploying |
| Local workerd preview | The built Worker can serve representative routes with preview bindings |
| Human-approved deploy | The reviewed bundle is released through the supported deployment path |
| Read-only production smoke checks | The deployed Worker and key visitor routes respond after release |

Local preview deliberately uses a direct revalidation queue because a local Worker cannot call its own internal Durable Object in the same way as production. Production retains R2-backed incremental caching and Durable Object coordination across isolates.

Together, these stages cover buildability, configuration and the routes observed after release. They do not establish an SLA, conversion result or future availability of an external service. I still made the final release decision.

## Where Cloudflare Pages fits

Cloudflare Pages is useful for static sites, but it was not the production runtime for this project. The delivered application ran on Workers because it needed server-side code and Queue integration.

The separate [traffic and cost chapter](07-production-economics-and-observability.md) connects this choice to event-window traffic, cache delivery, the account billing period and the domain cost. It also explains why a zero usage charge is not the same as saying the project cost nothing.

## Related code and notes

- Implementation: [OpenNext configuration](../../open-next.config.ts), [website Worker configuration](../../wrangler.jsonc) and [private consumer](../../workers/contact-sheet-consumer/)
- Tests: [Cloudflare configuration-contract checks](../../tests/cloudflare-config.test.ts) and [consumer configuration/runtime checks](../../workers/contact-sheet-consumer/)
- Diagram: [system overview SVG](../diagrams/system-overview.svg) and [Mermaid source](../diagrams/system-overview.mmd)
- Decision record: [Use OpenNext on Cloudflare Workers](../decisions/002-workers-not-static-pages.md) and [release checklist](../agent-workflow/release-checklist.md)
- Operations: [production economics and observability](07-production-economics-and-observability.md) and [sanitised metrics](../evidence/production-metrics/)
