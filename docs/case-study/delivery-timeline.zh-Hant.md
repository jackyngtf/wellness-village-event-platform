# 交付紀錄

[English](delivery-timeline.md) · [**繁體中文**](delivery-timeline.zh-Hant.md)

8 月 5 日，項目已有方向及內部目標，但尚未有正式網域。我沒有等所有細節完成，而是在同日把一個小型可操作版本放到家中伺服器。客戶可以先對實際頁面提出意見，我再用其後兩星期完成內容、整合、UX 修改、私隱檢查及正式環境設定。

## 交付時間線

| 日期 | 里程碑 | 重要性 |
| --- | --- | --- |
| **2026 年 8 月 5 日** | 項目群組確認由我開發網站，內部目標為 8 月 21 日。我在同日稍後把首個可供審閱的 MVP 放到家中伺服器，當時尚未購買正式網域。 | 客戶可以對實際介面提出意見；這仍是早期 vertical slice，不是完成網站。 |
| **8 月 12–14 日** | 加入當時最新的 184 頁 Guidebook 及設計資料，以 The Ground 資料展示 programme route，並處理 Guidebook reader、書面中文、spacing、navigation 及品牌呈現意見。 | 審閱由抽象方向進入真實內容及畫面。我只把未能自行核對的事實或決定交回客戶。 |
| **8 月 19 日** | 正式網域完成註冊，同時繼續核對品牌連結及內容。 | 第一次審閱不需要等待網域購買及正式環境設定。 |
| **8 月 20 日** | 分享可使用的正式網址；網站大致獲接受，仍有一項小改動待處理。 | 正式網址在 8 月 21 日內部目標前一日已可用；其後仍有細節調整。 |
| **8 月 21–26 日** | 繼續處理搜尋設定、文案及圖片修正、場地地圖、聯絡流程與 launch checks。 | 分享網址是 release milestone，不是工作終點。 |
| **8 月 27 日** | 網站短暫回傳 Cloudflare Error 1102。把共享帳戶轉到 Workers Paid，減少 CPU-heavy request paths，並重新檢查 runtime。 | 事故確立較合適的付費 baseline，亦促成活動前的程式優化；不把結果單獨歸因於任何一項改動。 |
| **8 月 28–29 日** | 繼續 runtime hardening、訪客指引及最後修正。 | 在 8 月 30 日活動開始前完成最後工作。 |
| **8 月 30 日至 9 月 10 日** | 網站在中環街市公開活動期間使用。 | 項目進入活動支援階段。 |
| **9 月 18 日** | 整理作品集時，以獲授權 read-only access 檢查 Cloudflare、帳單及 Search Console。 | 保留有日期的流量、成本及搜尋數字，而不是日後估算。 |

## 交付演進

![時間線由首次客戶 brief 及家中伺服器 MVP，發展到正式上線、活動運作及活動後證據整理。](../diagrams/delivery-evolution.zh-Hant.svg)

[開啟完整尺寸圖表](https://raw.githubusercontent.com/jackyngtf/wellness-village-event-platform/refs/heads/main/docs/diagrams/delivery-evolution.zh-Hant.svg)

[查看 Mermaid 原始檔](../diagrams/delivery-evolution.zh-Hant.mmd) · [閱讀經整理的時間線證據說明](../evidence/delivery-timeline/README.zh-Hant.md)

## 家中伺服器預覽的用途

臨時環境只供客戶審閱，不是最終 host。它讓雙方在購買網域及完成正式設定前，先討論最初體驗。預覽本身不是長期紀錄；本儲存庫內的截圖、圖表及可執行 demo 會接替這個用途。

時間安排把兩個問題分開：

1. **產品方向是否已具體到可以審閱？**家中伺服器 MVP 先回答這一點。
2. **系統是否準備好支援公開活動？**之後的整合、私隱、可靠性、部署及 release work 再回答。

## 工作分工

客戶提供已批准活動圖片、Guidebook PDF、設計指引及事實決定。我是唯一開發者，負責產品方向、印刷素材的網頁處理、公開品牌資料研究、雙語介面與整合、部署及 release support。我會先自行處理一般研究，只把模糊事實或要客戶批准的決定交回活動團隊。

Agent 協助資料清單、研究整理、程式碼草稿、重構、測試及文件。我審閱輸出，並保留產品、私隱及發佈決定。

## 資料來源與限制

- 同日 MVP 只證明可以迅速提供可審閱 vertical slice，不代表正式平台同日完成。
- 8 月 20 日只證明可使用的公開版本早於 8 月 21 日目標；細節調整仍然繼續。
- 8 月 27 日紀錄證明曾出現 Error 1102、帳戶轉到 Workers Paid，以及進行 CPU 優化；不能準確分拆各改動的作用。
- 時間線不能證明工時、Agent productivity uplift、conversion、attendance、revenue、SLA performance 或 business causation。
- 部分里程碑由私人項目通訊支持，但不公開聊天全文、參與者身份、聯絡資料、voice note 或私人連結。

## 延伸閱讀

- 背景：[角色與資料來源邊界](01-context-and-role.zh-Hant.md)
- Agent 使用：[Guidebook 與 Agent 工作流程](02-guidebook-and-agent-workflow.zh-Hant.md)
- 正式環境：[流量與成本](07-production-economics-and-observability.zh-Hant.md)及 [Search Console](08-search-discoverability.zh-Hant.md)
- 公開時間線：[經整理交付紀錄](../evidence/delivery-timeline/README.zh-Hant.md)
