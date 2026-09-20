# ADR 002：透過 OpenNext 在 Cloudflare Workers 執行

[English](002-workers-not-static-pages.md) · [**繁體中文**](002-workers-not-static-pages.zh-Hant.md)

## 狀態

已用於交付網站。

## 背景

網站需要 server-rendered routes、server-side event adapter、API routes、Queue production、incremental cache 及 revalidation。純 static export 或 Pages-only 設定無法支援整個組合。

## 決定

Next.js 應用程式透過 OpenNext 在 Cloudflare Worker 執行。R2 只用作 incremental-cache storage，Durable Object 只協調 revalidation；私人 contact-sheet consumer 保持另一個獨立 Worker。

Cloudflare 現時建議新 Next.js 應用使用 vinext。本作品集保留 OpenNext，因為這是已交付網站所用 runtime，並非把它推薦為新項目的預設選擇。

## 影響

- secrets、runtime checks 及第三方 fetching 不會進入 browser bundle。
- 網站 Worker 可以產生 Queue message，而不持有 Google credentials。
- R2 及 Durable Objects 是 Next.js cache／revalidation infrastructure，不是 lead storage；訪客提交走獨立 Queue-to-consumer path。
- build、emulation、bindings 及 releases 比 static hosting 複雜。
- Cloudflare Workers 是已交付 runtime；Pages 只曾作 static alternative 比較。

## 參考

- [Cloudflare 交付案例](../case-study/06-cloudflare-delivery.zh-Hant.md)
- [系統總覽](../diagrams/system-overview.zh-Hant.svg)及 [Mermaid 原始檔](../diagrams/system-overview.zh-Hant.mmd)
- [公開版本發佈清單](../agent-workflow/release-checklist.zh-Hant.md)
