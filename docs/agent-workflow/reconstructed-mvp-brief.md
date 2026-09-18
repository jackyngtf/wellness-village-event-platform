# Reconstructed MVP brief

> **Disclosure — reconstructed, edited and sanitised:** This retrospective brief was reconstructed from the delivered requirements. It is not the verbatim first prompt and does not imply that one prompt produced the final production system. Product direction, source authority, client decisions, privacy boundaries, architecture and release approval remained human-owned.

The historical first reviewable MVP was deployed from a home server on 5 August 2026, before the production domain was purchased. This reconstructed brief models the bounded vertical-slice intent; the [delivery timeline](../case-study/delivery-timeline.md) records how review, integration and production hardening continued afterwards.

## Prompt

You are helping me build the first working vertical slice of a bilingual visitor website for Wellness Village, a time-limited event at Central Market in Hong Kong.

### Product outcome

Create a mobile-first website that helps a person who knows nothing about the event quickly understand:

1. what Wellness Village is;
2. what activities are available and when;
3. whether an activity requires booking;
4. what to prepare before attending;
5. where the venue is and how to navigate it; and
6. which brand stories can be explored in the Guidebook.

The interface must support English and Hong Kong Traditional Chinese with the same core information architecture.

### Evidence rules

- Use only supplied or explicitly verified sources.
- Treat the Guidebook as editorial evidence, not a live timetable or evidence of a booth, sponsorship, attendance or booking state.
- Treat The Ground organisation-scoped public catalogue as the source for live event time, fee, public availability and canonical registration destination.
- Use approved venue records for arrival and map guidance; do not invent accessibility or operational details.
- Use first-party public brand sources only to verify an official destination or identity; they do not prove organiser endorsement or participation.
- If a value is unsupported, model it as `Unknown`, pending or unavailable, or omit it.
- Keep source references and publication status close to the structured content they support.

### Initial information architecture

- **Home:** event orientation and a clear path to programme, preparation and visit information.
- **Programme:** sessions grouped and filterable by useful visitor criteria, with an explicit booking hand-off.
- **Brands:** searchable editorial profiles organised by the Guidebook pillars.
- **Visit:** approved address, directions, arrival notes and map state.
- **Guidebook:** a first-party landing route and safe links into approved editorial material.
- **Privacy:** the published notice required before any native interest form is enabled.

### Experience requirements

- A first-time visitor should not need to know the site structure.
- Mobile navigation should keep the four primary tasks within thumb reach.
- Every external link must state what will happen and open safely.
- Empty, pending and unavailable states must explain the next valid action.
- Keep interactive touch targets at least 44 CSS pixels and preserve visible keyboard focus.
- Avoid document-level horizontal overflow on mobile Chromium and WebKit.

### Data and integration boundaries

- Keep external event fetching on the server.
- Validate external JSON at runtime and enforce finite pagination, response-size and request-time limits.
- Normalise event timestamps with explicit `Asia/Hong_Kong` / HKT (`+08:00`) behaviour rather than the deployment server timezone.
- Generate only canonical HTTPS registration links.
- The first slice may use synthetic verified fixtures behind the same adapter interface; do not hard-code a second UI-specific timetable.
- No credential, private URL or production identifier belongs in browser code, fixtures, logs or source control.
- Do not add a database solely to collect contact interest. Define a minimal validated delivery interface for an approved destination.

### Exact data-interface non-goals

- Do not fetch a global event catalogue and guess Wellness Village ownership from titles; use an organisation-scoped configuration boundary.
- Do not pass provider contacts, members, coaches, unsupported images or provider-only state into the public event model.
- Do not own booking, payment or registration records; hand off to canonical The Ground pages.
- Do not expose Google credentials or a Sheet identifier to the browser or website runtime.
- Do not write to Google Sheets synchronously in the visitor request. For genuine non-honeypot submissions, return `202 Accepted` only after awaited Queue acceptance; give honeypot decoys the same `202` without enqueueing, and never describe either response as Sheet persistence.
- Do not promise distributed exactly-once delivery; use stable IDs and deduplication when asynchronous delivery is introduced.
- Do not add user accounts, a CMS, CRM or general-purpose application database.
- Do not enable native personal-data collection until the approved privacy notice, verification and destination gates exist.

### Technical constraints

- Use Next.js, React and TypeScript.
- Use runtime schemas at external and internal trust boundaries.
- Keep components and content models testable without live credentials.
- Keep deployment-compatible server code isolated from client components.
- Make synthetic fixtures or disabled integrations the no-secret default.
- Add an `.env.example`; never add real values.

### Content and publication non-goals

- Do not rebuild the complete Guidebook as interactive content.
- Do not invent event schedules, venue maps, accessibility details or health claims.
- Do not publish unapproved source artwork, the Guidebook master, its page archive or client fonts.
- Do not present Agent output as client approval or reconstructed material as a verbatim transcript.

### Acceptance checks

- English and Traditional Chinese render the same core routes, navigation tasks and source boundaries.
- On mobile, a first-time visitor can move from orientation to activity choice, preparation guidance, venue support and continued brand exploration.
- Unsupported facts render as `Unknown`, pending or unavailable, or remain absent; no test fixture relies on production identifiers.
- External event and registration data pass through one server-only typed adapter with bounded failure behaviour and canonical HTTPS links.
- HKT phase and calendar behaviour are tested independently of the machine timezone, including midnight and multi-day boundaries.
- Core routes, locale parity, content counts, source status, external-link safety, keyboard focus and 44 CSS-pixel touch targets have automated or browser checks appropriate to the behaviour.
- Mobile Chromium and WebKit show no document-level horizontal overflow.
- Install, tests and the production build succeed without production secrets; integrations remain safely synthetic, disabled or fail-closed.
- Assumptions and unresolved source or client decisions are listed separately from completed behaviour.

Implement the smallest coherent vertical slice and report the exact checks run. Do not infer approval, production readiness or business impact from generated code or a passing build.

## What changed after the MVP

- **Client decisions:** five editorial activity categories and destination approvals were incorporated. The final evidence record contains four Guidebook pillars and 48 profiles: all 48 have client-confirmed Instagram destinations, 29 have independently verified official websites and 19 correctly retain no website action. See [Evidence-first Agent workflow](../case-study/02-evidence-first-agent-workflow.md).
- **Production hardening:** The Ground acquisition gained bounded pagination, schemas, explicit HKT handling, deterministic derivation and honest cache fallbacks. Visitor interest gained privacy gates, awaited Queue acceptance for genuine non-honeypot submissions, an indistinguishable non-forwarding honeypot response, a separate private Sheets consumer, an exact 14-field contract, stable IDs, retries, deduplication and DLQ handling. See [The Ground interface](../case-study/04-the-ground-event-interface.md) and [Queue-to-Sheets interface](../case-study/05-queue-to-sheets-interface.md).
- **Release evidence:** the full-stack application was delivered through OpenNext on Cloudflare Workers, with R2 incremental caching and Durable Object revalidation, then evaluated through inspect, test, build, dry-run, preview, deploy and read-only smoke-check stages. See [Cloudflare delivery](../case-study/06-cloudflare-delivery.md) and the [release checklist](release-checklist.md).

These changes are later human-directed delivery evidence, not capabilities attributed retrospectively to the initial brief.
