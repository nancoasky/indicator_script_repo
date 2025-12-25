const axios = require('axios');
const util = require('./util.js')

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

module.exports = { retrieveRiverStakingAPRAndAmount, retrieve4FUNItemCount };
