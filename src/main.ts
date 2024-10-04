import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router";
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn' //elementPlus国际化
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'wc-flow-layout'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'element-plus/theme-chalk/base.css'
//自定义的el组件样式
import '@/assets/custom_el.css'
/* 引入createPinia，用于创建pinia */
// import {createPinia} from 'pinia'
import pinia from '@/store'

// import {emitter} from "@/utils/emitter";

import hljsVuePlugin from "@highlightjs/vue-plugin";
import 'highlight.js/lib/common';//直接加载常用代码语言

import "highlight.js/styles/github-dark.css";// 选择你喜欢的主题样式
// import highlightDirective from './utils/highlightDirective';//引入highlightDirective.ts

import "./types/global.d.ts"//自定义的全局类型声明文件

// 判断是否是PC端
let isPC = true
const checkIsPC = () => {
  const userAgentInfo = navigator.userAgent
  const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']

  for (let i = 0; i < agents.length; i++) {
    if (userAgentInfo.includes(agents[i])) {
      isPC = false
      break
    }
  }
}

// 调用函数判断设备类型
checkIsPC()

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

/* 创建pinia */
// const pinia = createPinia()


app.use(router)

app.use(ElementPlus, {
  locale: zhCn,
    size:isPC?'default':'small'
})
app.use(hljsVuePlugin)//代码高亮，标签
app.use(pinia)
// app.directive('highlight', highlightDirective);//挂载
// app.use(vuePlugin)
app.mount('#app')

