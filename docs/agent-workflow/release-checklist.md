# Public-edition release checklist

This checklist prepares a candidate for owner review; it does not authorise remote creation, push or publication. Run it against the complete candidate after the publication scope is final.

## 1. Rights review

- [ ] Record the rights basis for every screenshot, logo, campaign element, font, code dependency and third-party asset.
- [ ] Confirm that documentary media is within the client-approved portfolio scope.
- [ ] Keep the Guidebook master, page archive, client fonts and campaign source assets out of the working tree and history.
- [ ] Preserve every required third-party notice, including the `liquidframe` notice if its CSS or source is distributed.
- [ ] Confirm the deliberate source-available policy remains accurate: no `LICENSE`, package metadata marked `UNLICENSED`, and no description of the repository as open-source.
- [ ] Obtain fresh owner approval before replacing that position with any future software licence.

## 2. Identifier, secret and privacy scans

- [ ] Scan the complete working tree for credentials, tokens, private keys, non-example environment files and private URLs.
- [ ] Confirm `.env*` and `.dev.vars*` stay ignored; only the placeholder `.env.example` may be published.
- [ ] Scan for production organisation identifiers, Cloudflare account IDs, Queue names, Worker names, Sheet IDs, personal contact records and client correspondence using a private denylist that is never committed or printed.
- [ ] Repeat secret and identifier scans across every commit in the independent candidate history.
- [ ] Confirm that logs, examples and documentation contain no submission payloads, credentials or personal data.

## 3. Synthetic fixture audit

- [ ] Confirm that names, email addresses, phone numbers, organisation IDs, event IDs, submission IDs, URLs and account-like values are synthetic and neutral.
- [ ] Confirm that synthetic mode is the no-secret default and install, test and local startup do not contact production services.
- [ ] Confirm that The Ground live access and Queue/Sheets delivery remain explicit opt-ins and fail closed when configuration is absent.

## 4. Documentation, claims and bilingual parity

- [ ] Resolve every local Markdown link and remove line-number anchors from durable evidence links.
- [ ] Confirm English and Traditional Chinese README section markers, claims, limitations, links, diagrams and media references are structurally aligned.
- [ ] Parse every Mermaid source and confirm each English source has a formal written Traditional Chinese partner with equivalent topology.
- [ ] Confirm every ADR contains Status, Context, Decision, Consequences and Evidence, and every major claim maps to an implementation, test, decision or explicit historical source note.
- [ ] Confirm every `202 Accepted` claim distinguishes genuine non-honeypot submissions, which await Queue acceptance, from honeypot decoys, which deliberately receive the same status without enqueueing; neither path may be described as Sheet persistence.
- [ ] Review reconstructed prompts and retrospective diagrams for clear disclosure; none may be presented as verbatim history.
- [ ] Search for prohibited claims and manually review every negation. Do not claim documented partner status for The Ground, synchronous Google Sheets persistence, distributed exactly-once delivery, Cloudflare Pages as the delivered runtime, one-prompt production delivery, or unmeasured conversion, productivity, SLA or ROI outcomes.
- [ ] Describe the campaign URL as optional and time-limited; the repository media and runnable demo are the durable record.
- [ ] Recompute every published aggregate metric from its retained sanitised record; keep requests, page views, Worker invocations, visitors and business outcomes distinct.
- [ ] Confirm direct project spend, shared-account billing, usage charges and public rate-card comparisons remain separate. A zero usage charge must never be described as zero total cost.
- [ ] Confirm every retained invoice-derived fact excludes account, order, payment and personal identifiers, and publish no shared-account total as a project-only cost without attributable line items.
- [ ] Publish Search Console outcomes only from an authorised verified property; otherwise state the evidence gap without inferring indexing or organic performance.

## 5. Code, build and runtime verification

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run cf:typegen:check`
- [ ] `npm run cf:build`
- [ ] `npm run cf:dry-run`
- [ ] Start `npm run cf:preview` in a bounded local session, request representative English and Traditional Chinese routes, then terminate it cleanly.
- [ ] Run configuration validation and Worker dry runs with neutral example configuration.
- [ ] Record build and dry-run evidence separately from any future deployment claim. A dry run neither uploads nor deploys.
- [ ] Before a future deployment, provision the documented R2 cache, revalidation Durable Object migration, contact Queue/consumer/DLQ, rate-limit namespaces and approved secrets; keep both live integrations disabled until every dependency is present.
- [ ] Complete browser QA in mobile Chromium, WebKit and desktop Chromium.
- [ ] Complete keyboard, focus, link-integrity and accessibility checks.
- [ ] Test a fresh clone from an empty directory without production secrets.
- [ ] Record exact commands, results and limitations; do not broaden what any check proves.

## 6. Media inspection

- [ ] Inspect every PNG, GIF and MP4 visually in its intended locale; confirm there are no credentials, personal data, browser history, notifications or unrelated desktop content.
- [ ] Confirm English and `-zh-Hant` media show the matching interface language and preserve the approved device/browser presentation.
- [ ] Record dimensions and duration, verify playback and reduced-motion poster behaviour, and provide meaningful alt text.
- [ ] Re-capture documentary media if the approved interface changes; do not use generated or redrawn product pixels as evidence.

## 7. Independent repository-history inspection

- [ ] Create a new local repository history only after the complete draft passes its publication audit; never copy the private `.git` directory.
- [ ] Have an independent reviewer inspect the tree, every commit, the diff from an empty tree and the clone result for excluded files, sensitive values, unsupported claims and unintended build output.
- [ ] Confirm the private production repository and its history remain unchanged and disconnected from the public edition.
- [ ] Confirm the candidate contains only reviewed source, synthetic fixtures, approved media, required notices and reproducible configuration.

## 8. Owner publication gate

- [ ] Present the final rights record, audit results, history review, unresolved limitations and exact candidate commit to the owner.
- [ ] Obtain an explicit owner instruction before creating a GitHub repository or any other remote.
- [ ] Obtain an explicit owner instruction for the exact push/publication action; local readiness is not publication authority.
- [ ] After an authorised push, verify the public repository and links from a signed-out view before using it in portfolio or social material.
