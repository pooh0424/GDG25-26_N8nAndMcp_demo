// 【後端核心】引入所需的模組
const express = require('express');
const fs = require('fs').promises; // 使用 Promise 版本的檔案系統，方便非同步讀取
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 【後端設定】告訴伺服器將 'public' 資料夾當作靜態檔案（前端網頁）的根目錄
app.use(express.static(path.join(__dirname, 'public')));

// 【後端 API 路由】當有人(例如前端)對 '/api/profile' 發出 GET 請求時，執行以下動作
app.get('/api/profile', async (req, res) => {
    try {
        // 1. 讀取 config.json 檔案
        const filePath = path.join(__dirname, 'config.json');
        const fileData = await fs.readFile(filePath, 'utf-8');
        
        // 2. 嘗試解析 JSON 格式
        let jsonData;
        try {
            jsonData = JSON.parse(fileData);
        } catch (parseError) {
            // 【錯誤處理】如果學生在 config.json 少打了逗號或括號，這裡會捕捉到錯誤
            return res.status(500).json({ 
                error: "設定檔格式錯誤", 
                message: "請檢查 config.json 是否符合標準 JSON 格式（例如是否漏了雙引號或逗號）。" 
            });
        }

        // 3. 成功讀取且解析無誤，將資料以 JSON 格式回傳給前端
        res.json(jsonData);

    } catch (err) {
        // 【錯誤處理】檔案不存在或讀取失敗
        console.error("讀取設定檔失敗：", err);
        res.status(500).json({ 
            error: "伺服器內部錯誤", 
            message: "無法讀取 config.json 檔案，請確認檔案是否存在。" 
        });
    }
});

// 【後端啟動】啟動伺服器並監聽指定 port
app.listen(PORT, () => {
    console.log(`伺服器已成功啟動！請在瀏覽器輸入 http://localhost:${PORT} 觀看你的網站。`);
});