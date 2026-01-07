require('dotenv').config();
const axios = require('axios');
const WebSocket = require('ws');

const API_BASE = 'https://proxy.opinion.trade:8443/openapi';
const API_KEY = process.env.API_KEY;

const headers = {
	'apikey': API_KEY,
	'Accept': '*/*'
};

// 假设 topicId=1098 对应 marketId，需要先查询或手动获取
// 这里示例：先获取市场详情（调整端点根据文档）
async function getMarketDetail(topicId) {
	try {
		const res = await axios.get(`${API_BASE}/market/${topicId}`, { headers }); // 或 /market/categorical/{id}
		console.log('Market Info:', res.data);
		// 从返回中提取 yesTokenId 和 noTokenId
		return res.data.result.data; // 示例路径
	} catch (err) {
		console.error('Error fetching market:', err.response?.data || err.message);
	}
}

// 获取历史价格曲线（用于初始曲线图）
async function getPriceHistory(tokenId) {
	try {
		const res = await axios.get(`${API_BASE}/token/price-history?token_id=${tokenId}`, { headers });
		const history = res.data.result.data; // 时间序列数组，如 [{time: ..., price: ...}, ...]
		console.log(`History for token ${tokenId}:`, history);
		// 这里可以处理数据、绘图或存储
		return history;
	} catch (err) {
		console.error('Error:', err.response?.data || err.message);
	}
}

// 获取最新价格
async function getLatestPrice(tokenId) {
	try {
		const res = await axios.get(`${API_BASE}/token/latest-price?token_id=${tokenId}`, { headers });
		const price = res.data.result.data.price; // 示例
		console.log(`Latest price for ${tokenId}: ${price}`);
		return price;
	} catch (err) {
		console.error('Error:', err.response?.data || err.message);
	}
}

// WebSocket 实时监控（文档中 Opinion Websocket，假设 ws URL 为 wss://proxy.opinion.trade:8443/ws 或类似，需查文档确认）
function connectWebSocket() {
	const ws = new WebSocket('wss://proxy.opinion.trade/ws_endpoint?apikey=' + API_KEY); // 替换为实际 WS URL

	ws.on('open', () => {
		console.log('WebSocket connected');
		// 订阅特定市场或 token 价格更新，例如：ws.send(JSON.stringify({subscribe: 'price_update', token_id: 'xxx'}));
	});

	ws.on('message', (data) => {
		const msg = JSON.parse(data);
		if (msg.type === 'price_update') {
			console.log('实时价格更新:', msg.data.token_id, msg.data.price);
			// 这里触发警报、记录曲线变化等
		}
	});

	ws.on('close', () => {
		console.log('Disconnected, reconnecting...');
		setTimeout(connectWebSocket, 5000);
	});

	ws.on('error', (err) => console.error('WS Error:', err));
}

// 主函数示例
async function main() {
	const market = await getMarketDetail(1098); // topicId=1098
	if (market) {
		const yesTokenId = market.yesTokenId; // 示例字段
		await getPriceHistory(yesTokenId);
		//     setInterval(() => getLatestPrice(yesTokenId), 10000); // 每10秒轮询一次最新价格

		//     connectWebSocket(); // 启动实时推送
	}
}

main();