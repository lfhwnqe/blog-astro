---
layout: '@/templates/BasePost.astro'
title: 怎么异步加载字体
description: 怎么异步加载字体
pubDate: 2020-11-11T00:00:00Z
imgSrc: '/assets/images/image-post7.jpeg'
imgAlt: 'Image post 2'
---
最近工作中，遇到一个页面。需要使用设计提供字体，但因字体过大导致页面加载速度很慢。梳理了一下解决方案

解决方案如下

1. 让设计把字体压缩，只提供需要用的文字部分，适用于只使用字体包内固定的部分文字，缺点：灵活性较差 
2. 使用 data urls  把字体转换为 base64 引入，第二次进入页面加载速度较快，缺点：需要使用工具手动转换且初次加载较慢
3. 网络字体可以使用字体加载库异步加载，缺点：几个常用的加载库都不支持从自有 cdn 引入
4. 异步加载字体, 使用 preload，加载完成后把 link 的 ref 修改为 stylesheet，浏览器会开始重绘，重绘使用这个字体的 DOM 之前才会触发 font 的加载事件，此时会有3秒内文字位置会显示空白：FOIT (Flash Of Invisible Text)，可以在使用该字体的 css 文件中使用 font-display: swap，font-family 后增加备用字体，在字体未加载出来前会展示页面已有的备用字体，字体加载完后过度到加载完的字体。缺点：因为是动态加载，每次进入页面都会从新下载，无法缓存

```jsx
const url = `https://image-1252680882.cos.ap-shanghai.myqcloud.com/act/2020/HYRunYuan-75W.ttf`;

  // do something...
  const link = document.createElement("style");
  link.rel = "preload";
  link.textContent = `@font-face {
  font-family: HYRunYuan;
  font-weight: 400;
  font-style: normal;
  src: url("${url}");
}`;
  document.head.appendChild(link);

  link.onload = function a() {
    console.log("font is onload");
    this.onload = null;
    this.rel = "stylesheet";
  };
```

```css
font-display: swap;
font-family: HYRunYuan, "PingFang SC";
```

5. 使用 FontFace 接口加载字体。缺点：这样直接运行还是会导致页面需要等字体加载完成才会加载完，速度较慢

```jsx
const url = `https://image-1252680882.cos.ap-shanghai.myqcloud.com/act/2020/HYRunYuan-75W.ttf`;

const HYRunYuan = new FontFace("HYRunYuan", `url(${url})`);
    // 添加到全局的 FontFaceSet 中
    document.fonts.add(HYRunYuan);
    HYRunYuan.load().then(() => {
      // 当字体加载完之后，我们就可以通过替换 class 的方法替换掉默认的字体
      // 此处的逻辑也可以是你的字体渲染策略
      const el = document.querySelector(".flashbuy-area__left");
      el.style.fontFamily = "HYRunYuan";
    });
```

6. 基于第5种方法，window 的 onload 事件后再设定一个定时器，这样能保证先渲染一个浏览器已有字体，再加载引用的字体，这样第一次加载页面速度较快，且可以缓存字体。缺点：FontFace 方法兼容性不够好

```jsx
const url = `https://image-1252680882.cos.ap-shanghai.myqcloud.com/act/2020/HYRunYuan-75W.ttf`;
window.onload = () => {
    console.log("onload");
    setTimeout(() => {
      const HYRunYuan = new FontFace("HYRunYuan", `url(${url})`);
      // 添加到全局的 FontFaceSet 中
      document.fonts.add(HYRunYuan);
      HYRunYuan.load().then(() => {
        // 当字体加载完之后，我们就可以通过替换 class 的方法替换掉默认的字体
        // 此处的逻辑也可以是你的字体渲染策略
        const el = document.querySelector(".flashbuy-area__left");
        el.style.fontFamily = "HYRunYuan";
      });
    }, 0);
  };
```

### 最佳实践

最佳实践需根据实际需求来选择，长久看来，方法6 会比较合适，即使没有加载成功，也能展示页面默认字体