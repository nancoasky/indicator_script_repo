const util = require('./util.js');


/**
 * 打印river价格信息
 * @param {*} currentDate 当前日期
 * @param {*} riverPriceInUsd river现货价格
 * @param {*} riverPtsPriceInUsd riverpts现货价格
 */
function logRiverPrice(currentDate, oldriverPriceInUsd, oldriverPtsPriceInUsd, riverPriceInUsd, riverPtsPriceInUsd) {
	console.log(`-------今日 ${currentDate} River价格播报🎺-------`)
	console.log('✅ River链上价格（USD）💰 ：'
		.concat('$')
		.concat(riverPriceInUsd)
		.concat(util.formatCompareIndication(oldriverPriceInUsd, riverPriceInUsd)));
	console.log('✅ RiverPts链上价格（USD）💰 ：'
		.concat('$')
		.concat(riverPtsPriceInUsd)
		.concat(util.formatCompareIndication(oldriverPtsPriceInUsd, riverPtsPriceInUsd))
		.concat('\n'))
}

/**
 * 打印river的官方质押情况，统计范围为自2025-12-11以来
 * @param {*} currentDate 当前日期
 * @param {*} maxinumAPR 最大年化
 * @param {*} oldTotalOfficialStakedAmount 昨日质押量 
 * @param {*} nowTotalStakedAmount 今日质押量
 */
function logRiverOfficialStaking(currentDate, maxinumAPR, oldTotalOfficialStakedAmount, riverStakingJson) {
	console.log(`-------今日 ${currentDate} River官方质押情况🎺-------`)
	console.log('✅ River最高APR(12个月) ：'.concat(maxinumAPR).concat('%'));
	console.log('✅ River质押总数(自2025-12-11以来) ：'.concat(util.formatDecimal(riverStakingJson.totalStakedAmount))
		.concat(util.formatCompareIndication(oldTotalOfficialStakedAmount, riverStakingJson.totalStakedAmount)));
	console.log('🧺质押3月总量：'.concat(util.formatDecimal(riverStakingJson.threemTotalStakedAmout))
		.concat(' (🌟')
		.concat((riverStakingJson.threemTotalStakedAmout * parseFloat(100) / riverStakingJson.totalStakedAmount).toFixed(2))
		.concat('%)')
	);
	console.log('🧺质押6月总量：'.concat(util.formatDecimal(riverStakingJson.sixmTotalStakedAmout))
		.concat(' (🌟')
		.concat((riverStakingJson.sixmTotalStakedAmout * parseFloat(100) / riverStakingJson.totalStakedAmount).toFixed(2))
		.concat('%)')
	);
	console.log('🧺质押9月总量：'.concat(util.formatDecimal(riverStakingJson.nicemTotalStakedAmout))
		.concat(' (🌟')
		.concat((riverStakingJson.nicemTotalStakedAmout * parseFloat(100) / riverStakingJson.totalStakedAmount).toFixed(2))
		.concat('%)'));
	console.log('🧺质押12月总量：'.concat(util.formatDecimal(riverStakingJson.twmTotalStakedAmout))
		.concat(' (🌟')
		.concat((riverStakingJson.twmTotalStakedAmout * parseFloat(100) / riverStakingJson.totalStakedAmount).toFixed(2))
		.concat('%)')
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
 * 打印2026年开春的river银河铸造稳定币活动
 * @param {*} currentDate 当前日期
 * @param {*} oldTotal2026GalxeMintStatUSDCount 昨日质押人数
 * @param {*} nowTotal2026GalxeMintStatUSDCount 今日质押人数
 * @param {*} riverPtsPriceInUsd river现货价格
 */
function log2026GalxeMintSatUSDAction(currentDate, oldTotal2026GalxeMintStatUSDCount, nowTotal2026GalxeMintStatUSDCount, riverPtsPriceInUsd) {
	console.log(`-------今日 ${currentDate} 银河River铸币活动分析📃-------`)
	let avgPtsPerPerson = 1000000 / parseFloat(nowTotal2026GalxeMintStatUSDCount);
	let avgRevenue = avgPtsPerPerson * riverPtsPriceInUsd
	let avgCost = 10;
	console.log('✅ 铸币奖池🪣 ：1,000,000');
	console.log('✅ 奖励发放品种🪙 ：$RIVERPTS');
	console.log('✅ 有效期：2026/01/13 21:00 - 2026/01/16 22:00 GMT+08:00');
	console.log('✅ 参数人数🧑‍🤝‍🧑 ：'
		.concat(util.formatDecimal(nowTotal2026GalxeMintStatUSDCount, 0, 0))
		.concat(util.formatCompareIndication(oldTotal2026GalxeMintStatUSDCount, nowTotal2026GalxeMintStatUSDCount)));
	console.log('✅ 铸币成本（USD）👝 ：'.concat(avgCost));
	console.log('✅ 人均积分（PTS）👝 ：'.concat(avgPtsPerPerson.toFixed(2)));
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
 * 打印river的积分转换情况，统计范围为自2025-12-11以来
 * @param {*} currentDate 当前日期
 * @param {*} conversionInfo 积分对象
 * @param {*} oldPtsActualRate 昨日真实兑换比例
 * @param {*} oldtotalRiverConvertedAmount 昨日兑换的river总量
 */
function logPtsConversionInfo(currentDate, conversionInfo, oldPtsActualRate, oldtotalRiverConvertedAmount) {
	console.log(`-------截止${currentDate} pts转换分析📃-------`)
	console.log(`⏰ 积分兑换2.0有效期：${conversionInfo.dynamicConversionStartTime} ~ ${conversionInfo.dynamicConversionEndTime} `);
	console.log(`✅ 已转换积分总量：${util.formatDecimal(conversionInfo.totalPtsConvertedAmount)}`);
	console.log(`✅ 已转换RIVER总量：${util.formatDecimal(conversionInfo.totalRiverConvertedAmount)}${util.formatCompareIndication(oldtotalRiverConvertedAmount, conversionInfo.totalRiverConvertedAmount)}`);

	let conversionProgress = conversionInfo.totalRiverConvertedAmount * 100 / parseFloat(30000000)
	console.log(`✅ 已转换进度(30M$RIVER)：${conversionProgress.toFixed(2)}% \n`);

	console.log(`-------今日 ${currentDate} pts转换分析📃-------`)
	console.log(`✅ 积分兑换总量：${util.formatDecimal(conversionInfo.todayConversion.ptsAmount)} `);
	console.log(`✅ 已兑换RIVER量：${util.formatDecimal(conversionInfo.todayConversion.tokensAmount)} `);
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
	console.log(`✅ 嘴撸人数 💬：${util.formatDecimal(nowRiver4funItems, 0, 0)}${util.formatCompareIndication(oldRiver4funItems, nowRiver4funItems)} \n`);
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

/**
 * 打印2026年的新年价格预测活动
 * @param {*} currentDatetime 当前时间
 * @param {*} predictionTop20RecordJson 20条top记录信息
 */
function log2026NewYearPricePredictionAction(currentDatetime, predictionTop20RecordJson) {
	let totalParticipateCount = predictionTop20RecordJson.totalItemsSize;
	// 愿景活动
	console.log(`-------今日 ${currentDatetime} River愿景活动分析🎺-------`)
	console.log('✅ 竞猜奖池🪣 ：$2,026');
	console.log('✅ 奖励发放品种🪙 ：$USDT');
	console.log('✅ 竞猜有效期：2026/01/02 - 2026/01/12');
	console.log('✅ 奖励公布日期：2026/01/16');
	console.log('✅ 奖励发放人数🧑‍🤝‍🧑 ：100');
	console.log('✅ 猪脚饭收益（USD） 🍚 ：20.26');
	console.log('✅ 目前参与人数 ：'.concat(util.formatDecimal(totalParticipateCount, 0, 0)));
	let get20DollarRatio = 100 / parseFloat(totalParticipateCount - 20) * 100.00;
	console.log('✅ 中奖概率 ：'.concat(get20DollarRatio.toFixed(2)).concat('%\n'));

	// 价格竞猜活动
	console.log(`-------今日 ${currentDatetime} River价格竞猜活动分析🎺-------`)
	console.log('✅ 竞猜奖池🪣 ：$2,026');
	console.log('✅ 奖励发放品种🪙 ：$RIVER');
	console.log('✅ 竞猜有效期：2026/01/02 - 2026/01/12');
	console.log('✅ 奖励公布日期：2026/01/16');
	console.log('✅ 奖励发放人数🧑‍🤝‍🧑 ：20');
	console.log('✅ 猪脚饭收益（USD） 🍚 ：101');
	console.log('✅ 目前参与人数 ：'.concat(util.formatDecimal(totalParticipateCount, 0, 0)));
	let get101DollarRatio = 20 / parseFloat(totalParticipateCount) * 100.00;
	console.log('✅ 中奖概率 ：'.concat(get101DollarRatio.toFixed(2)).concat('%'));
	console.log('✅ 竞猜评选结果依据：以 @CoinMarketCap 于2026/1/15 东八区晚8点的 $RIVER 收盘价为准');
	let formatLog = '✅ 目前榜单：';
	for (let i = 0; i < predictionTop20RecordJson.totalItems.length; i++) {
		let d = predictionTop20RecordJson.totalItems[i];

		let rankLogo = '🏁';
		if (d.rank === 1) {
			rankLogo = '🥇';
		} else if (d.rank === 2) {
			rankLogo = '🥈';
		} else if (d.rank === 3) {
			rankLogo = '🥉';
		}
		formatLog += `${rankLogo} ${d.twitterName} `;
		if ((i + 1) % 10 == 0 || (i + 1) == 3) {
			formatLog += '\n';
		}
	}
	console.log(`${formatLog}\n`);
}

/**
 * 打印2026年的sui&river创意活动
 * @param {*} currentDate 当前时间
 * @param {*} predictionTop20RecordJson 20条top记录信息
 */
function log2026SuiCreationAction(currentDate, riverPtsPriceInUsd) {
	// 
	console.log(`-------今日 ${currentDate} River&Sui创意活动分析🎺-------`)
	console.log('✅ 奖池🪣 ：$2,000RIVER&&100,000$RIVERPTS');
	console.log('✅ 创作时间：2026/01/27 - 2026/01/31');
	console.log('✅ 奖励公布日期：2026/02/02');
	console.log(`✅ 奖励发放规则🧑‍🤝‍🧑 ：
▸ 前20创作者，共享$2,000等值$RIVER
▸ 前100～200创作者, 共享100,000$RiverPts`);
	let avgMax = 1000000 / parseFloat(100) * riverPtsPriceInUsd;
	let avgMin = 1000000 / parseFloat(200) * riverPtsPriceInUsd;
	console.log(`✅ 猪脚饭🍚 ：
▸ 前20创作者人均：$100 等值RIVER
▸ 前100～200创作者人均：5000~10000PTS 价值 ${avgMin.toFixed(2)} ~ ${avgMax.toFixed(2)}\n`);
}

module.exports = {
	logRiverPrice,
	logRiverOfficialStaking,
	log2025GalxeStakingAction,
	log2026GalxeMintSatUSDAction,
	logPtsConversionInfo,
	logRiver4Fun,
	log2025ChristmasAction,
	log2026NewYearPricePredictionAction,
	log2026SuiCreationAction
};