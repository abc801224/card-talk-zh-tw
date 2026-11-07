# 圖卡說話（Card Talk 繁中版）

給口語表達較困難的孩子使用的圖卡溝通（AAC）網頁 App。介面繁體中文，朗讀優先 zh-TW。

## 功能
- 22 個分類、240+ 張內建真實照片圖卡
- 點圖卡朗讀並組成句子；播放整句／刪除／清除
- 自訂圖卡（相機／相簿＋選用錄音）、IndexedDB 儲存、JSON 匯出／匯入
- 圖卡大小與語速可調；PWA／離線（Service Worker）
- 無廣告、不需網路（首次載入後）

## 使用
用 Safari／Chrome 開啟 `index.html`（建議本機伺服器或 HTTPS）。iPad／iPhone：分享 → 加入主畫面。

## 圖片授權
見 [CREDITS.md](./CREDITS.md)。

## 限制
- iOS 需安裝繁體中文系統語音
- 錄音需要 HTTPS（或 localhost）
- `file://` 可能限制 Service Worker／麥克風

## v4 更新
- 介面重新設計（手機版排版、分類列＋「全部分類」、較大的句子列）
- 語音：可選擇裝置上的中文語音（優先台灣國語、標示高品質版本）、試聽、速度與音高
- 家長錄音模式：為內建圖卡錄家人的聲音，會一起備份／匯入
- 幫我組句／換一句：離線規則式組句（非 AI），詳見 compose.js；測試：`node tests-compose.js`
