# ADR 001: Keep current schedules and booking on The Ground

## Status

Used in the delivered website.

## Context

The website needed to make the programme easier to browse, while current times, prices, availability and registration were already managed on The Ground. The Guidebook supplied fixed editorial content but was not a current timetable. The integration uses an organisation-specific public catalogue, not a documented partner API.

## Decision

Read upcoming and past records through a server-side adapter with page, time and response-size limits. Check and trim the response, calculate the HKT display state and send booking back to the matching The Ground page. Do not maintain a second timetable or booking system by hand.

## Consequences

- Visitors can find sessions on the campaign site while booking remains on The Ground.
- Pagination, response size, request duration, schema checks, event-ID duplicate checks and safe links need to be maintained.
- A five-minute cache and the last valid in-memory copy can cover a short upstream failure. With no usable copy, the programme shows as unavailable and links directly to The Ground.
- The integration remains feature-flagged, configuration-scoped and replaceable.

## References

- [The Ground event-interface case study](../case-study/04-the-ground-event-interface.md)
- [The Ground event-interface diagram](../diagrams/the-ground-event-interface.svg) and [Mermaid source](../diagrams/the-ground-event-interface.mmd)
- [Reconstructed MVP brief](../agent-workflow/reconstructed-mvp-brief.md)
