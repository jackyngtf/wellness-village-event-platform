# 公開版本發佈清單

[English](release-checklist.md) · [**繁體中文**](release-checklist.zh-Hant.md)

這是一份可重用的候選版本檢查清單；未勾選的方格並非即時進度報告。每次執行應另行記錄日期及候選版本。公開 scope 確定後，應對完整候選版本執行一次；清單本身不會授權建立 remote、push 或公開發佈。

## 1. 權利檢查

- [ ] 記錄每張截圖、標誌、活動元素、字體、程式依賴及第三方素材的使用權基礎。
- [ ] 確認紀錄媒體屬客戶批准的作品集範圍。
- [ ] Guidebook master、page archive、客戶 fonts 及活動 source assets 不可進入 working tree 或歷史。
- [ ] 保留所有需要的第三方 notice；若分發 `liquidframe` CSS 或 source，必須同時保留其 notice。
- [ ] 確認 source-available 政策仍然準確：沒有 `LICENSE`、package metadata 為 `UNLICENSED`，亦沒有把儲存庫描述為 open source。
- [ ] 日後如要改用 software licence，先取得擁有人新的明確批准。

## 2. Identifier、secret 及私隱掃描

- [ ] 掃描完整 working tree，找出 credentials、tokens、private keys、非示例 environment files 及 private URLs。
- [ ] 確認 `.env*` 及 `.dev.vars*` 維持 ignored；只可發佈 placeholder `.env.example`。
- [ ] 使用不會 commit 或輸出的私人 denylist，掃描正式 organisation ID、Cloudflare account ID、Queue／Worker 名稱、Sheet ID、個人聯絡紀錄及客戶通訊。
- [ ] 在獨立候選 repo 的每一個 commit 重複 secret 及 identifier scans。
- [ ] 確認 logs、examples 及文件沒有 submission payload、credentials 或個人資料。

## 3. 合成 fixture 審計

- [ ] 姓名、電郵、電話、organisation ID、event ID、submission ID、URL 及類似帳戶值均為合成及中性資料。
- [ ] 合成模式是無 secret 的預設；install、test 及本機啟動不會接觸正式服務。
- [ ] The Ground live access 及 Queue／Sheets delivery 需另行啟用；缺少設定時 fail closed。

## 4. 文件、陳述及雙語一致性

- [ ] 所有本機 Markdown link 均可解析，durable evidence link 不使用 line-number anchor。
- [ ] 英文及繁體中文 README 的 section markers、陳述、限制、links、diagrams 及 media references 在結構上對齊。
- [ ] 繁中延伸閱讀應連到繁中 partner；程式碼、測試、JSON、媒體及外部官方資料等語言中立目標可共用。
- [ ] Parse 每份 Mermaid source，確認英文版本有正式書面繁中的 partner，且 topology 相同。
- [ ] 每份 ADR 都有 Status、Context、Decision、Consequences 及 References；每個主要陳述連到程式碼、測試、決定或有日期 source note。
- [ ] 每項 `202 Accepted` 陳述都要分開真實非 honeypot 提交（等待 Queue 接受）及 honeypot decoy（相同 status，但不 enqueue）；兩者都不可描述成 Sheet persistence。
- [ ] 重建 prompts 及事後繪製 diagrams 要清楚標示，不能當成逐字歷史。
- [ ] 搜尋禁止聲稱並人工檢查每項否定：不得聲稱 The Ground 正式 partner status、同步 Google Sheets persistence、distributed exactly-once delivery、Cloudflare Pages 是已交付 runtime、one-prompt production delivery，或未量度的 conversion、productivity、SLA、ROI。
- [ ] 活動 URL 是可停用的短期網址；repo 內 media 及 runnable demo 才是較長期紀錄。
- [ ] 從保留的 sanitised record 重新計算所有公開 aggregate metric；requests、page views、Worker invocations、visitors 及 business outcomes 必須分開。
- [ ] 項目直接支出、共享帳戶基本月費、額外用量費及公開價目表比較必須分開。US$0 額外用量費不可寫成總成本為零；有證據時，應同時列出 active paid-plan baseline。
- [ ] invoice-derived facts 不可包含 account、order、payment 或 personal identifiers；沒有可歸屬 line item 時，不可把共享帳戶總額當成項目成本。
- [ ] Search Console 結果只可來自獲授權 verified property；否則應清楚寫出證據缺口，不推測 indexing 或 organic performance。

## 5. 程式碼、build 及 runtime 驗證

- [ ] 使用最新的 Node.js 22.x（最低為 22.13.0）及已提交的 lockfile 執行 `npm ci`。
- [ ] `npm run check`：文件、lint、應用程式及 consumer 型別檢查、應用程式及 consumer runtime tests，以及 Next.js build。
- [ ] `npm run check:cloudflare`：兩個 binding 型別檢查、OpenNext build 及兩個 Worker 部署 dry run。
- [ ] 短暫啟動 `npm run cf:preview`，請求代表性的英文及繁中 routes，再乾淨停止。
- [ ] 使用中性示例設定執行 configuration validation 及 Worker dry runs。
- [ ] 把 build／dry-run evidence 與任何日後 deployment claim 分開記錄；dry run 不會 upload 或 deploy。
- [ ] 真實部署前，準備文件所列 R2 cache、revalidation Durable Object migration、contact Queue／consumer／DLQ、rate-limit namespaces 及已批准 secrets；所有 dependency 齊備前，兩項 live integrations 保持關閉。
- [ ] 完成 mobile Chromium、WebKit 及 desktop Chromium browser QA。
- [ ] 完成 keyboard、focus、link integrity 及 accessibility checks。
- [ ] 從空目錄測試 fresh clone，過程不使用 production secrets。
- [ ] 記錄準確 commands、結果及限制，不擴大任何檢查可以證明的範圍。

## 6. 媒體檢查

- [ ] 按相應語言逐一視覺檢查 PNG、GIF 及 MP4，確認沒有 credentials、personal data、browser history、notifications 或無關 desktop content。
- [ ] 英文及 `-zh-Hant` media 顯示相應介面語言，並維持已批准 device／browser 呈現。
- [ ] 記錄 dimensions 及 duration、確認 playback 與 reduced-motion poster 行為，並提供有意義 alt text。
- [ ] 已批准介面改變時重新 capture；不得以 generated 或 redrawn product pixels 當作證據。

## 7. 獨立 repository history 檢查

- [ ] 完整 draft 通過 publication audit 後，才建立新的本機 repo history；不可複製私人 `.git`。
- [ ] 由另一位 reviewer 檢查 tree、每個 commit、empty-tree diff 及 clone result，找出 excluded files、sensitive values、unsupported claims 及不應加入的 build output。
- [ ] 確認私人 production repo 及其歷史沒有改動，並與公開版本斷開。
- [ ] 候選版本只包含已審閱 source、synthetic fixtures、approved media、required notices 及 reproducible configuration。

## 8. 擁有人發佈閘門

- [ ] 向擁有人提交最終 rights record、audit result、history review、未解決限制及準確 candidate commit。
- [ ] 建立 GitHub repository 或其他 remote 前，取得擁有人指示。
- [ ] 對準確 push／publication action 再取得擁有人指示；本機檢查通過不等於已獲公開授權。
- [ ] 獲授權 push 後，以 signed-out view 檢查公開 repo 及 links，再用於作品集或社交媒體。
