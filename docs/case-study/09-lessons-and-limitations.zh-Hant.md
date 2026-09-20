# 下次會保留及改變的做法

[English](09-lessons-and-limitations.md) · [**繁體中文**](09-lessons-and-limitations.zh-Hant.md)

這是一個短期活動項目，不是受控產品研究。因此，最有用的回顧是實際做法：哪些決定有助交付，以及下一屆多收集哪些資料，才可以更清楚評估結果？

## 下次仍會保留的做法

### 先建立可供審閱的 vertical slice

家中伺服器 MVP 讓客戶在正式網域存在前，已經有一個可以打開及討論的頁面。我會再次採用相同做法：及早把體驗中風險較高的部分具體化，同時清楚分開「可以審閱」與「可以上線」。

### 給 Agent 一項有指定來源的小工作

長 prompt 不會取代 Guidebook、The Ground 或客戶決定的核對。Agent 最有用的情況，是每次收到一項範圍明確的工作、相關資料及可見的完成檢查。產品判斷、模糊事實、私隱及發佈仍由我負責。

### 讓每個外部系統保留一項工作

The Ground 保留會改動的節目及報名流程；Google Sheets 是首屆活動刻意保持簡單的聯絡資料目的地，配合預期有限的資料量及尚未確定的未來流程；Cloudflare Queue 則連接公開表格及私人 consumer。這樣不用維護重複時間表，亦不會在有需要前先引入較大型 datastore。

### 在真實裝置測試流程

實體手機檢查比桌面 responsive frame 更清楚顯示活動前須知位置、掃動提示、間距及語言切換問題。自動檢查仍然有用，但只會補充而不會取代這項審閱。

### 在活動前準備失敗狀態

Timeout、回應上限、近期節目副本、穩定提交 ID、retry、duplicate check 及 dead-letter Queue，為短期活動提供合理邊界。資料保留、撤回要求及失敗訊息 recovery 仍需要營運人員負責。

## 下次會增加的項目

1. **上線前的小型任務測試。**

   請數位首次訪客解釋活動、尋找節目、檢查報名及找到場地指引，記錄完成情況、時間及疑惑位置。

2. **重視私隱的 journey counts。**

   在上線前界定節目瀏覽、前往報名平台的點擊及已接受聯絡提交，包括 denominator 及 consent basis，而不把表格內容送到 analytics。

3. **更新時間量度。**

   記錄一項節目修正多久反映，以及團隊需要補充多少次資料。固定 Guidebook 品牌內容仍只會按編輯決定更改。

4. **第二位 reviewer。**

   請另一位設計師、無障礙 reviewer 或工程師重做主要訪客任務及部分發佈檢查。

5. **較長期 performance data。**

   如果網站保持上線足夠時間，再查看 field Core Web Vitals，而不是把 lab checks 當成 real-user 結果。

## 這套設計的界線

| 範圍 | 目前邊界 | 何時需要重新評估 |
| --- | --- | --- |
| **The Ground** | 使用公開 catalogue 的有限度整合及短期記憶體 fallback，不是正式 partner API | 長期商業整合需要雙方同意存取、polling 及內容重用條款 |
| **Google Sheets** | 小型 single-writer 目的地，配合 at-least-once Queue delivery 及營運層 duplicate check | 資料量或流程增加時，把唯一性及並行寫入移到 transactional datastore |
| **公開作品集** | 只保留挑選後程式碼、合成 fixtures 及已批准媒體；不包括私人歷史、個人資料、憑證或受限制素材 | 每次加入新素材時重新確認使用權及資料移除 |
| **量度** | 有日期的交付、流量、帳單及 Search Console 紀錄，但沒有入場、轉換、效率、SLA 或 ROI 研究 | 在下一次上線前先決定成功準則及收集方法 |

現有紀錄足以交代我完成的工作、主要流程如何運作，以及正式服務記錄到的情況。我不會用它們聲稱網站直接提高入場、轉換或商業回報。

參考紀錄：[交付紀錄](delivery-timeline.zh-Hant.md) · [流量與成本](07-production-economics-and-observability.zh-Hant.md) · [搜尋曝光](08-search-discoverability.zh-Hant.md) · [實作索引](10-evidence-index.zh-Hant.md) · [架構決定](../decisions/README.zh-Hant.md)
