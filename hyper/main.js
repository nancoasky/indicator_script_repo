// river-spot-optimized.js
const API_URL = 'https://api.hyperliquid.xyz/info';

async function queryRiverSpotOptimized() {
	console.log(`🔍 查询 RIVER/USDC 现货行情（优化版）... (${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })})`);

	// 1. 获取 spotMeta 并自动找到正确 coin (@301)
	const metaRes = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ type: 'spotMeta' })
	});
	const meta = await metaRes.json();
	const tokens = meta.tokens || [];
	const universe = meta.universe || [];

	const riverToken = tokens.find(t => t.name.toUpperCase() === 'RIVER');
	const usdcToken = tokens.find(t => t.name === 'USDC');

	if (!riverToken) {
		console.error('❌ 未找到 RIVER token');
		return;
	}

	const riverPair = universe.find(pair =>
		pair.tokens && pair.tokens.includes(riverToken.index) && pair.tokens.includes(usdcToken.index)
	);

	const coin = riverPair ? riverPair.name : '@301'; // 兜底 @301
	console.log(`🔑 使用 coin = "${coin}" (RIVER/USDC)`);

	const now = Date.now();
	const startTime = now - 25 * 60 * 60 * 1000;

	// 2. 5m K线（更敏感） + 24h 行情
	const candleRes = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			type: 'candleSnapshot',
			req: { coin, interval: '5m', startTime, endTime: now }
		})
	});
	const candles = await candleRes.json();

	let changePct = '暂无', volume24h = 0, currentMid = 'N/A';
	if (Array.isArray(candles) && candles.length >= 2) {
		const first = candles[0];
		const last = candles[candles.length - 1];
		const open24h = parseFloat(first[1]);
		const close24h = parseFloat(last[4]);
		volume24h = candles.reduce((sum, c) => sum + parseFloat(c[5] || 0), 0);
		changePct = open24h ? ((close24h - open24h) / open24h * 100).toFixed(2) + '%' : '暂无';
	} else {
		changePct = '暂无 24h 数据（刚上线）';
	}

	// 最新中间价
	const midsRes = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ type: 'allMids' })
	});
	const allMids = await midsRes.json();
	currentMid = allMids[coin] || 'N/A';

	// 3. L2 订单簿 + 最佳买卖价 + 总深度
	const l2Res = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ type: 'l2Book', coin })
	});
	const l2Book = await l2Res.json();

	let bestBid = 'N/A', bestAsk = 'N/A', spread = 'N/A';
	let bidDepthUSDC = 0, askDepthUSDC = 0;

	if (l2Book && Array.isArray(l2Book.bids) && l2Book.bids.length > 0) {
		bestBid = parseFloat(l2Book.bids[0][0]).toFixed(5);
		bestAsk = parseFloat(l2Book.asks[0][0]).toFixed(5);
		spread = (parseFloat(bestAsk) - parseFloat(bestBid)).toFixed(5);

		// 前 10 档总深度（USDC）
		l2Book.bids.slice(0, 10).forEach(([p, s]) => bidDepthUSDC += parseFloat(p) * parseFloat(s));
		l2Book.asks.slice(0, 10).forEach(([p, s]) => askDepthUSDC += parseFloat(p) * parseFloat(s));
	}

	// 4. 最近一笔成交（新增）
	const tradesRes = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ type: 'recentTrades', coin })
	});
	const recentTrades = await tradesRes.json();

	// 4. 根据overview获取现货统计数据
	const spotMetas = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ type: 'spotMetaAndAssetCtxs' })
	});
	const spotMetaAndAssetCtxs = await spotMetas.json();
	// API 返回的是数组 [meta, assetCtxs]
	let riverAssetCtx;
	if (Array.isArray(spotMetaAndAssetCtxs) && spotMetaAndAssetCtxs.length == 2) {
		const assetCtxs = spotMetaAndAssetCtxs[1];
		if (assetCtxs.length >= 301) {
			riverAssetCtx = assetCtxs[301];
		}
	}

	// {
    //         "prevDayPx": "8.1",
    //         "dayNtlVlm": "57338.329713",
    //         "markPx": "7.947",
    //         "midPx": "7.9765",
    //         "circulatingSupply": "99999999.9242267013",
    //         "coin": "@301",
    //         "totalSupply": "99999999.9242267013",
    //         "dayBaseVlm": "6492.31"
    //     }
	// changePct = changePct == '暂无' ? (isNullOrEmpty(riverAssetCtx) ? '暂无' : riverAssetCtx.) : changePct;
	let preDayPrice = isNullOrEmpty(riverAssetCtx) ? 'N/A' : riverAssetCtx.prevDayPx;
	currentMid = isNullOrEmpty(riverAssetCtx) ? currentMid : riverAssetCtx.markPx;
	changePct = isNullOrEmpty(riverAssetCtx) ? changePct : ((parseFloat(currentMid) - parseFloat(riverAssetCtx.prevDayPx)) / parseFloat(riverAssetCtx.prevDayPx) * 100).toFixed(2) 
	volume24h = volume24h || (isNullOrEmpty(riverAssetCtx) ? 0 : riverAssetCtx.dayNtlVlm);
    let tokenVolumn24h = isNullOrEmpty(riverAssetCtx) ? 'N/A' : riverAssetCtx.dayBaseVlm;
	// 输出汇总
	console.log(`\n✅ RIVER/USDC 现货实时行情`);
	console.log(` 当前标记价: ${currentMid} USDC`);
	console.log(` 昨日收盘价: ${preDayPrice} USDC`);
	console.log(` 24h 涨跌幅: ${changePct}%`);
	console.log(` 24h 交易量: ${volume24h.toLocaleString()} USDC`);
    console.log(` 24h 交易量: ${tokenVolumn24h.toLocaleString()} RIVER`);

	console.log(`\n📊 最佳买卖价 & 价差`);
	console.log(` 最佳买价 (Bid) : ${bestBid} USDC`);
	console.log(` 最佳卖价 (Ask) : ${bestAsk} USDC`);
	console.log(` 当前价差 : ${spread} USDC`);

	console.log(`\n🕒 最近成交记录 (最多显示 10 笔)`);
	if (Array.isArray(recentTrades) && recentTrades.length > 0) {
		const latest = recentTrades[0];
		const latestTime = new Date(latest.time); // 接口返回毫秒级时间戳
		const minutesAgo = ((now - latest.time) / 60000).toFixed(1);

		console.log(`   最新一笔 → ${latestTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}（${minutesAgo} 分钟前）`);
		console.log(`   价格: ${latest.px} USDC | 数量: ${latest.sz} RIVER | 方向: ${latest.side === 'B' ? '🟢 买入' : '🔴 卖出'}`);

		// 显示最近 10 笔，统一使用上海时间
		recentTrades.slice(0, 10).forEach((t, i) => {
			const tTime = new Date(t.time).toLocaleTimeString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' });
			const sideEmoji = t.side === 'B' ? '🟢' : '🔴';
			console.log(`   ${i + 1}. ${tTime} | ${t.px} | ${t.sz} RIVER | ${sideEmoji}`);
		});
	} else {
		console.log(`   暂无成交记录`);
	}

	console.log(`\n💧 深度统计 (前 10 档)`);
	console.log(` 买单总深度 ≈ ${bidDepthUSDC.toFixed(2)} USDC`);
	console.log(` 卖单总深度 ≈ ${askDepthUSDC.toFixed(2)} USDC`);

	console.log(`\n💡 数据来源：Hyperliquid 官方 Info API（@301）`);
}

function isNullOrEmpty(obj) {
	// null 或 undefined
	if (obj == null) return true;

	// 不是对象类型（比如数字、字符串、数组等）
	if (typeof obj !== 'object') return false;

	// 空对象 {}
	return Object.keys(obj).length === 0;
}

// 运行
queryRiverSpotOptimized().catch(err => console.error('请求失败:', err.message));
