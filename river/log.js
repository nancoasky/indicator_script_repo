const util = require('./util.js');


/**
 * 打印river价格信息
 * @param {*} currentDate 当前日期
 * @param {*} riverPriceInUsd river现货价格
 * @param {*} riverPtsPriceInUsd riverpts现货价格
 */
function logRiverPrice(currentDate, riverPriceInUsd, riverPtsPriceInUsd) {
	console.log(`-------今日 ${currentDate} River价格播报🎺-------`)
	console.log('✅ River链上价格（USD）💰 ：'.concat('$').concat(riverPriceInUsd));
	console.log('✅ RiverPts链上价格（USD）💰 ：'.concat('$').concat(riverPtsPriceInUsd).concat('\n'))
}

/**
 * 打印river的官方质押情况
 * @param {*} currentDate 当前日期
 * @param {*} maxinumAPR 最大年化
 * @param {*} oldTotalOfficialStakedAmount 昨日质押量 
 * @param {*} nowTotalStakedAmount 今日质押量
 */
function logRiverOfficialStaking(currentDate, maxinumAPR, oldTotalOfficialStakedAmount, nowTotalStakedAmount) {
	console.log(`-------今日 ${currentDate} River官方质押情况🎺-------`)
	console.log('✅ River最高APR ：'.concat(maxinumAPR).concat('%'));
	console.log('✅ River质押总数 ：'.concat(nowTotalStakedAmount)
		.concat(util.formatCompareIndication(oldTotalOfficialStakedAmount, nowTotalStakedAmount))
		.concat('\n'));
}

/**
 * 打印2025年的river银河任务质押情况
 * @param {*} currentDate 当前日期
 * @param {*} oldTotal2025GalxeStakingCount 昨日质押人数
 * @param {*} nowTotal2025GalxeStakingCount 今日质押人数
 * @param {*} riverPriceInUsd river现货价格
 */
function log2025GalxeStakingAction(currentDate, oldTotal2025GalxeStakingCount, nowTotal2025GalxeStakingCount, riverPriceInUsd) {
	console.log(`-------今日 ${currentDate} 银河River质押收益分析📃-------`)
	var avgRevenue = 10000 / parseFloat(nowTotal2025GalxeStakingCount)
	let avgCost = riverPriceInUsd * 10;
	console.log('✅ River质押奖池🪣 ：$10000');
	console.log('✅ 奖励发放品种🪙 ：$RIVER');
	console.log('✅ 有效期：2025/12/09 00:00 - 2025/12/29 23:00 GMT+08:00');
	console.log('✅ River质押参数人数🧑‍🤝‍🧑 ：'
		.concat(nowTotal2025GalxeStakingCount)
		.concat(util.formatCompareIndication(oldTotal2025GalxeStakingCount, nowTotal2025GalxeStakingCount)));
	console.log('✅ 质押成本（USD）👝 ：'.concat(avgCost));
	console.log('✅ 猪脚饭收益（USD） 🍚 ：'.concat(avgRevenue.toFixed(2)));
	let starRv;
	let anaRatio = avgRevenue / avgCost;
	if (anaRatio >= 8) {
		starRv = '🌟🌟🌟🌟🌟';
	} else if (anaRatio >= 6) {
		starRv = '🌟🌟🌟🌟';
	} else if (anaRatio >= 4) {
		starRv = '🌟🌟🌟';
	} else if (anaRatio >= 2) {
		starRv = '🌟🌟';
	} else if (anaRatio >= 1) {
		starRv = '🌟';
	} else {
		starRv = '😴';
	}
	console.log(`✅ 猪脚饭评分：${starRv}\n`);
}

/**
 * 打印river的积分转换情况
 * @param {*} currentDate 当前日期
 * @param {*} conversionInfo 积分对象
 * @param {*} oldPtsActualRate 昨日真实兑换比例
 */
function logPtsConversionInfo(currentDate, conversionInfo, oldPtsActualRate) {
	console.log(`-------截止${currentDate} pts转换分析📃-------`)
	console.log(`⏰ 积分兑换有效期：${conversionInfo.dynamicConversionStartTime} ~ ${conversionInfo.dynamicConversionEndTime} `);
	console.log(`✅ 已转换积分总量：${conversionInfo.totalPtsConvertedAmount}`);
	console.log(`✅ 已转换RIVER总量：${conversionInfo.totalRiverConvertedAmount} \n`);

	console.log(`-------今日 ${currentDate} pts转换分析📃-------`)
	console.log(`✅ 积分兑换总量：${conversionInfo.todayConversion.ptsAmount} `);
	console.log(`✅ 已兑换RIVER量：${conversionInfo.todayConversion.tokensAmount} `);
	console.log(`✅ 理想最大兑换利率：${conversionInfo.todayConversion.expectedRate} `);
	console.log(`✅ 实际最大兑换利率：${conversionInfo.todayConversion.actualRate}${util.formatCompareIndication(oldPtsActualRate, conversionInfo.todayConversion.actualRate)} \n`);
}

/**
 * 打印4fun嘴撸数据
 * @param {*} currentDate 当前日期
 * @param {*} oldRiver4funItems 昨日嘴撸登记人数
 * @param {*} nowRiver4funItems 今日嘴撸登记人数
 */
function logRiver4Fun(currentDate, oldRiver4funItems, nowRiver4funItems) {
	console.log(`-------今日 ${currentDate} 4fun嘴撸分析📃-------`)
	console.log(`✅ 嘴撸人数 💬：${nowRiver4funItems}${util.formatCompareIndication(oldRiver4funItems, nowRiver4funItems)} \n`);
}

/**
 * 打印river的2025年圣诞抽奖情况
 * @param {*} currentDate 当前日期
 * @param {*} rpyCount 帖子回复数
 */
function log2025ChristmasAction(currentDate, rpyCount) {
	console.log(`-------今日 ${currentDate} River圣诞抽奖分析🎄-------`)
	console.log('✅ 有效期：2025/12/23 - 2025/12/25');
	console.log('✅ 帖子回复数 ：'.concat(rpyCount));
	let get50DollarRatio = 20 / parseFloat(rpyCount) * 100.00;
	let getHoodiesRatio = 5 / parseFloat(rpyCount) * 100.00;
	console.log('✅ 价值$50等值River中奖概率 ：'.concat(get50DollarRatio.toFixed(2)).concat('%'));
	console.log('✅ 连帽衫中奖概率 ：'.concat(getHoodiesRatio.toFixed(2)).concat('%'));
}

module.exports = { logRiverPrice, logRiverOfficialStaking, log2025GalxeStakingAction, logPtsConversionInfo, logRiver4Fun, log2025ChristmasAction };