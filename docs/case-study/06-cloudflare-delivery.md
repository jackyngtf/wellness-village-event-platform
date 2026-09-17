# Cloudflare delivery

## Runtime decision

The evidenced production runtime is a Next.js application packaged by OpenNext and executed on Cloudflare Workers. A static Pages-only deployment did not satisfy the delivered need for server rendering, API routes, server-only integrations, Queue bindings and revalidation.

![System overview showing the three evidence and data paths plus the Cloudflare runtime.](../diagrams/system-overview.svg)

## Runtime responsibilities

- OpenNext adapts the Next.js request, route and asset model to the Worker runtime.
- Static assets are served as deployment assets.
- R2 stores the Next.js incremental cache.
- A Durable Object coordinates cache revalidation across Worker isolates.
- The server-only The Ground adapter acquires and normalises public event data.
- The website Worker produces approved contact messages to a Cloudflare Queue.
- A separate private consumer Worker performs Google OAuth, deduplication and Sheet appends.

R2 and the Durable Object are cache infrastructure. They are not lead stores and never replace the contact Queue or Google Sheet. Personal data follows the separate website Worker → Queue → private consumer → Google Sheets path, and Google credentials exist only at the consumer boundary.

The public edition removes account-specific identifiers, defaults to synthetic fixtures and keeps live integrations opt-in.

## Reference configuration

The checked-in configuration reproduces the delivered architecture without containing a deployable production identity:

- [`open-next.config.ts`](../../open-next.config.ts) selects the R2 incremental-cache override and OpenNext's supported Durable Object queue override for normal builds.
- [`wrangler.jsonc`](../../wrangler.jsonc) declares static assets, the Worker self-reference, R2 cache, `DOQueueHandler`, the neutral contact Queue producer and two example rate-limit namespaces. Both optional live integrations remain off.
- [`wrangler.preview.jsonc`](../../wrangler.preview.jsonc) is deliberately local-only. `npm run cf:preview` passes that file to both the supported OpenNext build and OpenNext preview commands, sets `OPEN_NEXT_LOCAL_PREVIEW=true` for the build, and relies on preview's local default without `--remote`. The preview file has no contact Queue, rate-limit or revalidation Durable Object binding.
- [`worker-configuration.d.ts`](../../worker-configuration.d.ts) is reproducibly generated from the website config. The hand-written optional contact Queue and rate-limiter contracts remain at the application boundary so a missing binding continues to fail closed without an unsafe cast.

Synthetic local mode requires no production resources. It uses synthetic content, disabled integrations and Wrangler's local binding implementations. `npm run cf:build` and `npm run cf:dry-run` assemble and validate a neutral bundle; a successful dry run does not create resources, upload a version or deploy a Worker.

Before any separately authorised real deployment, an operator must provision or approve the neutral resources for the target account: the R2 incremental-cache bucket; the contact Queue plus its private consumer and dead-letter Queue; distinct positive rate-limit namespace IDs; the Worker self-reference binding; and the `DOQueueHandler` migration. The approved hostname, consent version, Turnstile secret and optional The Ground organisation identifier must then be configured before either live feature is enabled. Google credentials and the destination Sheet settings belong only to the private consumer Worker.

## Current framework guidance

Cloudflare currently recommends [vinext for new Next.js applications](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) and positions its [OpenNext guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) for existing OpenNext applications. This portfolio retains OpenNext to reproduce the evidenced delivered architecture; it is not a blanket recommendation for a greenfield project. Any future migration should be evaluated against compatibility and evidence rather than rewritten into the historical delivery story.

## Delivery workflow

The release sequence separates evidence instead of treating one green command as proof of everything:

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

These stages prove buildability, configuration validity and observed route availability at the time checked. They do not, by themselves, prove an SLA, conversion impact or future upstream availability. Deployment remains subject to explicit human release approval.

## Cloudflare Pages in this story

Pages is useful for static sites and may be part of a broader Cloudflare learning narrative, but it was not the evidenced production runtime for this full-stack delivery. Keeping that distinction in the case study is more credible than listing every Cloudflare product as if it were used.

## Related evidence

- Implementation: [OpenNext configuration](../../open-next.config.ts), [website Worker configuration](../../wrangler.jsonc) and [private consumer](../../workers/contact-sheet-consumer/)
- Tests: [Cloudflare configuration-contract checks](../../tests/cloudflare-config.test.ts) and [consumer configuration/runtime checks](../../workers/contact-sheet-consumer/)
- Diagram: [system overview SVG](../diagrams/system-overview.svg) and [Mermaid source](../diagrams/system-overview.mmd)
- Decision record: [Use OpenNext on Cloudflare Workers](../decisions/002-workers-not-static-pages.md) and [release checklist](../agent-workflow/release-checklist.md)
