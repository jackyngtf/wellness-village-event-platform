# ADR 004: Guidebook claims stay editorial

## Status

Accepted for the delivered event platform.

## Context

The 184-page Guidebook was rich enough to seed bilingual discovery, but its layout and prose were not a live database. Visual proximity or editorial inclusion could not prove current event availability, a physical booth, sponsorship, attendance or booking state.

## Decision

Use the Guidebook for editorial profiles, campaign narrative, four pillars and exact page ranges only. Retain source and publication status with structured content. Use separate approved operational sources for sessions, registration, venue guidance and destination confirmation.

## Consequences

- Visitors can explore 48 structured profiles without treating print copy as live operations.
- Unsupported facts remain `Unknown`, pending, unavailable or absent instead of being inferred.
- Agent extraction, OCR and research remain candidate-generation aids; human visual verification and client decisions retain authority.
- Every content update needs a source and claim-boundary check backed by count, mapping, canonical-URL, uniqueness and source-status tests.
- The original Guidebook PDF, Guidebook page archive, client fonts and campaign source assets stay outside the public repository unconditionally; a rights record cannot create an exception.

## Evidence

- [Evidence-first Agent-workflow case study](../case-study/02-evidence-first-agent-workflow.md)
- [Guidebook content-pipeline diagram](../diagrams/guidebook-content-pipeline.svg) and [Mermaid source](../diagrams/guidebook-content-pipeline.mmd)
- [Evidence-first workflow](../agent-workflow/evidence-first-workflow.md)
