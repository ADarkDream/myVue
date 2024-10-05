import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'wc-flow-layout'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/base.css'
import pinia from '@/store'
//自定义的el组件样式
import '@/assets/custom_el.css'
// 自定义动画样式
import '@/assets/animation.css'


import hljsVuePlugin from "@highlightjs/vue-plugin";
import 'highlight.js/lib/common';//直接加载常用代码语言
import "highlight.js/styles/github-dark.css";// 选择你喜欢的主题样式
// import highlightDirective from './utils/highlightDirective';//引入highlightDirective.ts

import "./types/global.d.ts"//自定义的全局类型声明文件



const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.use(hljsVuePlugin)//代码高亮，标签
app.use(pinia)
app.mount('#app')

