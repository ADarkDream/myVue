<template>
  <el-container>
    <!--    顶部导航栏-->
    <el-header class="shade">
      <TitleDiv/>
    </el-header>
    <!-- 主要呈现部分(Home / Forum)-->
    <el-main class="main">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref} from "vue"
import TitleDiv from "@/components/TitleDiv.vue";
import {ElMessage} from "element-plus";
import {jwtDecode} from "jwt-decode";
import useResponsive from "@/hooks/useResponsive";
import {useRoute} from "vue-router";


const {isPC} = useResponsive()

const route = useRoute()

// console.log(route.path==='/')
interface Token {
  value: {
    isAdmin?: string
  }
}

// axios 公共配置,请求拦截器和响应拦截器

//云服务器基地址
// axios.defaults.baseURL = 'https://muxidream.cn/api/'


// 添加请求拦截器，在发送请求之前做些什么
axios.interceptors.request.use(function (config) {
  // console.log('当前服务器基地址是：'+axios.defaults.baseURL)
  // 统一携带 token 令牌字符串在请求头上
  let token = sessionStorage.getItem('token') || localStorage.getItem('token')
  token && (config.headers.Authorization = `Bearer ${token}`)
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器标志位，判断同一时间是否有多个相同错误，默认为false
const isErrorPrinted = ref(false)

// 添加响应拦截器，对响应数据做点什么
axios.interceptors.response.use(    (response)=>{
  // 2xx 范围内的状态码都会触发该函数。

  // console.log('App组件打印的response数据如下：')
  // console.log(response)

  //从响应头里面获取最新token
  if (response.headers.authorization !== undefined) {
    const newToken = response.headers.authorization
    if (!!newToken) {
      const token = jwtDecode(newToken) as Token
      console.log('token', token)
      if (token.value.isAdmin === '1') sessionStorage.setItem('token', newToken)
      else localStorage.setItem('token', newToken)
    }
  }


  const result= response.data.data

  if (result.status === 200) return response.data
      // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么，例如：统一对 401 身份验证失败情况做出处理
  else if (result.status > 299 && result.status < 400) {
    ElMessage.info(result.msg)
    return response.data
  } else if (result.status === 400) {
    if (!isErrorPrinted.value) {
      ElMessage.error(result.msg)
      //更改标志，使下一个相同的报错不显示提醒
      isErrorPrinted.value = true
      setTimeout(() => isErrorPrinted.value = false, 1000)
      Promise.reject(result)
    }
  } else if (result.status === 401 || result.status === 402) {//token过期或者未登录
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

</script>

<style scoped>

aside {
  margin-top: 50px;
}

.shade {
  /*会导致登录窗口被裁减
   backdrop-filter: blur(30px);
 */
  padding: 0;
  height: 40px;
  z-index: 100;
}


@media (min-width: 981px) {
  .main {
    padding-top: 0
  }
}

@media (max-width: 980px) {
  .main {
    padding: 40px 0 0 0;
    overflow-x: hidden;
  }

  .shade {
    padding: 0;
    position: fixed;
    width: 100%;

  }
}


</style>
