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
/* 引入createPinia，用于创建pinia */
import {createPinia} from 'pinia'
// import emitter from "@/utils/emitter";

import 'highlight.js/lib/common';//直接加载常用代码语言
import hljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/github.css";// 选择你喜欢的主题样式
// import highlightDirective from './utils/highlightDirective';//引入highlightDirective.ts

/* 创建pinia */
const pinia = createPinia()

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia)
app.use(router)

app.use(ElementPlus)
app.use(hljsVuePlugin)//代码高亮，标签

// app.directive('highlight', highlightDirective);//挂载
// app.use(vuePlugin)
app.mount('#app')

