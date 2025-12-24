const fs = require('fs').promises;
const path = require('path');

// 读取river相关配置
async function read() {
  try {
    // 拼接绝对路径：__dirname 表示当前文件所在的目录
    const filePath = path.join(__dirname, 'river_env.json');
    
    // 读取文件内容（得到的是字符串）
    const data = await fs.readFile(filePath, 'utf8');
    
    // 将字符串解析为 JSON 对象
    const json = JSON.parse(data);
    return json;
  } catch (err) {
    console.error('读取文件失败:', err);
  }
}

module.exports = { read };