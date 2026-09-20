# ADR 004: Use the Guidebook for fixed editorial content

[**English**](004-guidebook-content-boundaries.md) · [繁體中文](004-guidebook-content-boundaries.zh-Hant.md)

## Status

Used in the delivered website.

## Context

The 184-page Guidebook contained enough material for bilingual brand pages, but it was not a current event database. A brand appearing in the Guidebook did not by itself confirm a current session, physical booth, sponsorship, attendance or booking state.

## Decision

Use the Guidebook for fixed profiles, campaign copy, four themes and page ranges. Keep its publication status with the structured content. Use other approved sources for sessions, registration, venue guidance and public links.

## Consequences

- Visitors can explore 48 structured profiles without treating print copy as live operations.
- Unconfirmed details remain `Unknown`, pending, unavailable or absent instead of being guessed.
- Agent extraction, OCR and research can produce candidates; I still check the Guidebook visually, while the client makes the required factual approvals.
- Content changes need a named source and the relevant count, mapping, URL, uniqueness and status checks.
- The original Guidebook PDF, Guidebook page archive, client fonts and campaign source assets stay outside the public repository unconditionally; a rights record cannot create an exception.

## References

- [Guidebook and Agent case study](../case-study/02-guidebook-and-agent-workflow.md)
- [Guidebook content-pipeline diagram](../diagrams/guidebook-content-pipeline.svg) and [Mermaid source](../diagrams/guidebook-content-pipeline.mmd)
- [How I worked with an Agent](../agent-workflow/working-with-an-agent.md)
