# MPWeb 玩家註冊網站

React / Vite 前端與 Vercel Functions。正式網址 https://mp-web-9q62.vercel.app/ 。

## 架構

瀏覽器 → 同來源 Vercel API → HTTPS 測試通道 → 本機 127.0.0.1:8789 專用註冊服務 → 遊戲資料庫。

Vercel Production 環境需設定 REGISTRATION_BRIDGE_URL 與 REGISTRATION_BRIDGE_TOKEN，兩者都不得加 VITE_ 前綴。只有 Production 配置連接，Preview 缺少設定時會顯示服務暫停。

註冊入口驗證來源、簽名 CSRF 和 HttpOnly Cookie；本機服務驗證密鑰並限制每個來源 10 分鐘 5 次、全體 10 分鐘 30 次、同時 2 筆。只轉送帳號、密碼與 UUID；不轉送玩家提供的權限或其他欄位。密碼由本機 bcrypt 處理。UUID 讓相同提交可重試。服務離線時停用表單，頁面開啟超過 30 分鐘需重新整理。

## 部署

Git main 自動部署。Root Directory 為根目錄，Vite，npm run build，dist。npm test 執行 API 測試。變更環境變數後需重新部署。

## 測試通道限制

目前使用 Cloudflare Quick Tunnel；電腦、註冊服務或通道離線就無法註冊，通道重啟會改網址。本機 ops/Start-RegistrationBridge.ps1 啟動服務，ops/Sync-RegistrationBridge.ps1 驗證並同步新的 Vercel Production 參數，之後需部署套用。此版本沒有信箱驗證、自助找回密碼或 CAPTCHA；正式營運前應改成穩定主機與完整防濫用設計。

此儲存庫沒有遊戲資料、管理 API、資料庫憑證或通知密鑰。
