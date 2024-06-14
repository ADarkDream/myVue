import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'wc-flow-layout'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'element-plus/theme-chalk/base.css'
/* 引入createPinia，用于创建pinia */
import { createPinia } from 'pinia'
// import emitter from "@/utils/emitter";


/* 创建pinia */
const pinia = createPinia()
const app=createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)

app.use(ElementPlus)


// app.use(vuePlugin)
app.mount('#app')

