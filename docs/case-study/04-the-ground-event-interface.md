# The Ground event-data interface

## Responsibility boundary

The Ground is the operational source of truth for event time, price, availability and registration. In verified live mode, the Wellness Village website provides discovery and context, then hands booking back to the canonical The Ground page. The default synthetic demo stays on reserved example destinations.

This avoids a second hand-maintained timetable. The Guidebook can add editorial context, but it cannot overwrite a live operational record.

## Acquisition contract

The server-only adapter uses the verified organisation-scoped public catalogue rather than fetching a global catalogue and guessing ownership from titles. It:

- requests `upcoming` and `past` feeds in parallel;
- asks for at most 50 records per page and follows no more than 20 pages per feed;
- aborts an upstream request after eight seconds;
- rejects responses above 2 MiB and enforces the same ceiling while streaming when no usable content length is declared;
- validates strict RFC3339 timestamps and payloads with Zod;
- requires each admitted provider row to carry its numeric `companyId`, verifies it against the requested organisation before normalisation and strips it from public output;
- rejects unexpected pagination cursors, incoherent totals/page counts/page sizes, changing per-feed metadata and incomplete or excess rows;
- deduplicates by event ID, normalises and sorts before presentation; and
- caches the fully normalised catalogue for five minutes.

The historical production integration also checked that any separately requested public event detail belonged to the expected organisation. The curated reference keeps its runnable scope at the catalogue boundary, so it does not imply that a detail endpoint is required for the demonstrated programme explorer.

The original endpoint-discovery session is not preserved, so this case study documents the verified adapter behaviour without inventing a historical research transcript.

## From provider payload to interface

| Layer | Example fields or decisions |
| --- | --- |
| Provider payload | `id`, `companyId`, `name`, start/end, location, price and public RSVP state |
| Normalised contract | `eventId`, `title`, explicit HKT timestamps, public location, mode-safe booking URL and price/registration/availability unions |
| Derived interface | Exact phase, Today/Upcoming/Past bucket, category IDs, display order and CTA |

Only a privacy-filtered event contract reaches the presentation layer: source and event ID, title, explicit `+08:00` start and end times, public location, an allow-listed image URL or no image, a mode-safe booking URL, normalised price, registration-open state and deadline, and public-or-hidden capacity information. The provider `companyId` is used only for live membership verification; it is removed alongside provider contacts, members, coaches, unsupported images and provider-only state.

## Exact phase and Hong Kong calendar dates

Card status uses absolute timestamps:

| Condition | Phase |
| --- | --- |
| `now < startsAt` | Upcoming |
| `startsAt <= now < endsAt` | Live |
| `now >= endsAt` | Past / Ended |

Calendar navigation answers a different question: which Hong Kong dates does the event occupy?

- An event overlapping the current Hong Kong date belongs to Today.
- An event that ended earlier today can remain under Today while its card says Ended.
- An overnight or multi-day event belongs to every Hong Kong date it occupies.
- Intervals are treated as `[start, end)`, so an event ending exactly at midnight does not occupy the following date.

This separation prevents a calendar label from silently changing the exact event phase.

## Sorting, filters and deterministic categories

Default order is live events chronologically, then upcoming events chronologically, then past events by most recently ended. Booking availability is only a tie-breaker for simultaneous actionable events; it cannot move a later session ahead of a nearer one.

Valid URL-backed filters cover broad temporal state, exact Hong Kong date, client-confirmed category, location, price and booking state.

Admitted location labels are limited to 120 characters. Their filter keys use reversible UTF-8 base64url encoding instead of lossy ASCII slugging, so labels such as `A+B`, `A B` and `中環` remain distinct without truncated collisions while keeping query strings bounded.

The five editorial categories are:

- Yoga & Flow;
- Pilates & Fitness;
- Sound & Mind Therapy;
- Lifestyle & Holistic; and
- Community & Culture.

Classification normalises Unicode and punctuation, then matches exact confirmed activity phrases and reviewed provider-title aliases. Broad keyword inference is excluded. One event can belong to more than one category; an unmatched title stays visible under All events and receives the internal `other` classification.

The runnable public tests use deliberately fictional phrases and aliases to demonstrate this algorithm. They preserve the control method without reproducing production activity titles or provider payloads.

## Failure and booking semantics

After a valid fetch, a later provider failure can use the last valid warm-instance snapshot and label it stale. On a cold failure, the interface shows an unavailable state and a deliberate direct The Ground homepage link instead of a second schedule. Only organisation-verified live rows can generate canonical The Ground event URLs. Demo event CTAs use reserved `example.com` destinations and explicitly synthetic wording, so fictional IDs never contact the real provider. The website never claims to own registration or payment.

The integration uses a bounded, replaceable public endpoint, not a documented partner API in this repository. A formal long-term contract would require documented access, polling and content-reuse terms.

## Related evidence

- Implementation: [The Ground adapter](../../src/integrations/the-ground/) and [programme derivation](../../src/features/programme/)
- Tests: [adapter contract tests](../../src/integrations/the-ground/) and [HKT/category boundary tests](../../src/features/programme/)
- Diagram: [The Ground event interface SVG](../diagrams/the-ground-event-interface.svg) and [Mermaid source](../diagrams/the-ground-event-interface.mmd)
- Decision record: [The Ground remains the live source](../decisions/001-the-ground-is-the-live-source.md)
