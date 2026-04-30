const puppeteer = require('puppeteer');
const os = require('os');

/**
 * 获取当前平台的 Chrome 可执行文件路径
 */
function getChromePath() {
    const platform = os.platform();
    
    // 优先使用环境变量
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        return process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    
    // 根据操作系统返回默认路径
    const paths = {
        // Windows
        win32: [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
            process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
        ],
        // macOS
        darwin: [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium',
            process.env.HOME + '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        ],
        // Linux
        linux: [
            '/usr/bin/google-chrome-stable',
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/snap/bin/chromium'
        ]
    };
    
    const platformPaths = paths[platform] || paths.linux;
    
    // 返回第一个存在的路径
    for (const path of platformPaths) {
        try {
            const fs = require('fs');
            if (fs.existsSync(path)) {
                return path;
            }
        } catch (error) {
            // 忽略文件系统错误
        }
    }
    
    // 找不到时返回 undefined，让 puppeteer 使用内置 Chromium
    return undefined;
}

async function launchBrowser() {
    const chromePath = getChromePath();
    
    const launchOptions = {
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
    
    if (chromePath) {
        launchOptions.executablePath = chromePath;
        console.log(`使用 Chrome: ${chromePath}`);
    } else {
        console.log('未找到系统 Chrome，使用 Puppeteer 内置 Chromium');
    }
    
    const browser = await puppeteer.launch(launchOptions);
    return browser;
}

module.exports = {
	launchBrowser
};