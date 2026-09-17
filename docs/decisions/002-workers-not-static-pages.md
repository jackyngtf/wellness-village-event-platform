# ADR 002: Use OpenNext on Cloudflare Workers

## Status

Accepted for the delivered event platform.

## Context

The product required server-rendered routes, a server-only event adapter, API routes, Queue production, incremental caching and controlled revalidation. A static export or Cloudflare Pages-only design would remove those runtime boundaries.

## Decision

Run the Next.js application through OpenNext on a Cloudflare Worker. Use R2 only for incremental-cache storage and a Durable Object only for revalidation coordination. Keep the private contact-sheet consumer as a separate Worker.

Cloudflare currently recommends vinext for greenfield Next.js applications. This accepted decision retains OpenNext because the portfolio is reproducing the evidenced delivered runtime, not prescribing a default for new projects. A future migration can be assessed separately without changing the historical architecture claim.

## Consequences

- Secrets, trust-boundary validation and third-party fetching stay outside browser bundles.
- The website Worker can produce Queue messages without owning Google credentials.
- R2 and Durable Objects are Next.js cache and revalidation infrastructure, not lead storage; visitor submissions use the separate Queue-to-consumer path.
- Builds, emulation, bindings and releases are more involved than static hosting.
- Public descriptions must identify Cloudflare Workers as the delivered runtime; Cloudflare Pages is only the static alternative that was not delivered.

## Evidence

- [Cloudflare delivery case study](../case-study/06-cloudflare-delivery.md)
- [System overview diagram](../diagrams/system-overview.svg) and [Mermaid source](../diagrams/system-overview.mmd)
- [Public-edition release checklist](../agent-workflow/release-checklist.md)
