# ADR 001：最新節目及報名維持在 The Ground

[English](001-the-ground-is-the-live-source.md) · [**繁體中文**](001-the-ground-is-the-live-source.zh-Hant.md)

## 狀態

已用於交付網站。

## 背景

網站需要令節目更容易瀏覽，但最新時間、價格、名額及報名本身已由 The Ground 管理。Guidebook 提供固定編輯內容，不是即時時間表。整合使用指定機構的公開 catalogue，並非在此記錄的正式 partner API。

## 決定

透過 server-side adapter 讀取 upcoming 及 past records，並限制頁數、時間及 response size。檢查並裁減回應、計算 HKT 顯示狀態，再把報名送回相應 The Ground page。不人手維護第二份時間表或報名系統。

## 影響

- 訪客可在活動網站尋找節目；報名仍在 The Ground 完成。
- 需要維護 pagination、response size、request duration、schema、event ID duplicate check 及 safe link。
- 五分鐘 cache 及最後一份有效記憶體資料可以處理短暫上游中斷；沒有可用資料時顯示 unavailable，並直接連到 The Ground。
- 整合保留 feature flag、configuration scope 及可替換性。

## 參考

- [The Ground 資料介面案例](../case-study/04-the-ground-event-interface.zh-Hant.md)
- [The Ground 資料介面圖](../diagrams/the-ground-event-interface.zh-Hant.svg)及 [Mermaid 原始檔](../diagrams/the-ground-event-interface.zh-Hant.mmd)
- [重建版 MVP brief](../agent-workflow/reconstructed-mvp-brief.zh-Hant.md)
