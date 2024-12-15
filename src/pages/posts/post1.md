---
layout: '@/templates/BasePost.astro'
title: 闭包、访问器、工厂模式等
description: javascript中的闭包、访问器、工厂模式、构造函数模式、原型模式、动态原型模式.
pubDate: 2018-12-11T00:00:00Z
imgSrc: '/assets/images/image-post3.jpeg'
imgAlt: 'Image post 2'
---
### 闭包

有不少开发人员总是搞不清匿名函数和闭包这两个概念，因此经常混用。闭包是指有权访问另一个函数作用域中的变量的函数。创建闭包的常见方式，就是在一个函数内部创建另一个函数。



### 访问器

对象的访问器属性，访问器不包含数据值，它们包含一对儿getter和setter函数（不过这两个函数都不是必须的）。在读取访问器属性时，会调用getter函数，这个函数负责返回有效的值，在写入访问器属性时，会调用setter函数并传入新值，这个函数负责决定如何处理数据。

```javascript
var book = {
    _year: 2004, 
    edition: 1
};

Object.defineProperty(book, "year", {
    get: function(){
        return this._year;
    },
    set: function(newValue){

        if (newValue > 2004) {
            this._year = newValue;
            this.edition += newValue - 2004;
        }
    }
});

book.year = 2005;
alert(book.edition);  //2

// 摘录来自: 泽卡斯（Zakas. Nicholas C.）. “JavaScript高级程序设计(第3版) (图灵程序设计丛书)。” iBooks. 
```



### 工厂模式 

工厂模式是软件工程领域一种广为人知的设计模式，这种模式抽象了创建具体对象的过程。考虑到在ECMAScript中无法创建类，开发人员就发明了一种函数，用函数来封装以特定接口创建对象的细节

```javascript
function createPerson(name, age, job){
    var o = new Object();
    o.name = name;”
	o.age = age;
    o.job = job;
    o.sayName = function(){
        alert(this.name);
    };    
    return o;
}

var person1 = createPerson("Nicholas", 29, "Software Engineer");
var person2 = createPerson("Greg", 27, "Doctor");

// 摘录来自: 泽卡斯（Zakas. Nicholas C.）. “JavaScript高级程序设计(第3版) (图灵程序设计丛书)。” iBooks. 
```

函数createPerson能根据接受的参数来构建一个包含所有必要信息的Person对象。可以无数次地调用这个函数，而每次它都会返回一个包含三个属性一个方法的对象。工厂模式虽然解决了创建多个相似对象的问题，但却没有解决对象识别的问题（即怎样知道一个对象的类型）。随着javascript的发展，又一个新模式出现了



# 构造函数模式

```javascript
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        alert(this.name);
    };    
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

// 摘录来自: 泽卡斯（Zakas. Nicholas C.）. “JavaScript高级程序设计(第3版) (图灵程序设计丛书)。” iBooks. 
```

在上述例子中，Person函数取代了createPerson函数。我们注意到，Person中的代码除了与createPerson相同的部分外，还存在一下不同之处

- 没有显式的创建对象
- 直接将属性和方法赋给了this对象
- 没有return语句

此外，还应注意到函数名Person使用的是大写字母P，按照惯例，构造函数始终都应该以一个大写字母开头，而非构造函数则应该以一个小写字母开头

上述例子中，person1和person2分别保存着Person的一个不同的实例，这两个对象都有一个constructor（构造函数）属性，该属性指向Person

```javascript
alert(person1.constructor == Person);  //true
alert(person2.constructor == Person);  //true
```

对象的constructor属性最初是用来标识对象类型的。但是检测对象类型，还是instanceof操作符更可靠一些。在这个例子中，创建的所有对象即是Object的实例，同时也是Person的实例，这一点通过instanceof操作符可以得到验证

```javascript
alert(person1 instanceof Object);  //true
alert(person1 instanceof Person);  //true
alert(person2 instanceof Object);  //true
alert(person2 instanceof Person);  //true
```



### 构造函数的问题

构造函数上的每个方法，都要在每个实例上重新创建一遍。在前面的例子中，person1和person2都有一个名为sayName的方法，但是这两个方法不是同一个Function的实例。

然后创建两个完全相同任务的Function实例的确没有必要：况且有this对象在，根本不用在执行代码前把函数绑定在特定的对象上面。所以可以使用函数定义转移到构造函数外部来解决这个问题

```javascript
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}

function sayName(){
    alert(this.name);
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```

这样，我们就把sayName函数的定义转移到了构造函数外部。解决了两个函数做同一件事情的问题



# 原型模式

我们创建的每个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。换句话说，不必在构造函数中定义对象实例的信息，而是将这些信息直接添加到原型对象中

```javascript
function Person(){
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};

var person1 = new Person();
person1.sayName();   //"Nicholas"

var person2 = new Person();
person2.sayName();   //"Nicholas"

alert(person1.sayName == person2.sayName);  //true

// 摘录来自: 泽卡斯（Zakas. Nicholas C.）. “JavaScript高级程序设计(第3版) (图灵程序设计丛书)。” iBooks. 
```



### 理解原型对象

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个prototype属性，这个属性指向函数的原型对象。在默认情况下，所有原型对象都会自动获得一个constructor（构造函数）属性，这个属性包含一个执行prototype属性所在函数的指针。Person.prototype.constructor指向Person。

我们还可以继续为原型对象添加其他属性和方法。

以前面使用Person构造函数和Person.prototype创建实例的代码为例，下图展示了各个对象间的关系

![5bee9a0544bde.png](https://i.loli.net/2018/11/16/5bee9a0544bde.png)

```javascript
function Person(){

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};

var person1 = new Person();
var person2 = new Person();

alert(person1.hasOwnProperty("name"));  //false

person1.name = "Greg";
alert(person1.name);     //"Greg"——来自实例
alert(person1.hasOwnProperty("name"));  //true

alert(person2.name);     //"Nicholas"——来自原型
alert(person2.hasOwnProperty("name"));  //false

delete person1.name;
alert(person1.name);     //"Nicholas"——来自原型
alert(person1.hasOwnProperty("name"));  //false

摘录来自: 泽卡斯（Zakas. Nicholas C.）. “JavaScript高级程序设计(第3版) (图灵程序设计丛书)。” iBooks. 
```

通过使用hasOwnProperty方法，什么时候访问的是实例属性，什么时候访问的是原型属性就一清二楚了。



## 动态原型模式

```javascript
function Person(name, age, job){

    //属性
    this.name = name;
    this.age = age;
    this.job = job;

    //方法
    if (typeof this.sayName != "function"){

        Person.prototype.sayName = function(){
            alert(this.name);
        };

    }
}

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName();


摘录来自: 泽卡斯（Zakas. Nicholas C.）. “JavaScript高级程序设计(第3版) (图灵程序设计丛书)。” iBooks. 
```



# 继承

继承是oo语言中一种最为人津津乐道的概念，许多oo语言都支持两种继承方式：接口继承和实现继承。接口继承着只继承方法签名，而实现继承则继承实际的方法，由于函数没有签名，在ECMAScript中无法实现接口集成。只支持是实现继承，而实现继承主要依靠原型链实现