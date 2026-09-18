# AGENTS.md

## What this repository is

This is a cleaned-up public edition of the Wellness Village website. It serves two purposes: a runnable reference and a portfolio case study. It is not the private production repository, and it must remain useful without access to client accounts or secrets.

An Agent can help inspect source material, research links, write code, run tests and prepare documentation. Its output is always a draft. Product decisions, client approvals, privacy choices and release decisions stay with a person.

## Understand the content model first

- **Brand profiles are fixed editorial content.** They were prepared from the approved Guidebook and checked public brand links. They do not update from The Ground or another live feed.
- **Programme data is separate.** Current session times, availability, prices and registration destinations come from The Ground's organisation-scoped public catalogue.
- **Registration stays on The Ground.** The website helps visitors discover sessions, then sends them to the matching The Ground page to book.
- **Contact details follow a one-way path.** The website Worker validates a submission, puts a small message on a Cloudflare Queue, and a private consumer writes it to the client's Google Sheet.
- **The public demo uses synthetic data by default.** Live integrations are opt-in and must fail closed when their configuration is missing.

Do not fill gaps by guessing. Use `Unknown`, unavailable or no action when the available material does not support a value.

## Which source to use

Use the source that actually owns the information:

1. Use The Ground for current programme times, prices, availability and registration links.
2. Use approved client material for venue details, directions, campaign wording and presentation.
3. Use the Guidebook for the four themes and fixed brand profiles. A Guidebook entry does not by itself prove booth location, sponsorship, attendance or booking status.
4. Use a brand's own public website or social profile only to check its identity or official link.
5. Use the code and tests for current demo behaviour. Use dated records in `docs/evidence/` for historical traffic, cost, search and delivery facts.

## Keep private material out

- Never add production organisation IDs, Cloudflare account IDs, resource names, Sheet IDs, private URLs, credentials, personal records, client messages, raw Agent transcripts or private filesystem paths.
- Never add the original Guidebook PDF, its page archive, client fonts or campaign source files.
- Use neutral identifiers and synthetic people, events and submissions in fixtures, examples and tests.
- Product screenshots must come from the real interface. Do not present a generated or redrawn screen as a product capture.
- Check third-party media against [ASSET_POLICY.md](ASSET_POLICY.md) before adding it.
- Do not add a `LICENSE`, describe the repository as open source, create a remote or publish it without the owner's instruction. The [release checklist](docs/agent-workflow/release-checklist.md) must be complete first.

## Programme integration

- Access The Ground from the server only. Keep the organisation setting replaceable and use a neutral value in public fixtures.
- Fetch upcoming and past feeds with firm limits: 50 records per page, 20 pages per feed, an eight-second request timeout and a 2 MiB response limit.
- Validate responses and pagination at runtime. Keep only public event fields; exclude provider contacts, members, coaches and provider-only state.
- Convert dates using `Asia/Hong_Kong` / HKT (`+08:00`). Work out event phase separately from the Hong Kong calendar dates occupied by an event, including midnight and multi-day cases.
- Produce HTTPS registration links only, remove duplicate event IDs, and keep ordering and categories deterministic.
- Cache the cleaned programme for five minutes. If an upstream request fails, use the last valid warm snapshot. If there is no snapshot, show an unavailable state and a direct link to The Ground.

## Contact form and Google Sheets

- Google credentials and the destination Sheet ID belong only in the private Queue consumer. They must not enter browser code, the website Worker, fixtures, logs or documentation.
- Before reading personal data, resolve the feature flag, privacy version, Turnstile setting, Queue binding and both rate-limit bindings.
- Accept JSON only. Enforce the body-size limit and runtime schema, verify Turnstile on the server, rate-limit requests and keep the honeypot path from reaching the Queue.
- Keep the Queue message small and give it a stable submission ID. Queue delivery is at least once; the consumer checks IDs before appending so ordinary retries do not create another row. Do not call this distributed exactly-once delivery.
- A genuine submission receives `202 Accepted` only after the Queue accepts it. A honeypot receives the same response without being queued. Neither response means Google Sheets has already been updated.
- Never log form bodies, contact details, tokens, Sheet IDs, credentials or Queue payloads.

## How to work on a change

1. Identify the source and the user-visible result.
2. Read the relevant code, tests and decision note before editing.
3. Make the smallest complete change.
4. Add a useful regression test for changed behaviour, external-service failures or date/time edge cases.
5. Check the result a user can actually see.
6. Update the case study only when the implementation or a dated project record supports the new wording.

Read the installed Next.js guidance before changing framework-specific code. Keep external-service adapters and runtime schemas separate from presentation components.

## Checks before calling work complete

For changes to the runnable application, run:

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

Also run browser checks when navigation, responsive layout, keyboard use, accessibility or live-integration presentation changes. After documentation work, check local links, English/Traditional Chinese section parity and Mermaid source pairs.

Report only checks that were actually run. Requests are not visitors, page views are not registrations, and technical health does not prove attendance, conversion or return on investment.

## Writing the portfolio documentation

- Keep `README.md` as the short English overview. Keep `README.zh-Hant.md` as a formal written Traditional Chinese version that reads naturally in Hong Kong and Taiwan.
- Match the meaning, main sections, diagrams, media and limitations across both languages; do not translate technical names when that would make them less precise.
- Use unsuffixed English files and `-zh-Hant` for Traditional Chinese files. The production route `/zh-hk` does not change that documentation tag.
- Say when a prompt, timeline or diagram was reconstructed after the project. Do not present edited material as a verbatim record.
- Keep dates and scopes beside traffic, cost and Search Console figures. Do not turn an account-level number into a project number or publish lead volume.
