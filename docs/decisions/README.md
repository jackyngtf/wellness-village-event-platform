# Architecture decisions

[**English**](README.md) · [繁體中文](README.zh-Hant.md)

These short records explain the main boundaries used by the delivered website and retained in the public edition:

| Decision | Why it mattered here | Detailed chapter | Diagram |
| --- | --- | --- | --- |
| [Keep current schedules and booking on The Ground](001-the-ground-is-the-live-source.md) | Avoid a second timetable while giving visitors a clearer way to browse | [Programme interface](../case-study/04-the-ground-event-interface.md) | [Data flow](../diagrams/the-ground-event-interface.svg) |
| [Use OpenNext on Cloudflare Workers](002-workers-not-static-pages.md) | Preserve server rendering, API routes, private adapters and Queue production | [Cloudflare delivery](../case-study/06-cloudflare-delivery.md) | [System overview](../diagrams/system-overview.svg) |
| [Put a Queue before Google Sheets](003-queue-before-google-sheets.md) | Keep Google credentials and response time outside the public request | [Contact flow](../case-study/05-queue-to-sheets-interface.md) | [Sequence](../diagrams/queue-to-sheets-sequence.svg) |
| [Use the Guidebook for fixed editorial content](004-guidebook-content-boundaries.md) | Keep approved brand stories separate from changing operational data | [Guidebook workflow](../case-study/02-guidebook-and-agent-workflow.md) | [Content pipeline](../diagrams/guidebook-content-pipeline.svg) |

They document project decisions, not universal recommendations. The case-study chapters provide the surrounding implementation and evidence.
