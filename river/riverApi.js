const axios = require('axios');
const util = require('./util.js')
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-core');

/**
 * 获取指定推文的回复数
 * @param {*} url 帖文地址
 * @returns 回复数
 */
async function retrieveTwitterReplyCount(url) {
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
/**
 * 
 * @param {*} url 请求路径
 * @returns json对象
 */
async function retrieveRiverApiData(url) {
	try {
		// 1. 使用 axios API数据
		const response = await axios.get(url, {
			// 模拟浏览器 User-Agent，防止部分网站拒绝爬虫访问
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
				'Accept': 'application/json',
				'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
				'Connection': 'keep-alive',
				'Origin': 'https://app.river.inc'
			}
		});
		// console.log(response)

		if (response && response.data) {
			return response.data;
		} else {
			console.error(`get ${url} response fail`);
		}

	} catch (error) {
		console.error('请求发生错误:', error.message);
		return null;
	}
}


/**
 * 获取指定合约地址的代币价格
 * @param {string} contractAddress 代币的合约地址
 * @param {string} vsCurrencies 想要兑换的法币或代币符号，如 'usd', 'cny', 'bnb'
 * @returns {Promise<object|null>} 包含价格信息的对象或 null
*/
async function retrieveTokenPriceByCoinGecko(contractAddress, vsCurrencies = 'usd') {
	// CoinGecko API 的基础 URL
	const BASE_URL = 'https://api.coingecko.com/api/v3';
	// CoinGecko 查询 BSC 上的代币需要使用平台 ID: 'binance-smart-chain'
	const url = `${BASE_URL}/simple/token_price/binance-smart-chain`;

	try {
		const response = await axios.get(url, {
			params: {
				// 将代币地址转换为小写，这是 API 要求的标准做法
				contract_addresses: contractAddress.toLowerCase(),
				// 想要获取的价格类型
				vs_currencies: vsCurrencies
			}
		});

		const data = response.data;

		// CoinGecko 返回的数据结构是以合约地址为键
		if (data && data[contractAddress.toLowerCase()]) {
			const priceData = data[contractAddress.toLowerCase()];
			return priceData;
		} else {
			console.warn(`⚠️ 警告：CoinGecko API 未返回 ${contractAddress} 的价格数据。`);
			console.log("这可能是因为该代币尚未被 CoinGecko 收录。");
			return null;
		}

	} catch (error) {
		// CoinGecko 有 API 速率限制，如果请求过于频繁可能会被限制
		console.error('❌ 获取代币价格时发生错误:', error.message);
		if (error.response && error.response.status === 429) {
			console.error('   错误提示：您可能已达到 API 速率限制 (Rate Limit)。');
		}
		return null;
	}
}

/**
 * 获取指定网页的指定选择器的标签内容
 * @param {*} url 地址
 * @param {*} selector class名 
 * @returns 对应的内容
*/
async function fetchAndParseContent(url, selector) {
	try {
		// 1. 使用 axios 获取页面的 HTML 内容
		const html = await retrieveRiverApiData(url);

		// 2. 使用 cheerio 加载 HTML，cheerio 提供了类似 jQuery 的选择器语法
		const $ = cheerio.load(html);

		// 3. 使用选择器找到第一个匹配的元素
		const targetElement = $(selector).first();

		if (targetElement.length === 0) {
			console.log(`未找到匹配选择器 "${selector}" 的元素。`);
			return null;
		}

		// 4. 获取该元素内的文本内容
		// .text() 方法会去除所有子标签，只保留纯文本
		const content = targetElement.text().trim();
		return content;
	} catch (error) {
		console.error('获取或解析页面内容时发生错误:', error.message);
		return null;
	}
}

// get the maxinum APR
async function retrieveRiverStakingAPRAndAmount(url) {
	let riverConfig = await util.readFileAsJson('river_env.json');
	let aprJsonArr = await retrieveRiverApiData(url);

	// total staked amount
	let totalStakedAmount = 0.00
	aprJsonArr.data.forEach(element => {
		totalStakedAmount += element.stakedRiverAmount;
	});
	let maxinumAPR = aprJsonArr.data[3].apr;

	return {
		'maxinumAPR': (maxinumAPR * 100 * riverConfig.aprFactor).toFixed(2),
		'totalStakedAmount': totalStakedAmount.toFixed(2)
	};
}

/**
 * 获取指定4fun上的yap人数
 * @param {*} url 地址
 * @returns 人数
 */
async function retrieve4FUNItemCount() {
	let fourfunApiURL = 'https://api-v2.satoshiprotocol.org/twitter/account-list?itemsPerPage=10&currentPage=1&sortBy=scoreRank&direction=asc';
	let d = await retrieveRiverApiData(fourfunApiURL);
	if (d) {
		return d.totalItems;
	} else {
		return 0;
	}
}

/**
 * 获取指定的riverpts转换信息
 * @returns 
 */
async function retrieveTodayPtsConversionInfo() {
	let conversionPtsApiURL = 'https://api-airdrop.river.inc/s2/pts-conversion-chart?interval=1d';
	let d = await retrieveRiverApiData(conversionPtsApiURL);
	if (d) {
		let conversionInfoJson = {};
		conversionInfoJson.dynamicConversionStartTime = util.convertUTCAsChinaTime(d.referenceLines[1].timestamp);
		conversionInfoJson.dynamicConversionEndTime = util.convertUTCAsChinaTime(d.referenceLines[3].timestamp);

		let dotList = d.data;
		// 过滤出今天的数据
		let todayChinaTime = util.getCurrentDate();
		/**
		 * {
			"timestamp": "2025-12-26T16:00:00.000Z",
			"ptsAmount": 4271719.47878052,
			"tokensAmount": 5494.61779219,
			"penaltyAmount": 4184.13431284,
			"actualRate": 0.00196142,
			"expectedRate": 0.0072222
		}
		 */
		let totalPtsConvertedAmount = 0;
		let totalRiverConvertedAmount = 0;
		let totalPenaltyAmount = 0;
		let satisfyTodayJson;
		for (let i = 0; i < dotList.length; i++) {
			let d = dotList[i];
			let convertedChinaTime = util.convertUTCAsChinaTime(d.timestamp);
			totalPtsConvertedAmount += d.ptsAmount;
			totalPenaltyAmount += d.penaltyAmount;
			totalRiverConvertedAmount += d.tokensAmount;
			if (todayChinaTime === convertedChinaTime) {
				satisfyTodayJson = d;
				break;
			}
		}
		// console.log(`totalPenaltyAmount : ${totalPenaltyAmount}`)
		// 组装返回的json对象
		conversionInfoJson.totalPtsConvertedAmount = totalPtsConvertedAmount;
		conversionInfoJson.totalRiverConvertedAmount = totalRiverConvertedAmount;
		conversionInfoJson.todayConversion = satisfyTodayJson;

		return conversionInfoJson;
	} else {
		return null;
	}
}

module.exports = {
	retrieveTwitterReplyCount,
	retrieveTokenPriceByCoinGecko,
	fetchAndParseContent,
	retrieveRiverStakingAPRAndAmount,
	retrieve4FUNItemCount,
	retrieveTodayPtsConversionInfo
};
