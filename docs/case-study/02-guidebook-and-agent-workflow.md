# How I used an Agent without losing track of the source

The Agent was useful for organising a large amount of material and speeding up repetitive work. The important part was deciding what each source could tell us before asking the Agent to write content or code.

## Each source had a different job

| Source | Used for | Not used for |
| --- | --- | --- |
| Guidebook | Brand profiles, campaign story, four themes and page ranges | Current sessions, booths, sponsorship or booking availability |
| The Ground | Public activity times, prices, availability and registration links | Brand stories, venue operations or participation outside its listings |
| Approved venue and campaign material | Address, visitor guidance, map and visual direction | Details that were not supplied or confirmed |
| Public brand pages | Checking an official website or social account | Proving participation in the event |

If a detail could not be confirmed, it stayed missing, pending or unavailable. I did not ask the Agent to fill the gap with a plausible answer.

## Reviewing the Guidebook

The main source was a 184-page Guidebook. I kept its file details and checksum in the private project record, rendered every page and checked the pages visually. Text extraction and OCR helped create a first pass, but I did not rely on them for brand names, headings or page boundaries.

The final structure contained four themes and 48 profiles, each covering an exact two-page range. I then represented that structure as typed content rather than copying loose text directly into page components.

## Checking official links

The Agent helped collect possible first-party destinations. I reviewed those candidates before publication:

- The client confirmed the Instagram destination for all 48 profiles.
- I added a website only when an official site or another first-party page connected the domain to the brand.
- Directories, marketplaces, guessed domains, inactive pages and name similarity were not enough.
- I confirmed 29 official websites. The remaining 19 profiles stayed without a website button.

This is why the total is shown as `29 + 19 = 48`. “No website button” only describes what I could confirm at the time; it is not a judgement about the brand.

## Turning the checked content into code

The private production content recorded the profile, theme, Guidebook page range, bilingual presentation, public destinations and whether each item was ready to publish. Tests checked the profile count, theme distribution, two-page mapping, URL format, duplicate records and link status.

These tests did not decide whether a brand fact was true. They made sure the reviewed content was represented consistently in the application.

## What this public repository can show

The original profile names, links, Guidebook copy and production repository remain private. Instead, this portfolio includes an [anonymised audit](../../src/content/guidebook-audit.ts) with all 48 page mappings, four anonymous theme IDs and the `48 / 29 / 19` link totals. The [public tests](../../src/content/guidebook-audit.test.ts) check those numbers and also check that no real URL or social handle is present.

This makes the counts reviewable without republishing the client material.

## Reviewing Agent output

The working loop was straightforward:

1. list the material available for the task;
2. note what each source covered;
3. turn confirmed details into structured content;
4. give the Agent a small, specific piece of work;
5. review the result against the product, privacy and failure cases;
6. run tests, browser checks and builds; and
7. keep unresolved questions separate from completed work.

The Agent could suggest, extract, research, code and challenge an approach. It could not confirm a client fact, approve personal-data handling or decide to release the site.

The first home-server MVP on 5 August was the start of this review loop. During the following two weeks I added the current Guidebook and design material, The Ground integration, client UX feedback, privacy controls and production setup. The [delivery timeline](delivery-timeline.md) shows those stages.

## About the example MVP brief

The original first prompt is not preserved in the private Git history. The public [MVP brief](../agent-workflow/reconstructed-mvp-brief.md) was written afterwards from the delivered requirements, then edited to remove private details. It is an example of how the first slice could be scoped, not a transcript and not a claim that one prompt built the finished site.

## Related material

- Public audit: [anonymised Guidebook counts](../../src/content/guidebook-audit.ts)
- Tests: [count, page-range, link-status and identity-removal checks](../../src/content/guidebook-audit.test.ts)
- Diagram: [Guidebook content flow](../diagrams/guidebook-content-pipeline.svg) and [Mermaid source](../diagrams/guidebook-content-pipeline.mmd)
- Decision: [how Guidebook content was used](../decisions/004-guidebook-content-boundaries.md)
- Working notes: [Agent workflow](../agent-workflow/working-with-an-agent.md)
