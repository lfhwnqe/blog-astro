---
layout: '@/templates/BasePost.astro'
title: let和const
description: 彻底理解let和const
pubDate: 2019-12-11T00:00:00Z
imgSrc: '/assets/images/image-post4.jpeg'
imgAlt: 'Image post 2'
---
# let和const
## let命令
let用法类似var，但是所声明的变凉，只在let命令所在的代码块内有效
```
{
	let arr = 3
	var arr0 = 9
}
console.log(arr)    //ReferenceError: arr is not defined
console.log(arr0)    //9
```
for循环的计数器，很适合let命令
```
for(let i=0; i<10; i++){
	console.log(i)
}
console.log(i)   //ReferenceError: i is not defined
```
另外，for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
```
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```
### 不存在变量提升
var命令会发生”变量提升“现象，即变量可以在声明之前使用，值为undefined。这种现象多多少少是有些奇怪的，按照一般的逻辑，变量应该在声明语句之后才可以使用。

为了纠正这种现象，let命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错。
```
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```
### 暂时性死区
只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

```
if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
```
上面代码中，在let命令声明变量tmp之前，都属于变量tmp的“死区”。

“暂时性死区”也意味着typeof不再是一个百分之百安全的操作。

下面的代码也会报错，与var的行为不同。
```
// 不报错
var x = x;

// 报错
let x = x;
// ReferenceError: x is not defined
```
上面代码报错，也是因为暂时性死区。使用let声明变量时，只要变量在还没有声明完成前使用，就会报错。上面这行就属于这个情况，在变量x的声明语句还没有执行完成前，就去取x的值，导致报错”x 未定义“。

ES6 规定暂时性死区和let、const语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。这样的错误在 ES5 是很常见的，现在有了这种规定，避免此类错误就很容易了。

总之，暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。
### 不允许重复声明
let不允许在相同作用域内，重复声明同一个变量。
```
// 报错
function func() {
  let a = 10;
  var a = 1;
}

// 报错
function func() {
  let a = 10;
  let a = 1;
}
```
### ES6的块级作用域
let实际上为 JavaScript 新增了块级作用域。
```
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
  }
  console.log(n); // 5
}
```
上面的函数有两个代码块，都声明了变量n，运行后输出5。这表示外层代码块不受内层代码块的影响。如果两次都使用var定义变量n，最后输出的值才是10。

ES6 允许块级作用域的任意嵌套。
```
{{{{{let insane = 'Hello World'}}}}};
```
上面代码使用了一个五层的块级作用域。外层作用域无法读取内层作用域的变量。
```
{{{{
  {let insane = 'Hello World'}
  console.log(insane); // 报错
}}}};
```
内层作用域可以定义外层作用域的同名变
```
{{{{
  let insane = 'Hello World';
  {let insane = 'Hello World'}
}}}};
```
块级作用域的出现，实际上使得获得广泛应用的立即执行函数表达式（IIFE）不再必要了。
```
// IIFE 写法
(function () {
  var tmp = ...;
  ...
}());

// 块级作用域写法
{
  let tmp = ...;
  ...
}
```
### 块级作用域与函数声明
ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。
```
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());
```
### do表达式
本质上，块级作用域是一个语句，将多个操作封装在一起，没有返回值。
```
{
  let t = f();
  t = t * t + 1;
}
```
上面代码中，块级作用域将两个语句封装在一起。但是，在块级作用域以外，没有办法得到t的值，因为块级作用域不返回值，除非t是全局变量。

现在有一个提案，使得块级作用域可以变为表达式，也就是说可以返回值，办法就是在块级作用域之前加上do，使它变为do表达式。
```
let x = do {
  let t = f();
  t * t + 1;
};
```
上面代码中，变量x会得到整个块级作用域的返回值。
## const命令


### 基本用法
const声明一个只读的常量。一旦声明，常量的值就不能改变。
```
const arr = 3.5
arr // 3.5

arr = 4
// TypeError: Assignment to constant variable.
```
上面代码表明改变常量的值会报错。

const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。
```
const foo;
// SyntaxError: Missing initializer in const declaration
```
上面代码表示，对于const来说，只声明不赋值，就会报错。

const的作用域与let命令相同：只在声明所在的块级作用域内有效。
```
if (true) {
  const MAX = 5;
}

MAX // Uncaught ReferenceError: MAX is not defined
```
const命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用。
```
if (true) {
  console.log(MAX); // ReferenceError
  const MAX = 5;
}
```
上面代码在常量MAX声明之前就调用，结果报错。

const声明的常量，也与let一样不可重复声明。
```
var message = "Hello!";
let age = 25;

// 以下两行都会报错
const message = "Goodbye!";
const age = 30;
```
### 本质
const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指针，const只能保证这个指针是固定的，至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。
```
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```
上面代码中，常量foo储存的是一个地址，这个地址指向一个对象。不可变的只是这个地址，即不能把foo指向另一个地址，但对象本身是可变的，所以依然可以为其添加新属性。

下面是另一个例子。
```
const a = [];
a.push('Hello'); // 可执行
a.length = 0;    // 可执行
a = ['Dave'];    // 报错
```
上面代码中，常量a是一个数组，这个数组本身是可写的，但是如果将另一个数组赋值给a，就会报错。

如果真的想将对象冻结，应该使用Object.freeze方法。
```
const foo = Object.freeze({});

// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
```
上面代码中，常量foo指向一个冻结的对象，所以添加新属性不起作用，严格模式时还会报错。

除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数。
```
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};
```