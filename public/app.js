// 【前端邏輯】當網頁的 HTML 結構載入完成後，執行這段程式碼
document.addEventListener('DOMContentLoaded', () => {
    
    // 步驟 1：向後端 API 請求設定檔資料
    fetch('/api/profile')
        .then(response => {
            if (!response.ok) throw new Error('無法取得資料或 JSON 解析失敗');
            return response.json(); // 解析為 JS 物件
        })
        .then(data => {
            // 若後端回傳錯誤（例如 JSON 格式壞了）
            if (data.error) {
                alert("後端回傳錯誤：" + data.message);
                return;
            }
            // 步驟 2：資料成功取得，開始渲染網頁
            renderWebsite(data);
        })
        .catch(error => {
            document.getElementById('user-name').innerText = "發生錯誤";
            document.getElementById('user-bio').innerText = "請檢查後端伺服器是否正常運作，或 config.json 格式是否正確。";
            console.error(error);
        });
});

// 【核心函數】將 JSON 資料渲染到前端畫面上
function renderWebsite(config) {
    // === 1. 處理樣式與排版 (Style & Layout) ===
    const styles = config.style_settings;
    
    // 套用深色模式
    if (styles.is_dark_mode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 動態修改 CSS 主題顏色變數
    const root = document.documentElement;
    if (styles.theme_color === 'tech_blue') {
        root.style.setProperty('--primary-color', 'var(--color-tech_blue)');
    } else if (styles.theme_color === 'forest_green') {
        root.style.setProperty('--primary-color', 'var(--color-forest_green)');
    } else if (styles.theme_color === 'rose_pink') {
        root.style.setProperty('--primary-color', 'var(--color-rose_pink)');
    }

    // 切換網頁排版結構 (classic, modern, card)
    const mainContainer = document.getElementById('main-container');
    mainContainer.className = `layout-${styles.layout_choice || 'classic'}`;

    // === 2. 處理個人資訊 (Personal Info) ===
    const info = config.personal_info;
    document.getElementById('site-logo').innerText = `${info.name || 'My'} Portfolio`;
    document.getElementById('user-name').innerText = info.name || '未命名';
    document.getElementById('user-major').innerText = info.major || '未填寫科系';
    document.getElementById('user-birthday').innerText = info.birthday || '神秘';
    document.getElementById('user-animal').innerText = info.favorite_animal || '無';
    document.getElementById('user-bio').innerText = info.bio || '這個人很懶，什麼都沒寫。';

    // 取字首當作大頭貼
    if(info.name) {
        document.getElementById('avatar-placeholder').innerText = info.name.charAt(0);
    }

    // === 3. 處理社群連結 (Social Links) ===
    const socialContainer = document.getElementById('social-links');
    socialContainer.innerHTML = ''; // 清空原本內容
    const links = config.social_links;
    for (const [platform, url] of Object.entries(links)) {
        if (url) {
            const a = document.createElement('a');
            a.href = url;
            a.target = "_blank"; // 開新分頁
            a.innerText = platform.toUpperCase();
            socialContainer.appendChild(a);
        }
    }

    // === 4. 處理專案清單 (Projects) ===
    const projectsContainer = document.getElementById('projects-grid');
    projectsContainer.innerHTML = ''; // 清空
    if (config.projects && config.projects.length > 0) {
        config.projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h4>${project.name}</h4>
                <p>${project.description}</p>
            `;
            projectsContainer.appendChild(card);
        });
    } else {
        projectsContainer.innerHTML = '<p>目前還沒有專案喔！</p>';
    }

    // === 5. 設定深淺色切換按鈕功能 ===
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    });
}