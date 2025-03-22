---
layout: '@/templates/BasePost.astro'
title: 表驱动编程来处理复杂的判断
description: 怎么使用表驱动编程来处理复杂的判断
pubDate: 2020-12-11T00:00:00Z
imgSrc: '/assets/images/image-post3.jpeg'
imgAlt: 'Image post 2'
---
在业务开发中，常遇到复杂的 if-else 判断，使用 if-else 来判断，嵌套过深，会遇到很多问题

1. 判断次数很多，影响页面性能
2. 需要迭代，需求方增加或修改了判断条件时，需要从新对判断条件进行梳理，及有可能改错

如何使用便捷的方法来处理复杂判断呢。现以一个实际需求为例：
![image](https://user-images.githubusercontent.com/28968665/103154696-11128f80-47d4-11eb-8b47-a39bd247a2e4.png)
调用领取接口且判断用户是否登陆后，根据4个判断条件，有4种类型的弹窗需要展示，判断条件如下

```jsx
const resData = {
	// 是否领取了卡券
  sentNewUserReward: false,
	// 是否使用了卡券
  usedNewUserReward: false,
	// 卡券是否过期
  expired: false,
	// 是否新用户
  newer: true,
};
const { sentNewUserReward, newer, usedNewUserReward, expired } = resData;
```

需求到手，先用就用 if-else 来实现吧

```jsx
//判断逻辑
// 已发送 已使用
if (sentNewUserReward && usedNewUserReward) {
  console.log('已经领取弹窗');
} else if (sentNewUserReward && !usedNewUserReward && !expired) {
  console.log('展示成功领取页');
} else if (sentNewUserReward && !usedNewUserReward && expired && newer) {
  console.log('成功领取福利弹窗');
} else if (sentNewUserReward && !usedNewUserReward && expired && !newer) {
  console.log('新用户才可以领取弹窗');
} else if (newer) {
  console.log('成功领取福利弹窗');
} else {
  console.log('新用户才可以领取弹窗');
}
```

看起来还不难实现，那如果下次迭代，需求方再加一个判断条件，是否加入了队伍，加入了队伍需要判断是否使用卡券、未加入队伍要判断是否是新用户。应该怎么修改这些判断呢。

哎，我抓破头都难想出来怎么写，之前有看到过网上的解决方案，使用表编程来替换 if-else 写复杂的判断。我们来看下怎么实现吧

## 表编程

先从简单的范例开始，需求：根据输入的数字 1-7 获取周几

```jsx
getweek(value){
    this.dayOfWeek = value;
    if(this.dayOfWeek == 1){
        this.Week = "星期一";
    }else if(this.dayOfWeek == 2){
        this.Week = "星期二";
    }else if(this.dayOfWeek == 3){
        this.Week = "星期三";
    }else if(this.dayOfWeek == 4){
        this.Week = "星期四";
    }else if(this.dayOfWeek == 5){
        this.Week = "星期五";
    }else if(this.dayOfWeek == 6){
        this.Week = "星期六";
    }else if(this.dayOfWeek == 0){
        this.Week = "星期日";
    }      
}
```

使用 if-else 的代码还是格外的多，毫无美感可言。如果加一个需求，需要输出中英文两种星期的文字呢，直接使用表驱动编程来实现吧

不需要输出双语格式的代码

```jsx
// 使用一个map存起来
let weekdayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
this.Week = weekdayMap[value];
```

输出双语格式

```jsx
let weekdayMap = {
    'zh-cn': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    'en-us': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};
this.Week = weekdayMap[language][value];
```

现在继续看最开始的例子，把 4 个条件翻译成一个 key 值，value 存的是一个具体调用的方法，直接调用这个方法即可：

```jsx
const map = {
  a: () => {
    console.log('成功领取福利弹窗');
  },
  b: () => {
    console.log('新用户才可以领取弹窗');
  },
};
map.a()
```

现在需要思考如何把 4 个条件转换成 key 值，根据流程图，可得出，每个条件对最终弹窗的影响有 3 种情况：正影响(true)、负影响(false)、无影响(any)。有了这三种状态，再把 4 个条件的排序按照下边顺序固定：sentNewUserReward, usedNewUserReward, expired, newer，得出我们的 key

```jsx
const mapArray = [sentNewUserReward, usedNewUserReward, expired, newer];

const map = {
  'false-any-any-true': () => {
    console.log('成功领取福利弹窗');
  },
  'false-any-any-false': () => {
    console.log('新用户才可以领取弹窗');
  },
  'true-true-any-any': () => {
    console.log('已经领取弹窗');
  },
  'true-false-false-any': () => {
    console.log('展示成功领取页');
  },
  'true-false-true-true': () => {
    console.log('成功领取福利弹窗');
  },
  'true-false-true-false': () => {
    console.log('新用户才可以领取弹窗');
  }
};
```

map 的结构完成，现在还需要把 4 个判断条件转换成 map 内 key 的结构：

```jsx
for (let i = 0; i < mapKeys.length; i++) {
  let currentKeyArr = mapKeys[i].split('-').map((item, index) => {
    if (item === 'any') return `${mapArray[i]}`;
    return item;
  });
}
// 输出如下
currentKeyArr==>> [ 'false', 'false', 'false', 'true' ]
currentKeyArr==>> [ 'false', 'false', 'false', 'false' ]
currentKeyArr==>> [ 'true', 'true', 'false', 'false' ]
currentKeyArr==>> [ 'true', 'false', 'false', 'true' ]
currentKeyArr==>> [ 'true', 'false', 'true', 'true' ]
currentKeyArr==>> [ 'true', 'false', 'true', 'false' ]
```

key 转换完成，优化下代码

```jsx
function getMapKey(map, mapArray) {
  const mapKeys = Object.keys(map);
  // 遍历map的keyArr，与MapArray内的值进行对比，如果都相同，停止循环，赋值给执行的函数
  for (let i = 0; i < mapKeys.length; i++) {
    let currentKeyArr = mapKeys[i].split('-').map((item, index) => {
      if (item === 'any') return `${mapArray[i]}`;
      return item;
    });
    const currentArrayStr = currentKeyArr.join('-');
    const mapArrayStr = mapArray.join('-');
    if (currentArrayStr === mapArrayStr) {
      return mapKeys[i];
    }
  }
}

map[getMapKey(map, mapArray)]();
```

ok，现在判断条件与每种条件需要执行的方法实现了分离，大部分修改判断条件的需求变更，只需要在 map 做一个更改即可实现。