# 安全政策

[English](SECURITY.md) · [**繁體中文**](SECURITY.zh-Hant.md)

本作品集版本是經整理的 reference implementation，使用 synthetic fixtures，所有 integrations 預設關閉。它不是 production security programme，亦不代表可以測試歷史活動網站。

## 報告問題

如在公開 reference implementation 發現 security 或 privacy issue，請透過儲存庫擁有人的 GitHub profile 私下聯絡。請提供受影響 file 或 route、可能影響、version／commit，以及只使用 synthetic data 的最小 reproduction。

不可在 public issue、pull request、discussion、screenshot 或 log 放入 credential、token、private key、personal information、private client material、production endpoint 或 production resource identifier。如沒有安全私人聯絡方法，只需公開表示需要私人 channel。

## Scope

可接受的報告包括：

- credential 或 identifier exposure；
- personal-data handling 或 logging regression；
- validation、Turnstile、rate-limit 或 Queue-boundary bypass；
- unsafe canonical-link generation；以及
- 影響經整理公開 implementation 的 dependency 或 deployment issue。

純文件修正而非 vulnerability，可使用一般 contribution path，但不可包含私人資料。

## 獲授權測試及不在 scope 的目標

獲授權測試只限 source review，以及在測試者控制的本機或測試環境執行本公開版本，並只使用 synthetic data 及測試者擁有或明確獲准使用的資源。

歷史活動網站、客戶 infrastructure 及第三方 platforms 均不是獲授權測試目標。不得向 production services、The Ground、Google Sheets、Cloudflare accounts、客戶 social accounts 或從舊媒體找到的 endpoint 進行 probe 或提交測試資料。

本 repo 只有 demo configuration。任何 committed resource name、placeholder hostname 或 synthetic form destination 都不能當成相應 live resource 存在的證明。

## 回應預期

這是獨立作品集 repo，不承諾 service-level response time。擁有人會在實際可行時確認可重現且在 scope 內的報告，私下評估 exposure，並按需要發佈經整理修正或 advisory。

如中英文版本出現安全範圍解讀差異，以 [English security policy](SECURITY.md) 為準。
