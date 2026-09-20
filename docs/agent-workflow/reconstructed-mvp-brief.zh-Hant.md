# 首個 MVP 的重建版 brief

[English](reconstructed-mvp-brief.md) · [**繁體中文**](reconstructed-mvp-brief.zh-Hant.md)

> 這份示例是在項目完成後，按已交付需求反推整理。內容經過編輯並移除私人資料，不是最初 prompt，亦不表示一個 prompt 已經產生整個完成網站。

首個可供審閱 MVP 於 2026 年 8 月 5 日放到家中伺服器，當時尚未購買正式網域。以下 brief 表示第一個 vertical slice 的預期 scope；其後審閱、整合及正式環境工作見[交付時間線](../case-study/delivery-timeline.zh-Hant.md)。

## 重建版 prompt

你要協助我建立 Wellness Village 雙語訪客網站的第一個可運作 vertical slice。這是一個在香港中環街市舉行的限時活動。

### 產品結果

建立 mobile-first 網站，讓完全不了解活動的人可以迅速明白：

1. Wellness Village 是甚麼；
2. 有哪些活動及舉行時間；
3. 活動是否需要報名；
4. 出席前要準備甚麼；
5. 場地位置及如何前往；以及
6. Guidebook 有哪些品牌故事可繼續閱讀。

介面必須支援英文及香港繁體中文，並使用相同核心 information architecture。

### 資料來源規則

- 只使用客戶提供或明確核實的來源。
- Guidebook 用於編輯內容，不作即時時間表，亦不能單獨證明攤位、贊助、出席或報名狀態。
- The Ground 指定機構的公開 catalogue 是即時活動時間、收費、公開名額及 canonical registration destination 的來源。
- 到場及地圖指引只使用已批准場地資料；不得自行補充無障礙或營運細節。
- 品牌第一方公開頁面只用於核對官方目的地或身份；不能證明主辦方認可或活動參與。
- 未有資料支持的值，標示為 `Unknown`、待確認、暫時無法提供，或直接不顯示。
- source reference 及 publication status 與其支持的 structured content 放在一起。

### 初步 information architecture

- **Home：**活動簡介，以及前往節目、準備及到訪資料的清楚路徑。
- **Programme：**按訪客實際需要分組及篩選活動，並清楚交代報名會轉往外部平台。
- **Brands：**按 Guidebook 主題整理、可搜尋的品牌專題。
- **Visit：**已批准地址、方向、到場須知及地圖狀態。
- **Guidebook：**第一方 landing route 及進入已批准編輯內容的安全連結。
- **Privacy：**啟用任何原生聯絡表格前所需的已發佈聲明。

### 體驗要求

- 首次到訪者不需要預先知道網站結構。
- 手機導覽要讓四項主要工作容易以拇指觸及。
- 每個外部連結要說明下一步，並安全開啟。
- empty、pending 及 unavailable 狀態要提供下一個有效操作。
- 互動 touch target 至少 44 CSS pixels，鍵盤 focus 清楚可見。
- 手機 Chromium 及 WebKit 不應出現 document-level horizontal overflow。

### 資料與整合邊界

- 外部節目資料只在 server side 取得。
- 在 runtime 驗證外部 JSON，並限制 pagination、response size 及 request time。
- event timestamp 使用明確 `Asia/Hong_Kong`／HKT（`+08:00`）行為，不依賴部署 server timezone。
- 只產生 canonical HTTPS registration link。
- 第一版可以在相同 adapter interface 後使用合成 fixtures，但不得 hard-code 第二份只供 UI 使用的時間表。
- 瀏覽器程式碼、fixtures、logs 及 source control 不可包含憑證、私人 URL 或正式識別資料。
- 不因收集聯絡資料而另建資料庫；為已批准 destination 定義最小且已驗證的 delivery interface。

### 本版本不負責的事項

- 不可讀取全平台 catalogue，再由活動標題猜測是否屬於 Wellness Village；使用 organisation-scoped configuration boundary。
- 不把 provider contacts、members、coaches、不支援圖片或 provider-only state 放入公開 event model。
- 不擁有 booking、payment 或 registration records；轉往 canonical The Ground page。
- 不把 Google 憑證或 Sheet identifier 暴露給瀏覽器或網站 runtime。
- 不在訪客請求中同步寫入 Google Sheets。真實非 honeypot 提交只在 Queue 接受後回傳 `202 Accepted`；honeypot 收到相同 `202` 但不入 Queue；兩者均不可描述為 Sheet persistence。
- 不承諾 distributed exactly-once delivery；非同步 delivery 要使用 stable ID 及 deduplication。
- 不加入 user account、CMS、CRM 或通用應用程式資料庫。
- 在私隱聲明、verification 及 destination gates 全部準備好前，不啟用原生個人資料收集。

### 技術限制

- 使用 Next.js、React 及 TypeScript。
- 在外部及內部 trust boundary 使用 runtime schema。
- components 及 content models 要在沒有即時憑證下可測試。
- 與部署相容的 server code 與 client components 分隔。
- 合成 fixtures 或停用 integrations 是無 secrets 的預設模式。
- 加入 `.env.example`，不得加入真實值。

### 不在 scope 內的內容

- 不把完整 Guidebook 重建成互動內容。
- 不自行創作活動時間表、場地地圖、無障礙資料或健康聲稱。
- 不公開未批准 source artwork、Guidebook master、page archive 或客戶 fonts。
- 不把 Agent output 當成客戶批准，亦不把重建材料當成逐字紀錄。

### 接受檢查

- 英文及繁體中文顯示相同核心 routes 及導覽任務；每類資料使用相同來源。
- 手機首次訪客可由活動簡介走到活動選擇、準備提示、場地支援及品牌延伸閱讀。
- 無來源支持的事實顯示 `Unknown`、待確認、暫時無法提供或不顯示；任何 test fixture 都不依賴 production identifiers。
- 外部活動及報名資料經同一個 server-only typed adapter，並有 page、size、time limits 及 HTTPS registration link。
- HKT phase 及 calendar 行為不依賴機器 timezone，並測試 midnight 及 multi-day boundaries。
- 核心 routes、locale parity、content counts、source status、external-link safety、keyboard focus 及 44 CSS-pixel touch target 有合適的 automated 或 browser checks。
- Mobile Chromium 及 WebKit 沒有 document-level horizontal overflow。
- 安裝、測試及 production build 在沒有 production secrets 下成功；integrations 維持 synthetic、disabled 或 fail closed。
- assumptions 及 unresolved source/client decisions 與完成行為分開列出。

實作最小可運作 vertical slice，並報告實際執行的檢查。不得把生成程式碼或 build 通過視為客戶批准、production readiness 或 business impact。

## MVP 之後加入的內容

- **內容及客戶決定：**正式網站使用五個活動類別、四個 Guidebook 主題及 48 個專題。客戶確認 48 個 Instagram；我核對 29 個官方網站，19 個維持沒有網站按鈕。詳見 [Guidebook 與 Agent 章節](../case-study/02-guidebook-and-agent-workflow.zh-Hant.md)。
- **正式環境工作：**The Ground 整合加入 pagination、response limits、runtime checks、HKT handling 及 cache fallback；聯絡流程加入 privacy checks、Queue acknowledgement、獨立 Sheets consumer、14 欄內部格式、stable IDs、retry、duplicate check 及 dead-letter handling。詳見 [The Ground 整合](../case-study/04-the-ground-event-interface.zh-Hant.md)及 [Queue-to-Sheets](../case-study/05-queue-to-sheets-interface.zh-Hant.md)。
- **Release：**完整應用程式透過 OpenNext 在 Cloudflare Workers 執行，R2 作 incremental cache、Durable Object 作 revalidation；流程包括 inspect、test、build、dry run、preview、deploy 及 read-only smoke checks。詳見 [Cloudflare 交付](../case-study/06-cloudflare-delivery.zh-Hant.md)及[發佈清單](release-checklist.zh-Hant.md)。

以上都是首個 MVP 後由我加入的工作，不會歸因於這份重建 prompt。
