# How the contact form reaches Google Sheets

## Why I did not add a database

The client already used Google Sheets and only needed a small contact form, so I did not add a CRM or application database. Cloudflare Queue carries accepted submissions to a separate Worker; it is not used as long-term storage. This keeps Google credentials and Google response time out of the public website request.

## Checks before the form body is read

Before reading a submitted body, the route checks that contact collection is enabled, the privacy-notice version matches, Turnstile is configured, the Queue binding exists and both rate limiters are available. These configuration checks do not consume rate-limit quota. If any required setting is missing, the route stops without processing the submitted personal data.

The public portfolio keeps contact collection off by default and does not render the form. The code can still be run and tested without collecting data from portfolio visitors.

After those gates, the route:

1. requires JSON;
2. applies a coarse pre-verification rate limit;
3. reads at most 8 KiB, including streamed bodies;
4. applies a strict Zod schema for the UUID, names, email, phone, locale, literal consent, Turnstile token and honeypot, rejecting extra fields;
5. verifies Turnstile server-side;
6. applies the shared post-verification rate limit; and
7. gives a filled honeypot the same `202 Accepted` response without placing it on the Queue.

The form creates one stable UUID for a logical submission and reuses it after a failed attempt until acceptance. The website adds server-side UTC and Hong Kong timestamps and retains only a same-origin pathname—never its query string or fragment—as source metadata.

## What `202 Accepted` means

For a genuine submission, the website creates the small internal message, waits for Queue acceptance and then returns `202 Accepted`. A filled honeypot receives the same public response but is not queued. The response therefore does not reveal the anti-spam result, and it does not mean that Google Sheets has already written a row.

## The 14 columns written to the Sheet

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

## Retries and duplicate checks

Cloudflare Queues deliver at least once. A transient OAuth or Sheets failure retries the unconfirmed messages; exhausted messages move to a dead-letter Queue for controlled operator recovery. If a Sheets append commits but its response is lost, the retry reads column A and can recognise the stable ID before another append.

For ordinary retries, this design should settle on one row, but it is not distributed exactly-once delivery. Reading before appending is also not a general transaction system, so the consumer stays as a single writer. Monitoring, Sheet retention, withdrawal requests and dead-letter recovery still need an operator. Logs contain event names, counts and upstream status, not form values or credentials.

Cloudflare generally recommends allowing Queue consumers to autoscale. This example sets `max_concurrency: 1` because its duplicate check assumes one writer to one Sheet. A higher-volume system should enforce uniqueness in a transactional datastore rather than adding more concurrent writers to this pattern.

## Privacy safeguards

- Google credentials exist only in the consumer Worker.
- Personal fields and message bodies are excluded from logs.
- The native form remains fail-closed without the approved privacy notice, Turnstile configuration, both rate-limiter bindings, Queue binding and consumer configuration. The binding preflight happens before the body is read; actual pre-IP quota is consumed before the body, and post-verification quota is consumed only after successful Turnstile verification.
- The destination Sheet is append-only during normal ingestion; retention and withdrawal are controlled operational processes.

## Related code and notes

- Implementation: [public schemas and Queue producer](../../src/features/interest/), [API route](../../src/app/api/interest/) and [private consumer](../../workers/contact-sheet-consumer/)
- Tests: [route and producer tests](../../src/features/interest/), [API boundary tests](../../src/app/api/interest/) and [Worker-runtime consumer tests](../../workers/contact-sheet-consumer/src/)
- Operations: [consumer setup, secret boundary and verification](../../workers/contact-sheet-consumer/README.md)
- Diagram: [Queue-to-Sheets sequence SVG](../diagrams/queue-to-sheets-sequence.svg) and [Mermaid source](../diagrams/queue-to-sheets-sequence.mmd)
- Decision record: [Queue submissions before Google Sheets](../decisions/003-queue-before-google-sheets.md)
