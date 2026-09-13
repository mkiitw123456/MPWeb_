# MPWeb 玩家註冊網站

獨立的 React / Vite 網站，供 Vercel Git 部署。

## 目前狀態

目前是「註冊尚未開放」預覽：欄位與送出停用，不建立帳號，也不連接本機或 Hamachi。這不是已完成公開註冊的網站。

## Vercel

匯入此儲存庫，Root Directory 使用根目錄（留空或 `.`），Framework 選 Vite。建置命令 `npm run build`，輸出目錄 `dist`，使用 Node.js 22 或更新的相容版本。部署後可先使用 Vercel 自帶網址。

## 本機

```sh
npm ci
npm run build
npm run preview
```

## 接通註冊前

另建立受驗證的 HTTPS 註冊 API 與本機遊戲資料庫之間的連接、來源檢查及限流，再啟用表單。Vercel 無法自動加入 Hamachi。電腦離線時應暫停註冊。不得把管理後台或 MySQL 直接公開。

此儲存庫不包含遊戲客戶端、WZ、管理後台、資料庫設定或密鑰。任何伺服端密鑰都不得使用 VITE_ 前綴或提交到 Git。
