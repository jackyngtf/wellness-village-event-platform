# Visitor journey

## The problem

A first-time visitor might know very little about the event, its programme or the original Guidebook. The homepage therefore starts by explaining the event and offering a few useful next steps instead of expecting people to understand the document structure.

## The path through the site

The intended path is continuous:

1. understand what Wellness Village is;
2. discover an activity and whether booking is required;
3. review preparation reminders before leaving;
4. find the venue, arrival notes and map; and
5. continue into brand stories and the digital Guidebook.

The homepage turns the middle of that path into three simple tasks: choose an activity, read the before-you-go guidance and plan the visit. The English and Chinese pages use matching section links, so cards, navigation and shared links lead to the same place in either language. Mobile navigation keeps the main tasks easy to reach during the visit.

![A MacBook-and-iPhone composition of the English Wellness Village homepage, using real production captures framed by Chrome and compact Safari chrome.](../media/portfolio-hero.png)

The [visitor-journey diagram](../diagrams/visitor-journey.svg) shows the sequence and where booking moves to The Ground.

## Empty and unavailable states

- Event orientation appears before the visitor has to understand filters or site structure.
- The programme starts with a short preview, then allows filtering by date, category, location, price and booking state without copying the schedule into a second data source.
- Session cards separate timing from booking state and explain that registration continues on The Ground.
- Preparation reminders are placed beside the activity decision, where they can change what a visitor brings or does before arrival.
- The visit experience keeps address and direction actions ahead of detail, then adds arrival notes, the map and a text alternative.
- Empty search results suggest another useful action. If the live feed cannot be loaded, the page says so and keeps a direct link to The Ground instead of showing made-up or stale sessions as current.
- Brand stories and the digital Guidebook remain a continuation of the visit rather than a disconnected archive.

## How I checked it

I checked the delivered journey in mobile Chromium, iPhone/WebKit and desktop Chromium. The checks covered section links, touch targets, keyboard use, language switching, horizontal overflow, link integrity and automated accessibility scans.

The portfolio image is a real application capture. The device frame is a presentation layer; no generated interface is substituted for the delivered product.

## Related code and notes

- Implementation: [guided-home feature](../../src/features/home/) and [bilingual routes](../../src/app/)
- Tests: [visitor-journey component checks](../../src/features/home/) and [route checks](../../src/app/)
- Diagram: [visitor journey SVG](../diagrams/visitor-journey.svg) and [Mermaid source](../diagrams/visitor-journey.mmd)
- Decision record: [The Ground remains the booking source](../decisions/001-the-ground-is-the-live-source.md) and [reconstructed MVP brief](../agent-workflow/reconstructed-mvp-brief.md)
