---
layout: "@/templates/BasePost.astro"
title: 威科夫2.0系统理解
description: 威科夫2.0：市场结构、成交量分布与订单流
pubDate: 2025-03-05T21:08:00Z
imgSrc: "https://nuo-english.s3.us-east-2.amazonaws.com/trading/250305-wyckoff/wyckoff.jpg"
imgAlt: "Image post 4"
---

# 威科夫 2.0：市场结构、成交量分布与订单流

## 基本市场原理

市场是由于买卖双方构成的。有买卖双方价格才会移动。所以并不会出现一个时间点，买方比买方多，或者卖方比买方多。

### 订单类型

虽然市场上最终成交的订单表现为，限价买卖+市场价买卖进行撮合形成交易，但实际上市场上存在不同的订单，例如：

- 多方止盈卖出配对上空方止损买入
- 虽然表现为有力与价格上涨的信号
- 实际这背后的动机确是，多空双方了结离开市场

所以单纯的分析量价关系并不能很好的抓住市场的真实情况。

## 威科夫市场周期

根据市场拍卖原理，市场总是在震荡或趋势之间来回切换。

### 趋势阶段

书中把市场趋势分为几个步骤：

1. **积累** - 大资金的吸筹
2. **趋势开始** - 更多人察觉趋势的方向开始入场跟随趋势
3. **派发** - 趋势逐渐结束，开始进行派发
4. **逐渐降低** - 派发阶段完成，价格逐渐下跌

真正引领市场的人就是这些大资金。我们通过威科夫的研究就是为了在市场行情的波动中，找到这些人潜藏的动作，从而成为跟随趋势的人。

### 威科夫周期

威科夫的几个周期：

- 趋势
- 趋势停止
- 震荡开始
- 评估
- 趋势展开
- 方向确认

熟练地根据市场行情分析当前处在威科夫架构下什么周期，能够更好地了结行情。想要判断市场行情，需要结合多个维度的指标。

## 成交量分布分析

通过不同时间成交量分布的分析，可以找到交易者更感兴趣的价值区域。例如上一次趋势的完整成交量分布中，找到它的 POC（Point of Control）。趋势结束后，价格很可能在这个 POC 进行测试。

### 重要价格区域

- **POC（最高成交量点）** - 价值区域的核心
- **价值区域的高点低点** - 震荡行情围绕它们作为边界进行运动
- **高成交量节点** - 代表价格曾经在这个附近形成过共识，价格将会更容易来到这里
- **价值区域边缘** - 如果边缘属于未成交的交易，它就属于异常信号，价格可能会重新回到这里

### 实用分析方法

- 一般会绘制前一个交易日与当前交易日的成交量分布图
- 判断当前价格处在前一日行情的什么范围，具有很重要的参考意义
- 如果价格远离了价值区域，这时是趋势阶段
- 判断趋势的延续可以看 POC 是否逐渐跟着趋势方向移动
- 如果价格在上涨趋势方向上最后一个高成交量节点价格上边，就可以继续看涨
- 如果跌破最后一个高成交量节点，可以理解为上涨趋势的结束

## 订单流分析

结合订单流工具，我们可以看到每根 K 线内部的信息，结合成交量分布以及威科夫结构，可以更好地判断市场下一步的形态。

### POC 位置判断

- K 线的价值区域高点
- 如果 POC 在 K 线下方，看涨
- 在上方，看跌

### Delta 分析

- 单条 K 线内如果 delta 为正，表示多方更强；负则是空方更强
- 当我们基于威科夫结构与价值区域找到关键价位后，就可以在这些关键价位附近寻找异常 delta
- 异常信号示例：关键价格区域附近出现一根上涨的 K 线，delta 却是负数
- 需要结合其他指标判断，比如成交量异常高，它的价值更大

### 失衡分析

- **失衡** - 在某个价位，买方远超过卖方，或者卖方数量远超过买方
- **失衡堆积** - 如果出现连续的失衡，就是失衡堆积，这是一个很强力的信号

### 吸收现象

大资金并不会在订单薄上进行挂单，因为这会暴露它们的意图。它们往往都是以市价单的方式进行交易。

**吸收**就是大资金做墙的概念，分为买方吸收与卖方吸收：

- 当某条 K 线上出现了买方吸收，价格却涨不上去，这就是一个潜在的买方失衡
- 它代表着市场情绪看多，有很多市价买单正在推动价格的上涨运动
- 但在某一区域，无论主动买单有多少，都有卖单与之匹配
- 这表现为一个强力的失衡，或者连续失衡
- 这时大资金的意图就暴露了，他们不希望价格再往上运动
- **还有一种隐藏吸收，比如价格持续上涨，但是delta一直是负的，这表明可能有大资金通过冰山单缓慢吸收卖单。隐藏痕迹**

**在哪里找吸收是有意义的**：

- 关键价格区域（威科夫结构中重要的价位附近）
- 高成交量节点
- Delta 异常的节点

### 主动行为

- 大量的主动买入或者主动卖出，是以市价单推动价格运动的行为
- 如果出现一个较长的上涨 K 线，它就是主动行为

### 行情反转信号

- 如果出现了买方吸收，接着伴随着卖方主动行为，这是强烈的行情反转信号
- 在威科夫结构震荡区间的边缘，我们可以关注是否出现吸收+主动行为
- 这是强烈的翻转信号

## 趋势控制与测试

### 控制

- 一根很长的上涨 K 线，且它的下方有买方失衡
- 买方失衡在 K 线越下方越好，K 线越长越好
- 代表了控制行为影响力越强
- 买方失衡代表着有很多积极的买家出现在这里

### 控制测试

如果测试成功，代表趋势将会继续延续：

- 一个大幅上涨趋势后（一根长阳线，或者多根上涨趋势），价格可能会向下回落
- 应该观察回落的 K 线成交量是否大，如果不大，代表市场对这个价格没有太大的兴趣，这利于控制行为的有效性
- 由于上涨控制行为会有很多积极的买方出现，如果价格下跌到这些积极买方入场的位置，他们会主动出击捍卫自己的多头
- 这会造成，当价格跌回测试这些价格时，会出现强烈的反弹，这是对控制行为的一次成功测试

如果控制测试失败，那就需要评估是否趋势结束进入新的区间了。

## 交易计划框架

### 背景分析

1. 查看多个周期的 K 线，判断市场背景
2. 判断是震荡还是趋势周期
3. 15 分钟、1 小时、4 小时图表都需要查看
4. 分析中绘制多个成交量分布图
5. 找到交易高成交量节点，它们会是大资金更感兴趣的区域
6. 判断当前行情处在什么背景，趋势还是震荡
7. 绘制威科夫结构/使用价值区域结构

### 入场策略

**震荡行情**：

- 做区间反转交易
- 需要找到关键的反转节点
- 在附近找到吸收与主动行为
- 等待价格完成测试，确认反转方向后可以入场
- 由于可能会突破价值区域产生趋势，所以不能价格到了区间边界就入场
- 需要等市场进行测试才可以入场

**趋势行情**：

- 找到控制 K 线
- 等待控制测试成功后跟随趋势入场
- 如果测试失败，需要重新等待新的结构形成

### 风险管理

**止损设置**：

- 止损点选择有吸收的位置附近，有大资金保护
- 如果在跟随多方趋势，止损选在控制测试成功价格的下方（因为这个价格被验证过）

**止盈策略**：

- 基于市场背景，找到当前价格附近的高交量节点
- 将这些节点作为止盈点
