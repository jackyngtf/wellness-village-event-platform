# 流量與成本紀錄

[English](README.md) · [**繁體中文**](README.zh-Hant.md)

本目錄保留 Wellness Village 網站在活動日期內的 aggregate record，讓活動網址或帳戶 dashboard 日後不可用時，作品集仍有主要營運數字。

## 來源及擷取範圍

- 擷取日期：2026 年 9 月 18 日
- 來源：獲授權 read-only Cloudflare GraphQL Analytics API queries
- Zone reporting window：2026 年 8 月 30 日至 9 月 10 日 UTC daily roll-ups（包括首尾日期）
- Worker 及 storage reporting window：2026 年 8 月 30 日 00:00 至 9 月 11 日 00:00，`Asia/Hong_Kong`
- 公開紀錄：[`event-window-aggregates.json`](event-window-aggregates.json)
- 計費及直接成本：[`billing-and-domain-summary.json`](billing-and-domain-summary.json)

保留的 JSON 只有 aggregate counts，不包括 account／zone identifiers、Worker／Queue names、IP addresses、paths、query strings、user-level data、personal submissions、billing identifiers 或 message-level lead volumes。

第二份 JSON 把三項已核實成本資料分開：Workers Paid 已啟用，當時 rate card 的帳戶基本月費最低為 US$5；完整的 2026 年 8 月 12 日至 9 月 11 日 Cloudflare **帳戶**帳單週期額外用量費為 US$0.00；Porkbun invoice 則記錄首年網域 US$11.08。US$0.00 因此不會寫成帳戶或項目總成本。沒有可歸屬 line item 的共享帳戶 invoice total 不公開，dashboard abbreviated values 亦維持標示 rounded，不轉成虛假精確整數。

同一紀錄亦交代 8 月 27 日 Error 1102 事故及其後 paid-plan baseline。plan change 與 CPU-reduction work 同時發生，公開紀錄不會把任何一項稱為唯一修復。

## 指標邊界

- **Edge requests：** Cloudflare edge 的 HTTP requests，包括 HTML、scripts、styles、images、crawlers 及 threats，不是人或 visits。
- **HTML page views：** Cloudflare 成功 HTML responses，較 total requests 接近頁面消費，但仍不能證明 distinct human audience。
- **Worker invocations：** 應用程式 runtime 層；cached assets 等 edge-handled traffic 未必到達 Worker。
- **R2 object count 及 bytes：** 時段內最新 storage snapshot，不是 monthly GB-month invoice。
- `workersInvocationsAdaptive` 是 adaptive dataset，因此 Worker totals 標示為 approximate。

Cloudflare 文件說明 Free-plan HTTP traffic 可包括 legitimate users、crawlers 及 threats；一個 page view 可產生多個 requests；page view 是成功 HTML response。見 [Zone Analytics](https://developers.cloudflare.com/analytics/account-and-zone-analytics/zone-analytics/)及 [GraphQL sampling](https://developers.cloudflare.com/analytics/graphql-api/sampling/)。

## 不公開及不推論的內容

不公開每日 unique-IP 數字，亦不會相加成 visitor total。同一人或 automated client 可跨日重複，IP 亦不是穩定 person-level identity。

Queue operation exact count 不公開，避免推測 confidential lead volume。案例只陳述獲支持的 rate-card position：觀察到的 workload 低於適用 included allowance。

account-level billing-cycle values 不作 project-specific traffic。event-window file 提供 project-scoped analytics；billing file 只提供 account plan status、included usage 及 additional-charge position。Porkbun 金額因 invoice 直接識別項目網域而保留，所有 invoice 及付款 identifiers 均已移除。

這些流量數字不會描述成 event attendance、registration conversion、commercial return 或網站造成結果的證明。

可繼續閱讀[流量、託管與成本章節](../../case-study/07-production-economics-and-observability.zh-Hant.md)，或查看[量度邊界圖](../../diagrams/production-measurement-boundaries.zh-Hant.svg)。
