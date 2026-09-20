# 在不暴露 Google 憑證下簡化聯絡資料收集

[English](05-queue-to-sheets-interface.md) · [**繁體中文**](05-queue-to-sheets-interface.zh-Hant.md)

Wellness Village 需要讓有興趣的訪客留下資料，卻未需要一套客戶資料庫。這是活動首次舉辦，預計資料量有限，而主辦方亦未確定往後活動或長期聯絡流程會如何發展。

## 為何 Google Sheets 適合首屆活動

Google Sheets 是本項目的技術選擇，不是客戶原有流程。我考慮過 Firebase 及 Supabase，但在未來工作方式仍未確定時，選擇營運範圍較小的方案。

| 方案 | 對這次發佈的評估 |
| --- | --- |
| **Google Sheets** | 預期資料量只需要一份小型 single-writer 名單，容易檢視及交接，亦毋須另行營運應用程式 datastore。 |
| **Firebase 或 Supabase** | 兩者都可以支援較複雜查詢及未來產品功能，但在需要尚未清楚前，便要先決定資料模型、存取方式及後續營運。 |

設定、維護及預計成本都是考量，但我沒有保留可以直接比較的歷史價格資料，所以這項決定並不聲稱節省了某個確實金額。重點是按需要控制規模；如果日後資料量、工作流程或活動形式變得複雜，便應重新評估 datastore。

## 把公開表格與 Google 分開

我沒有讓瀏覽器直接寫入 Sheet。公開網站先驗證請求，再把已接受的內部訊息放入 Cloudflare Queue。另一個私人 Worker 持有 Google 憑證，讀取 Queue，並只在 Sheet 未有相同提交 ID 時加入資料列。

![聯絡資料先通過驗證及 Turnstile，再由 Cloudflare Queue 交給私人 consumer；consumer 只把未見過的 ID 加入 Google Sheets。](../diagrams/queue-to-sheets-sequence.zh-Hant.svg)

[查看 Mermaid 原始檔](../diagrams/queue-to-sheets-sequence.zh-Hant.mmd)

這個安排令 Google 回應時間不會影響訪客請求，而瀏覽器及主要網站 Worker 亦不會取得 Google 憑證。Queue 是傳送緩衝，不是長期潛在客戶資料儲存。

## 由瀏覽器到 Queue

Route 在讀取個人資料前，會先檢查聯絡資料收集、已批准私隱聲明版本、Turnstile、Queue binding 及兩個 rate limiter 是否已設定。缺少任何必要設定時，route 會在處理表格內容前停止。

功能啟用後，請求仍要通過 body 大小上限、嚴格 schema、honeypot、server-side Turnstile 及兩階段 rate limit；多餘欄位會被拒絕。伺服器加入 UTC 及香港時間，只保留同源 pathname 作來源資料，不會記錄 query string 或 fragment。

公開作品集預設關閉聯絡資料收集，亦不會顯示表格，讀者可以在不收集任何人資料的情況下執行示範。

## `202 Accepted` 代表甚麼

真實提交會等待 Cloudflare Queue 接受訊息，再回傳 `202 Accepted`。填了 honeypot 的提交會收到相同公開回應，但不會進入 Queue，因此回應不會暴露防濫用判斷。

`202` **不代表** Google Sheets 已經寫入資料列；私人 consumer 會在之後以非同步方式完成。

## 由 Queue 到一列 Sheet 資料

Consumer 沒有公開 route。它會驗證完整內部訊息、取得只可存取 Sheets 的 OAuth token，再到 A 欄檢查穩定提交 ID。同一 batch 內的重複 ID 會先合併；已有 ID 會略過；未見過的資料列以 `valueInputOption=RAW` append，避免把訪客文字當成公式。

<details>
<summary><strong>14 欄 Sheet contract</strong></summary>

| 欄 | 欄位 | 用途 |
| --- | --- | --- |
| A | `submission_id` | 穩定 UUID 及去重 key |
| B | `submitted_at_utc` | 伺服器 UTC timestamp |
| C | `submitted_at_hkt` | 同一時刻的香港時區表示 |
| D | `last_name` | 已驗證姓氏 |
| E | `first_name` | 已驗證名字 |
| F | `display_name` | 按 locale 衍生的顯示名稱 |
| G | `email` | 已驗證電郵地址 |
| H | `phone` | 已驗證電話值 |
| I | `locale` | `en` 或 `zh-hk` |
| J | `source_page` | 同源 pathname 或 `unknown` |
| K | `consent` | 固定為 `true` |
| L | `consent_version` | 與已發佈聲明相連的版本 |
| M | `purpose` | 已批准的固定處理目的 |
| N | `marketing_opt_in` | 本 contract 固定為 `true` |

</details>

## 重試、重複資料及何時應升級設計

Cloudflare Queues 採用 at-least-once delivery。短暫 Google 失敗會重試未確認訊息；用盡重試後則移到 dead-letter Queue，等待營運人員檢查。如果 append 已成功但回應遺失，重試可以在再次 append 前辨認穩定 ID。

這個做法預期可令一般重試收斂到一列，但並非 distributed exactly-once delivery。Read-before-append 假設只有一個 consumer 寫入一張 Sheet，所以 `max_concurrency` 維持 `1`。較高流量或多 writer 的流程應把唯一性放進 transactional datastore，而不是直接橫向擴展這個模式。

Log 只保留事件名稱、數量及上游狀態，不包括表格內容或憑證。資料保留、撤回要求、監察及 dead-letter recovery 仍需要營運人員處理。

下一篇：[網站如何在 Cloudflare 上線](06-cloudflare-delivery.zh-Hant.md) · [producer 及 route](../../src/features/interest/) · [私人 consumer](../../workers/contact-sheet-consumer/README.zh-Hant.md) · [架構決定](../decisions/003-queue-before-google-sheets.zh-Hant.md)
