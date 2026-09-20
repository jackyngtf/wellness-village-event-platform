# What I would keep and change next time

[**English**](09-lessons-and-limitations.md) · [繁體中文](09-lessons-and-limitations.zh-Hant.md)

This was a short event project, not a controlled product study. The most useful retrospective is therefore practical: which choices helped me deliver, and what information would make the next edition easier to evaluate?

## What I would keep

### Start with a reviewable vertical slice

The home-server MVP gave the client a page to open and discuss before the production domain existed. I would use the same approach again: make the riskiest part of the experience concrete early, while keeping the difference between “ready to review” and “ready to launch” clear.

### Give the Agent small jobs with a named source

A long prompt did not remove the need to check the Guidebook, The Ground or a client decision. The Agent was most useful when it received one bounded task, the relevant material and a visible completion check. Product judgement, ambiguous facts, privacy and release stayed with me.

### Let each external system keep one job

The Ground kept the changing programme and booking flow. Google Sheets was the intentionally small contact destination for a first edition with modest expected volume and an uncertain future workflow. Cloudflare Queue joined the public form to the private consumer. This avoided maintaining duplicate schedules or introducing a larger datastore before it was needed.

### Test the journey on real devices

The physical-phone review exposed the placement of before-you-go guidance, swipe affordance, spacing and language-switch behaviour more clearly than a desktop responsive frame. Automated checks remained useful, but they complemented rather than replaced that review.

### Prepare failure states before the event

Timeouts, response limits, a recent programme copy, stable submission IDs, retries, duplicate checks and a dead-letter Queue gave the short campaign sensible boundaries. I would still keep an operator responsible for retention, withdrawal requests and failed-message recovery.

## What I would add next time

1. **Short task tests before launch.** Ask several first-time visitors to explain the event, find an activity, check booking and locate arrival guidance. Record completion, time and points of confusion.
2. **Privacy-conscious journey counts.** Define programme views, outbound booking clicks and accepted contact submissions before launch, including the denominator and consent basis, without sending form values to analytics.
3. **An update-time measure.** Record how long a programme correction takes to appear and how often the team has to clarify it. Fixed Guidebook profiles would still change only through an editorial decision.
4. **A second reviewer.** Ask another designer, accessibility reviewer or engineer to repeat the main visitor tasks and selected release checks.
5. **Longer-lived performance data.** If the site remains online long enough, review field Core Web Vitals rather than treating lab checks as real-user results.

## Where this design stops

| Area | Current boundary | When to reconsider it |
| --- | --- | --- |
| **The Ground** | A limited public-catalogue integration with a short in-memory fallback, not a formal partner API | Agree access, polling and content-reuse terms for a long-term commercial integration |
| **Google Sheets** | A small, single-writer destination with at-least-once Queue delivery and operational duplicate checks | Move uniqueness and concurrent writes into a transactional datastore when volume or workflow grows |
| **Public portfolio** | Selected code, synthetic fixtures and approved media; no private history, personal data, credentials or restricted source material | Reconfirm rights and redaction whenever new material is added |
| **Measurement** | Dated delivery, traffic, billing and Search Console records, but no attendance, conversion, productivity, SLA or ROI study | Decide success measures and collection method before the next launch |

The available records are enough to describe what I built, how the main paths behaved and what the production services recorded. I do not use them to claim that the website caused higher attendance, conversion or commercial return.

Reference notes: [delivery record](delivery-timeline.md) · [traffic and cost](07-production-economics-and-observability.md) · [search discovery](08-search-discoverability.md) · [implementation map](10-evidence-index.md) · [architecture decisions](../decisions/README.md)
