const fs = require('fs');
const XLSX = require('xlsx');

/**
 * 数组集合转excel文件
 * @param {*} formattedData 数组对象
 * @param {*} excelFilePath excel输出的相对路径
 */
function rows2Xlsx(formattedData, excelFilePath) {
	// 1. 创建工作簿和工作表
	const workbook = XLSX.utils.book_new();
	const worksheet = XLSX.utils.json_to_sheet(formattedData);

	// 2. 将工作表添加到工作簿，并写入Excel文件
	XLSX.utils.book_append_sheet(workbook, worksheet, '转换数据'); // 工作表名称
	XLSX.writeFile(workbook, excelFilePath);

	// console.log(`✅ JSON转换Excel成功！文件保存至：${excelFilePath}`);
	// console.log(`📊 转换数据总行数：${formattedData.length}`);
}


/**
 * json转xlsx文件
 * @param {*} jsonFilePath json文件相对路径
 * @param {*} excelFilePath excel输出的相对路径
 */
function json2Xlsx(jsonFilePath, excelFilePath, formatJsonData) {
	try {
		// 2. 读取并解析JSON文件
		const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
		const jsonData = JSON.parse(jsonContent);

		// 3. 提取核心数据（data数组）并处理
		const dataRows = jsonData.data;

		// 可选：格式化时间戳，让Excel中更易读
		let formattedData = dataRows;
		if (typeof formatJsonData === 'function') {
			formattedData = formatJsonData(dataRows);
		}
		
		rows2Xlsx(formattedData, excelFilePath);

	} catch (error) {
		console.error('❌ 转换失败：', error.message);
	}
}

module.exports = {
	json2Xlsx,
	rows2Xlsx
};


// json2Xlsx('../river/riverpts_conversion_data_from_official.json', './conversion_data.xlsx',(dataRows) =>{
// 	return dataRows.map(item => {
// 			return {
// 				// 将 ISO 时间戳转为 YYYY-MM-DD HH:MM:SS 格式
// 				timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString('zh-CN', {
// 					year: 'numeric',
// 					month: '2-digit',
// 					day: '2-digit',
// 					hour: '2-digit',
// 					minute: '2-digit',
// 					second: '2-digit'
// 				}).replace(/\//g, '-') : '',
// 				ptsAmount: item.ptsAmount,
// 				tokensAmount: item.tokensAmount,
// 				penaltyAmount: item.penaltyAmount,
// 				actualRate: item.actualRate ?? '', // 处理null值
// 				expectedRate: item.expectedRate ?? ''
// 			};
// 		});
// });