# ADR 003: Queue precedes Google Sheets

## Status

Accepted for the delivered event platform.

## Context

The client wanted approved visitor-interest fields in an existing Google Sheet without adding a general-purpose application database. A synchronous Sheet write would expose Google latency and failure to the public request while putting broader credentials in the website runtime.

## Decision

After privacy, configuration, verification and schema gates, the website Worker enqueues a minimal payload with a stable submission ID for a genuine non-honeypot submission. A honeypot decoy deliberately receives the same public response without enqueueing. A separate non-public consumer owns Google authentication, exact 14-field contract validation, existing-ID checks and append-only `RAW` Sheet writes.

## Consequences

- The browser and website Worker never receive Google credentials or the destination Sheet identifier.
- For a genuine non-honeypot submission, `202 Accepted` follows awaited Queue acceptance. A honeypot decoy deliberately receives the same `202` without enqueueing; neither response means synchronous Google Sheets persistence.
- Cloudflare Queue delivery remains at-least-once. Same-batch collapse and read-before-append deduplication provide idempotent convergence for ordinary retries without claiming distributed exactly-once delivery.
- Transient failures retry; exhausted messages move to a dead-letter Queue for controlled recovery.
- Monitoring, retention, withdrawal, deduplication and DLQ recovery remain explicit human-owned operations.

## Evidence

- [Queue-to-Sheets case study](../case-study/05-queue-to-sheets-interface.md)
- [Queue-to-Sheets sequence diagram](../diagrams/queue-to-sheets-sequence.svg) and [Mermaid source](../diagrams/queue-to-sheets-sequence.mmd)
- [System overview diagram](../diagrams/system-overview.svg)
