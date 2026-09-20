# 架構決定

[English](README.md) · [**繁體中文**](README.zh-Hant.md)

以下短篇紀錄說明已交付網站的主要系統邊界，以及公開版本如何保留這些做法：

| 決定 | 為何適合本項目 | 詳細章節 | 圖表 |
| --- | --- | --- | --- |
| [最新節目及報名維持在 The Ground](001-the-ground-is-the-live-source.zh-Hant.md) | 不另建第二份時間表，同時讓訪客更容易瀏覽 | [節目介面](../case-study/04-the-ground-event-interface.zh-Hant.md) | [資料流程](../diagrams/the-ground-event-interface.zh-Hant.svg) |
| [透過 OpenNext 在 Cloudflare Workers 執行](002-workers-not-static-pages.zh-Hant.md) | 保留 server rendering、API routes、私人 adapters 及 Queue production | [Cloudflare 交付](../case-study/06-cloudflare-delivery.zh-Hant.md) | [系統總覽](../diagrams/system-overview.zh-Hant.svg) |
| [先放入 Queue，再寫入 Google Sheets](003-queue-before-google-sheets.zh-Hant.md) | 讓 Google 憑證及回應時間離開公開請求 | [聯絡資料流程](../case-study/05-queue-to-sheets-interface.zh-Hant.md) | [流程圖](../diagrams/queue-to-sheets-sequence.zh-Hant.svg) |
| [Guidebook 只作固定編輯內容](004-guidebook-content-boundaries.zh-Hant.md) | 把已批准品牌內容與會改動的營運資料分開 | [Guidebook 工作流程](../case-study/02-guidebook-and-agent-workflow.zh-Hant.md) | [內容流程](../diagrams/guidebook-content-pipeline.zh-Hant.svg) |

這些是本項目的決定，不是適用於所有項目的通用建議。案例研究各章會補充實作及證據。
