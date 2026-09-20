# ADR 003: Put a Queue before Google Sheets

[**English**](003-queue-before-google-sheets.md) · [繁體中文](003-queue-before-google-sheets.zh-Hant.md)

## Status

Used in the delivered website.

## Context

Wellness Village was a first edition with modest expected contact volume and no settled long-term data workflow. I considered Firebase and Supabase, then chose a Google Sheet as the initial destination rather than introduce a general-purpose application database before the future requirement was known. The Sheet was a project decision, not an existing client workflow.

Writing to the Sheet during the public request would make visitors wait for Google and would place broader credentials in the website runtime.

## Decision

After checking privacy settings, configuration, Turnstile and the schema, the website Worker places a small message with a stable submission ID on the Queue. A filled honeypot receives the same public response but is not queued. A separate non-public consumer owns Google authentication, checks the 14-field internal format, looks for an existing ID and appends unseen rows with `RAW` values.

## Consequences

- The browser and website Worker never receive Google credentials or the destination Sheet identifier.
- For a genuine non-honeypot submission, `202 Accepted` follows awaited Queue acceptance. A honeypot decoy deliberately receives the same `202` without enqueueing; neither response means synchronous Google Sheets persistence.
- Cloudflare Queue delivery remains at-least-once. Same-batch collapse and read-before-append deduplication provide idempotent convergence for ordinary retries without claiming distributed exactly-once delivery.
- Transient failures retry; exhausted messages move to a dead-letter Queue for controlled recovery.
- Monitoring, retention, withdrawal requests, duplicate handling and dead-letter recovery still need an operator.
- The Sheet remains a small, single-writer destination. Multiple writers, transactional uniqueness, relational queries or materially higher volume would be reasons to revisit Firebase, Supabase or another datastore.

## References

- [Queue-to-Sheets case study](../case-study/05-queue-to-sheets-interface.md)
- [Queue-to-Sheets sequence diagram](../diagrams/queue-to-sheets-sequence.svg) and [Mermaid source](../diagrams/queue-to-sheets-sequence.mmd)
- [System overview diagram](../diagrams/system-overview.svg)
