---
layout: '@/templates/BasePost.astro'
title: js的执行机制
description: js的执行机制
pubDate: 2018-12-11T00:00:00Z
imgSrc: '/assets/images/image-post7.jpeg'
imgAlt: 'Image post 2'
---
# js的执行机制

如下代码

```javascript
setTimeout(function(){
    // 1
    console.log('定时器开始啦')
});
new Promise(function(resolve){
   	// 2
    console.log('马上执行for循环啦');
    for(var i = 0; i < 10000; i++){
        i == 99 && resolve();
    }
}).then(function(){
    // 3
    console.log('执行then函数啦')
});
// 4
console.log('代码执行结束');

```

代码实际打印顺序

2-4-3-1



### js是单线程语言，js版的多线程都是用单线程模拟的



程序的任务分为两个种类：

1. 同步任务
2. 异步任务 

例如图片音乐的加载，耗时长，是异步任务，页面骨架和元素的渲染是同步任务



#### 流程示例

1. 任务进入执行栈
2. 区分同步任务和异步任务
3. 同步任务进入主线程执行，同时异步任务进入event table
4. 同步任务全部执行完毕，异步任务注册回调函数（event queue）
5. 主线程到event queue读取对应的函数，进入主线程执行
6. 上述过程不断重复



## js如何得知主线程执行栈为空

js引擎存在monitoring process进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去event queue检查是否有等待被调用的函数，如果有等待被调用的函数，就会依异步任务注册时的顺序调用

如下代码

```javascript
setTimeout(() => {
    console.log('timer')
},3000)

// sleep方法消耗的时间为10秒
sleep(10000000)
```

此时代码的执行顺序是，sleep函数执行结束后，立即打印timer，因为此事的时间已经远超过3秒



### setInterval的运行机制

setInterval和setTimeout类似，不过setInterval是循环执行。从执行顺序来说，setInterval会每隔指定的时间将注册的函数放入EventQueue，如果前边的任务耗时太久，它同样需要等待。



需要注意的是，对于setInterval(fn,ms)来说，不是每过ms秒执行一次fn，而是，每过ms秒，会有fn进入EventQueue。一旦setInterval的回调函数fn执行时间超过了延迟时间，那么就完全看不出有时间间隔了。



### js的微任务和宏任务

js先执行一轮宏任务（遇到微任务分发到微任务event queue），宏任务执行完成，执行微任务，然后进入下一轮宏任务







