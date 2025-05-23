---
layout: "@/templates/BasePost.astro"
title: 2025-4-25 eth行情分析
description: 威科夫交易分析
pubDate: 2025-04-25T07:00:00Z
imgSrc: "https://d1txd7788i3w4j.cloudfront.net/images/84c84428-50f1-7025-b778-548a97e9da87/2025-04-24/1745537225422-eth-15m.jpg"
imgAlt: "Image post 4"
---

# 早间行情分析

2025-04-25 早上行情分析 7:00-7:30

## A. 技术面分析与交易计划制定

### 长周期分析

- 打开周线和日线图，标记关键支撑、阻力、趋势线与量价异常点

  - **15m k 线如下：**
    ![结构分析](https://d1txd7788i3w4j.cloudfront.net/images/84c84428-50f1-7025-b778-548a97e9da87/2025-04-24/1745537225422-eth-15m.jpg)

    - 背景：震荡区间
      - 分析：
        - 昨日价格开始震荡，震荡区间试图突破，下降到低点后，又回到价值区间内，价值区间范围越来越小。这是突破的前兆
        - 昨日价格试图下跌，但是下跌失败，表明空方力量并不强势。向下突破失败后，价格回到之前的区间内部，但是并不是测试的行为（之前没有遇到过这种场景，等待今日行情完成后分析，是重回区间内部继续震荡，还是什么！）
        - 价格一直在上个区域的区域低点附近震荡，但是不能跌破，代表区间下沿的阻力依然有效，价格会继续上涨？这里需要等待验证，由于区间过窄，这种上涨之前是否会有一个假突破？可以在区域上下沿设置接针单，检验这个结论
        - 价格高于 vwap，但不是远高于。代表经过市场的盘整过后。上涨的阻力相对变弱
        - 总结：
          - 多方力量依旧强势（价格在 vwap 之上），上涨趋势后，价格来到一个逐渐变小的震荡区间。同时进行了下跌测试，并没能够验证之前上涨趋势的 poc，下跌趋势就停止了（需要判断这里是否代表多方过于强势）
          - 上方有强力的买方吸收特征，但是价格已经在这个吸收区间下方停止很久。是否代表这个吸收的力量正在逐渐降低（控制不住多方力量了）
          - 寻找价格离开震荡区间的假突破，做反向交易（入场点位选择现有的阻力点）
          - 监控价格真突破（量价异常信号+假突破之后的行为），在价格测试行为跟随入场
    - 重点价格：

      - 1838：上方第一阻力点，买方吸收出现的位置
      - 1801：上个区间高点
      - 1696：下方第二接近高成交量节点 vwap 附近，这里也可能会成为一个价格测试点。价格如果在这里测试成功，多方趋势将会继续延续
        - 这里可以设置市价止盈止损多单
          - 止盈：上个周期震荡区域高点 1800
          - 止损：该价格下方的高成交量节点 1668
          - 退出订单原因：
            - 价格下跌到这里后，没有出现明显的向上反弹，代表空方力量强势。这里的价格验证失败。入场的原因不存在了
      - 1752：上个区间低点，今日价格也在一直这个附近徘徊
      - 1720：昨日低点，下方第二阻力点

    - 策略：
      - 寻找假突破的阻力点反向入场的机会
      - 寻找震荡区间边界入场的机会

- **制定当日交易计划**

  - 背景
    - 分析：上涨大周期，趋势健康度检测中
    - 交易区域
      - 1700：
        - 分析：vwap 附近，价格测试重要区域（之前上涨 poc）
        - 多单：市价止盈止损
          - 入场价格：1700
          - 止盈价格：
            - 1800：上个震荡周期高点
          - 止损价格：1668
            - 跌破 vwap+上涨 poc，空方趋势有效
        - 退出理由：
          - 价格出现单边行情，跌破 vwap+入场价格，代表空方趋势得到了验证
      - 1720：
        - 分析：下方第二阻力点，多方假突破可能到达的价格
        - 多单：市价止盈止损
          - 入场价格：1720
          - 止盈价格：
            - 1800：上方供应区，上个区域高点
          - 止损价格：1670
            - 空方力量过于强势，不是插针，入场理由不存在
          - 退出理由：
            - 价格自然下跌到 1720 附近，并不是插针行为
            - 上方出现假突破就退出，假突破的行为一般不会出现多次
  - 如果形成了新的价格区域。分析结构后重新制定交易计划

  - 风险控制
    - 如果价格移动破坏了本次分析的图形结构。代表本次分析无效。不能根据本次的分析进行交易
  - 交易 checklist

    1. [x] 本交易是否符合行情分析
    2. [x] 是否完成价格测试
    3. [x] 入场操作是否违背了强势 k 线信号
    4. [x] 如果交易被止损。立即重新分析记忆计划错误原因。没分析出来之前不能进行交易
    5. [x] 是否在下午 5-6 点之前(趋势中可相对灵活)
    6. [x] 这个交易计划是否已经被使用过了
    7. [x] eth 能吃到 1.25%以上波动既离场
    8. [x] 阻力点被测试的次数越多，它被突破时的力度越强，可以在这个阻力点背后做反向单。获取一部分利润

  - 区间交易规则：

    - 对于 15m 周期最大的阻力点。如果价格突破这里，可以在阻力点附近入场。止损在第二阻力点附近。这样保证盈亏比。还能不错过入场机会，因为价格突破了结构边缘，又突破了阻力点。这是加强的趋势信号

    ![结构分析](https://d1txd7788i3w4j.cloudfront.net/images/84c84428-50f1-7025-b778-548a97e9da87/2025-03-28/1743167232237-tradingview15m.jpg)

    - 概念：基于上图增加概念方便理解
      - 上方第一阻力点：上方最强阻力点
      - 上方第二阻力点：威科夫结构上沿
      - 价值区域上沿：价值区域高点
      - 价值区域下沿：价值区域低点
      - 下方第二支撑点：威科夫结构下沿
      - 下方第一支撑点：下方最强支撑点
    - 交易方式：总结出新的交易方式，需要进行数据回溯模拟
      - 趋势空单
        - 下方第一阻力点设置限价止盈止损
          - 入场价格：下方第一阻力点价格
          - 止损价格：下方第二阻力点上方结构低点
          - 止盈价格：下方第一阻力点下方移动止盈。
      - 趋势多单
        - 上方第一阻力点设置限价止盈止损
          - 入场价格：上方第一阻力点价格
          - 止损价格：上方第二阻力点下方结构高点
          - 止盈价格：上方第一阻力点上方移动止盈。
      - 震荡区间
        - 震荡转向多单：限价止盈止损
          - 触发条件：下方第二阻力点结构低点下方
          - 入场价格：下方第二阻力点
          - 止盈价格：价值区域上沿
          - 止损价格：下方第一阻力点
        - 震荡转向空单: 限价止盈止损
          - 触发条件：上方第二阻力点上方
          - 入场价格：上方第二阻力点
          - 止盈价格：价值区域下沿
          - 止损价格：上方第一阻力点
      - 趋势健康度判断
        - 3 条 k 线收线以证明趋势的力度

### B. 当日交易执行总结

- **交易计划对比执行情况** - 按照早盘交易计划，对照每笔模拟/实盘交易的实际执行，记录进场、止损和出场是否符合计划

#### 交易记录

- 开仓价格

  - 交易 1
    - 开仓时间：04/25/2025 16:52:12
    - 开仓价格：1,773.80
    - 方向：空
    - 平仓均价：1,787.31
    - 最后平仓时间：04/25/2025 18:01:34
    - 总结：
      - 在两次假突破后，价格在之前假突破启动之前的价值区域高点附近波动，表示经过假突破后，下方已经有一定的阻力，导致价格没有回到区间内部，这时候是跟多的机会，入场跟多
        ![结构分析](https://d1txd7788i3w4j.cloudfront.net/images/84c84428-50f1-7025-b778-548a97e9da87/2025-04-25/1745587526411-eth-15m-n.jpg)

#### 交易分析优化

- 对于假突破的情况，有了一定的了解没问题。同时需要考虑止损点的设置
- 如果价格打破止损点应该如何办
