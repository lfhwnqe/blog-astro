---
layout: '@/templates/BasePost.astro'
title: 怎么分析算法时间复杂度
description: 怎么分析算法时间复杂度
pubDate: 2020-12-11T00:00:00Z
imgSrc: '/assets/images/image-post2.jpeg'
imgAlt: 'Image post 2'
---

# 怎么分析算法时间复杂度

## 大O复杂度表示法

T(n) = O(f(n))

表示代码执行时间随数据规模增长的变化趋势

例如：T(n)=O(2n2 + 2n + 3)
- 去掉 2n + 3 因为它对整体复杂度影响小
- 2n2中最大的是 2次方。所以只保留n2
- 最后结果是 复杂度为 O(n2)

### 对数换底公式推导

$$
log_3(n)=log_3(2)*log_2(n)
$$

$$
\frac{log_3(n)}{log_3(2)}=log_2(n)
$$

对数换底公式如下：

$$
log_a(b)=\frac{log_c(b)}{log_c(a)}
$$

$$
log_c(b)=log_c(a)*log_a(b)
$$

$$
log_c(a)=\frac{log_c(b)}{log_a(b)}
$$

## 算法时间复杂度具体分析

- 只关注循环执行次数最多的一段代码
- 加法法则：总复杂度等于量级最大的那段代码的复杂度
- 乘法法则：嵌套代码的复杂度等于嵌套内外代码复杂度的乘积
- 有二分查找的话 则为O（logN）

### 深度优先与广度优先遍历的复杂度

深度优先搜索（DFS）和广度优先搜索（BFS）是两种常用的图遍历算法，它们的时间复杂度通常都是O(V + E)，其中V是顶点数，E是边数。这是因为在最坏的情况下，每个顶点和每条边都会被访问一次。然而，空间复杂度可能有所不同：
- DFS的空间复杂度是O(H)，其中H是图的高度（递归调用栈的深度）
- BFS的空间复杂度是O(W)，其中W是图的宽度（队列中的最大节点数）

## 常见算法复杂度

这些算法展示了常见的时间复杂度类别：
- 线性时间 O(n)
- 对数时间 O(logn)
- 线性对数时间 O(nlogn)
- 二次时间 O(n2)
- 指数时间 O(2n)

### 1. 线性时间 O(n) - 遍历数组

```typescript
function findMax(arr: number[]): number {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

const array = [1, 3, 5, 7, 9];
console.log(findMax(array));  // 输出：9
```

### 2. 对数时间 O(logn) - 二分搜索

二分搜索，在已经排序的数组内找到指定的元素。通过目标值与数组中间元素的比较，可以每次把搜索范围缩小一半。

**算法复杂度分析：**
1. 初始化搜索空间，最开始时搜索范围包含整个数组。即n个元素
2. 每次迭代后搜索空间减半：每次迭代会把查找的数与数组中间元素做对比
3. 重复搜索直到找到对应元素或空间耗尽
4. 计算迭代次数：搜索区间经过 k 次迭代后。会变成 n/2^k。当 n/2^k = 1 时则 2^k = n。k = log_2(n)
5. 这里的对数底数通常省略，因为在大 O 记号中，常数因子并不影响复杂度分类。得出复杂度 O(logn)

```typescript
function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(binarySearch(sortedArray, 4));  // 输出：3
```

### 3. 线性对数时间 O(nlogn) - 归并排序

归并排序的思路是把一个大问题分成多个小问题来解决。然后将小问题合并。

**复杂度分析：**
- 时间复杂度：
  1. 拆分每次都是除以2。完成所有拆分进行的操作次数是 n/2^k ⇒ k = log_2(n)
  2. 合并操作是把数据线性合并，复杂度为 O(n)
  3. 总的时间复杂度就是 O(nlogn)
- 空间复杂度：
  1. 递归每次调用都会占用栈空间。递归深度为 log_2(n) 复杂度 O(logn)
  2. 合并子数组需要临时数组存储合并结果复杂度为 O(n)
  3. 总的空间复杂度是 O(logn) + O(n) = O(n)

```typescript
function mergeSort(arr: number[]): number[] {
    const length = arr.length;
    if (length <= 1) return arr;
    const middle = Math.floor(length / 2);
    const left = mergeSort(arr.slice(0, middle));
    const right = mergeSort(arr.slice(middle));
    const merged = merge(left, right);
    return merged;
}

function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0;
    let j = 0;
    while (left.length > i && right.length > j) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    while (left.length > i) {
        result.push(left[i]);
        i++;
    }
    while (right.length > j) {
        result.push(right[j]);
        j++;
    }
    return result;
}

console.log(mergeSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]));
// 输出：[1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]
```

### 4. 二次时间 O(n2) - 冒泡排序

```typescript
function bubbleSort(arr: number[]): number[] {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

console.log(bubbleSort([5, 3, 8, 4, 2]));  // 输出：[2, 3, 4, 5, 8]
```

### 5. 指数时间 O(2n) - 斐波那契数列

```typescript
function fibonacci(n: number): number {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));  // 输出：55
```

# 空间复杂度

我们常见的空间复杂度就是 O(1)、O(n)、O(n2)，像 O(logn)、O(nlogn) 这样的对数阶复杂度平时都用不到。