---
layout: '@/templates/BasePost.astro'
title: javascript数据结构
description: javascript中的常规数据结构
pubDate: 2018-12-11T00:00:00Z
imgSrc: '/assets/images/image-post4.jpeg'
imgAlt: 'Image post 2'
---
# javascript数据结构

### 栈

一种遵从先进后出原则的有序集合



### 队列

遵从先进先出原则的有序项



### 优先队列

修改版的队列，设置优先级



### 循环队列

基于队列，克服‘假溢出’想象的队列。例如队列长度为5，取第6个数据时，会取第一个数据



### 链表

要存储多个元素，数组（或列表）可能是最常用的数据结构

每种语言都实现了数组。这种数据结构非常方便，提供了一个便利的[]语法来访问它的元素。

然后，这种数据结构有一个缺点：在大多数语言中，数组的大小是固定的，从数组的起点或中间插入或移除项的成本很高，因需要移动元素。

尽管javascript中的Array类方法可以帮我们做这些事，但背后的处理机制同样如此。



链表储存有序的元素集合，但不同于数组，链表中的元素在内存中不是连续放置的。每个元素由一个储存元素本身的节点和一个指向下一个元素的引用（也称指针或链接）组成



相对于传统的数组，链表的一个好处在于，添加或移除元素的时候不需要移动其他元素。然而，链表需要使用指针，因此实现链表时需要额外注意。



数组的另一个细节是可以直接访问任意位置的任何元素，而要想访问链表中间的一个元素，需要从起点（表头）开始迭代列表直到找到所需的元素

```javascript
// 链表节点
class Node {
    constructor(element) {
        this.element = element
        this.next = null
    }
}

// 链表
class LinkedList {

    constructor() {
        this.head = null
        this.length = 0
    }

    // 追加元素
    append(element) {
        const node = new Node(element)
        let current = null
        if (this.head === null) {
            this.head = node
        } else {
            current = this.head
            while(current.next) {
                current = current.next
            }
            current.next = node
        }
        this.length++
    }

    // 任意位置插入元素
    insert(position, element) {
        if (position >= 0 && position <= this.length) {
            const node = new Node(element)
            let current = this.head
            let previous = null
            let index = 0
            if (position === 0) {
                this.head = node
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                node.next = current
                previous.next = node
            }
            this.length++
            return true
        }
        return false
    }

    // 移除指定位置元素
    removeAt(position) {

        // 检查越界值
        if (position > -1 && position < length) {
            let current = this.head
            let previous = null
            let index = 0
            if (position === 0) {
                this.head = current.next
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                previous.next = current.next
            }
            this.length--
            return current.element
        }
        return null
    }

    // 寻找元素下标
    findIndex(element) {
        let current = this.head
        let index = -1
        while (current) {
            if (element === current.element) {
                return index + 1
            }
            index++
            current = current.next
        }
        return -1
    }

    // 删除指定文档
    remove(element) {
        const index = this.indexOf(element)
        return this.removeAt(index)
    }

    isEmpty() {
        return !this.length
    }

    size() {
        return this.length
    }

    // 转为字符串
    toString() {
        let current = this.head
        let string = ''
        while (current) {
            string += ` ${current.element}`
            current = current.next
        }
        return string
    }
}

```



### 双向链表

与普通链表的区别在于，双向链表的链接是双向的，一个链向下一个元素，一个链向上一个元素。

双向链表提供了两种迭代列表的方法，从头到尾或反过来。在单向链表中，如果迭代列表时错过了要找的元素，就需要回到列表起点，重新开始迭代。



### 循环链表

循环链表可以是单向链表一样只有单向引用，也可以向双向链表有双向引用。循环链表和链表之间唯一的区别在于，最后元素指向下一个元素的指针(tail.next)不是引用null，而是指向第一个元素(head)



链表相比数组最重要的优点，就是无需移动链表中的元素，就能轻松地添加移除元素。因此，当你需要添加移除很多元素时，最好的选择就是链表，而不是数组



### 集合

集合是由一组无序且唯一（不能重复）的项组成的。这个数据结构使用了与优先集合相同的数学概念，但应用在计算机科学的数据结构中

```javascript
class Set {

    constructor() {
        this.items = {}
    }

    has(value) {
        return this.items.hasOwnProperty(value)
    }

    add(value) {
        if (!this.has(value)) {
            this.items[value] = value
            return true
        }     
        return false
    }

    remove(value) {
        if (this.has(value)) {
            delete this.items[value]
            return true
        }
        return false
    }

    get size() {
        return Object.keys(this.items).length
    }

    get values() {
        return Object.keys(this.items)
    }
}
					
```



### 字典

集合，字典，散列表都可以存储不重复的数据。字典和集合很像，集合是以{ value: value }的形式存储数据，而字典是以{ key: value}的形式存储数据，字典也称为映射。

object对象便是字典在javascript中的实现 



### 树

一个树结构包含一系列存在父子关系的节点。每个节点都有一个父节点（除顶部的第一个节点）以及零个或者多个子节点

![5bebdf5a082c0.png](https://i.loli.net/2018/11/14/5bebdf5a082c0.png)



### 二叉树和二叉搜索树

二叉树中的节点最多只能有两个子节点：一个是左侧子节点，另一个是右侧子节点。二叉树在计算机科学中应用非常广泛

二叉搜索树（BST）是二叉树的一种，但是它只允许你在左侧节点存储比父节点小的值，右侧节点存储比父节点大的值

下图展示二叉搜索树的组织结构方式

![5bebe4ba8c4ba.png](https://i.loli.net/2018/11/14/5bebe4ba8c4ba.png)

代码实现二叉搜索树

```javascript
class Node {
    constructor(key) {
        this.key = key
        this.left = null
        this.right = null
    }
}

class BinarySearchTree {

    constructor() {
        this.root = null
    }

    insert(key) {
        const newNode = new Node(key)
        const insertNode = (node, newNode) => {
            if (newNode.key < node.key) {
                if (node.left === null) {
                    node.left = newNode
                } else {
                    insertNode(node.left, newNode)
                }
            } else {
                if (node.right === null) {
                    node.right = newNode
                } else {
                    insertNode(node.right, newNode)
                }
            }
        }
        if (!this.root) {
            this.root = newNode
        } else {
            insertNode(this.root, newNode)
        }
    }
}


```

使用二叉搜索树

```javascript
const tree = new BinarySearchTree()
tree.insert(11)
tree.insert(7)
tree.insert(5)
tree.insert(3)
tree.insert(9)
tree.insert(8)
tree.insert(10)
tree.insert(13)
tree.insert(12)
tree.insert(14)
tree.insert(20)
tree.insert(18)
tree.insert(25)
```

构建的树如下图：

![5bebe52aef48f.png](https://i.loli.net/2018/11/14/5bebe52aef48f.png)

### 树的遍历

遍历一颗树是指访问树的每一个节点并对它们进行某种操作的过程。

访问树的所有节点有三种方式：中序、先序、后序

### 中序遍历

中序遍历是一种以上行顺序访问BST所有节点的遍历方式，也就是以从小到最大的顺序访问所有的节点。中序遍历的一种应用就是对树进行排序操作。实现如下：

```javascript
inOrderTraverse(callback) {
    const inOrderTraverseNode = (node, callback) => {
        if (node !== null) {
            inOrderTraverseNode(node.left, callback)
            callback(node.key)
            inOrderTraverseNode(node.right, callback)
        }
    }
    inOrderTraverseNode(this.root, callback)
}

```

inOrderTraverse方法接受一个回调函数作为参数，回掉函数用来定义我们对便利到的每个节点进行的操作，这也叫做访问者模式



在之前展示的树上执行下面的方法：

```javascript
tree.inOrderTraverse(value => { console.log(value) })
```

控制台将会按照顺序输出：3 5 6 7 8 9 10 11 12 13 14 15 18 20 25

下图描述了inOrderTraverse方法的访问路径

![5bebf8212f68e.png](https://i.loli.net/2018/11/14/5bebf8212f68e.png)



### 先序遍历

先序遍历是以优先于后代节点的顺序访问每个节点的，先序遍历的一种应用是打印一个结构化的文档。

```javascript
preOrderTraverse(callback) {
    const preOrderTraverseNode = (node, callback) => {
        if (node !== null) {
            callback(node.key)
            preOrderTraverseNode(node.left, callback)
            preOrderTraverseNode(node.right, callback)
        }
    }
    preOrderTraverseNode(this.root, callback)
}
```

下面的图描绘了 preOrderTraverse 方法的访问路径:

![5bebf96be124c.png](https://i.loli.net/2018/11/14/5bebf96be124c.png)



### 后序遍历

后序遍历是先访问节点的后代节点，再访问节点本身。后续遍历的一种应用是计算一个目录和它的子目录所有文件所占空间的大小

```javascript
postOrderTraverse(callback) {
    const postOrderTraverseNode = (node, callback) => {
        if (node !== null) {
            postOrderTraverseNode(node.left, callback)
            postOrderTraverseNode(node.right, callback)
            callback(node.key)
        }
    }
    postOrderTraverseNode(this.root, callback)
}
```

这个例子中，后续遍历会先访问左侧节点，然后是右侧节点，最后是父节点本身。

中序遍历、先序遍历、后续遍历的实现方式相似的，唯一不同是三行代码的执行顺序。

下图描绘postOrderTraverse方法的访问路径

![5bebfc03e06a3.png](https://i.loli.net/2018/11/14/5bebfc03e06a3.png)



### 三种遍历访问顺序的不同	

1. 先序遍历：节点本身 => 左侧子节点 => 右侧子节点
2. 中序遍历：左侧子节点 => 节点本身 => 右侧子节点
3. 后序遍历：左侧子节点 => 节点本身 => 右侧子节点



### 搜索树中的值

在树中，有三种经常执行的搜索顺序：

1. 最大值
2. 最小值
3. 搜索特定值



### 搜索最大值和最小值

用下图的树作为示例

![5bebfc9400691.png](https://i.loli.net/2018/11/14/5bebfc9400691.png)

实现方法：

```javascript
min(node) {
    const minNode = node => {
        return node ? (node.left ? minNode(node.left) : node) : null
    }
    return minNode(node || this.root)
}

max(node) {
    const maxNode = node => {
        return node ? (node.right ? maxNode(node.right) : node) : null
    }
    return maxNode(node || this.root)
}
```

搜索一个特定的值

```javascript
search(key) {
    const searchNode = (node, key) => {
        if (node === null) return false
        if (node.key === key) return node
        return searchNode((key < node.key) ? node.left : node.right, key)
    }
    return searchNode(root, key)
}
```

移除一个节点

```javascript
remove(key) {
    const removeNode = (node, key) => {
        if (node === null) return false
        if (node.key === key) {
            console.log(node)
            if (node.left === null && node.right === null) {
                let _node = node
                node = null
                return _node
            } else {
                console.log('key', key)
            }
        } else if (node.left !== null && node.key > key) {
            if (node.left.key === key) {
                node.left.key = this.min(node.left.right).key
                removeNode(node.left.right, node.left.key)
                return node.left
            } else {
                return removeNode(node.left, key)
            }
        } else if (node.right !== null && node.key < key) {
            if (node.right.key === key) {
                node.right.key = this.min(node.right.right).key
                removeNode(node.right.right, node.right.key)
                return node.right
            } else {
                return removeNode(node.right, key)
            }
        } else {
            return false
        }
        return removeNode((key < node.key) ? node.left : node.right, key)
    }
    return removeNode(this.root, key)
}
```

完整写法：

```javascript
var removeNode = function(node, key){

  if (node === null){ //{2}
    return null;
  }
  if (key < node.key){ //{3}
    node.left = removeNode(node.left, key); //{4}
    return node; //{5}

  } else if (key > node.key){ //{6}
    node.right = removeNode(node.right, key); //{7}
    return node; //{8}

  } else { //键等于node.key

    //第一种情况——一个叶节点
    if (node.left === null && node.right === null){ //{9}
      node = null; //{10}
      return node; //{11}
    }

    //第二种情况——一个只有一个子节点的节点
    if (node.left === null){ //{12}
      node = node.right; //{13}
      return node; //{14}

    } else if (node.right === null){ //{15}
      node = node.left; //{16}
      return node; //{17}
    }

    //第三种情况——一个有两个子节点的节点
    var aux = findMinNode(node.right); //{18}
    node.key = aux.key; //{19}
    node.right = removeNode(node.right, aux.key); //{20}
    return node; //{21}
  }
};

var findMinNode = function(node){
  while (node && node.left !== null) {
    node = node.left;
  }
  return node;
};

```

### 自平衡二叉搜索树和红黑树

TODO

### 算法