## 环境要求
- node v20+

## 安装依赖
> npm install --registry=https://registry.npmmirror.com

## 输出结果
> node retrieveRiverIndicators.js

```xml
-------今日 2025-12-26 River价格播报🎺-------
✅ River链上价格（USD）💰 ：$3.92
✅ RiverPts链上价格（USD）💰 ：$0.00127916

-------今日 2025-12-26 River官方质押情况🎺-------
✅ River最高APR ：36.86%
✅ River质押总数 ：137962.59(📈+7,546.21)

-------今日 2025-12-26 银河River质押收益分析📃-------
✅ River质押奖池🪣 ：$10000
✅ 奖励发放品种🪙 ：$RIVER
✅ 有效期：2025/12/09 00:00 - 2025/12/29 23:00 GMT+08:00
✅ River质押参数人数🧑‍🤝‍🧑 ：313(📈+33)
✅ 质押成本（USD）👝 ：39.2
✅ 猪脚饭收益（USD） 🍚 ：31.95
✅ 猪脚饭评分：😴

-------今日 2025-12-26 4fun嘴撸分析📃-------
✅ 嘴撸人数 💬：108791(📈+38)

-------今日 2025-12-26 River圣诞抽奖分析🎄-------
✅ 有效期：2025/12/23 - 2025/12/25
✅ 帖子回复数 ：826
✅ 价值$50等值River中奖概率 ：2.42%
✅ 连帽衫中奖概率 ：0.61%
```

### 配置文件说明
| 序号 | 配置文件名          | 说明           |
| ---- | ------------------- | -------------- |
| 1    | to_be_compared.json | 昨日的指标数据 |
| 2    | river_env.json      | river相关配置  |
|      |                     |                |

#### 配置详细说明
1. to_be_compared.json
```json
{
	"totalOfficialStakedAmount" : 130416.38, // 官方river质押总数
	"total2025GalxeStakingCount" : 280, // 2025年的Galxe质押活动参与人数
	"river4funItems" : 108753 // river4fun的参与登记人数
}
```

2. river_env.json
```json
{
	"aprFactor" : 2 ,// APR系数，目前官方提供双倍质押福利
	"enableReport2025Christmas" : true ,// 是否启用2025年圣诞活动分析输出
	"enableReport2025GalxeStakingAction" : true // 是否启用2025年银河质押活动分析输出
}
```

## 台账
记录台账方便后续进行多维度的分析，台账[链接](https://docs.google.com/spreadsheets/d/1lQ6i7Qm19QGsQj-Z7Kz4bbIcmqdklSFdfdKRF5lpxjA/edit?gid=0#gid=0) 