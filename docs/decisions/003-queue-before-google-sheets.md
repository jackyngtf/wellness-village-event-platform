# ADR 003: Put a Queue before Google Sheets

## Status

Used in the delivered website.

## Context

The client wanted selected contact-form fields in an existing Google Sheet without adding an application database. Writing to the Sheet during the public request would make visitors wait for Google and would place broader credentials in the website runtime.

## Decision

After checking privacy settings, configuration, Turnstile and the schema, the website Worker places a small message with a stable submission ID on the Queue. A filled honeypot receives the same public response but is not queued. A separate non-public consumer owns Google authentication, checks the 14-field internal format, looks for an existing ID and appends unseen rows with `RAW` values.

## Consequences

- The browser and website Worker never receive Google credentials or the destination Sheet identifier.
- For a genuine non-honeypot submission, `202 Accepted` follows awaited Queue acceptance. A honeypot decoy deliberately receives the same `202` without enqueueing; neither response means synchronous Google Sheets persistence.
- Cloudflare Queue delivery remains at-least-once. Same-batch collapse and read-before-append deduplication provide idempotent convergence for ordinary retries without claiming distributed exactly-once delivery.
- Transient failures retry; exhausted messages move to a dead-letter Queue for controlled recovery.
- Monitoring, retention, withdrawal requests, duplicate handling and dead-letter recovery still need an operator.

## References

- [Queue-to-Sheets case study](../case-study/05-queue-to-sheets-interface.md)
- [Queue-to-Sheets sequence diagram](../diagrams/queue-to-sheets-sequence.svg) and [Mermaid source](../diagrams/queue-to-sheets-sequence.mmd)
- [System overview diagram](../diagrams/system-overview.svg)
