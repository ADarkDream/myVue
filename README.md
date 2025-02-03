# myVue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## 记录

### 关于瀑布流

> column纯CSS会从上到下，从左到右排列，也就是会将元素均分为N列，然后依次展示；
> 适合不会变化的数据，如果数据动态变化，会重新排布整个页面

> grid布局纯CSS可以实现自定义网格展示(不变的数据)，但要动态实现瀑布流需要结合JS计算每一个新增元素的位置和坐标，[实现思路](https://www.bilibili.com/video/BV1dt421L7a7/?share_source=copy_web&vd_source=4a848b0771dedcff278c8618837fdf90)

> 最后使用第三方库`wc-flow-layout`实现，[项目地址](https://www.npmjs.com/package/wc-flow-layout)
