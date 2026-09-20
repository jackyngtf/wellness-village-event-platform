# 在 Cloudflare 上線並處理首個正式環境事故

[English](06-cloudflare-delivery.md) · [**繁體中文**](06-cloudflare-delivery.zh-Hant.md)

網站以內容為主，但已交付系統並不是一個靜態宣傳頁。它會在 server side render routes、由 server-only 程式讀取 The Ground、透過 API route 接受聯絡訊息，再把訊息放入 Cloudflare Queue。這些需要同時影響託管及發佈方式。

## 為何使用 Workers 而不是靜態 Pages

我用 OpenNext 打包 Next.js 應用程式，再於 Cloudflare Workers 執行。純靜態 Pages export 無法提供項目所需的 server-side routes、Queue binding 及 cache revalidation。

Cloudflare Pages 仍然適合靜態網站，只是不是本項目的正式 runtime。網域使用 Cloudflare DNS、TLS 及 edge delivery，而應用程式本身以 Worker 執行。

![系統圖顯示三條資料路徑及 Cloudflare 執行環境。](../diagrams/system-overview.zh-Hant.svg)

[開啟完整尺寸圖表](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/diagrams/system-overview.zh-Hant.svg)

## 各部分在哪裡執行

- OpenNext 把 Next.js route、request 及 asset model 適配到 Worker runtime。
- Deployment assets 及 edge cache 處理重複靜態傳輸。
- R2 保存 Next.js incremental cache，Durable Object 則協調不同 Worker isolate 的 revalidation。
- Server-only adapter 取得並標準化 The Ground 活動。
- 網站 Worker 把已接受的聯絡訊息放入 Queue。
- 另一個私人 consumer 負責 Google OAuth、重複檢查及 append 到 Sheet。

R2 及 Durable Objects 用於應用程式快取及重新驗證，不會儲存聯絡表格內容。個人資料走另一條網站 Worker → Queue → 私人 consumer → Google Sheets 路徑；Google 憑證只存在於 consumer。

## 發佈不只是一個成功 build

沒有單一綠色指令可以涵蓋整個發佈，所以我按次序進行多項檢查：

| 階段 | 回答的問題 |
| --- | --- |
| 檢查 source、diff 及設定 | 我審閱的是預期程式碼及 bindings 嗎？ |
| Lint、type check 及針對性測試 | 靜態規則及已測 contract 通過嗎？ |
| Next.js build 及 OpenNext bundle | 應用程式可為目標 runtime 組裝嗎？ |
| Wrangler dry run | Worker bundle 及設定可以在不部署下準備嗎？ |
| 本機 workerd preview | 代表性 routes 可以使用本機 preview bindings 執行嗎？ |
| 人手批准部署 | 這是我打算發佈、亦已審閱的版本嗎？ |
| Read-only production smoke | 已部署 Worker 及重要訪客 routes 現在有回應嗎？ |

本機 workerd preview 直接使用 revalidation queue，因為本機 Worker 不能以相同方式呼叫自身內部 Durable Object。正式環境保留 R2 incremental cache 及 Durable Object 跨 isolate 協調。

這些檢查涵蓋可 build 性、設定及實際觀察到的 routes，但不會把一次發佈變成 SLA，亦不能保證外部服務永久可用。

## 8 月 27 日的 Error 1102

活動開始前三日，網站曾短暫回傳 Cloudflare Error 1102，即 Worker 超出資源上限。診斷紀錄與 Free plan 的單一請求 CPU 上限吻合。

我從兩方面處理：把共享 Cloudflare 帳戶轉到 Workers Paid，建立較合適的每月 US$5 帳戶基準；同時減少請求路徑上較耗 CPU 的工作，再重新檢查 runtime。活動開始前亦繼續進行其他 hardening。

現有紀錄無法分開計算每項改動的作用，所以我不會把方案升級或程式改動其中一項單獨稱為修復。較實際的營運經驗是：資源上限同時是容量決定及應用程式效能問題。

其後取得的完整帳單週期顯示，觀察到的用量仍在付費方案包括的數量內，所以**額外**用量費為 US$0.00。這不會抵銷基本月費；帳戶亦有其他工作，因此不能把整筆 US$5 當成只屬於本項目的發票。

<details>
<summary><strong>公開儲存庫如何表示 runtime</strong></summary>

- [`open-next.config.ts`](../../open-next.config.ts)為正常 build 選擇 R2 incremental cache 及支援的 Durable Object queue override。
- [`wrangler.jsonc`](../../wrangler.jsonc)以中性名稱宣告 assets、self-reference、R2、Durable Object、Queue producer 及示例 rate-limit bindings，不包括正式帳戶 ID。
- [`wrangler.preview.jsonc`](../../wrangler.preview.jsonc)提供本機 bindings，並刻意省略即時聯絡資料及 revalidation Durable Object bindings。
- `npm run cf:build` 組裝 Worker，`npm run cf:dry-run` 驗證中性部署 bundle，`npm run cf:preview` 則執行本機 Worker。
- The Ground 及聯絡資料即時整合維持明確 opt-in。Google 憑證及 Sheet 設定只屬於私人 consumer Worker。

</details>

## 日後重建時的 framework 說明

截至 2026 年 9 月 19 日的檢查，Cloudflare [Next.js 指引](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)把 vinext 列為新應用程式的預設路徑，而 [OpenNext 指引](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/)則涵蓋既有 OpenNext 應用程式。本作品集保留 OpenNext，是因為已交付網站使用這套做法，並不表示所有新項目都應作相同選擇。

下一篇：[流量與成本](07-production-economics-and-observability.zh-Hant.md) · [搜尋曝光](08-search-discoverability.zh-Hant.md) · [Cloudflare 設定測試](../../tests/cloudflare-config.test.ts) · [發佈清單](../agent-workflow/release-checklist.zh-Hant.md)
