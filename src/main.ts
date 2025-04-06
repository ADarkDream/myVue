import { createApp } from "vue"
import App from "./App.vue"
import router from "@/router"
//全局导入ElementPlus及其样式
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
//全局导入ElementPlus的图标
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//按需导入
import "element-plus/theme-chalk/base.css"
//导入夜间主题
import "element-plus/theme-chalk/dark/css-vars.css"
import "wc-flow-layout"
import pinia from "@/store"
//  注册自定义图标组件
import "virtual:svg-icons-register"

/*调色盘*/
import VSwatches from "vue3-swatches"
import "vue3-swatches/dist/style.css"

//代码高亮
import hljsVuePlugin from "@highlightjs/vue-plugin"
import "highlight.js/lib/common" //直接加载常用代码语言
import "highlight.js/styles/github-dark.css" // 选择你喜欢的主题样式
// import highlightDirective from './utils/highlightDirective';//引入highlightDirective.ts
//自定义的el组件样式
import "@/assets/css/custom_el.css"
// 自定义动画样式
import "@/assets/css/animation.css"
//自定义主题样式
import "@/assets/css/main.css"
import { MotionPlugin } from "@vueuse/motion"
import myCustomMotion from "@/utils/customMotion"
// import '@/assets/css/base.css'

const app = createApp(App)
//全局导入ElementPlus的图标
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }
// app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.use(VSwatches) //调色盘
app.use(hljsVuePlugin) //代码高亮，标签
/**
 * @vueuse/motion动画库，后面可改为局部安装
 * https://motion.vueuse.org/getting-started/introduction#global-installation
 */
app.use(MotionPlugin, myCustomMotion)
app.mount("#app")

//全局初始化
// document.addEventListener('DOMContentLoaded', () => {
//     //微博JS SDK初始化
//     console.log(12345, new Date().getTime());
//     console.log(wb);
//     wb.init({
//         debug: false,
//         appkey: '1271732898',
//         timestamp: new Date(),//生成签名的时间戳
//         noncestr: 'momo',//生成签名的随机串
//         signature: 'momo',//签名
//         scope: [//需要使用的JS接口列表
//             'getNetworkType',
//             // 'setBrowserTitle',
//             // 'setSharingContent',
//             // 'openMenu',
//             // 'scanQRCode',
//             // 'pickContact'
//         ]
//     });
//     wb.ready(() => {
//         console.warn("## init success");
//     });
//     wb.error((res) => {
//         console.error("## init error: " + res);
//     });
// })
