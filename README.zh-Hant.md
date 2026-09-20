<!-- section:hero -->
# Wellness Village 活動網站

[English](README.md) · [**繁體中文**](README.zh-Hant.md)

![手提電腦與 iPhone 畫面展示 Wellness Village 繁體中文網站，依序呈現活動介紹、節目、品牌故事、聯絡表格及頁尾。](docs/media/responsive-scroll-walkthrough-zh-Hant.gif)

[查看靜態海報](docs/media/responsive-scroll-walkthrough-zh-Hant-poster.png) · [下載 H.264 導覽影片](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/responsive-scroll-walkthrough-zh-Hant.mp4)

Wellness Village 已有一本 184 頁 Guidebook、The Ground 上的節目資料，以及收集查詢的需要，但內容分散在不同地方。我以唯一開發者身分，把它們整理成一個雙語網站，供這項於香港中環街市舉行、為期 12 日的活動使用。

我由即日完成的家中伺服器 MVP，一直負責至活動支援。客戶提供活動素材及批准；我處理產品架構、公開資料研究、內容整理、全端開發、Cloudflare 設定及上線。Agent 協助範圍明確的工作，而產品、個人資料處理及發佈決定仍由我負責。

[瀏覽活動網站](https://www.wellnessvillagehk.com/zh-hk) · [閱讀開發背後的故事](docs/case-study/README.zh-Hant.md) · [查看實作索引](docs/case-study/10-evidence-index.zh-Hant.md)

> **作品集說明：**這個獨立整理版本使用合成資料，不包括私人儲存庫、憑證、個人資料、訊息及受限制素材。詳見[法律聲明](NOTICE.zh-Hant.md)及[素材政策](ASSET_POLICY.zh-Hant.md)。

<!-- section:project-summary -->
## 項目概覽

| | |
| --- | --- |
| **活動** | 由 ELLE Hong Kong 與 IŚSMEN 呈獻、於中環街市舉行的 Wellness Village；ELLE Hong Kong 報道活動為期 12 日、橫跨三個樓層，集合超過 50 個品牌及 30 多項工作坊與體驗 |
| **我的角色** | 唯一開發者，由首個可供審閱的 MVP 負責至正式上線及活動期間支援 |
| **交付時間** | 8 月 5 日提供家中伺服器預覽；8 月 20 日分享正式網址，早於 8 月 21 日內部目標；活動於 2026 年 8 月 30 日至 9 月 10 日舉行 |
| **語言** | 英文與繁體中文使用相同資訊架構 |
| **主要使用情境** | 手機及桌面均可使用；訪客流程主要為活動前及活動期間以手機瀏覽而設計 |
| **主要技術** | Next.js、TypeScript、OpenNext、Cloudflare Workers、Queues、R2、Durable Objects、Turnstile 及 Google Sheets API |
| **公開版本** | 使用合成內容即可執行，不需要正式環境憑證 |

[ELLE Hong Kong 的活動介紹](https://www.elle.com.hk/life/wellness-village-elle-hong-kong-issmen)提供活動背景。

<!-- section:experience -->
## 簡短產品導覽

頁首影片一直瀏覽至聯絡表格及頁尾。展開以下任何一項，即可直接觀看桌面及 iPhone 的訪客流程動畫，即使活動網址停用後仍可查看。

<details>
<summary><strong>節目及活動前須知</strong>——40 秒</summary>

![手提電腦及 iPhone 節目導覽。](docs/media/programme-walkthrough-zh-Hant.gif)

在電腦使用畫面上的下一步箭嘴，或在 iPhone 左右掃動 Experience 101 圖卡；其後篩選活動結束後保留的活動紀錄，再開啟 The Ground 上相應的公開頁面。影片保留平台顯示的「活動已結束」狀態，不會令人誤以為仍可報名。

[查看靜態海報](docs/media/programme-walkthrough-zh-Hant-poster.png) · [下載 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/programme-walkthrough-zh-Hant.mp4) · [了解節目資料流程](docs/case-study/04-the-ground-event-interface.zh-Hant.md)

</details>

<details>
<summary><strong>場地指南及地圖</strong>——31 秒</summary>

![手提電腦及 iPhone 場地指南導覽。](docs/media/venue-guide-walkthrough-zh-Hant.gif)

在同一流程找到地址及到場提示，再以電腦箭嘴或 iPhone 掃動手勢切換兩頁地圖。桌面版放大檢視器會固定控制列，讓訪客由上至下閱讀每張直向地圖；手機則保留完整頁面。

[查看靜態海報](docs/media/venue-guide-walkthrough-zh-Hant-poster.png) · [下載 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/venue-guide-walkthrough-zh-Hant.mp4) · [閱讀訪客流程說明](docs/case-study/03-visitor-journey.zh-Hant.md)

</details>

<details>
<summary><strong>品牌搜尋及 Guidebook 內容</strong>——48 秒</summary>

![手提電腦及 iPhone 品牌搜尋導覽。](docs/media/brand-discovery-walkthrough-zh-Hant.gif)

在 48 個 Guidebook 品牌專題中搜尋活動呈獻單位 IŚSMEN，以兩種裝置前往其公開 Instagram 及官方網站，再閱讀站內 Guidebook 專題的兩頁內容。

[查看靜態海報](docs/media/brand-discovery-walkthrough-zh-Hant-poster.png) · [下載 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/brand-discovery-walkthrough-zh-Hant.mp4) · [了解 Guidebook 如何變成網頁內容](docs/case-study/02-guidebook-and-agent-workflow.zh-Hant.md)

</details>

<details>
<summary><strong>數碼 Guidebook 入口及閱讀器</strong>——43 秒</summary>

![手提電腦及 iPhone 數碼 Guidebook 導覽。](docs/media/guidebook-journey-walkthrough-zh-Hant.gif)

由首頁開啟數碼版，選擇較快的網頁閱讀器，跳到第 66 頁，比較電腦並列兩頁與手機依次閱讀的方式，再前往下一個跨頁。另一張流程圖列出網站內其餘 Guidebook 入口。

[查看靜態海報](docs/media/guidebook-journey-walkthrough-zh-Hant-poster.png) · [下載 MP4](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/media/guidebook-journey-walkthrough-zh-Hant.mp4) · [查看所有 Guidebook 入口](docs/diagrams/guidebook-entry-and-reading-flow.zh-Hant.svg) · [閱讀內容整理流程](docs/case-study/02-guidebook-and-agent-workflow.zh-Hant.md)

</details>

[查看所有媒體及擷取說明](docs/media/README.zh-Hant.md)

<!-- section:built -->
## 三個資料來源，一條訪客流程

![系統圖展示固定的 Guidebook 內容、來自 The Ground 的節目資料，以及由聯絡表格前往 Google Sheets 的路徑。](docs/diagrams/system-overview.zh-Hant.svg)

| 起點 | 我在其上建立的部分 | 對訪客或主辦方的作用 |
| --- | --- | --- |
| **184 頁 Guidebook** | 我把 48 個兩頁品牌專題整理到四個主題，再核對公開連結。 | 訪客可以搜尋客戶內容。48 個 Instagram 由客戶確認；29 個專題加入經核對網站，19 個保留沒有推測按鈕。 |
| **The Ground 活動目錄** | Server adapter 驗證指定機構的活動、轉換成香港時間，再整理今日、即將舉行及已結束狀態。 | 訪客先在活動網站瀏覽，再返回 The Ground 報名。 |
| **聯絡表格** | 資料通過驗證、Turnstile 及速率限制後，由 Queue 交給私人 Sheets consumer。 | 首屆活動有一份簡單名單，不暴露 Google 憑證，亦不用在未來方向未明前先選資料庫。 |

OpenNext 讓應用程式在 Cloudflare Workers 上執行。R2 及 Durable Objects 用於快取及重新驗證，不會儲存聯絡表格內容。[架構決定](docs/decisions/README.zh-Hant.md)。

<!-- section:delivery -->
## MVP 與正式上線之間改變了甚麼

8 月 5 日的小型預覽讓客戶在正式網域尚未存在時，已經可以對實際頁面提出意見。之後我再處理最新 Guidebook、品牌公開資料研究、節目整合、私隱控制及發佈設定，只把未能解決的事實及批准事項交回活動團隊。

用手機實際走一次流程亦改變了介面。活動前須知原本放在節目列表之後，訪客可能先離開網站前往 The Ground，未及看到提醒。我把須知移到活動列表之前，刪除重複文字卡，並讓九張圖片毋須展開便可直接左右掃動。我亦把首頁、節目及場地指引連成一條路徑，而不是三個互不相干的頁面。

正式網址於 8 月 20 日分享，早於 8 月 21 日目標；上線工作繼續至 8 月 30 日活動開始前。Agent 協助有指定來源、可檢查的工作；我審閱輸出、測試網站及作出決定。

[了解工作方式](docs/agent-workflow/working-with-an-agent.zh-Hant.md) · [查看有日期的交付紀錄](docs/case-study/delivery-timeline.zh-Hant.md)

<!-- section:production -->
## 上線紀錄顯示的情況

| 記錄項目 | 結果 |
| --- | ---: |
| 活動時段的 Cloudflare 邊緣請求 | 108,443 |
| 成功回傳的 HTML 頁面 | 4,322 |
| 傳輸量／回應位元組快取比例／Worker 調用 | 4.34 GB／78.5%／約 35,600 |
| 與活動日期對齊時段內的搜尋點擊／曝光 | 112／362 |
| Workers 基本方案／完整帳單週期的額外用量 | 帳戶基本月費 US$5／US$0.00 |
| 首年網域註冊費 | US$11.08 |

付費數字是帳戶基本月費，並非項目專屬發票；US$0.00 代表額外用量。請求數不等於人數，項目亦沒有量度入場、轉換或投資回報。

各報告的每日界線不同：邊緣流量使用 UTC、Worker 活動使用 HKT，而 Search Console 使用 PT。以下延伸閱讀保留了各自的準確時段。

[閱讀流量與成本紀錄](docs/case-study/07-production-economics-and-observability.zh-Hant.md) · [閱讀 Search Console 紀錄](docs/case-study/08-search-discoverability.zh-Hant.md) · [查看下次會改變的做法](docs/case-study/09-lessons-and-limitations.zh-Hant.md)

<!-- section:explore -->
## 以六篇內容了解完整項目

1. [一個限期、分散的資料與一名開發者](docs/case-study/01-context-and-role.zh-Hant.md)
2. [把 184 頁 Guidebook 變成可用內容](docs/case-study/02-guidebook-and-agent-workflow.zh-Hant.md)
3. [用手機測試流程後改變了甚麼](docs/case-study/03-visitor-journey.zh-Hant.md)
4. [在不重建報名系統下使用 The Ground](docs/case-study/04-the-ground-event-interface.zh-Hant.md)
5. [在不暴露 Google 憑證下簡化聯絡資料收集](docs/case-study/05-queue-to-sheets-interface.zh-Hant.md)
6. [在 Cloudflare 上線並處理首個正式環境事故](docs/case-study/06-cloudflare-delivery.zh-Hant.md)

參考資料：[交付紀錄](docs/case-study/delivery-timeline.zh-Hant.md) · [實作索引](docs/case-study/10-evidence-index.zh-Hant.md) · [架構決定](docs/decisions/README.zh-Hant.md)

<details>
<summary><strong>在本機執行合成資料示範</strong></summary>

請使用最新的 Node.js 22.x（最低為 22.13.0，與 CI 一致）。示範版本預設使用合成活動及品牌資料，不需要正式環境憑證，亦不需要連接 The Ground、Google 或 Cloudflare。

影片展示已交付網站。本機程式是精簡參考版本，包含四個虛構品牌及 Guidebook 說明頁，沒有正式網站的閱讀器、聯絡表格介面或受授權限制的活動素材。聯絡 API 及 Queue consumer 的參考實作仍可閱讀，預設不會啟用。

```sh
npm ci
npm run dev
```

開啟[英文示範](http://localhost:3000/en)或[繁體中文示範](http://localhost:3000/zh-hk)。`npm run check` 檢查文件、應用程式及 Queue consumer；`npm run check:cloudflare` 檢查 bindings 並執行部署 dry run。GitHub Actions workflow 會執行兩者，但兩個指令都不會部署。即時整合只有在明確設定後才會啟用。

</details>

<details>
<summary><strong>公開版本沒有包括的內容</strong></summary>

私人正式版本、受限制素材、憑證、通訊及訪客紀錄均不包括在內。本作品集沒有以開放原始碼授權發佈。[法律聲明](NOTICE.zh-Hant.md) · [素材政策](ASSET_POLICY.zh-Hant.md) · [安全說明](SECURITY.zh-Hant.md)

</details>

如想討論類似的活動網站、內容整理或系統整合項目，歡迎透過 [LinkedIn](https://www.linkedin.com/in/jackyng-tf/) 與我聯絡。
