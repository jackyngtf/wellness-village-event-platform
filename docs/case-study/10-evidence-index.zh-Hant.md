# 實作索引

[English](10-evidence-index.md) · [**繁體中文**](10-evidence-index.zh-Hant.md)

這是主要故事背後的參考層，把項目細節連到相關程式碼、測試或有日期紀錄，避免每篇內容都被重複引證打斷。真實品牌名稱及可識別 Guidebook 紀錄維持私人；公開審計只保留匿名總數。

| 作品集所述內容 | 相關程式碼或紀錄 | 核對方式 | 說明及限制 |
| --- | --- | --- | --- |
| ELLE Hong Kong 公開介紹記錄活動為期 12 日、橫跨中環街市三層，並有 50+ 品牌及 30+ 工作坊與體驗。 | [背景與角色](01-context-and-role.zh-Hant.md) | 這是公開活動背景，不是應用程式測試 | [ELLE Hong Kong 活動介紹](https://www.elle.com.hk/life/wellness-village-elle-hong-kong-issmen)；背景章節亦列明不能作因果推論 |
| 8 月 5 日在購買網域前提供首個家中伺服器 MVP；8 月 20 日分享正式網址，早於 8 月 21 日內部目標一日，其後仍有小型修正。 | [交付時間線](delivery-timeline.zh-Hant.md)及[時間線圖](../diagrams/delivery-evolution.zh-Hant.svg) | 以有 timestamp 的私人項目紀錄及獲授權網域紀錄核對；不是應用程式測試 | [經整理時間線說明](../evidence/delivery-timeline/README.zh-Hant.md)及[帳單與網域摘要](../evidence/production-metrics/billing-and-domain-summary.json) |
| 8 月 27 日網站短暫回傳 Error 1102；共享帳戶轉到 Workers Paid，CPU-heavy request path 亦在活動前減少。 | [交付時間線](delivery-timeline.zh-Hant.md) | 對照有日期的私人營運紀錄、其後帳戶方案狀態及 implementation history；不把任何一項改動稱為唯一修復 | [流量與成本章節](07-production-economics-and-observability.zh-Hant.md#活動前的資源限制事故)及[帳單摘要](../evidence/production-metrics/billing-and-domain-summary.json) |
| 首次到訪者可以由活動簡介前往選擇活動、準備提示、到場支援及品牌內容。 | [首頁導覽功能](../../src/features/home/)及[雙語 routes](../../src/app/) | [首頁及 route tests](../../src/features/home/) | [訪客流程](03-visitor-journey.zh-Hant.md)及[圖表](../diagrams/visitor-journey.zh-Hant.svg) |
| Guidebook 審閱產生四個主題及 48 個準確兩頁專題紀錄。 | [匿名彙總審計](../../src/content/guidebook-audit.ts) | [數量、主題及頁碼範圍測試](../../src/content/guidebook-audit.test.ts) | [由已審閱內容到訪客介面](02-guidebook-and-agent-workflow.zh-Hant.md#由已審閱內容到訪客介面)及 [ADR 004](../decisions/004-guidebook-content-boundaries.zh-Hant.md) |
| 48 個專題均有客戶確認 Instagram；29 個有獨立核對的官方網站，19 個維持沒有網站按鈕。 | [經整理連結狀態審計](../../src/content/guidebook-audit.ts) | [狀態及身份移除測試](../../src/content/guidebook-audit.test.ts) | [我親自核對的部分](02-guidebook-and-agent-workflow.zh-Hant.md#我親自核對的部分) |
| 英文及繁體中文 routes 共用相同 information architecture。 | [Locale routes 及 dictionaries](../../src/app/) | [Locale 及 route parity tests](../../src/app/) | [重建版 MVP brief](../agent-workflow/reconstructed-mvp-brief.zh-Hant.md) |
| The Ground acquisition 按 organisation scope、只在 server side 執行、有 pagination limits，並在呈現前移除不需要資料。 | [Adapter、schema 及 normaliser](../../src/integrations/the-ground/) | [Adapter contract tests](../../src/integrations/the-ground/) | [ADR 001](../decisions/001-the-ground-is-the-live-source.zh-Hant.md) |
| 活動卡階段及今日／即將舉行／已結束導覽使用香港時間，並處理午夜及跨日邊界。 | [HKT event-time module](../../src/features/programme/the-ground-event-time.ts) | [HKT boundary tests](../../src/features/programme/) | [The Ground 章節](04-the-ground-event-interface.zh-Hant.md) |
| 活動類別只使用已確認完整字句及經審閱 alias；可多重分類，未匹配活動保留為 `other`。 | [Category module](../../src/features/programme/event-categories.ts) | [Deterministic classification tests](../../src/features/programme/) | [活動資料介面章節](04-the-ground-event-interface.zh-Hant.md) |
| 節目結果維持 live → upcoming → recent-past 次序及有效 URL-backed filters。 | [Programme feature](../../src/features/programme/) | [排序及 filter tests](../../src/features/programme/) | [活動資料介面章節](04-the-ground-event-interface.zh-Hant.md) |
| 真實非 honeypot 提交只在 Queue 接受後回傳 `202 Accepted`；honeypot 收到相同 `202` 但不入 Queue；兩者都不代表同步寫入 Google Sheets。 | [Interest API route](../../src/app/api/interest/)及 [Queue producer](../../src/features/interest/) | [Awaited Queue、honeypot 及 Queue failure tests](../../src/features/interest/) | [ADR 003](../decisions/003-queue-before-google-sheets.zh-Hant.md) |
| Consumer 驗證準確 14 欄 `A:N` contract，只以 `RAW` append 未見過的資料列。 | [私人 consumer source](../../workers/contact-sheet-consumer/src/) | [Contract 及 Sheets adapter tests](../../workers/contact-sheet-consumer/src/) | [Queue-to-Sheets 章節](05-queue-to-sheets-interface.zh-Hant.md) |
| Stable IDs、same-batch collapse 及 read-before-append 讓一般重試收斂，但不宣稱 exactly-once delivery。 | [Consumer deduplication](../../workers/contact-sheet-consumer/src/) | [Existing ID、duplicate 及 timeout-after-commit tests](../../workers/contact-sheet-consumer/src/) | [ADR 003](../decisions/003-queue-before-google-sheets.zh-Hant.md) |
| Google 憑證只存在於不公開 consumer Worker；瀏覽器及網站 Worker 不會收到。 | [公開 producer](../../src/features/interest/)及[私人 consumer source](../../workers/contact-sheet-consumer/src/) | [Configuration-boundary tests](../../src/) | [Queue-to-Sheets 章節](05-queue-to-sheets-interface.zh-Hant.md) |
| 已交付 full-stack runtime 是 Cloudflare Workers 上的 OpenNext，配合 R2 incremental cache 及 Durable Object revalidation。 | [OpenNext config](../../open-next.config.ts)及 [Wrangler config](../../wrangler.jsonc) | [Cloudflare configuration-contract tests](../../tests/cloudflare-config.test.ts) | [ADR 002](../decisions/002-workers-not-static-pages.zh-Hant.md) |
| 活動時段記錄 108,443 edge requests、4,322 HTML page responses、4.34 GB 傳輸、78.5% cached response bytes 及約 35,600 Worker invocations。 | [經整理彙總紀錄](../evidence/production-metrics/event-window-aggregates.json) | 以獲授權 read-only Cloudflare analytics 核對；不是應用程式測試 | [指標定義及排除項目](../evidence/production-metrics/README.zh-Hant.md)及[流量與成本章節](07-production-economics-and-observability.zh-Hant.md) |
| Workers Paid 已啟用，當時帳戶基本月費最低 US$5；完整 8 月 12 日至 9 月 11 日帳單週期的額外用量費為 US$0.00；Porkbun 首年網域費為 US$11.08。 | [經整理帳單與網域紀錄](../evidence/production-metrics/billing-and-domain-summary.json) | 對照 read-only dashboard、當時價目表及網域 invoice；識別資料已移除 | [成本呈現方式](07-production-economics-and-observability.zh-Hant.md#成本如何呈現)及[量度邊界圖](../diagrams/production-measurement-boundaries.zh-Hant.svg) |
| 正式網站提供可抓取 `robots.txt` 及 12 URL 雙語 sitemap；Google submitted-sitemap 紀錄顯示 `Success`，9 月 14 日讀取後有 12 個 discovered pages。 | [保留 endpoint snapshots 及經整理 Search Console 紀錄](../evidence/search-discoverability/README.zh-Hant.md) | 在獲授權 read-only Chrome session 內核對 Domain property | [Search Console 章節](08-search-discoverability.zh-Hant.md)及[來源說明](../evidence/search-discoverability/README.zh-Hant.md) |
| 與 12 個活動日期對齊的 PT 時段記錄 112 clicks、362 impressions、30.9% CTR 及 average position 3.5；9 月 14 日 snapshot 顯示已提交 URL 中 6/12 indexed。 | [經整理 Search Console 紀錄](../evidence/search-discoverability/search-console-summary.json) | 核對 property totals、daily rows 及 sitemap-scoped indexing；不是應用程式測試 | [日期及 aggregation 說明](08-search-discoverability.zh-Hant.md#活動日期內的搜尋結果) |

## 延伸閱讀

- 實作：[應用程式 source](../../src/)及[私人 contact-sheet consumer source](../../workers/contact-sheet-consumer/src/)
- 測試：[同目錄應用程式 tests](../../src/)及 [consumer tests](../../workers/contact-sheet-consumer/src/)
- 圖表：[架構圖索引](../diagrams/README.zh-Hant.md)
- 營運紀錄：[交付時間線](../evidence/delivery-timeline/README.zh-Hant.md)、[正式環境指標](../evidence/production-metrics/README.zh-Hant.md)及[搜尋紀錄](../evidence/search-discoverability/README.zh-Hant.md)
- 決定：[ADR 001](../decisions/001-the-ground-is-the-live-source.zh-Hant.md)、[ADR 002](../decisions/002-workers-not-static-pages.zh-Hant.md)、[ADR 003](../decisions/003-queue-before-google-sheets.zh-Hant.md)及 [ADR 004](../decisions/004-guidebook-content-boundaries.zh-Hant.md)
