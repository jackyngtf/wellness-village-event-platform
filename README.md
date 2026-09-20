<!-- section:hero -->
# Wellness Village event website

[**English**](README.md) · [繁體中文](README.zh-Hant.md)

![Laptop and iPhone views of the English Wellness Village website, moving through the introduction, programme, brand stories, contact form and footer.](docs/media/responsive-scroll-walkthrough.gif)

[View the static poster](docs/media/responsive-scroll-walkthrough-poster.png) · [Download the H.264 walkthrough](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/responsive-scroll-walkthrough.mp4)

Wellness Village had a 184-page Guidebook, programme listings on The Ground and a need to collect enquiries—but those pieces lived in different places. As sole developer, I turned them into one bilingual website for a 12-day event at Central Market in Hong Kong.

I took the project from a same-day home-server MVP to event support. The client supplied the campaign material and approvals; I handled the product structure, public research, content preparation, full-stack build, Cloudflare setup and launch. An Agent assisted with bounded tasks, while I retained the product, privacy and release decisions.

[Visit the campaign site](https://www.wellnessvillagehk.com/en) · [Read the story behind the build](docs/case-study/README.md) · [Inspect the implementation map](docs/case-study/10-evidence-index.md)

> **Portfolio note:** This separate reconstruction uses synthetic data and excludes the private repository, credentials, personal data, messages and restricted assets. See [NOTICE.md](NOTICE.md) and [ASSET_POLICY.md](ASSET_POLICY.md).

<!-- section:project-summary -->
## Project at a glance

| | |
| --- | --- |
| **Event** | Wellness Village at Central Market, presented by ELLE Hong Kong and IŚSMEN; 12 days across three floors, with 50+ brands and 30+ workshops and experiences reported by ELLE Hong Kong |
| **My role** | Sole developer, from the first reviewable MVP to launch and event support |
| **Delivery** | Home-server preview on 5 August; production URL shared on 20 August, before the 21 August internal target; event ran from 30 August to 10 September 2026 |
| **Languages** | English and Traditional Chinese with matching information architecture |
| **Primary use** | Responsive on phones and desktops; the visitor journey was designed mainly for phone use before and during the event |
| **Main stack** | Next.js, TypeScript, OpenNext, Cloudflare Workers, Queues, R2, Durable Objects, Turnstile and Google Sheets API |
| **Public copy** | Runs with synthetic content and no production credentials |

[ELLE Hong Kong's event introduction](https://www.elle.com.hk/life/wellness-village-elle-hong-kong-issmen) provides the event context.

<!-- section:experience -->
## A short product tour

The film above reaches the contact form and footer. Expand any of the four sections below to see the visitor journey on desktop and iPhone, even if the campaign URL is retired.

<details>
<summary><strong>Programme and before-you-go guidance</strong> — 40 seconds</summary>

![Programme walkthrough on a laptop and iPhone.](docs/media/programme-walkthrough.gif)

Use the visible next arrow on desktop or swipe on iPhone to move through the Experience 101 reminders, filter the post-event activity records, then open the corresponding public page on The Ground. The recording keeps the provider's “This event has ended” state rather than implying that registration is still open.

[View the static poster](docs/media/programme-walkthrough-poster.png) · [Download the MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/programme-walkthrough.mp4) · [Follow the programme data](docs/case-study/04-the-ground-event-interface.md)

</details>

<details>
<summary><strong>Venue guide and map</strong> — 31 seconds</summary>

![Venue guide walkthrough on a laptop and iPhone.](docs/media/venue-guide-walkthrough.gif)

Keep the address and arrival notes together, then move between both map pages with the desktop arrows or an iPhone swipe. In the enlarged desktop viewer, the controls stay fixed while each portrait map scrolls from top to bottom; the phone keeps the complete page in view.

[View the static poster](docs/media/venue-guide-walkthrough-poster.png) · [Download the MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/venue-guide-walkthrough.mp4) · [Read the visitor-journey notes](docs/case-study/03-visitor-journey.md)

</details>

<details>
<summary><strong>Brand search and Guidebook stories</strong> — 48 seconds</summary>

![Brand-search walkthrough on a laptop and iPhone.](docs/media/brand-discovery-walkthrough.gif)

Search for event presenter IŚSMEN among 48 Guidebook profiles, open its public Instagram and official website on both devices, then read both pages of its internal Guidebook story.

[View the static poster](docs/media/brand-discovery-walkthrough-poster.png) · [Download the MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/brand-discovery-walkthrough.mp4) · [Read how the Guidebook became web content](docs/case-study/02-guidebook-and-agent-workflow.md)

</details>

<details>
<summary><strong>Digital Guidebook paths and reader</strong> — 43 seconds</summary>

![Digital Guidebook walkthrough on a laptop and iPhone.](docs/media/guidebook-journey-walkthrough.gif)

Open the digital edition from the homepage, choose the faster web reader, jump to page 66, compare the two-page desktop spread with sequential phone reading, then continue to the next spread. A separate diagram maps the other Guidebook entry points used across the site.

[View the static poster](docs/media/guidebook-journey-walkthrough-poster.png) · [Download the MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/guidebook-journey-walkthrough.mp4) · [See every Guidebook entry path](docs/diagrams/guidebook-entry-and-reading-flow.svg) · [Read the content workflow](docs/case-study/02-guidebook-and-agent-workflow.md)

</details>

[View all media and capture notes](docs/media/README.md)

<!-- section:built -->
## Three sources, one visitor journey

![System diagram showing the fixed Guidebook content, programme data from The Ground and the contact form path to Google Sheets.](docs/diagrams/system-overview.svg)

| Starting point | What I built around it | Result for the visitor or organiser |
| --- | --- | --- |
| **184-page Guidebook** | I mapped 48 two-page profiles into four themes and checked public destinations. | Visitors could search the supplied stories. All 48 Instagram links were client-confirmed; 29 profiles gained a verified website and 19 kept no guessed button. |
| **The Ground catalogue** | A server adapter validates organisation-scoped listings, converts time to HKT and derives Today, Upcoming and Past. | Visitors browse on the event site, then return to The Ground to register. |
| **Contact form** | After validation, Turnstile and rate limits, Queue passes submissions to a private Sheets consumer. | The first edition gained a simple list without exposing Google credentials or choosing a database before the future workflow was known. |

OpenNext ran the application on Cloudflare Workers. R2 and Durable Objects supported cache and revalidation; they do not store contact submissions. [Architecture decisions](docs/decisions/README.md).

<!-- section:delivery -->
## What changed between the MVP and launch

The small 5 August preview gave the client a real page to review before the production domain existed. I then worked through the current Guidebook, public brand research, programme integration, privacy controls and release setup, returning to the organising team only for facts or approvals I could not resolve.

Testing the journey on a phone also changed the interface. The before-you-go reminders originally sat below the activity list, where a visitor could leave for The Ground without seeing them. I moved those reminders before the listings, removed duplicate text cards and made all nine images directly swipeable. I also connected the homepage, programme and venue guidance as one route rather than three unrelated pages.

Production was shared on 20 August, ahead of the 21 August target; launch work continued before the event opened on 30 August. The Agent assisted with named, checkable tasks. I reviewed its output, tested the site and made the decisions.

[See the working method](docs/agent-workflow/working-with-an-agent.md) · [Open the dated delivery record](docs/case-study/delivery-timeline.md)

<!-- section:production -->
## What the launch record shows

| Recorded item | Result |
| --- | ---: |
| Cloudflare edge requests during the event window | 108,443 |
| Successful HTML page responses | 4,322 |
| Data delivered / response bytes cached / Worker invocations | 4.34 GB / 78.5% / approximately 35,600 |
| Google Search clicks / impressions in the event-aligned period | 112 / 362 |
| Workers baseline / additional usage in the complete billing period | US$5 account/month minimum / US$0.00 |
| Direct first-year domain registration | US$11.08 |

The paid figure is an account baseline, not a project-only invoice; US$0.00 means additional usage. Requests are not people, and the project did not measure attendance, conversion or ROI.

The reports use different day boundaries: UTC for edge traffic, HKT for Worker activity and PT for Search Console. The linked notes retain the exact windows.

[Read the traffic and cost note](docs/case-study/07-production-economics-and-observability.md) · [Read the Search Console note](docs/case-study/08-search-discoverability.md) · [See what I would change next time](docs/case-study/09-lessons-and-limitations.md)

<!-- section:explore -->
## Read the story in six parts

1. [A deadline, scattered inputs and one developer](docs/case-study/01-context-and-role.md)
2. [Turning a 184-page Guidebook into usable content](docs/case-study/02-guidebook-and-agent-workflow.md)
3. [What changed after testing the journey on a phone](docs/case-study/03-visitor-journey.md)
4. [Using The Ground without rebuilding booking](docs/case-study/04-the-ground-event-interface.md)
5. [Keeping lead capture simple without exposing Google credentials](docs/case-study/05-queue-to-sheets-interface.md)
6. [Launching on Cloudflare and handling the first incident](docs/case-study/06-cloudflare-delivery.md)

For reference: [delivery record](docs/case-study/delivery-timeline.md) · [implementation map](docs/case-study/10-evidence-index.md) · [architecture decisions](docs/decisions/README.md)

<details>
<summary><strong>Run the synthetic demo locally</strong></summary>

Use the latest Node.js 22.x (minimum 22.13.0, matching CI). The demo uses synthetic events and brands by default. It does not need production credentials or a live connection to The Ground, Google or Cloudflare.

The films show the delivered site. The local app is a reduced reference with four fictional brand profiles and an explanatory Guidebook page, without the production reader, contact-form UI or licensed campaign assets. The contact API and Queue consumer remain inspectable references, disabled by default.

```sh
npm ci
npm run dev
```

Open [the English demo](http://localhost:3000/en) or [the Traditional Chinese demo](http://localhost:3000/zh-hk). Run `npm run check` for documentation, application and Queue-consumer checks, or `npm run check:cloudflare` for binding checks and deployment dry runs. The GitHub Actions workflow runs both; neither command deploys. Live integrations stay off unless explicitly configured.

</details>

<details>
<summary><strong>What this public copy leaves out</strong></summary>

The private production repository, restricted assets, credentials, correspondence and visitor records are not included. This portfolio is not released under an open-source licence. [Notice](NOTICE.md) · [Asset policy](ASSET_POLICY.md) · [Security](SECURITY.md)

</details>

If you would like to discuss a similar event, content or integration project, connect with me on [LinkedIn](https://www.linkedin.com/in/jackyng-tf/).
