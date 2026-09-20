# 搜尋與索引紀錄

[English](README.md) · [**繁體中文**](README.zh-Hant.md)

本目錄保留 2026 年 9 月 18 日擷取的正式搜尋 endpoints read-only snapshots：

- [`robots.txt`](robots.txt)容許 public crawling、排除 `/api/`，並指出 sitemap。
- [`sitemap.xml`](sitemap.xml)包含 12 個 canonical locale URLs：繁中及英文各六個 routes，配有 `zh-HK`、`en` 及 `x-default` alternates。
- [`search-console-summary.json`](search-console-summary.json)保留獲授權 aggregate Search Console performance、sitemap、indexing 及 enhancement results，不包含 account identity 或低流量 query 原始資料。

snapshots 只證明正式網站在擷取時提供的內容，不能證明 Google 已抓取、接受或索引每一個 URL。

獲授權 read-only Chrome 檢查確認既有 verified Domain property。在 Search Console Pacific Time reporting basis 下，2026 年 8 月 30 日至 9 月 10 日（包括首尾日期）Web Search 記錄 112 clicks、362 impressions、30.9% CTR 及 average position 3.5。日期配合香港活動日曆，但不是準確 HKT-hour window。

submitted sitemap 最後在 9 月 14 日成功讀取，顯示 12 discovered pages。同日 sitemap-scoped Page indexing snapshot 顯示 6 indexed、6 not indexed。這是有日期 Google report，不是永久 coverage guarantee。Mobile 及 desktop Core Web Vitals 都沒有足夠 90 日 field data，因此不宣稱 real-user performance result。

整理期間沒有新增 property、提交 sitemap，亦沒有改動 DNS 或 Search Console。account identifiers、screenshots、permission listings 及低流量 query rows 均不公開。

官方資料：[Performance report](https://support.google.com/webmasters/answer/7576553?hl=zh-Hant)、[Performance data and aggregation](https://support.google.com/webmasters/answer/17011364?hl=zh-Hant)、[Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=zh-Hant)、[Page indexing report](https://support.google.com/webmasters/answer/7440203?hl=zh-Hant)及 [Core Web Vitals report](https://support.google.com/webmasters/answer/9205520?hl=zh-Hant)。

可繼續閱讀[Search Console 與索引章節](../../case-study/08-search-discoverability.zh-Hant.md)，或查看[搜尋 discovery 生命週期](../../diagrams/search-discovery-lifecycle.zh-Hant.svg)。
