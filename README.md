# online-shop-backend

## 介紹
這是一個前後端分離的線上購物網站雛形，本專案為後端 API 部分。

備註1：前端部分請參考這個連結：https://github.com/jamiennn/shop-frontend.git

備註2：本專案未做金流相關設定

## 要跑這個專案，你需要有：
可連線的 SQL 資料庫  
Imgur 帳號  
node v16  

## 安裝

1. 下載專案
```
git clone https://github.com/jamiennn/shop-backend
```

2. 下載專案所使用的套件
```
npm install
```

## 環境設置

### 資料庫
1. 在 SQL 建立資料庫`online_shop_workspace`，登入資訊可至 [config/config.json](https://github.com/jamiennn/shop-backend/blob/master/config/config.json) 設定
2. migrate 資料庫
```
npx sequelize db:migrate
```
3. 建立種子資料
```
npx sequelize db:seed:all
```

### 環境變數
建立 .env 檔案：
```js
// 設定 json web token 所使用的 secret
JWT_SECRET=secret

// 請在 Imgur 申請一組 client id 使用
IMGUR_CLIENT_ID=
```
以上可參考 [.env.example](https://github.com/jamiennn/shop-backend/blob/master/.env.example)


## 開始使用

輸入指令啟動專案
```
npm run dev
```

## 功能介紹
1. 關於各個路徑所回傳的 API 內容，詳細可參考本專案根目錄的 [API.md](https://github.com/jamiennn/shop-backend/blob/master/API.md) 檔案  
2. 針對使用者傳回的表單內容，可以在 [middleware/validator.js](https://github.com/jamiennn/shop-backend/blob/master/middleware/validator.js) 調整驗證，例如：
```js
// 限制定價的上限
const PRICE_MAX = 50000
```