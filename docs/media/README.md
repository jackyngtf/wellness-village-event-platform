# Portfolio media

[**English**](README.md) · [繁體中文](README.zh-Hant.md)

These files preserve the delivered bilingual interface if the production URL later becomes unavailable. The website areas are unredrawn browser captures; the 3:2 laptop, Chrome, iPhone, Safari and portfolio board are presentation layers. The site is responsive, but its main field use case was a visitor checking activities, preparation notes and directions on a phone before or during the event.

## Media inventory

GIF links open GitHub's image viewer. MP4 links download the original file for playback in your preferred player, bypassing GitHub's file-preview page.

| Walkthrough | English files | Traditional Chinese files | Duration and frames |
| --- | --- | --- | ---: |
| Project overview | [GIF](responsive-scroll-walkthrough.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/responsive-scroll-walkthrough.mp4) · [poster](responsive-scroll-walkthrough-poster.png) | [GIF](responsive-scroll-walkthrough-zh-Hant.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/responsive-scroll-walkthrough-zh-Hant.mp4) · [poster](responsive-scroll-walkthrough-zh-Hant-poster.png) | 24.000 s · GIF 240 / MP4 720 |
| Programme and before-you-go guidance | [GIF](programme-walkthrough.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/programme-walkthrough.mp4) · [poster](programme-walkthrough-poster.png) | [GIF](programme-walkthrough-zh-Hant.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/programme-walkthrough-zh-Hant.mp4) · [poster](programme-walkthrough-zh-Hant-poster.png) | 40.000 s · GIF 400 / MP4 1,200 |
| Venue guide and map | [GIF](venue-guide-walkthrough.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/venue-guide-walkthrough.mp4) · [poster](venue-guide-walkthrough-poster.png) | [GIF](venue-guide-walkthrough-zh-Hant.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/venue-guide-walkthrough-zh-Hant.mp4) · [poster](venue-guide-walkthrough-zh-Hant-poster.png) | 31.000 s · GIF 310 / MP4 930 |
| Brand search and Guidebook story | [GIF](brand-discovery-walkthrough.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/brand-discovery-walkthrough.mp4) · [poster](brand-discovery-walkthrough-poster.png) | [GIF](brand-discovery-walkthrough-zh-Hant.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/brand-discovery-walkthrough-zh-Hant.mp4) · [poster](brand-discovery-walkthrough-zh-Hant-poster.png) | 48.000 s · GIF 480 / MP4 1,440 |
| Digital Guidebook journey | [GIF](guidebook-journey-walkthrough.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/guidebook-journey-walkthrough.mp4) · [poster](guidebook-journey-walkthrough-poster.png) | [GIF](guidebook-journey-walkthrough-zh-Hant.gif) · [H.264 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/guidebook-journey-walkthrough-zh-Hant.mp4) · [poster](guidebook-journey-walkthrough-zh-Hant-poster.png) | 43.000 s · GIF 430 / MP4 1,290 |

All GIFs are 1440 × 900 at 10 fps, use a capture-specific palette of up to 256 colours and loop. The higher-quality MP4 versions are 1600 × 1000, H.264 4:2:0, 30 fps and fast-start enabled. The README shows the overview GIF at the top and the four focused GIFs inside expandable sections. Each walkthrough also links to a 1600 × 1000 static poster and its MP4. GitHub may load GIFs even while their sections are collapsed; the MP4 files are smaller downloads.

The five walkthroughs preserve these tasks:

- **Project overview:** the homepage journey, including programme and brand sections, the contact fields and the complete footer.
- **Programme:** the visible next arrow on desktop and a horizontal swipe on iPhone move through the Experience 101 artwork. The route then covers booking guidance, working date and category controls, activity cards, the hand-off to The Ground and the matching public event record. Because the capture was made after the event, the site says “View event record” and The Ground says “This event has ended”.
- **Venue guide:** address and arrival information, the desktop next arrow and iPhone swipe between both map pages, then both enlarged pages. On desktop, the portrait artwork scrolls inside the viewer while its controls remain fixed; the phone keeps each complete page legible. The route closes on the practical venue notes.
- **Brand discovery:** a category filter, a typed search for event presenter IŚSMEN, its public Instagram profile and official website on both devices, and the p. 66–67 internal Guidebook story. The phone scroll shows how the second page is reached on the smaller viewport.
- **Digital Guidebook:** a homepage entry, the landing page's web and PDF choices, the fast reader, a jump to p. 66, side-by-side desktop and sequential phone reading, reader controls and the next spread. The [entry-flow diagram](../diagrams/guidebook-entry-and-reading-flow.svg) documents the other routes into the same reader.

## How the captures were made

- English routes: `/en`, `/en/programme`, `/en/visit` and `/en/brands`
- Traditional Chinese routes: `/zh-hk`, `/zh-hk/programme`, `/zh-hk/visit` and `/zh-hk/brands`
- Production origin at capture time: <https://www.wellnessvillagehk.com/>
- Capture dates: 18–20 September 2026
- Desktop browser viewport: 1440 × 867 CSS pixels at device scale factor 1, fitted inside a 3:2 display after the simulated Chrome controls
- Mobile browser viewport: 390 × 664 CSS pixels at device scale factor 3, producing 1170 × 1992 source pixels

Captures used fresh, isolated browser contexts with service workers blocked, reduced motion enabled, animation and transitions disabled, and analytics or tracking requests blocked where identifiable. Website mutations—including the contact endpoint—were blocked. Two narrowly matched non-GET requests were permitted: Cloudflare Turnstile's challenge request so the unsubmitted form could show its normal security control, and one named Instagram logged-out GraphQL query needed to keep its public desktop profile visible. The latter was limited by exact host, path and query name; other Instagram POST requests remained blocked. The production floating Instagram action remains in its captured viewport position.

The approved Playwright recordings remain the underlying footage. For this portfolio edition, one shared Remotion layer adds a small cursor, tap ring, swipe trace or mouse-wheel cue only where an action leads to the next state. Ordinary reading and page scrolling remain unmarked; the two enlarged-map scrolls are marked because they explain how the fixed viewer handles portrait artwork. English and Traditional Chinese use the same cue timings, checked against the final rendered frames. FFmpeg produces the final MP4 and GIF files. This overlay did not rebuild, edit or redeploy the production website.

The Programme and Brand walkthroughs use ordinary GET navigation to three named public destinations: one matching The Ground event record, IŚSMEN's Instagram profile and its official website. The capture did not sign in, follow an account, submit a form, start booking or payment, or make a cookie choice. A local Instagram sign-in prompt was dismissed so the already-public profile remained visible. The destination and return path are recorded on both devices. These third-party views record what was publicly visible on 20 September 2026; they are not an uptime or future-availability claim.

The Traditional Chinese programme route returned HTTP 404 on the production origin during the 20 September re-capture, while its sitemap entry, source route and other bilingual routes remained present. That one walkthrough was therefore captured from the same local production checkout. Before recording, its six event IDs, first five The Ground destinations and all nine reminder-image paths were compared with the live English route and matched. No production change or redeployment was made for this portfolio update.

Any names, email addresses or phone-number strings visible in the contact section are placeholders published by the production form. They are not submitted personal data and no values were entered during capture.

## Device-frame credits

- 3:2 laptop shell: adapted from the MacBook geometry in [react-mockframe](https://github.com/mbdev3/react-mockframe), source revision `c2e114b46cc252aedb8701d5e7b7a532b5fa2cc6`, MIT, © 2026 Mohammed Banani. Its styles are adapted from Marvel `devices.css`, MIT, © 2014 Marvelapp.
- iPhone geometry, Dynamic Island, safe areas and compact Safari chrome: [liquidframe](https://github.com/CVERInc/liquidframe), repository `main` inspected 17 September 2026, MIT, © 2026 liquidframe contributors.

Both libraries provide only the rendered presentation frame. They do not replace, generate or redraw the production interface. This repository contains the rendered PNG, GIF and MP4 outputs, not either library's source or CSS; see [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).

## How these captures may be used

These captures are approved documentary portfolio material. They do not grant downstream users permission to extract or reuse campaign artwork, brand marks, photography, fonts, copy or other client/third-party material visible inside the interface. A future software licence will apply only to expressly covered original code and will not relicense these media. See [ASSET_POLICY.md](../../ASSET_POLICY.md).
