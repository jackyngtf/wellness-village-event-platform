# ADR 003：先放入 Queue，再寫入 Google Sheets

[English](003-queue-before-google-sheets.md) · [**繁體中文**](003-queue-before-google-sheets.zh-Hant.md)

## 狀態

已用於交付網站。

## 背景

Wellness Village 是首次舉辦，預計聯絡資料量有限，長期資料流程亦未確定。我考慮過 Firebase 及 Supabase，最後選擇 Google Sheet 作為初期目的地，沒有在未知道日後需要前先引入通用應用程式資料庫。這張 Sheet 是本項目的技術選擇，不是客戶原有的工作流程。

若在公開請求內直接寫入 Sheet，訪客要等待 Google，網站 runtime 亦要持有更廣泛 credentials。

## 決定

網站 Worker 在核對 privacy settings、configuration、Turnstile 及 schema 後，把包含 stable submission ID 的小型 message 放入 Queue。honeypot 收到相同公開 response，但不 enqueue。另一個不公開 consumer 持有 Google authentication、驗證 14 欄內部格式、查找既有 ID，再用 `RAW` append 未見資料列。

## 影響

- browser 及網站 Worker 不會收到 Google credentials 或目的地 Sheet identifier。
- 真實非 honeypot submission 只在等待 Queue acceptance 後回傳 `202 Accepted`；honeypot deliberate decoy 收到同一 `202` 但不 enqueue；兩者都不是同步 Google Sheets persistence。
- Cloudflare Queue 保持 at-least-once delivery。同 batch collapse 及 read-before-append deduplication 令一般重試 idempotently converge，但不宣稱 distributed exactly-once delivery。
- transient failure 會 retry；用盡後移到 dead-letter Queue，由營運人員控制 recovery。
- monitoring、retention、withdrawal、duplicate handling 及 dead-letter recovery 仍需要 operator。
- Sheet 維持小型 single-writer destination；如果日後出現多個 writers、transactional uniqueness、relational queries 或明顯較高數量，便應重新評估 Firebase、Supabase 或其他 datastore。

## 參考

- [Queue-to-Sheets 案例](../case-study/05-queue-to-sheets-interface.zh-Hant.md)
- [Queue-to-Sheets 流程圖](../diagrams/queue-to-sheets-sequence.zh-Hant.svg)及 [Mermaid 原始檔](../diagrams/queue-to-sheets-sequence.zh-Hant.mmd)
- [系統總覽](../diagrams/system-overview.zh-Hant.svg)
