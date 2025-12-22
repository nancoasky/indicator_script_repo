const axios = require('axios');
const cheerio = require('cheerio');
const riverApi = require('./riverApi.js')

const url = 'https://app.galxe.com/quest/River/GCr1ktYnFp?utm_source=Twitter&utm_medium=Social&utm_campaign=RiverQuest';
const targetSelector = 'div.text-info-lighten1.text-size-14';

async function fetchAndParseContent(url, selector) {
	try {
		// 1. 使用 axios 获取页面的 HTML 内容
		const response = await axios.get(url, {
			// 模拟浏览器 User-Agent，防止部分网站拒绝爬虫访问
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
				'Connection': 'keep-alive'
			}
		});

		const html = response.data;

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

// 您要查询的代币合约地址
const RIVER_CONTRACT_ADDRESS = '0xda7ad9dea9397cffddae2f8a052b82f1484252b3';

const RIVER_PTS_CONTRACT_ADDRESS = '0xfc6be825925b7a83d131e33b46efef9084f0e014';

// CoinGecko API 的基础 URL
const BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * 获取指定合约地址的代币价格
 * @param {string} contractAddress 代币的合约地址
 * @param {string} vsCurrencies 想要兑换的法币或代币符号，如 'usd', 'cny', 'bnb'
 * @returns {Promise<object|null>} 包含价格信息的对象或 null
 */
async function getTokenPrice(contractAddress, vsCurrencies = 'usd') {
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
			// console.log(`✅ 成功获取 ${contractAddress} 的价格信息：`);

			// 循环打印获取到的所有价格
			// for (const currency in priceData) {
			// 	console.log(`   1 Token = ${priceData[currency]} ${currency.toUpperCase()}`);
			// }
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

// 调用函数获取价格
// 尝试获取美元 (usd) 和 BNB (bnb) 的价格
var riverPriceInUsd = 0.00;
var riverPtsPriceInUsd = 0.00;

getTokenPrice(RIVER_CONTRACT_ADDRESS, 'usd,bnb')
	.then(priceData => {
		if (priceData) {
			riverPriceInUsd = priceData['usd']
		}
	});
getTokenPrice(RIVER_PTS_CONTRACT_ADDRESS, 'usd,bnb')
	.then(priceData => {
		if (priceData) {
			riverPtsPriceInUsd = priceData['usd']
		}
	});
// 获取当前日期
const currentDate = new Date().toLocaleDateString('zh-CN', {
	timeZone: 'Asia/Shanghai',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
}).replace(/\//g, '-'); // 将默认的的斜杠/替换为- 

// 获取river质押相关信息
riverApi.retrieveRiverStakingAPRAndAmount('https://api-airdrop.river.inc/staking/estimate-apr')
	.then(riverStakingJson => {
		// 获取目前galxe上参与的人数
		fetchAndParseContent(url, targetSelector)
			.then(content => {
				if (content) {
					console.log(`-------今日 ${currentDate} River价格播报🎺-------`)
					console.log('✅ River链上价格（USD）💰 ：'.concat('$').concat(riverPriceInUsd));
					console.log('✅ RiverPts链上价格（USD）💰 ：'.concat('$').concat(riverPtsPriceInUsd).concat('\n'))

					console.log(`-------今日 ${currentDate} River官方质押情况🎺-------`)
					console.log('✅ River最高APR ：'.concat(riverStakingJson.maxinumAPR).concat('%'));
					console.log('✅ River质押总数 ：'.concat(riverStakingJson.totalStakedAmount).concat('\n'));

					console.log(`-------今日 ${currentDate} 银河River质押收益分析📃-------`)
					var avgRevenue = 10000 / parseFloat(content)
					console.log('✅ River质押奖池🪣 ：$10000');
					console.log('✅ 奖励发放品种🪙 ：$RIVER');
					console.log('✅ 有效期：2025/12/09 00:00 - 2025/12/29 23:00 GMT+08:00');
					console.log('✅ River质押参数人数🧑‍🤝‍🧑 ：'.concat(content));
					console.log('✅ 猪脚饭收益（USD） 🍚 ：'.concat('$').concat(avgRevenue.toFixed(2)));
					let starRv
					if (avgRevenue / 10 >= 8) {
						starRv = '🌟🌟🌟🌟🌟';
					} else if (avgRevenue / 10 >= 6) {
						starRv = '🌟🌟🌟🌟';
					} else if (avgRevenue / 10 >= 4) {
						starRv = '🌟🌟🌟';
					} else if (avgRevenue / 10 >= 2) {
						starRv = '🌟🌟';
					} else if (avgRevenue / 10 >= 1) {
						starRv = '🌟';
					} else {
						starRv = '😴';
					}
					console.log(`✅ 猪脚饭评分：${starRv}`);
				}
			});
	})




