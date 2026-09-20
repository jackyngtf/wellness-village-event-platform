# 公開 Agent 指引（繁體中文閱讀版）

[English canonical instructions](AGENTS.md) · [**繁體中文閱讀版**](AGENTS.zh-Hant.md)

這份文件方便繁體中文讀者了解公開版本如何約束 Agent。真正由工具讀取及執行的 canonical instructions 仍是 [`AGENTS.md`](AGENTS.md)；兩者有差異時，以英文 canonical file 為準。

## 儲存庫用途

這是 Wellness Village 網站經整理的公開版本，同時是一個可執行 reference 及作品集案例。它不是私人 production repository，而且在沒有客戶帳戶或 secrets 的情況下仍應可用。

Agent 可以協助檢查來源、研究連結、草擬程式碼、執行測試及準備文件；其輸出一律視為草稿。產品決定、客戶批准、私隱處理及 release decision 由人負責。

## 先理解內容模型

- **品牌介紹是固定編輯內容。** 資料由已批准 Guidebook 及核對後的公開品牌連結整理，不會由 The Ground 或其他 live feed 更新。
- **節目資料是另一條路徑。** 最新 session time、availability、price 及 registration destination 來自 The Ground 指定機構的公開 catalogue。
- **報名維持在 The Ground。** 網站協助發現活動，再把訪客送到相應 The Ground page。
- **聯絡資料是單向流程。** 網站 Worker 驗證 submission、放入 Cloudflare Queue，再由私人 consumer 寫入客戶 Google Sheet。
- **公開 demo 預設使用 synthetic data。** Live integrations 只可 opt in；設定不足時必須 fail closed。

資料不足時不可猜測。使用 `Unknown`、unavailable 或不採取行動。

## 各類資料應用哪個來源

1. 最新節目時間、價格、名額及報名連結使用 The Ground。
2. 場地、方向、活動文案及呈現使用已批准客戶素材。
3. 四個主題及固定品牌介紹使用 Guidebook。Guidebook entry 不會單獨證明攤位、贊助、出席或 booking status。
4. 品牌官方網站或 social profile 只用於核對身份或官方 link。
5. demo 現有行為以 code 及 tests 為準；歷史流量、成本、搜尋及交付 facts 使用 `docs/evidence/` 有日期紀錄。

## 私人資料不得進入公開版本

- 不可加入 production organisation ID、Cloudflare account ID、resource name、Sheet ID、private URL、credential、personal record、client message、raw Agent transcript 或 private filesystem path。
- 不可加入原始 Guidebook PDF、page archive、客戶 fonts 或 campaign source files。
- fixtures、examples 及 tests 只使用中性 identifier 及 synthetic people、events、submissions。
- product screenshots 必須來自真實介面；generated 或 redrawn screen 不可當成 product capture。
- 加入第三方 media 前先按[素材政策](ASSET_POLICY.zh-Hant.md)檢查。
- 未有擁有人指示前，不可加入 `LICENSE`、把 repo 描述成 open source、建立 remote 或公開發佈。先完成[發佈清單](docs/agent-workflow/release-checklist.zh-Hant.md)。

## 節目整合

- The Ground 只可由 server 存取；organisation setting 可替換，公開 fixtures 使用 neutral value。
- upcoming 及 past feeds 各自最多每頁 50 項、20 頁；request timeout 八秒；response limit 2 MiB。
- runtime 驗證 response 及 pagination，只保留 public event fields；排除 provider contacts、members、coaches 及 provider-only state。
- 使用 `Asia/Hong_Kong`／HKT（`+08:00`）轉換日期。event phase 與活動佔用的香港 calendar dates 分開計算，包括 midnight 及 multi-day cases。
- 只產生 HTTPS registration links、按 event ID 去重、排序及分類保持 deterministic。
- 標準化 programme 快取五分鐘。上游失敗時使用最後有效 warm snapshot；沒有 snapshot 時顯示 unavailable 及 The Ground 直接連結。

## 聯絡表格及 Google Sheets

- Google credentials 及 Sheet ID 只屬於私人 Queue consumer，不可進入 browser code、網站 Worker、fixtures、logs 或文件。
- 讀取 personal data 前，先確認 feature flag、privacy version、Turnstile、Queue binding 及兩個 rate-limit bindings。
- 只接受 JSON，限制 body size、執行 runtime schema、server-side Turnstile verification、rate limit，並阻止 honeypot path 到達 Queue。
- Queue message 保持細小並使用 stable submission ID。Queue 是 at-least-once delivery；consumer append 前檢查 ID，不能稱為 distributed exactly-once delivery。
- 真實 submission 只在 Queue 接受後回傳 `202 Accepted`；honeypot 收到相同 response 但不 enqueue。兩者都不表示 Google Sheets 已完成寫入。
- 不可 log form body、contact detail、token、Sheet ID、credential 或 Queue payload。

## 進行修改的步驟

1. 找出資料來源及使用者可見結果。
2. 修改前閱讀相關 code、tests 及 decision note。
3. 作最小但完整的改動。
4. 對改變行為、external-service failure 或 date/time edge case 加入有用 regression test。
5. 檢查使用者實際可見結果。
6. 只有 implementation 或有日期項目紀錄支持時，才更新案例文字。

修改 framework-specific code 前閱讀已安裝 Next.js guidance。external-service adapter、runtime schema 與 presentation component 保持分隔。

## 完成前檢查

應用程式改動執行：

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

navigation、responsive layout、keyboard use、accessibility 或 live-integration presentation 有改動時，亦要執行 browser checks。文件改動後，檢查本機 links、英文／繁中 section parity 及 Mermaid source pairs。

只報告實際執行的檢查。requests 不等於 visitors、page views 不等於 registrations、technical health 不證明 attendance、conversion 或 ROI。

## 作品集文件寫法

- `README.md` 保持為簡短英文總覽；`README.zh-Hant.md` 使用香港及台灣讀者均可理解的正式書面繁體中文。
- 兩種語言的意思、主要 sections、diagrams、media 及 limitations 要一致；technical name 如翻譯會降低準確度則保留原文。
- 英文檔案不用 suffix；繁中使用 `-zh-Hant`。production route `/zh-hk` 不會改變文件 language tag。
- 繁中頁面應連到相應繁中延伸閱讀；只有 code、tests、JSON、media、Mermaid 或沒有本地化版本的外部 source 可共用。
- prompt、timeline 或 diagram 如在項目後重建，要清楚說明；不可當成 verbatim record。
- traffic、cost 及 Search Console figure 旁要保留 dates 及 scopes。不可把 account-level number 當成 project number，亦不可公開 lead volume。
