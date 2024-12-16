---
layout: '@/templates/BasePost.astro'
title: js中的call apply bind
description: js中的call apply bind
pubDate: 2019-12-11T00:00:00Z
imgSrc: '/assets/images/image-post5.jpeg'
imgAlt: 'Image post 2'
---
一直很难理解js中的call apply bind，在w3schools,mdn阅读了，也看了很多相关的文章，今天我来写下我理解的call apply bind
首先创建一个函数
```
function man(){}

man.prototype = {
    name: "Jack",
    love: "Rose",
    say: function(){
        console.log(this.name +" love " + this.love)
    }
}

var James = new man
James.say()     //Jack love Rose
```
现在有一个新的对象Mike，但Mike里没有say的方法，但是又要使用say方法应该怎么办呢,那就可以用call和apply来调用James的say方法
```
var Mike = {
    name: "唐老鸭",
    love: "小朋友"
}

James.say.call(Mike)
James.say.apply(Mike)
```
此处可以看出，call于apply的用法几乎相同，只有一个区别，就是call()方法接受的是若干个参数的列表，而apply()方法接受的是一个包含多个参数的数组。

> 下面的示例，展示了call所传参数的形式

### 通过call来实现继承
创建一个构造函数product
```
function product(name, price){
    this.name = name
    this.price = price
}
```
再创建一个构造函数food，引用product
```
function food(name, price){
    product.call(this, name, price)
    this.category = "food"
}

var rice = new food("东北大米", "50")
rice    //food {name: "东北大米", price: "50", category: "food"}
```
使用food构造函数创建的对象实例拥有在country构造函数添加的属性name和price，但category属性是在food构造函数中定义的。

这里也可以看出，call接受的参数第一位是需要传递的this对象，在非严格模式下，如果不需要对this进行改变，可把第一个值设为null，会自动指定到全局对象。后面的值是函数传递进来的参数

### 使用call调用匿名函数
创建以下函数
```
var animals = [
    {species: "Lion", name: "King"},
    {species: "Whale", name: "Fail"}
]

for (var i = 0; i < animals.length; i++) {
  (function(i) {
    this.print = function() {
      console.log('#' + i + ' ' + this.species + ': ' + this.name)
    }
    this.print()
  }).call(animals[i], i)
}
```
此函数通过call调用了匿名函数

> apply

apply() 方法调用一个函数, 其具有一个指定的this值，以及作为一个数组（或类似数组的对象）提供的参数。

例1，数组之间的追加
```
var arr1 = ["hello", "world"]
var arr2 = ["animals", "friends"]
Array.prototype.push.apply(arr1, arr2)
```
例2，获取数组最大最小值
```
var num = [50, 10, 255, 800]
var maxNum = Math.max.apply(Math, num)
var minNum = Math.min.apply(Math, num)
var maxNum1 = Math.max.call(Math, 50, 10, 255, 800)
console.log(maxNum)  //800
console.log(minNum)  //10
```
num需要取出最大最小值，使用apply调用Math的方法即可
例3，类数组，伪数组使用数组方法
```
Array.prototype.slice.apply(document.querySelectorAll("div"))   //打印出所有div
Array.prototype.slice.apply(document.querySelectorAll("div"), [1, 3])
//打印下标1开始3之前结束的div
```
### bind
MDN对bind的描述： 

bind() 函数会创建一个新函数（称为绑定函数），新函数与被调函数（绑定函数的目标函数）具有相同的函数体（在 ECMAScript 5 规范中内置的call属性）。当新函数被调用时 this 值绑定到 bind() 的第一个参数，该参数不能被重写。绑定函数被调用时，bind() 也接受预设的参数提供给原函数。一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

例子：
创建一个函数，使用这个函数不论怎么调用都只有一个this的值
```
this.x = 100
var dog = {
    x: 10,
    getX: function() {
        console.log(this.x)
    }
}

dog.getX()  //10

var hello = dog.getX
hello()  //100 这里因为this指向全局作用域
```
这里怎么才能调用dog的getX方法呢？
bind可以帮到你
```
var bindHello = hello.bind(dog)  
bindHello()  //10
```
从hello函数创建一个绑定函数，把this的值绑定到新的函数上，然后就可以愉快的调用了

#### 总结一下： 
call、apply和bind都是改变函数this对象的指向的，bind返回新的函数，而call和apply会立即执行函数
