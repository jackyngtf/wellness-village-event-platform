# Queue-to-Sheets without an application database

## Product decision

Google Sheets remained the client-owned operating destination for this bounded contact-interest workflow. Cloudflare Queue provides durable asynchronous transport; it is not treated as a long-term application database. This kept the change proportional while separating the public request path from Google credentials and latency.

## Gates before personal data

Before the route reads a submitted body, it confirms that native collection is deliberately enabled, the published privacy-notice version matches the payload contract, server-side Turnstile configuration is valid, the Queue producer binding exists and both required rate-limiter bindings are present. This binding preflight consumes no quota. A missing gate fails closed without processing the submitted personal data.

In the public portfolio, that gate is off by default and the browser interface renders no contact form. The source remains executable and testable without turning the portfolio itself into a data-collection surface.

After those gates, the route:

1. requires JSON;
2. applies a coarse pre-verification rate limit;
3. reads at most 8 KiB, including streamed bodies;
4. applies a strict Zod schema for the UUID, names, email, phone, locale, literal consent, Turnstile token and honeypot, rejecting extra fields;
5. verifies Turnstile server-side;
6. applies the shared post-verification rate limit; and
7. gives a filled honeypot the same `202 Accepted` response without forwarding it.

The form creates one stable UUID for a logical submission and reuses it after a failed attempt until acceptance. The website adds server-side UTC and Hong Kong timestamps and retains only a same-origin pathname—never its query string or fragment—as source metadata.

## What `202 Accepted` means across both paths

For a genuine non-honeypot submission, the website creates the minimal approved Queue message, awaits Queue acceptance and only then returns `202 Accepted`. A honeypot decoy deliberately receives the indistinguishable `202` without enqueueing, so the status alone does not prove that a message entered the Queue. Neither response means Google Sheets has already stored a row.

## Private 14-column contract

A separate consumer Worker has no public route. Only that Worker receives the Google service-account credentials, destination spreadsheet ID and fixed append range. It validates the exact field set and order before using the `A:N` Sheet contract:

| Column | Field | Purpose |
| --- | --- | --- |
| A | `submission_id` | Stable logical UUID and deduplication key |
| B | `submitted_at_utc` | Server timestamp in UTC |
| C | `submitted_at_hkt` | The same instant with explicit Hong Kong offset |
| D | `last_name` | Validated surname |
| E | `first_name` | Validated given name |
| F | `display_name` | Locale-aware derived display name |
| G | `email` | Validated email address |
| H | `phone` | Validated telephone value |
| I | `locale` | `en` or `zh-hk` |
| J | `source_page` | Same-origin pathname or `unknown` |
| K | `consent` | Literal `true` |
| L | `consent_version` | Version tied to the published notice |
| M | `purpose` | Fixed approved processing purpose |
| N | `marketing_opt_in` | Literal `true` for this contract |

The consumer obtains a Sheets-scoped OAuth token, reads column A, collapses duplicate IDs within the current batch and acknowledges IDs already present. It appends only unseen rows with `valueInputOption=RAW`, preventing formula interpretation of visitor-entered values, and acknowledges those messages only after the append is confirmed.

## Retry, deduplication and limits

Cloudflare Queues deliver at least once. A transient OAuth or Sheets failure retries the unconfirmed messages; exhausted messages move to a dead-letter Queue for controlled operator recovery. If a Sheets append commits but its response is lost, the retry reads column A and can recognise the stable ID before another append.

This is idempotent convergence for ordinary retries, not distributed exactly-once delivery. Read-before-append is not a general transaction system, so the consumer remains a single writer and the workflow remains intentionally bounded. Operational monitoring, Sheet retention, withdrawal handling and DLQ recovery remain human responsibilities. Logs contain event names, counts and upstream status only—not payloads or credentials.

Cloudflare generally recommends allowing Queue consumers to autoscale. This reference deliberately sets `max_concurrency: 1` because its read-before-append convergence assumes one writer to one Sheet. A higher-throughput system should move uniqueness into a transactional destination instead of increasing concurrency around this pattern.

## Privacy boundary

- Google credentials exist only in the consumer Worker.
- Personal fields and message bodies are excluded from logs.
- The native form remains fail-closed without the approved privacy notice, Turnstile configuration, both rate-limiter bindings, Queue binding and consumer configuration. The binding preflight happens before the body is read; actual pre-IP quota is consumed before the body, and post-verification quota is consumed only after successful Turnstile verification.
- The destination Sheet is append-only during normal ingestion; retention and withdrawal are controlled operational processes.

## Related evidence

- Implementation: [public schemas and Queue producer](../../src/features/interest/), [API route](../../src/app/api/interest/) and [private consumer](../../workers/contact-sheet-consumer/)
- Tests: [route and producer tests](../../src/features/interest/), [API boundary tests](../../src/app/api/interest/) and [Worker-runtime consumer tests](../../workers/contact-sheet-consumer/src/)
- Operations: [consumer setup, secret boundary and verification](../../workers/contact-sheet-consumer/README.md)
- Diagram: [Queue-to-Sheets sequence SVG](../diagrams/queue-to-sheets-sequence.svg) and [Mermaid source](../diagrams/queue-to-sheets-sequence.mmd)
- Decision record: [Queue submissions before Google Sheets](../decisions/003-queue-before-google-sheets.md)
