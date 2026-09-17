# ADR 001: The Ground owns live schedule and booking authority

## Status

Accepted for the delivered event platform.

## Context

The website needed to make the programme discoverable while live times, prices, public availability and registration already belonged to The Ground. The Guidebook supplied editorial context but was not an operational timetable. The available endpoint is evidenced here as an organisation-scoped public catalogue, not a documented partner API.

## Decision

Read upcoming and past records through a bounded, server-only, organisation-scoped adapter. Validate and privacy-filter the public event contract, derive HKT presentation state, and hand booking back to canonical The Ground pages. Do not maintain a second manually edited timetable or booking system.

## Consequences

- Visitors can discover sessions in the campaign experience without creating a second booking authority.
- Pagination, response size, request duration, schema, event-ID deduplication and canonical links require explicit controls.
- A five-minute normalised cache and last valid warm snapshot cover short upstream failures; a cold failure remains visibly unavailable with a direct hand-off.
- The integration remains feature-flagged, configuration-scoped and replaceable.

## Evidence

- [The Ground event-interface case study](../case-study/04-the-ground-event-interface.md)
- [The Ground event-interface diagram](../diagrams/the-ground-event-interface.svg) and [Mermaid source](../diagrams/the-ground-event-interface.mmd)
- [Reconstructed MVP brief](../agent-workflow/reconstructed-mvp-brief.md)
