# Portfolio media provenance

These files preserve the delivered bilingual interface if the production URL later becomes unavailable. The website areas are unredrawn browser captures; the laptop, Chrome, iPhone, Safari and portfolio board are presentation layers.

## Media inventory

| File | Locale and use | Technical details |
| --- | --- | --- |
| portfolio-hero.png | English static cover and reduced-motion poster | PNG, 1600 × 1000 |
| portfolio-hero-zh-Hant.png | Traditional Chinese static cover and reduced-motion poster | PNG, 1600 × 1000 |
| responsive-scroll-walkthrough.gif | English inline GitHub walkthrough | GIF, 1200 × 750, 72 frames at 8 fps, 9 seconds, loops |
| responsive-scroll-walkthrough-zh-Hant.gif | Traditional Chinese inline GitHub walkthrough | GIF, 1200 × 750, 72 frames at 8 fps, 9 seconds, loops |
| responsive-scroll-walkthrough.mp4 | English higher-quality walkthrough | H.264 MP4, 1600 × 1000, yuv420p, 72 frames at 8 fps, 9 seconds, faststart |
| responsive-scroll-walkthrough-zh-Hant.mp4 | Traditional Chinese higher-quality walkthrough | H.264 MP4, 1600 × 1000, yuv420p, 72 frames at 8 fps, 9 seconds, faststart |

Use the GIF for the default inline GitHub presentation and link the MP4 as the higher-quality alternative. Use the matching portfolio-hero PNG whenever animation is unavailable or the reader requests reduced motion; the hero PNG is the poster, so there is no separate poster asset.

Suggested English alt text:

> MacBook and iPhone views of the English Wellness Village experience moving through event orientation, programme discovery, brand stories and the contact journey.

Suggested Traditional Chinese alt text:

> MacBook 與 iPhone 畫面展示 Wellness Village 繁體中文體驗，依序呈現活動導覽、節目探索、品牌故事及聯絡流程。

## Capture sources and method

- English interface: <https://www.wellnessvillagehk.com/en>
- Traditional Chinese interface: <https://www.wellnessvillagehk.com/zh-hk>
- Capture date: 18 September 2026
- Desktop browser viewport: 1440 × 807 CSS pixels at device scale factor 1
- Mobile browser viewport: 390 × 664 CSS pixels at device scale factor 3, producing 1170 × 1992 source pixels

Captures used fresh, isolated browser contexts with service workers blocked, reduced motion enabled, animation and transitions disabled, and analytics or tracking requests blocked where identifiable. Network requests were limited to GET navigation, image, font and other read-only asset loading. No form was submitted and no booking, Instagram or other external action was clicked. The production floating Instagram action remains in its captured viewport position.

Any names, email addresses or phone-number strings visible in the contact section are placeholders published by the production form. They are not submitted personal data and no values were entered during capture.

## Device-frame attribution

- MacBook geometry: [react-mockframe](https://github.com/mbdev3/react-mockframe), source revision `c2e114b46cc252aedb8701d5e7b7a532b5fa2cc6`, MIT, © 2026 Mohammed Banani. Its styles are adapted from Marvel `devices.css`, MIT, © 2014 Marvelapp.
- iPhone geometry, Dynamic Island, safe areas and compact Safari chrome: [liquidframe](https://github.com/CVERInc/liquidframe), repository `main` inspected 17 September 2026, MIT, © 2026 liquidframe contributors.

Both libraries provide only the rendered presentation frame. They do not replace, generate or redraw the production interface. This repository contains the rendered PNG, GIF and MP4 outputs, not either library's source or CSS; see [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).

## Documentary-use boundary

These captures are approved documentary portfolio material. They do not grant downstream users permission to extract or reuse campaign artwork, brand marks, photography, fonts, copy or other client/third-party material visible inside the interface. A future software licence will apply only to expressly covered original code and will not relicense these media. See [ASSET_POLICY.md](../../ASSET_POLICY.md).
