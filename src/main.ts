import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
//全局导入ElementPlus及其样式
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
//全局导入ElementPlus的图标
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//按需导入
import 'element-plus/theme-chalk/base.css'
//导入夜间主题
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'wc-flow-layout'

import pinia from '@/store'

/*调色盘*/
import VSwatches from 'vue3-swatches'
import 'vue3-swatches/dist/style.css'

//代码高亮
import hljsVuePlugin from "@highlightjs/vue-plugin";
import 'highlight.js/lib/common';//直接加载常用代码语言
import "highlight.js/styles/github-dark.css";// 选择你喜欢的主题样式
// import highlightDirective from './utils/highlightDirective';//引入highlightDirective.ts
//自定义的el组件样式
import '@/assets/custom_el.css'
// 自定义动画样式
import '@/assets/animation.css'



const app = createApp(App)
//全局导入ElementPlus的图标
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }
// app.use(ElementPlus)
app.use(router)
app.use(VSwatches)//调色盘
app.use(hljsVuePlugin)//代码高亮，标签
app.use(pinia)
app.mount('#app')

