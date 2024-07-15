# 模拟时钟 React 组件

## 分支说明

`main` 分支对时钟的实现思路并不好，会导致很多 bug。

我用新的实现思路重新实现了时钟，并放在 `cohesive` 分支中。之后会完全覆盖 `main` 分支。

## 运行方法

需要预先安装：

* node.js

在项目根目录打开终端，安装依赖

```sh
npm install
```

运行项目

```sh
npm dev
```

在浏览器中访问页面所在的 url（默认为 localhost:3000）

应该看到类似以下的场景

![](readme-assets/image.png)

## 目标清单

### 时钟

- [x] 绘制简单的表盘
- [ ] 绘制更加精美的表盘
- [x] 指针按照正常时间走动
- [x] 在合适的位置同步显示数字时间
- [ ] 通过输入框修改时间
- [x] 可以用鼠标拨动指针
- [x] 确保时针和分针的正确位置关系

### 闹钟

### 秒表

### 计时器