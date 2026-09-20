# Launching on Cloudflare and handling the first production incident

[**English**](06-cloudflare-delivery.md) · [繁體中文](06-cloudflare-delivery.zh-Hant.md)

The website looked content-led, but the delivered system was not a static brochure. It rendered routes on the server, read The Ground from server-only code, accepted contact messages through an API route and produced those messages to Cloudflare Queue. That shaped both the hosting choice and the release process.

## Why Workers rather than static Pages

I packaged the Next.js application with OpenNext and ran it on Cloudflare Workers. A static Pages-only export could not provide the server-side routes, Queue binding or cache revalidation used by the project.

Cloudflare Pages is still useful for static websites; it simply was not the production runtime here. The domain used Cloudflare DNS, TLS and edge delivery, while the application itself ran as a Worker.

![System overview showing the three data paths and the Cloudflare runtime.](../diagrams/system-overview.svg)

[Open the full-size diagram](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/diagrams/system-overview.svg)

## What ran where

- OpenNext adapted the Next.js route, request and asset model to the Worker runtime.
- Deployment assets and edge caching handled repeat static delivery.
- R2 held the Next.js incremental cache, while a Durable Object coordinated revalidation across Worker isolates.
- The server-only adapter acquired and normalised The Ground listings.
- The website Worker produced accepted contact messages to Queue.
- A separate private consumer performed Google OAuth, duplicate checks and Sheet appends.

R2 and Durable Objects support application caching and revalidation; they do not store contact submissions. Personal data follows the separate website Worker → Queue → private consumer → Google Sheets path, and Google credentials exist only in the consumer.

## Releasing more than a successful build

No single green command covered the whole release, so I used a sequence of checks:

| Stage | Question it answered |
| --- | --- |
| Inspect source, diff and configuration | Am I reviewing the intended code and bindings? |
| Lint, type checks and focused tests | Do the static rules and tested contracts pass? |
| Next.js build and OpenNext bundle | Can the application be assembled for the target runtime? |
| Wrangler dry run | Can the Worker bundle and declared configuration be prepared without deployment? |
| Local workerd preview | Can representative routes run with local preview bindings? |
| Human-approved deployment | Is this the reviewed version I intend to release? |
| Read-only production smoke | Do the deployed Worker and important visitor routes respond now? |

Local workerd preview uses a direct revalidation queue because the local Worker cannot call its own internal Durable Object in the same way. Production retains R2-backed incremental caching and Durable Object coordination across isolates.

These checks covered buildability, configuration and observed routes. They did not turn a release into an SLA or establish that an external service would always be available.

## The 27 August Error 1102

Three days before the event, the site briefly returned Cloudflare Error 1102: the Worker had exceeded a resource limit. The diagnostic record matched the Free plan's per-request CPU ceiling.

I responded on two fronts. I moved the shared Cloudflare account to Workers Paid, establishing a more suitable US$5/month account baseline, and I reduced CPU-heavy work on request paths before checking the runtime again. Further hardening continued before the event opened.

The available records do not isolate how much each change contributed, so I do not describe the plan upgrade—or the code changes—alone as the fix. The important operational lesson was to treat the limit as both a capacity decision and an application-performance problem.

The complete captured billing period later showed US$0.00 in **additional** usage charges because the observed usage remained inside the paid plan's included quantities. That does not erase the base subscription, and the shared account means the whole US$5 cannot be treated as a project-only invoice.

<details>
<summary><strong>How the public repository represents the runtime</strong></summary>

- [`open-next.config.ts`](../../open-next.config.ts) selects the R2 incremental cache and supported Durable Object queue override for normal builds.
- [`wrangler.jsonc`](../../wrangler.jsonc) declares neutral assets, self-reference, R2, Durable Object, Queue producer and example rate-limit bindings without production account IDs.
- [`wrangler.preview.jsonc`](../../wrangler.preview.jsonc) provides local bindings and deliberately omits live contact and revalidation Durable Object bindings.
- `npm run cf:build` assembles the Worker, `npm run cf:dry-run` validates the neutral deployment bundle and `npm run cf:preview` runs the local Worker.
- Live The Ground and contact integrations remain explicit opt-ins. Google credentials and Sheet settings belong only to the private consumer Worker.

</details>

## Framework note for a future rebuild

As checked on 19 September 2026, Cloudflare's [Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) recommended vinext as the default path for new applications, while its [OpenNext guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) covered existing OpenNext applications. This portfolio keeps OpenNext because that is what the delivered site used, not because every new project should make the same choice.

Next: [traffic and cost](07-production-economics-and-observability.md) · [Search discovery](08-search-discoverability.md) · [Cloudflare configuration tests](../../tests/cloudflare-config.test.ts) · [release checklist](../agent-workflow/release-checklist.md)
