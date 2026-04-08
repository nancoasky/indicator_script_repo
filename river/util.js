const fs = require('fs').promises;
const path = require('path');

/**
 * 判断是否为数值
 * @param {*} value 值
 * @returns true-是数值 false-非数值
 */
function isNumeric(value) {
	if (typeof value === "number") return !isNaN(value);
	if (typeof value === "string" && value.trim() !== "") {
		return !isNaN(value) && !isNaN(parseFloat(value));
	}
	return false;
}


/**
 * 获取当前日期，格式为yyyy-MM-dd
 * @returns 当前日期
 */
function getCurrentDate() {
	return new Date().toLocaleDateString('zh-CN', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).replace(/\//g, '-');
}

/**
 * 获取当前日期的index天，格式为yyyy-MM-dd
 * @param index 指定下标 -1表示前一天 +1表示后一天
 * @returns 当前日期 yyyy-MM-dd
 */
function getCertainDate(index) {
  let currentDate = new Date();
  // setDate只接受一个参数（天数），index作为偏移量
  currentDate.setDate(currentDate.getDate() + index);
  
  return currentDate.toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');
}

/**
 * 转换ISO字符串为中国时区的日期
 * @param {} isoString 2025-12-26T16:00:00.000Z
 * @returns yyyy-MM-dd
 */
function convertUTCAsChinaDate(isoString) {
	// 格式化 ISO 字符串为中国时区的日期
	const chinaDate = new Date(isoString).toLocaleDateString('zh-CN', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).replace(/\//g, '-'); // 结果为 "2025-12-27"

	return chinaDate;
}

/**
 * 获取当前的中国时间
 * @returns yyyy-MM-dd HH:mm:ss
 */
function getCurrentChinaDateTime() {
	const now = new Date();

	// 配置格式化选项
	const options = {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false // 强制使用 24 小时制
	};

	// 使用 Intl 格式化并手动拼接，以确保格式严格为 yyyy-MM-dd HH:mm:ss
	const formatter = new Intl.DateTimeFormat('zh-CN', options);
	const parts = formatter.formatToParts(now);
	const map = new Map(parts.map(p => [p.type, p.value]));

	return `${map.get('year')}-${map.get('month')}-${map.get('day')} ${map.get('hour')}:${map.get('minute')}:${map.get('second')}`;
}

/**
 * 转换ISO字符串为中国时区的日期
 * @param {*} utcDate 2025-12-26T16:00:00.000Z
 * @returns yyyy-MM-dd HH:mm:ss
 */
function convertUTCAsChinaDatetime(utcDate) {
	// 创建格式化对象，指定时区为 Asia/Shanghai
	const formatter = new Intl.DateTimeFormat('zh-CN', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false // 使用 24 小时制
	});

	// 格式化并处理分隔符（将斜杠替换为连字符）
	const parts = formatter.formatToParts(new Date(utcDate));
	const map = new Map(parts.map(p => [p.type, p.value]));

	const formattedDate = `${map.get('year')}-${map.get('month')}-${map.get('day')} ${map.get('hour')}:${map.get('minute')}:${map.get('second')}`;

	// 输出: 2025-12-27 00:00:00
	return formattedDate;
}



/**
 * 读取对应配置
 * @param {*} fileRelativePath  相对路径
 * @returns json对象
 */
async function readFileAsJson(fileRelativePath) {
	try {
		// 拼接绝对路径：__dirname 表示当前文件所在的目录
		const filePath = path.join(__dirname, fileRelativePath);

		// 读取文件内容（得到的是字符串）
		const data = await fs.readFile(filePath, 'utf8');

		// 将字符串解析为 JSON 对象
		const json = JSON.parse(data);
		return json;
	} catch (err) {
		console.error('读取文件失败:', err);
	}
}

/**
 * 格式化金额数字
 * @param {*} number 数值 
 * @returns 格式化后的数字
 */
function formatDecimal(number, minimumFractionDigits, maximumFractionDigits) {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',         // 纯数字模式，不带货币符号
		minimumFractionDigits: minimumFractionDigits == 0 ? minimumFractionDigits : 2, // 最小保留2位小数
		maximumFractionDigits: maximumFractionDigits == 0 ? maximumFractionDigits : 2, // 最大保留2位小数
	});

	return formatter.format(number); // 输出: "1,234,567.89"
}

/**
 * 返回增长值
 * @param {*} oldValue 旧值
 * @param {*} newValue 新值
 * @returns -1/+1
 */
function formatCompareIndication(oldValue, newValue) {
	const diff = newValue - oldValue;

	let format = new Intl.NumberFormat('en-US', {
		signDisplay: 'always',    // 强制显示正负号
		maximumFractionDigits: 10 // 设置保留的小数位数
	}).format(diff);

	if (format.charAt(0) === '+') {
		format = '📈' + format;
	} else {
		format = '📉' + format;
	}

	// 使用 Intl 格式化数字
	return '(' + format + ')';
}

/**
 * 将带有 K/M/B 单位的字符串转为数字
 * @param {string} str 包含单位的字符串 (如 "1.2K", "5M", "1.1B")
 * @returns {number} 转换后的真实数字
 */
function parseAbbreviatedNumber(str) {
	if (typeof str !== 'string') return 0;

	// 1. 去掉空格并将字符串转为大写
	const cleanStr = str.trim().toUpperCase();

	// 2. 定义单位对应的乘数 (K: 千, M: 百万, B: 十亿)
	const multipliers = {
		'K': 1000,
		'M': 1000000,
		'B': 1000000000
	};

	// 3. 使用正则提取数字部分和单位部分
	// ([0-9.]+): 匹配数字或小数点
	// ([KMB]?): 匹配 K, M, 或 B (可选)
	const match = cleanStr.match(/^([0-9.]+)\s*([KMB]?)$/);

	if (!match) return parseFloat(cleanStr) || 0;

	const value = parseFloat(match[1]); // 提取数字，如 1.2
	const unit = match[2];              // 提取单位，如 K

	// 4. 计算最终结果
	return unit ? value * multipliers[unit] : value;
}

module.exports = {
	isNumeric,
	getCurrentDate,
	getCertainDate,
	getCurrentChinaDateTime,
	convertUTCAsChinaDate,
	convertUTCAsChinaDatetime,
	readFileAsJson,
	formatDecimal,
	formatCompareIndication,
	parseAbbreviatedNumber
};