# Evidence-first Agent workflow

The Agent workflow began with source authority rather than code generation. Its purpose was to make fast assistance useful without allowing a plausible draft to become an unsupported public claim.

## Establish the source hierarchy

Each source was assigned a narrow job:

| Source | It could establish | It could not establish alone |
| --- | --- | --- |
| Guidebook | Editorial profiles, campaign narrative, four pillars and page ranges | Live sessions, physical booths, sponsorship or booking availability |
| The Ground | Public event times, prices, availability and registration destinations | Campaign narrative, venue operations or participation outside its records |
| Approved venue and campaign records | Address, visitor guidance, map and approved presentation | Unrecorded brand or event claims |
| Public brand sources | A first-party destination and identity evidence | Organiser endorsement or campaign participation |

Unsupported values stayed absent, pending, unknown or unavailable.

## Review the Guidebook as evidence

The source was a 184-page Guidebook. Its metadata and checksum remained in the private evidence record. Every page was rendered and visually reviewed; native text extraction and OCR were used only to generate candidates, never as final authority for names, hierarchy or page boundaries.

Visual verification established four editorial pillars and 48 profiles, each occupying an exact two-page range. That structure became typed content rather than a loose collection of copied strings.

## Research destinations through an evidence gate

The Agent helped organise candidate destinations and research possible first-party sources. Publication still required evidence:

- Instagram records were published only after client confirmation. The historical result was 48 confirmed Instagram destinations for 48 profiles.
- A website action required a first-party website, an official social destination that tied the domain to the brand, or another corroborating first-party record.
- Directories, marketplaces, inferred domains, inactive sites and search-result similarity alone did not qualify.
- The resulting historical set contained 29 independently verified official websites. The other 19 profiles remained without a website action rather than receiving a guessed link.

The arithmetic is intentionally visible: `29 + 19 = 48`. “No qualifying live site” is an evidence status, not a negative judgement about a brand.

## Convert verified facts into testable content

The private production content model recorded profile identity, pillar, exact Guidebook page range, bilingual presentation, canonical public destinations, source status and publication state. Automated production tests locked the profile count, pillar distribution, two-page mapping, canonical URL shape, uniqueness and evidence status.

## Public evidence boundary

The identity-bearing records, destination URLs, Guidebook copy and production repository remain private. This portfolio edition therefore publishes a [pseudonymous aggregate audit](../../src/content/guidebook-audit.ts) instead of reconstructing or pretending to redistribute that source. It preserves all 48 two-page mappings, four anonymised pillar IDs and the `48 / 29 / 19` destination-status boundary. Its [public tests](../../src/content/guidebook-audit.test.ts) verify the counts, unique pseudonymous records, page-range shape, pillar distribution and absence of URLs or handles.

This aggregate makes the public arithmetic inspectable; it does not replace the private Guidebook visual audit as the authority for brand identity or client approval.

## Use the Agent inside a review loop

The working loop was:

1. inventory the available sources;
2. state what each source can and cannot prove;
3. convert supported claims into a typed content model;
4. give the Agent a bounded vertical-slice brief;
5. review implementation against product, privacy and failure-path acceptance criteria;
6. verify with tests, browser QA, builds and read-only live checks;
7. record decisions and unresolved facts separately.

Human review remained the control surface: the Agent could propose, extract, research, implement and challenge, but it could not confirm client facts, approve privacy terms or authorise a release.

## Reconstructed-prompt disclosure

The initial one-shot prompt is not preserved in the private Git history. The public [MVP brief](../agent-workflow/reconstructed-mvp-brief.md) is therefore labelled reconstructed, edited and sanitised. It demonstrates how the vertical slice was bounded; it is not presented as a verbatim transcript or as evidence that one prompt produced the final system.

## Related evidence

- Sanitised aggregate: [pseudonymous Guidebook audit](../../src/content/guidebook-audit.ts)
- Public tests: [count, page-range, status and identity-exclusion checks](../../src/content/guidebook-audit.test.ts)
- Diagram: [Guidebook content pipeline SVG](../diagrams/guidebook-content-pipeline.svg) and [Mermaid source](../diagrams/guidebook-content-pipeline.mmd)
- Decision record: [Guidebook content boundaries](../decisions/004-guidebook-content-boundaries.md) and [full Agent workflow](../agent-workflow/evidence-first-workflow.md)
