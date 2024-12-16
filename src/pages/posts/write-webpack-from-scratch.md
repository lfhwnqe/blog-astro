---
layout: '@/templates/BasePost.astro'
title: 手写一个webpack
description: 如何手写一个webpack
pubDate: 2019-12-11T00:00:00Z
imgSrc: '/assets/images/image-post7.jpeg'
imgAlt: 'Image post 2'
---
# 缘起

- jquery 时代，javascript 的模块化只能在 node 端实现，前端页面只能这么写
- 前端复杂页面，引入无尽的脚本

## 前端

```html
<script src="./a.js"></script>
<script src="./b.js"></script>

<script>
	console.log('a==>>', a);
	console.log('b==>>', b);
</script>
```

## node 端

```jsx
// index.js
const { a } = require('./a.js');
const { b } = require('./b.js');

console.log('a==>>', a);
console.log('b==>>',b);

// a.js
exports.a = 'a';

// b.js
console.log('in b')
exports.b = 'b'
```

# 愿望

- 页面逐渐复杂，前端页面也想吃上模块化的糖。既然有想法，那何不做一个

# 分析

- 既然 node 有现成模块化方案，就按 node 的规范来吧。开发时按照上边 node 规范写代码，通过一个工具把生成的文件输出到一个大文件夹即可，需要解决的问题如下：

- 页面开发时使用 `node` 的模块化规范
- 开发完成后使用 `node工具` 把代码修改成符合浏览器运行规范的代码

# 流程

- 把所有文件内代码放到一个 `module` 对象里维护
- 创建一个打包方法，把 `module` 内的文件进行打包
- 实现 `require` 方法

### 

```jsx
const modules = {
  0: (require, exports) => {
    const { a } = require('./a.js');
    const { b } = require('./b.js');
    console.log('a==>>', a);
    console.log('b==>>', b);
  },
  1: (require, exports) => {
    exports.a = 'a';
  },
  2: (require, exports) => {
    console.log('in b');
    exports.b = 'b';
  },
};
```

- 创建一个打包方法，把 `module` 内的文件进行打包

```jsx
function build(moduleId) {
  const exports = {};
  const fn = modules[moduleId];
  fn(require, exports);

  function require(path) {
    // 实现 require 方法即可
  }
  return exports;
}

build(0);
```

- 实现 `require` 方法
    - 根据 path 获取 modules 里对应模块的代码
    - 差每个模块的依赖，那就在 `modules` 数据里加上每个模块依赖的模块吧

```jsx
const modules = {
  0: [
    (require, exports) => {
      const { a } = require('./a.js');
      const { b } = require('./b.js');
      console.log('a==>>', a);
      console.log('b==>>', b);
    },
    { './a.js': 1, './b.js': 2 },
  ],
  1: [
    (require, exports) => {
      exports.a = 'a';
    },
    {},
  ],
  2: [
    (require, exports) => {
      console.log('in b');
      exports.b = 'b';
    },
    {},
  ],
};

function build(moduleId) {
  const exports = {};
  let [fn, map] = modules[moduleId];
  fn && fn(require, exports);

  function require(path) {
    // 根据 path 获取 modules 里对应模块的代码
    return build(map[path]);
  }
  return exports;
}

build(0);
```

- ok，代码成功执行。证明把文件转化为改数据格式，即可在浏览器正常运行

### 剩下的问题

- 把文件转换为上变 `modules` 的格式
- 输出一个包含 上一步的文件夹

### 转换 modules 的格式

- 需求格式如下，分析需要的步骤

```jsx
const modules = {
  0: [
    (require, exports) => {
      const { a } = require('./a.js');
      const { b } = require('./b.js');
      console.log('a==>>', a);
      console.log('b==>>', b);
    },
    { './a.js': 1, './b.js': 2 },
  ],
  1: [
    (require, exports) => {
      exports.a = 'a';
    },
    {},
  ],
  2: [
    (require, exports) => {
      console.log('in b');
      exports.b = 'b';
    },
    {},
  ],
};
```

- 根据上一步，需要如下信息
    - 模块 id
    - 获取模块依赖
    - 记录模块代码
- 获取文件依赖
    - webpack 使用 acorn 来解析语法

```jsx
//  获取文件依赖
function getDependencies(code) {
  // return ['./a.js', './b.js'];
}
```

```jsx
//  获取文件依赖
function getDependencies(code) {
	// 此处使用用正则获取依赖
  let reg = /require\(['"](.+?)['"]\)/g;
  let result = null;
  const dependencies = [];
  while ((result = reg.exec(code))) {
    dependencies.push(result[1]);
  }
  return dependencies;
}
```

- 根据文件路径生成文件数据对象

```jsx
function createAssets(fileName) {
  // return {
  //   id: 0,
  //   dependency: ['./a.js', './b.js'],
  //   code: (require, exports) => {
  //     const { a } = require('./a.js');
  //     const { b } = require('./b.js');
  //     console.log('a==>>', a);
  //     console.log('b==>>', b);
  //   },
  // };
}
```

```jsx

//  记录模块 id
let ID = 0;
// 生成单个文件数据对象
function createAssets(fileName) {
  const fileContent = fs.readFileSync(fileName, 'utf-8');
  return {
    id: ID++,
    fileName,
    dependency: getDependencies(fileContent),
    code: `function (require, exports) {${fileContent}}`,
  };
}
```

- 生成所有模块

```jsx
// 生成所有模块
function createQueue() {
  // return [
  //   {
  //     path: './index.js',
  //     id: 0,
  //     dependency: ['./a.js', './b.js'],
  //     code: (require, exports) => {
  //       const { a } = require('./a.js');
  //       const { b } = require('./b.js');
  //       console.log('a==>>', a);
  //       console.log('b==>>', b);
  //     },
  //   },
  //   {
  //     path: './a.js',
  //     id: 1,
  //     dependency: [],
  //     code: (require, exports) => {
  //       exports.a = 'a';
  //     },
  //   },
  // ];
}
```

```jsx
// 生成所有模块
function createQueue(fileName) {
  const asset = createAssets(fileName);
  const queue = [asset];
	// 使用 let of 在循环过程中，数组增加的内容依然会被遍历
  for (let asset of queue) {
    const dirname = path.dirname(asset.fileName);
    asset.map = {};
    asset.dependency.forEach((relativePath) => {
			// 此处使用绝对路径，避免报错
      const absolutePath = path.join(dirname, relativePath);
			// 获取被依赖模块
      const model = createAssets(absolutePath);
			// 在当前模块的依赖 map 中加上这个模块
      asset.map[relativePath] = model.id;
			// 放到模块数组放到队列中
      queue.push(model);
    });
  }
  return queue;
}

const result = createQueue('./entry.js');
```

- 打包文件

```jsx
// 写入打包文件
function createBundle(queue) {
  // fs.writeFileSync('./dist/bundle.js', result);
}
```

```jsx
function createBundle(result) {
  let modules = ``;

  result.forEach((item) => {
    modules += `${item.id}:[${item.code},  ${JSON.stringify(item.map)}],`;
  });

  const fileContent = `(function (modules) {
    function build(id) {
      const [fn, map] = modules[id];
      const exports = {};

      fn && fn(require, exports);

      function require(path) {
        return build(map[path]);
      }
      return exports;
    }

    build(0);
  })({${modules}})`;
  fs.writeFileSync('./bundle.js', fileContent);
  // fs.writeFileSync('./dist/bundle.js', result);
}

createBundle(result)
```

### Done