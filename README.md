# myVue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable
Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type
checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript
language service aware of `.vue` types.

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

> column纯CSS会从上到下，从左到右排列，也就是会将元素均分为N列，然后依次展示；适合不会变化的数据，如果数据动态变化，会重新排布整个页面

> grid布局纯CSS可以实现自定义网格展示(不变的数据)，但要动态实现瀑布流需要结合JS计算每一个新增元素的位置和坐标，[实现思路](https://www.bilibili.com/video/BV1dt421L7a7/?share_source=copy_web&vd_source=4a848b0771dedcff278c8618837fdf90)

> 最后使用第三方库`wc-flow-layout`实现，[项目地址](https://www.npmjs.com/package/wc-flow-layout)

### 代码审查和git commit引导、校验工作流

> 相关配置包含ts检查，故有部分@type库
>
> 此工作流主要使用如下库：eslint：代码审查prettier：代码格式审查husky：Githooks钩子工具,在 Git 操作前或者后执行自定义的脚本lint-staged：用于检查暂存区代码commitlint：git
> commit格式校验cz-git：引导式git commit工具commitizen ：cz-git必需库

#### 1、结构说明

`package.json`如下：

```jsonc
{
  "type": "module",
  "scripts": {
    "lint-staged": "lint-staged",
    "check:type": "vue-tsc --build --noEmit --force",
    "check:prettier": "prettier --check .",
    "check": "eslint .",
    "lint": "eslint . --fix",
    "lint:prettier": "prettier . --write",
    "lint:commitlint": "commitlint --edit $1",
    "commit": "git add . && pnpm exec lint-staged && cz",
  },
  "lint-staged": {
    "**/*.{cjs,mjs,js,jsx,tsx,ts,less,md,json}": ["pnpm exec eslint --fix"],
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git",
    },
  },
}
```

项目结构如下：Project

```css
│── .husky
│   ├── _ //husky安装之后自行创建(无需关心)
│   ├── commit-msg  //提交信息完成之后执行
│   └── pre-commit  //提交信息(引导)完成之后，提交代码到暂存区之前执行执行的脚本
│── .prettierignore //prettier检查忽略文件
│── .prettierrc.cjs //prettier配置
│── commitlint.config.cjs   //commitlint和cz-git配置
│── eslint.config.js    //eslint配置
└── package.json    //包管理文件‌
```

#### 2、安装

```bash
# 安装项目依赖
pnpm add @commitlint/cli @commitlint/config-conventional @commitlint/types @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser cz-git eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue globals husky lint-staged prettier typescript typescript-eslint vue-eslint-parser

# 全局安装 commitizen
pnpm add -g commitizen
```

> grid布局纯CSS可以实现自定义网格展示(不变的数据)，但要动态实现瀑布流需要结合JS计算每一个新增元素的位置和坐标，[实现思路](https://www.bilibili.com/video/BV1dt421L7a7/?share_source=copy_web&vd_source=4a848b0771dedcff278c8618837fdf90)

> 最后使用第三方库`wc-flow-layout`实现，[项目地址](https://www.npmjs.com/package/wc-flow-layout)
