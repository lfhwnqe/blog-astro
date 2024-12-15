---
layout: '@/templates/BasePost.astro'
title: 常规算法
description: javascript中常规算法
pubDate: 2018-12-11T00:00:00Z
imgSrc: '/assets/images/image-post6.jpeg'
imgAlt: 'Image post 2'
---
# javascript算法

### 排序算法

### 冒泡排序

冒泡排序是排序算法中最简单的，从运行时间的角度来看，冒泡排序是最差的

冒泡排序比较任何两个相邻的项，如果第一个比第二个大，则交换它们。元素项向上移动至正确的顺序，就好像气泡升至表面一样。

```javascript
Array.prototype.bubbleSort = function() {
    for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this.length - 1 - i; j++) {
            if (this[j] > this[j + 1]) {
                let aux = this[j]
                this[j] = this[j + 1]
                this[j + 1] = aux
            }
        }
    }
}
```

注: 冒泡排序算法的复杂度是O(n2),不推荐此算法

### 选择排序

选择排序算法是一种原址比较排序算法。选择排序算法的思路是：找到数据结构的最小值并将其放置在第一位，接着找到第二小的值并将其放在第二位，以此类推

```javascript
Array.prototype.selectionSort = function() {
    let indexMin
    for (let i = 0; i < this.length - 1; i++){
        indexMin = i
        for (var j = i; j < this.length; j++){ 
            if(this[indexMin] > this[j]) {
                indexMin = j
            }
        } 
        if (i !== indexMin){
            let aux = this[i]
            this[i] = this[indexMin]
            this[indexMin] = aux
        }
    }
    return this
}
```



### 插入排序

插入排序每次排一个数组项，以此方式构建最后的排序数组。假定第一项已经排序了，接着，它和第二项进行比较，第二项应该待在原位还是插到第一项之前呢？这样，头两项就已正确排序，接着和第三项比较（它是该插入到第一、第二还是第三的位置呢？），以此类推

```javascript
Array.prototype.insertionSort = function() {
    let j
    let temp
    for (let i = 1; i < this.length; i++) {
        j = i
        temp = this[i]
        while (j > 0 && this[j - 1] > temp) {
            this[j] = this[j - 1]
            j--
        } 
        this[j] = temp
        console.log(this.join(', '))
    }
    return this
}
```

