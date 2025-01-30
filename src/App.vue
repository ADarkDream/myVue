<template>
  <el-config-provider :locale="locale" :size="isPC ? 'default' : 'small'">
    <el-container class="app">
      <!-- <LoadingMask :show="isLoading" /> -->
      <!--    顶部导航栏-->
      <el-header class="shade" mode="out-in">
        <TitleDiv />
      </el-header>
      <!-- 主要呈现部分(Home / Forum)-->
      <div class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" v-if="Component" class="view-component" view-component />
          </transition>
        </router-view>
      </div>
    </el-container>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";
import zhCn from 'element-plus/es/locale/lang/zh-cn' //elementPlus国际化
import en from 'element-plus/es/locale/lang/en' //elementPlus国际化
//components
import TitleDiv from "@/components/TitleDiv.vue";
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useResponsiveStore } from '@/store/useResponsiveStore';

const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()

const { token } = toRefs(userInfoStore)
const { setTokenByType, checkLocalToken } = userInfoStore
const { screenHeight } = toRefs(responsiveStore)

const router = useRouter();

const isPC = ref(true)

// 判断是否是PC端
window.addEventListener('resize', () => checkIsPC())

function checkIsPC() {
  // console.log('屏幕变化了')
  //获取当前屏幕宽度

  isPC.value = document.body.clientWidth > 980;
  // 调用函数判断设备类型
  const userAgentInfo = navigator.userAgent
  const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  for (let i = 0; i < agents.length; i++) {
    if (userAgentInfo.includes(agents[i])) {
      isPC.value = false
      break
    }
  }
}

checkIsPC()
checkLocalToken()






const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


// axios 公共配置,请求拦截器和响应拦截器

//云服务器基地址
// axios.defaults.baseURL = 'https://muxidream.cn/api/'


// 添加请求拦截器，在发送请求之前做些什么
axios.interceptors.request.use(function (config) {
  // console.log('当前服务器基地址是：'+axios.defaults.baseURL)
  // 统一携带 token 令牌字符串在请求头上
  if (token.value)
    config.headers.Authorization = `Bearer ${token.value}`
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器标志位，判断同一时间是否有多个相同错误，默认为false
const isErrorPrinted = ref(false)

// 添加响应拦截器，对响应数据做点什么
axios.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // console.log('response', response.config.baseURL, response)
  // console.log('App组件打印的response数据如下：')
  // console.log(response)

  //从响应头里面获取最新token
  if (response.headers.authorization !== undefined) {
    const newToken = response.headers.authorization
    setTokenByType(newToken)
  }

  //获取响应的地址
  const baseURL = response.config.baseURL
  //获取响应的接口

  //region第三方接口处理
  // const url = response.config.url
  // console.log('baseURL',response.config.baseURL)
  // console.log('url',response.config.url)
  // if (baseURL && baseURL.includes('jinrishici')) {
  //   const result = response.data.data
  //   if (result.status === 'success') return response.data
  //   else return Promise.reject(result)
  // }
  if (baseURL && baseURL.includes('hitokoto')) {
    const result = response.data
    if (result.status === 200) return result
    else return Promise.reject(result)
  }

  // if (response.data.code) {//music_api返回的
  //   if (response.data.code === 200) {
  //     return response.data
  //   }
  // }
  //endregion



  // 下面是自己的接口
  const result = response.data.data
  const { status, msg } = result
  if (status >= 200 && status < 300) return response.data
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么，例如：统一对 401 身份验证失败情况做出处理
  else if (status > 299 && status < 400) {
    ElMessage.info(msg)
    return response.data
  } else if (status === 400) {
    if (!isErrorPrinted.value) {
      ElMessage.error(msg)
      //更改标志，使下一个相同的报错不显示提醒
      isErrorPrinted.value = true
      setTimeout(() => isErrorPrinted.value = false, 1000)
      return Promise.reject(result)
    }
  } else if (status === 401 || status === 402) {//token过期或者未登录
    //更改标志，使下一个相同的报错不显示提醒
    // isErrorPrinted.value = true
    // setTimeout(() => isErrorPrinted.value = false, 1000)
    localStorage.removeItem('token')
    sessionStorage.clear()
    alert(result.msg)
    // location.href = '/'
  }
  return Promise.reject(result);//抛出返回的其他错误信息
}, function (error) {
  // 对响应错误做点什么
  console.dir(error)
  if (error.code === 'ERR_NETWORK' && isErrorPrinted.value === false) {
    //更改标志，使下一个相同的报错不显示提醒
    if (!isErrorPrinted.value) {
      ElMessage.error('抱歉，暂时无法连接服务器。')
      isErrorPrinted.value = true
      setTimeout(() => isErrorPrinted.value = false, 1000)
    }
  }
  return Promise.reject(error)
})


const isLoading = ref(true); // 控制加载状态

// 首次进入网站时显示加载动画
onMounted(() => {
  isLoading.value = false; // 首次渲染完成后关闭加载动画
});

// 监听路由跳转
// router.beforeEach((to, from, next) => {
//   isLoading.value = true; // 路由开始跳转时显示加载动画
//   console.log('路由跳转');

//   next();
// });

// router.afterEach(() => {
//   console.log('路由跳转完成');

//   // 等待页面渲染完成，延迟关闭加载动画
//   setTimeout(() => {
//     isLoading.value = false;
//   }, 300); // 根据动画时间调整
// });
</script>
<style>
@import "./assets/css/mainPanel.css";
</style>
<style scoped>
.shade {
  /*会导致登录窗口被裁减
   backdrop-filter: blur(40px);
 */
  padding: 0;
  height: 40px;
  z-index: 100;
}

.main {
  position: relative;
  height: calc(100vh - 40px);
}

/* 路由页面 */
.view-component {
  position: absolute;
  /* 确保新旧组件占据相同位置 */
  top: 0;
  left: 0;
}
</style>
