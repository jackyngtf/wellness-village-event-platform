# 交付日期的核對方式

[English](README.md) · [**繁體中文**](README.zh-Hant.md)

這份說明交代如何核對公開時間線，而不公開私人客戶訊息。

## 已審閱來源

時間線於 2026 年 9 月 18 日根據以下資料重建：

- 透過擁有人授權 read-only access 檢查、有 timestamp 的項目群組及直接項目通訊；
- 擁有人的第一手交付紀錄，包括 sole-developer 責任、家中伺服器預覽，以及把客戶提供的印刷素材整理成網頁版本；
- 8 月 27 日 Error 1102 的有日期營運紀錄，以及相應 Worker CPU reduction implementation history；
- [帳單與網域摘要](../production-metrics/billing-and-domain-summary.json)所保留、獲授權查看的 Porkbun invoice；
- ELLE Hong Kong 公開活動日期；以及
- 項目紀錄內獲授權的活動後 Cloudflare 及 Search Console captures。

## 公開保留的內容

- 理解交付次序所需的里程碑日期；
- 分開首個可審閱 MVP、公開正式 release 及其後營運 refinement；
- 一項窄義 on-time 說明：可使用正式網址在 8 月 20 日分享，早於 8 月 21 日內部目標；
- 一項窄義營運說明：網站於 8 月 27 日短暫回傳 Error 1102，共享帳戶轉到 Workers Paid，CPU-heavy request path 亦在活動前減少；以及
- source category 及 interpretation limits。

## 不公開的內容

- chat screenshots、transcripts 及 direct quotations；
- 參與者身份、電話、電郵及 account details；
- voice notes、attachments 及 private Drive links；
- credentials、私人 infrastructure details 及 client-only handover material；以及
- 任何對工時、attendance、conversion、revenue、ROI 或 causal business impact 的推論。

## 解讀限制

8 月 5 日預覽是可審閱 vertical slice，不是完成系統。8 月 20 日是可運作公開 release，不是 content freeze；8 月 30 日活動開始前仍有小型修正及 operational hardening。「按時」只指 release date 與 internal target 的比較。

8 月 27 日紀錄不能證明 paid-plan change 或 code change 單獨解決 resource-limit incident。

原始私人通訊由擁有人保留，不會透過作品集再分發。讀者可以檢查公開 implementation、tests、domain record、aggregate metrics 及紀錄媒體，但不包括私人訊息本身。

可繼續閱讀[公開交付時間線](../../case-study/delivery-timeline.zh-Hant.md)，或查看[交付演進圖](../../diagrams/delivery-evolution.zh-Hant.svg)。
