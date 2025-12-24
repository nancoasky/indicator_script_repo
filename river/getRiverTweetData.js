const puppeteer = require('puppeteer-core');

async function getReplyCount(url) {
    // launch({ headless: true }) 表示不弹出浏览器窗口
    const browser = await puppeteer.launch({ 
        headless: "new",
		executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();

    // 设置伪装 User-Agent，防止被识别为机器人
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

    try {
        // console.debug("正在加载页面...");
        await page.goto(url, { waitUntil: 'networkidle2' }); // 等待网络空闲

        // 等待推文内容渲染出来
        const selector = 'article[data-testid="tweet"] [data-testid="reply"]';
        await page.waitForSelector(selector, { timeout: 15000 });

        // 在页面上下文中执行脚本获取数据
        const replyCount = await page.evaluate(() => {
            const btn = document.querySelector('article[data-testid="tweet"] [data-testid="reply"]');
            if (btn) {
                // 优先取文本，如果没有文本则取 aria-label
                return btn.innerText.trim() || btn.getAttribute('aria-label');
            }
            return "未找到";
        });

		return replyCount;
    } catch (error) {
        console.error("获取失败，原因可能是：页面加载过慢、需要登录或被反爬虫拦截。");
        // 调试用：保存截图看看页面卡在哪里了
        await page.screenshot({ path: 'debug_error.png' });
    } finally {
        await browser.close();
    }
}

module.exports = { getReplyCount };