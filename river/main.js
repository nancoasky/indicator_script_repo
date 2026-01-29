const riverApi = require('./riverApi.js')
const util = require('./util.js')
const logUtil = require('./log.js')

/**
 * 检索对应的river指标信息
 */
async function retrieveRiverIndicators() {
	// 获取公用配置
	let riverConfig = await util.readFileAsJson('river_env.json');
	// 获取昨日数据配置
	let oldData = await util.readFileAsJson('to_be_compared.json');
	// 获取river质押APR
	let nowOfficialStakingMaxinumAPR = await riverApi.retrieveMaxinumAPR();
	// 获取river质押相关信息
	let riverStakingJson = await riverApi.retrieveRiverStakingAPRAndAmount(riverConfig.riverStakingApiURL);

	// 获取river/riverpts的现货价格
	let currentDate = util.getCurrentDate();
	let riverPriceData = await riverApi.retrieveTokenPriceByCoinGecko(riverConfig.riverContractAddress, 'usd,bnb');
	let riverPriceInUsd = riverPriceData['usd'];
	let riverPtsPriceData = await riverApi.retrieveTokenPriceByCoinGecko(riverConfig.riverPtsContractAddress, 'usd,bnb');
	let riverPtsPriceInUsd = riverPtsPriceData['usd'];

	// 打印相关信息
	if (riverConfig.enableReportRiverPrice) {
		logUtil.logRiverPrice(currentDate, oldData.oldriverPriceInUsd, oldData.oldriverPtsPriceInUsd, riverPriceInUsd, riverPtsPriceInUsd);
	}

	if (riverConfig.enableReport2026SuiCreationAction) {
		logUtil.log2026SuiCreationAction(currentDate, riverPtsPriceInUsd);
	}

	if (riverConfig.enableReport2026PredictPriceCampaign) {
		let predictionTop20RecordJson = await riverApi.retrieveRiver2026PredictPriceCampaign();
		logUtil.log2026NewYearPricePredictionAction(util.getCurrentChinaDateTime(), predictionTop20RecordJson);
	}

	if (riverConfig.enableReportRiverOfficialStaking) {
		logUtil.logRiverOfficialStaking(currentDate, nowOfficialStakingMaxinumAPR, oldData.totalOfficialStakedAmount, riverStakingJson);
	}

	if (riverConfig.enableReport2025GalxeStakingAction) {
		// river银河任务网址
		const url = 'https://app.galxe.com/quest/River/GCr1ktYnFp?utm_source=Twitter&utm_medium=Social&utm_campaign=RiverQuest';
		const targetSelector = 'div.text-info-lighten1.text-size-14';
		// 获取目前galxe上参与的人数
		let nowTotal2025GalxeStakingCount = await riverApi.fetchAndParseContent(url, targetSelector);
		logUtil.log2025GalxeStakingAction(currentDate, util.parseAbbreviatedNumber(oldData.oldtotal2025GalxeStakingCount), nowTotal2025GalxeStakingCount, riverPriceInUsd);
	}

	if (riverConfig.enableReport2026GalxeMintSatUSDAction) {
		// river银河任务网址
		const url = 'https://app.galxe.com/quest/River/GCcqStYdaW';
		const targetSelector = 'div.text-info-lighten1.text-size-14';
		// 获取目前galxe上参与的人数
		let nowTotal2026GalxeMintSatUSDCount = await riverApi.fetchAndParseContent(url, targetSelector);
		logUtil.log2026GalxeMintSatUSDAction(currentDate, oldData.oldtotal2026GalxeMintSatUSDCount, util.parseAbbreviatedNumber(nowTotal2026GalxeMintSatUSDCount), riverPtsPriceInUsd);
	}

	// 获取指定的RiverPts转换信息
	if (riverConfig.enableReportRiverPtsConversionInfo) {
		let conversionInfo = await riverApi.retrieveTodayPtsConversionInfo();
		if (conversionInfo) {
			logUtil.logPtsConversionInfo(currentDate, conversionInfo, oldData.ptsActualRate, oldData.oldtotalRiverConvertedAmount);
		}
	}
	// 获取指定4FUN参与人数
	if (riverConfig.enableReportRiver4funItems) {
		let river4funItems = await riverApi.retrieve4FUNItemCount();
		if (river4funItems) {
			logUtil.logRiver4Fun(currentDate, oldData.river4funItems, river4funItems);
		}
	}

	if (riverConfig.enableReport2025Christmas) {
		// 获取指定推文的回复数
		const tweetUrl = 'https://x.com/RiverdotInc/status/2003148910450352632';
		let rpyCount = await riverApi.retrieveTwitterReplyCount(tweetUrl);
		if (util.isNumeric(rpyCount)) {
			logUtil.log2025ChristmasAction(currentDate, rpyCount);
		}
	}
}

// 启动
retrieveRiverIndicators();

