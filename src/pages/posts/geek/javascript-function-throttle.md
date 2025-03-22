---
layout: '@/templates/BasePost.astro'
title: javascript函数节流
description: javascript函数节流
pubDate: 2020-12-11T00:00:00Z
imgSrc: '/assets/images/image-post4.jpeg'
imgAlt: 'Image post 2'
---
# 定时器

> JavaScript提供定时执行代码的功能，叫做定时器（timer），主要由setTimeout()和setInterval()这两个函数来完成。

### setTimeout()
setTimeout函数用来指定某个函数或某段代码，在多少毫秒之后执行。它返回一个整数，表示定时器的编号，以后可以用来取消这个定时器。
```
var timerId = setTimeout(func|code, delay)
```
上面代码中，setTimeout函数接受两个参数，第一个参数func|code是将要推迟执行的函数名或者一段代码，第二个参数delay是推迟执行的毫秒数。
```
console.log(1);
setTimeout('console.log(2)',1000);    //不常用
console.log(3);
```
上面代码的输出结果就是1，3，2，因为setTimeout指定第二行语句推迟1000毫秒再执行。

需要注意的是，推迟执行的代码必须以字符串的形式，放入setTimeout，因为引擎内部使用eval函数，将字符串转为代码。如果推迟执行的是函数，则可以直接将函数名，放入setTimeout。一方面eval函数有安全顾虑，另一方面为了便于JavaScript引擎优化代码，setTimeout方法一般总是采用函数名的形式，就像下面这样。
```
function f(){
  console.log(2);
}

setTimeout(f,1000);

// 或者

setTimeout(function (){console.log(2)},1000);


var timer = setTimeout(function(){
	console.log('hello world')	
},10000)
console.log(timer)    //1  定时器的编号，用于操作定时器
//'hello world'  10秒后出现字符串helloworld
clearTimeout(timer)    //结束定时器
clearTimeout(1)    //同上
```
### setInterval()
setInterval函数的用法与setTimeout完全一致，区别仅仅在于setInterval指定某个任务每隔一段时间就执行一次，也就是无限次的定时执行。
```
  var i = 1
  var timer = setInterval(function() {
    console.log(i++);
  }, 1000);    //每秒打印一次i
  clearInterval(timer)    //清除timer
  
  var i = 1
  var timer = setInterval(function() {
    console.log(new Date);
  }, 1000);    //Sun Sep 10 2017 07:03:25 GMT+0800 (CST)  每秒出现时间
  clearInterval(timer)    //清除timer
  
```
# 单线程模型
### 含义
单线程模型指的是，JavaScript只在一个线程上运行。也就是说，JavaScript同时只能执行一个任务，其他任务都必须在后面排队等待。

注意，JavaScript只在一个线程上运行，不代表JavaScript引擎只有一个线程。事实上，JavaScript引擎有多个线程，单个脚本只能在一个线程上运行，其他线程都是在后台配合。

JavaScript之所以采用单线程，而不是多线程，跟历史有关系。JavaScript从诞生起就是单线程，原因是不想让浏览器变得太复杂，因为多线程需要共享资源、且有可能修改彼此的运行结果，对于一种网页脚本语言来说，这就太复杂了。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？所以，为了避免复杂性，从一诞生，JavaScript就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

单线程模型带来了一些问题，主要是新的任务被加在队列的尾部，只有前面的所有任务运行结束，才会轮到它执行。如果有一个任务特别耗时，后面的任务都会停在那里等待，造成浏览器失去响应，又称“假死”。为了避免“假死”，当某个操作在一定时间后仍无法结束，浏览器就会跳出提示框，询问用户是否要强行停止脚本运行。

如果排队是因为计算量大，CPU忙不过来，倒也算了，但是很多时候CPU是闲着的，因为IO设备（输入输出设备）很慢（比如Ajax操作从网络读取数据），不得不等着结果出来，再往下执行。JavaScript语言的设计者意识到，这时CPU完全可以不管IO设备，挂起处于等待中的任务，先运行排在后面的任务。等到IO设备返回了结果，再回过头，把挂起的任务继续执行下去。这种机制就是JavaScript内部采用的Event Loop机制。  
[单线程模式详细介绍](http://javascript.ruanyifeng.com/advanced/single-thread.html)
### 运行机制
setTimeout和setInterval的运行机制是，将指定的代码移出本次执行，等到下一轮Event Loop时，再检查是否到了指定时间。如果到了，就执行对应的代码；如果不到，就等到再下一轮Event Loop时重新判断。这意味着，setTimeout指定的代码，必须等到本次执行的所有代码都执行完，才会执行。

setTimeout的作用是将代码推迟到指定时间执行，如果指定时间为0，即setTimeout(f,0)，那么不会立刻执行

setTimeout(f,0)将第二个参数设为0，作用是让f在现有的任务（脚本的同步任务和“任务队列”中已有的事件）一结束就立刻执行。也就是说，setTimeout(f,0)的作用是，_尽可能早_ 地执行指定的任务。
```
setTimeout(function(){
    console.log(1)
},0)
console.log(2)
/*
2
1
*/

for(var i=0; i<10; i++){
  setTimeout(function(){
      console.log(i)
  }, 1000)
}    //10 10 运行10次10   先执行for循环内部，再执行setTimeout


var t = true;  
setTimeout(function(){ 
  t = false; 
}, 1000);  

while(t){ }  
console.log('end')    //代码永远不会执行，一致卡在while(t){}
```
异步与回调
```
function f1(){
    setTimeout(function(){
        //做某件事，可能很久
        console.log('别急，开始执行f1')
        for(var i=0;i< 100000;i++){

        }
        console.log('f1执行完了')

        
    }, 0);

}
function f2(){
    console.log('执行f2');
}
function f3(){
    console.log('执行f3');
}
f1()
f2()
f3()
/*
执行f2
执行f3
别急，开始执行f1
f1执行完了
*/
```
若要函数按顺序执行，使用回调函数方式
```
function f1(j){
    setTimeout(function(){
        //做某件事，可能很久
        console.log('别急，开始执行f1')
        for(var i=0;i< 100000;i++){

        }
        console.log('f1执行完了')

        j()
		
    }, 0);

}
function f2(){
    console.log('执行f2');
}
function f3(){
    console.log('执行f3');
}
f1(f2) //当f1执行完之后再执行 f2
/*
别急，开始执行f1
f1执行完了
执行f2
*/
```
```
function f1(callback){
	setTimeout(function(){
		console.log('开始执行f1')
		for(var i=0;i< 10000;i++){

		}
		console.log('f1执行完成')
		callback(i)
},0)

}

f1(function(value){
	console.log(value)
})
/*
开始执行f1
f1执行完成
10000
*/
```
### 函数节流

```
    var timer    //此处timer = undifined
  function hiFrequency(){
      if(timer){
          clearTimeout(timer)
      }
        timer = setTimeout(function(){
             console.log('do something')
        }, 1000)
  }

  hiFrequency()    //运行一次函数，则timer为true
  hiFrequency()    //timer为true，则运行clearTimeout，之后打印do something
  hiFrequency()
```
改造
```
function throttle(fn, delay) {
    var timer = null
    return function(){
        clearTimeout(timer)
        timer = setTimeout(function(){ 
            fn(arguments)
        }, delay)
    }
}

function fn(){
    console.log('hello ')
}

var fn2 = throttle(fn, 1000)
fn2()
fn2()
fn2()    //hello 
```
