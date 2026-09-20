# ADR 004：Guidebook 只作固定編輯內容

[English](004-guidebook-content-boundaries.md) · [**繁體中文**](004-guidebook-content-boundaries.zh-Hant.md)

## 狀態

已用於交付網站。

## 背景

184 頁 Guidebook 有足夠資料建立雙語品牌頁，但不是即時活動資料庫。品牌在 Guidebook 出現，不會單獨證明其即時節目、實體攤位、贊助、出席或報名狀態。

## 決定

Guidebook 用於固定專題、活動文案、四個主題及頁碼範圍，並在 structured content 保留 publication status。節目、報名、場地指引及公開連結使用其他已批准來源。

## 影響

- 訪客可以瀏覽 48 個結構化專題，而不會把印刷文案當成即時營運資料。
- 未確認資料維持 `Unknown`、待確認、暫時無法提供或不顯示，不自行推測。
- Agent extraction、OCR 及 research 可以產生候選項目；我仍會視覺檢查 Guidebook，而需要的事實批准由客戶作出。
- 內容改動要有指定來源，並執行相關 count、mapping、URL、uniqueness 及 status checks。
- 原始 Guidebook PDF、Guidebook page archive、客戶 fonts 及活動 source assets 無條件保持在公開 repo 之外；rights record 不能為它們建立例外。

## 參考

- [Guidebook 與 Agent 案例](../case-study/02-guidebook-and-agent-workflow.zh-Hant.md)
- [Guidebook 內容流程圖](../diagrams/guidebook-content-pipeline.zh-Hant.svg)及 [Mermaid 原始檔](../diagrams/guidebook-content-pipeline.zh-Hant.mmd)
- [我如何與 Agent 協作](../agent-workflow/working-with-an-agent.zh-Hant.md)
