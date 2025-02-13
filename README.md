# Vue3 + ECharts 圖表 Demo

使用 Vue3 + Vite + ECharts 的簡單圖表專案，展示如何整合 ECharts 圖表，並支援 RWD。

專案連結: https://echarts-demo-five.vercel.app/echarts

## 專案特色

- 使用 ECharts 繪製圖表
- 支援視窗縮放自動調整
- 基於 Vue3 + Vite，開發體驗更快
- 響應式設計，適應不同螢幕大小
- 可擴展，能夠輕鬆加入更多圖表

## 安裝與運行

```
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

## 資料夾配置

```
src/
├── assets/          # 靜態資源
│   ├── images/      # 圖片
│   ├── styles/      # 樣式檔
├── components/      # 元件
├── views/           # 頁面
├── router/          # 路由配置
├── store/           # pinia 狀態管理
├── api/             # API 請求
├── utils/           # 工具函數
├── App.vue          # 主組件
│── main.js          # 入口文件
├── README.md        # 專案說明
├── package.json     # 依賴與指令
└── vite.config.js   # Vite 配置
```

## 使用的圖表

目前 Demo 內包含以下 ECharts 圖表：

- Bar Chart（長條圖）
- Pie Chart（圓餅圖）
- Taiwan Map（台灣地圖）
