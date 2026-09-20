# ADR 002: Use OpenNext on Cloudflare Workers

[**English**](002-workers-not-static-pages.md) · [繁體中文](002-workers-not-static-pages.zh-Hant.md)

## Status

Used in the delivered website.

## Context

The site needed server-rendered routes, a server-side event adapter, API routes, Queue production, incremental caching and revalidation. A static export or Pages-only setup would not support that combination.

## Decision

Run the Next.js application through OpenNext on a Cloudflare Worker. Use R2 only for incremental-cache storage and a Durable Object only for revalidation coordination. Keep the private contact-sheet consumer as a separate Worker.

Cloudflare now recommends vinext for new Next.js applications. This portfolio keeps OpenNext because that is what the delivered site used; it is not suggesting OpenNext as the default for a new project.

## Consequences

- Secrets, runtime checks and third-party fetching stay outside browser bundles.
- The website Worker can produce Queue messages without owning Google credentials.
- R2 and Durable Objects are Next.js cache and revalidation infrastructure, not lead storage; visitor submissions use the separate Queue-to-consumer path.
- Builds, emulation, bindings and releases are more involved than static hosting.
- Cloudflare Workers is the delivered runtime. Pages was considered only as a static alternative.

## References

- [Cloudflare delivery case study](../case-study/06-cloudflare-delivery.md)
- [System overview diagram](../diagrams/system-overview.svg) and [Mermaid source](../diagrams/system-overview.mmd)
- [Public-edition release checklist](../agent-workflow/release-checklist.md)
