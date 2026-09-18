# Lessons and limitations

## What I can and cannot say about the result

Different records answer different questions:

| Question | What I have | What is still missing |
| --- | --- | --- |
| Was the site delivered against the recorded dates? | Timestamped project records, the cleaned-up timeline and the domain registration date | A reliable measure of how much time Agent assistance saved |
| Did the defined content, date, privacy and failure cases work? | Typed data, automated tests, builds, browser checks, accessibility checks and dry runs | Coverage of every real-world condition or permanent availability of external services |
| What happened after launch? | Cloudflare traffic and billing, the domain invoice, production endpoints and Search Console | Unique visitor, attendance, booking, revenue and ROI data |
| Did the website improve comprehension or satisfaction? | No controlled baseline or user study | A comparison with the original Guidebook and The Ground experience |

The project can support a strong delivery and engineering story. It cannot support a claim that the website increased attendance, conversion or business return.

## Things I would keep for another project

### Give the Agent smaller jobs with a named source

A long prompt did not remove the need to check the Guidebook, The Ground or a client decision. The Agent was most useful when I gave it one task, the relevant source and a clear check for completion.

### Make an early version easy to review

The home-server preview let the client react to a working page before the production domain existed. It was useful because it started a concrete conversation, not because a home server was the final hosting choice.

### Let each external system keep its job

The Ground kept the current schedule and booking flow. Google Sheets remained the client's contact list. Cloudflare Queue connected the contact form to the Sheet. The website improved how people found information without trying to replace those systems.

### Plan for failure even on a short campaign

A campaign site can still expose credentials, show old information or lose a form submission. Request limits, runtime checks, timeouts, a recent programme snapshot, stable IDs, retries, duplicate checks and a dead-letter Queue were reasonable safeguards for this project.

### Edit a public portfolio instead of publishing private history

The public repository is not a copy of the production repo. It contains selected code, synthetic fixtures, approved media and enough documentation to understand the work. Private messages, credentials, personal data and restricted source assets stay out.

### Keep traffic, billing and outcomes separate

Edge requests, HTML responses, Worker calls, included usage and invoices describe different parts of the system. The useful cost result is that the observed usage stayed within the included quantities shown for the billing period—not that the project was free.

## What I would add next time

1. **Short task-based tests before launch.** Ask first-time visitors to explain the event, find a suitable activity, check whether booking is needed and locate arrival guidance. Record completion, time and points of confusion.
2. **Privacy-conscious journey counts.** Count programme views, outbound links to The Ground and accepted contact submissions without placing form values in analytics. Decide the denominator and consent basis before launch.
3. **Content-update timing.** Record how long a programme correction takes to appear and how often an update needs client clarification. Brand profiles would remain fixed Guidebook content unless the client requested an editorial change.
4. **Longer-term performance data.** If the site stays online long enough, review field Core Web Vitals rather than treating lab checks as real-user results.
5. **A second reviewer.** Ask another designer, accessibility reviewer or engineer to repeat the main visitor tasks and selected technical checks.

These are ideas for a future event, not results being added to this one after the fact.

## Limits of this case study

### External services

- The Ground integration used a public endpoint, not a formal partner API documented here.
- The recent in-memory programme copy only covers a short upstream interruption.
- Google Sheets suits this small, single-writer workflow; it is not a transactional application database.
- Cloudflare Queue can deliver more than once. Stable IDs and duplicate checks reduce ordinary duplicates but do not create distributed exactly-once delivery.
- Sheet retention, withdrawal requests, monitoring and dead-letter recovery still need a person to operate them.

### Public portfolio

- The screenshots and videos show the delivered interface, but the campaign imagery remains within the approved portfolio scope.
- The example MVP brief was written after the project. It is not the original first prompt.
- The public timeline is based partly on private project messages. Names, quotations, attachments and message screenshots remain private.
- The event URL may be retired; the repository media and synthetic demo are the lasting record.

### Metrics

- Cloudflare requests and page responses include crawlers and threats and do not count people or attendance. Some Worker analytics may be sampled.
- The Cloudflare bill is account-level and can include other work. It showed no usage charge for the captured billing period but is not a project-only invoice.
- The first-year Porkbun domain registration is a direct project cost; future renewal pricing is not included.
- Search Console uses Pacific Time for performance dates. The selected dates match the 12 event calendar dates but not the exact HKT hours.
- The 6-of-12 indexing figure is a 14 September snapshot, and there was not enough 90-day field data for a Core Web Vitals result.
- The project did not retain conversion, productivity, SLA or ROI measurements.

## Related material

- Implementation: [public Agent instructions](../../AGENTS.md) and [public release checklist](../agent-workflow/release-checklist.md)
- Tests: [application checks](../../src/) and [contact-consumer checks](../../workers/contact-sheet-consumer/)
- Diagrams: [diagram index](../diagrams/README.md)
- Traffic and search: [Cloudflare and cost](07-production-economics-and-observability.md) and [Search Console](08-search-discoverability.md)
- Decisions: [The Ground](../decisions/001-the-ground-is-the-live-source.md), [Workers](../decisions/002-workers-not-static-pages.md), [Queue before Sheets](../decisions/003-queue-before-google-sheets.md) and [Guidebook content](../decisions/004-guidebook-content-boundaries.md)
