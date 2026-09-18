# How programme data comes from The Ground

## What stays on The Ground

Current activity times, prices, availability and registration remain on The Ground. The Wellness Village website makes those listings easier to browse, then sends visitors to the relevant The Ground page to register. The synthetic demo uses reserved example destinations and never contacts a real booking page.

This avoids maintaining a second timetable by hand. The Guidebook provides fixed editorial content, but it does not change a current activity listing.

## How the website fetches the listings

The server-side adapter reads the public catalogue for the configured organisation. It does not fetch a global catalogue and guess which events belong to Wellness Village from their titles. It:

- requests `upcoming` and `past` feeds in parallel;
- asks for at most 50 records per page and follows no more than 20 pages per feed;
- aborts an upstream request after eight seconds;
- rejects responses above 2 MiB and enforces the same ceiling while streaming when no usable content length is declared;
- validates strict RFC3339 timestamps and payloads with Zod;
- requires each admitted provider row to carry its numeric `companyId`, verifies it against the requested organisation before normalisation and strips it from public output;
- rejects unexpected pagination cursors, incoherent totals/page counts/page sizes, changing per-feed metadata and incomplete or excess rows;
- deduplicates by event ID, normalises and sorts before presentation; and
- caches the fully normalised catalogue for five minutes.

The production version also checked that any separately requested event detail belonged to the expected organisation. This public demo only needs the catalogue flow and does not depend on a detail endpoint.

I did not preserve the original endpoint-discovery session. This page therefore describes the adapter that was implemented and tested; it does not recreate that research history.

## From response data to a programme card

| Layer | Example fields or decisions |
| --- | --- |
| Provider payload | `id`, `companyId`, `name`, start/end, location, price and public RSVP state |
| Normalised contract | `eventId`, `title`, explicit HKT timestamps, public location, mode-safe booking URL and price/registration/availability unions |
| Derived interface | Exact phase, Today/Upcoming/Past bucket, category IDs, display order and CTA |

The page only receives the fields it needs: source and event ID, title, `+08:00` start and end times, public location, an approved image URL or no image, a safe booking URL, price, registration state and public capacity information. The adapter uses `companyId` to check the organisation, then removes it together with provider contacts, members, coaches, unsupported images and internal provider state.

## Live status and Hong Kong calendar dates

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

Keeping these two calculations separate means a date tab cannot accidentally change whether a card says Upcoming, Live or Ended.

## Ordering, filters and categories

Default order is live events chronologically, then upcoming events chronologically, then past events by most recently ended. Booking availability is only a tie-breaker for simultaneous actionable events; it cannot move a later session ahead of a nearer one.

Valid URL-backed filters cover broad temporal state, exact Hong Kong date, client-confirmed category, location, price and booking state.

Location labels are limited to 120 characters. Their filter keys use reversible UTF-8 base64url encoding, so labels such as `A+B`, `A B` and `中環` remain different without making the query string unreasonably long.

The five editorial categories are:

- Yoga & Flow;
- Pilates & Fitness;
- Sound & Mind Therapy;
- Lifestyle & Holistic; and
- Community & Culture.

Classification normalises Unicode and punctuation, then matches exact confirmed activity phrases and reviewed provider-title aliases. Broad keyword inference is excluded. One event can belong to more than one category; an unmatched title stays visible under All events and receives the internal `other` classification.

The public tests use fictional phrases and aliases. They show how the matching works without reproducing production activity titles or provider responses.

## If The Ground is unavailable

After one successful fetch, a later failure can use the most recent in-memory copy and label it as older data. If no copy exists, the page shows an unavailable message and a direct link to The Ground instead of inventing a schedule. Only live rows checked against the configured organisation can create real The Ground event links. Demo buttons use `example.com`, so fictional IDs never reach the provider. Registration and payment remain on The Ground.

This repository documents a limited public integration, not a formal partner API. A long-term commercial integration would need agreed access, polling and content-reuse terms.

## Related code and notes

- Implementation: [The Ground adapter](../../src/integrations/the-ground/) and [programme derivation](../../src/features/programme/)
- Tests: [adapter contract tests](../../src/integrations/the-ground/) and [HKT/category boundary tests](../../src/features/programme/)
- Diagram: [The Ground event interface SVG](../diagrams/the-ground-event-interface.svg) and [Mermaid source](../diagrams/the-ground-event-interface.mmd)
- Decision record: [The Ground remains the live source](../decisions/001-the-ground-is-the-live-source.md)
