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

 let latestTrade = null;
 if (Array.isArray(recentTrades) && recentTrades.length > 0) {
 latestTrade = recentTrades[0]; // 最新的一笔
 }

 // 输出汇总
 console.log(`\n✅ RIVER/USDC 现货实时行情`);
 console.log(` 当前中间价: ${currentMid} USDC`);
 console.log(` 24h 涨跌幅: ${changePct}`);
 console.log(` 24h 交易量: ${volume24h.toLocaleString()} USDC`);

 console.log(`\n📊 最佳买卖价 & 价差`);
 console.log(` 最佳买价 (Bid) : ${bestBid} USDC`);
 console.log(` 最佳卖价 (Ask) : ${bestAsk} USDC`);
 console.log(` 当前价差 : ${spread} USDC`);

 console.log(`\n📈 最近一笔成交`);
 if (latestTrade) {
 const tradeTime = new Date(latestTrade.time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
 const side = latestTrade.side === 'B' ? '买入' : '卖出';
 console.log(` 时间: ${tradeTime}`);
 console.log(` 价格: ${latestTrade.px} USDC`);
 console.log(` 数量: ${latestTrade.sz} RIVER`);
 console.log(` 方向: ${side}`);
 } else {
 console.log(` 暂无成交记录（流动性积累中）`);
 }

 console.log(`\n💧 深度统计 (前 10 档)`);
 console.log(` 买单总深度 ≈ ${bidDepthUSDC.toFixed(2)} USDC`);
 console.log(` 卖单总深度 ≈ ${askDepthUSDC.toFixed(2)} USDC`);

 console.log(`\n💡 数据来源：Hyperliquid 官方 Info API（@301）`);
}

// 运行
queryRiverSpotOptimized().catch(err => console.error('请求失败:', err.message));
