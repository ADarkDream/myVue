# myVue

默默的小站前端

## 项目说明

公开本项目前端部分以供展示

尚有部分冗余文件未删除，部分bug未修复

### 项目安装

```sh
npm install
#or
pnpm i
```

### 项目运行

```sh
npm run start
#or
pnpm start
```

### 项目打包

```sh
npm run build:prod
#or
pnpm build:prod
```

## 其他记录

### 关于瀑布流

> column纯CSS会从上到下，从左到右排列，也就是会将元素均分为N列，然后依次展示；适合不会变化的数据，如果数据动态变化，会重新排布整个页面
>
> grid布局纯CSS可以实现自定义网格展示(不变的数据)，但要动态实现瀑布流需要结合JS计算每一个新增元素的位置和坐标，[实现思路](https://www.bilibili.com/video/BV1dt421L7a7/?share_source=copy_web&vd_source=4a848b0771dedcff278c8618837fdf90)
>
> 最后使用第三方库`wc-flow-layout`实现，[项目地址](https://www.npmjs.com/package/wc-flow-layout)
>

## 脚本说明(部分)

```text
"prepare": "husky",                                                     // 每次执行 npm i 时触发，如果 husky 没有初始化，则初始化 husky
"check:type": "vue-tsc --build --noEmit --force",                       // 执行 TypeScript 类型检查，但不生成任何输出文件
"check:prettier": "prettier --check .",                                 // 检查项目所有文件并报告不符合格式化规则的代码
"check": "eslint .",                                                    // 检查项目所有文件并报告不符合格式化和校验规则的代码
"lint": "eslint . --fix",                                               // 检查项目所有文件并自动修改不符合格式化和校验规则的代码
"lint:prettier": "prettier . --write",                                  // 检查项目所有文件并自动修改不符合格式化规则的代码
"lint:commitlint": "commitlint --edit $1",                              // 检查上一次的 commit 信息格式
"lint-staged": "lint-staged",                                           // 检查暂存区所有文件，并自动修复格式及代码规范问题
"lint:diff": "git add . && npm exec lint-staged",                       // 代码暂存 && 格式化和校验（仅检查并修复本次修改的文件）
"commit": "npm run lint:diff && cz",                                    // 代码暂存 && 格式化和校验 && 引导式提交【需要全局安装 commitizen】
"sitemap": "node updateSitemap.js",                                     // 根据 router 生成站点地图，用于搜索引擎抓取【有新页面时需要修改该文件】
"build": "vite build",                                                  // 打包项目
"build-after-check": "run-p type-check \"build {@}\" --",               // 先执行类型检查，再执行打包
"build:prod": "npm run sitemap && npx vite build --mode production",    // 先生成站点地图，再以生产模式打包项目
"dev": "vite --host 0.0.0.0 --mode development",                        // 开发环境下运行项目
"preview": "vite preview"                                               // 预览打包后的项目【浏览的是 dist 文件夹，因此需要先执行打包命令】

```

## 项目根目录结构说明

```text
│── .husky                  // Git Hooks 工具
│   ├── _                   // 此文件夹是 husky 的自带脚本，内部文件命名代表 git 的 Hooks 的生命周期
│   ├── commit-msg          // 提交信息完成之后执行
│   └── pre-commit          // 提交(引导完成之后)信息之前，提交代码到本地仓库之前执行执行的脚本
│── .vscode                 // VSCode项目相关配置
│   ├── extensions.json     // VSCode插件推荐
│   └── settings.json       // VSCode项目配置
│── .env                    // 全局环境变量
│── .env.development        // 开发环境模式下的变量(开发环境下默认)
│── .env.production         // 生产环境模式下的变量，脚本带上 "--mode 环境名" 参数即可读取对应环境下的变量，如脚本 "build:prod" 使用的 "--mode production"
│── .prettierignore         // prettier 检查忽略文件
│── .prettierrc.cjs         // prettier 配置
│── auto-imports.d.ts       // 自动导入全局函数/库,提供 TypeScript 类型支持
│── commitlint.config.cjs   // commitlint 和 cz-git 配置
│── components.d.ts         // 自动导入 Vue 组件,提供 TypeScript 类型支持
│── eslint.config.js        // eslint 配置
│── package.json            // 依赖管理，存储项目信息、依赖包、脚本命令等
│── tsconfig.json           // TypeScript 配置文件
│── tsconfig.node.json      // 用于 Node.js 运行的 TypeScript 配置
│── updateSitemap.js        // 项目打包时，根据router生成网站站点地图的脚本文件【网站新增路由需要手动更新本脚本内容】
└── vite.config.ts          // Vite 配置文件，定义构建、插件、代理等前端开发环境的相关配置
```

## 推荐的编译器设置

已在 .vscode 中配置如下自动格式化和默认格式化插件，VSCode打开项目应该会提示安装插件。

如果使用其他编译器，应该也有同类设置和插件。

>强烈推荐VSCode安装下方插件，因为项目配置了 Prettier 和 ESLint ，所以请在[VSCode中设置工作区默认格式化工具和自动格式化](https://cloud.tencent.com.cn/developer/information/%E5%A6%82%E4%BD%95%E5%9C%A8vscode%E4%B8%AD%E4%BF%AE%E6%94%B9%E8%87%AA%E5%8A%A8%E6%A0%BC%E5%BC%8F%E5%8C%96%E8%A7%84%E5%88%99%EF%BC%9F)以防冲突
>
>[VSCode插件-Prettier（可配置自动格式化）](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
>
>[VSCode插件-ESLint（可配置自动检查、错误提醒和修复建议）](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
>

## Git 提交规范

项目已配置引导式提交工具，执行`commit`脚本,例如`npm run commit`，即可触发，大致步骤如下。

一、引导式提交

**需要全局安装`pnpm add -g commitizen`**

1、代码格式化和检查：

每次执行时会先将被修改的代码添加到暂存区，然后进行代码检查。如果检查出错，注意看报错信息，会提醒是否可自动修复。

如果可以**自动修复就使用`lint:diff`脚本**将文件添加到暂存区再自动修复，这仅会修复本次修改的代码(如果你使用`lint:fix`脚本会检查并修改整个项目的代码)，如果无法自动修复则前往错误文件手动修改(`Ctrl键+鼠标左键`可以快速跳转)。

代码检查通过之后才会进行引导式提交。

2、开始引导式提交：

在引导式提交中，会依次要求选择类型( type )、范围( scope )、主题( subject )和其他信息，依照提醒一步步完成即可（具体格式要求可阅下方自行提交第3步）。

3、commit 信息格式校验：

commit 信息输入完成之后会触发格式检查，检查无误才会将代码提交到本地仓库。（**如果试错多次仍无法过校验，有可能是配置问题**）

4、将本地仓库代码提交到远程仓库
【可选】配置用户名和邮箱，以便提交代码时能够识别身份：

`git config --global user.name 你的名字`

`git config --global user.email 你的邮箱`

执行命令`git remote -v`查看当前项目关联的远程仓库，如果你没有关联仓库，执行如下命令可关联本项目的仓库：

``` bash
git remote add origin https://github.com/ADarkDream/myVue.git
# and
git remote add Gitee https://gitee.com/MuXi-Dream/myVue.git
```

执行脚本`push`或命令`git push Gitee && git push origin`可将本地仓库代码提交到所有相关联的远程仓库

或`git push Gitee master` or `git push origin master`可分别推送到两个仓库

二、自行提交

如果不需要引导式提交，可执行命令`git add . && npm exec lint-staged && git commit`进行提交，命令说明如下：

1、`git add  .`：先将被修改的代码添加到暂存区；

2、`npm exec lint-staged`：引导式提交中的第1步，代码格式化和检查；

3、`git commit`：原版提交方式；

提交信息详细规则在`commitlint.config.cjs`中可以查看，大致格式如`{type}({scope,scope}): {subject}`。

**其中 type 和 subject 为必填项，scope 可不填，也可填多个，用英文逗号分隔，仅支持中文、英文小写、数字和下划线。冒号后需要加空格**。

4、引导式提交中的第3步和第4步

>如果你对这个工作流程感兴趣，欢迎阅读文章：[代码审查和 git commit 引导、校验工作流](https://mp.weixin.qq.com/s/ta7lt3-BZvkLyjyLW934BA)
