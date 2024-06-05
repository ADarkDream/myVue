<template>
  <el-container>
    <!--    顶部一排菜单栏，保持不变-->
    <el-header class="shade">
      <TitleDiv/>
    </el-header>

    <!-- 主要呈现部分(Home / Forum)-->
    <el-main class="mainContent">
      <router-view/>
    </el-main>


  </el-container>
  <div class="footer">
    <!--  <el-card class="footer" shadow="none">-->
    <!--      <el-button link type="success">本网站暂时用作毕业设计</el-button>-->
    <!--    备案信息-->
    <div>
      <el-space spacer="|">
        <el-button link tag="a" type="info"
                   @click="copyText('50011502001039','https://beian.mps.gov.cn/#/query/webSearch?code=50011502001039')">
          <img src="https://beian.mps.gov.cn/favicon.ico" style="width: 20px" alt="图片加载失败">
          &ensp;渝公网安备50011502001039
        </el-button>

        <el-button link tag="a" type="info" @click="copyText('渝ICP备2024030473号','http://beian.miit.gov.cn/')">
          渝ICP备2024030473号
        </el-button>
      </el-space>
    </div>
    <!--    </el-card>-->
  </div>
</template>

<script setup lang="ts">
// axios 公共配置,请求拦截器和响应拦截器
import axios from "axios";
import TitleDiv from "@/components/TitleDiv.vue";
import {ElMessage} from "element-plus";
import {jwtDecode} from "jwt-decode";


function copyText(text: string, url: string) {
  navigator.clipboard.writeText(text).then(
      () => {
        ElMessage.success('备案号已复制到剪贴板')
        setTimeout(() => {
          window.open(url)
        }, 1500)
      },
      () => {
        alert('备案号复制失败,请自行复制')
        setTimeout(() => {
          window.open(url)
        }, 1500)
      }
  )
}


interface Token {
  value: {
    isAdmin?: string
  }
}


// 本地服务器基地址,根据本环境配置的DEV参数判断是生产环境还是开发环境
axios.defaults.baseURL = import.meta.env.DEV === true ? 'http://127.0.0.1:9000' : 'https://muxidream.cn/api/'

//云服务器基地址
// axios.defaults.baseURL = 'https://muxidream.cn/api/'
// 添加请求拦截器,如果axios没设置基地址则执行以下方法
axios.interceptors.request.use(function (config) {
  // console.log('当前服务器基地址是：'+axios.defaults.baseURL)
  // 在发送请求之前做些什么
  // 统一携带 token 令牌字符串在请求头上
  let token = sessionStorage.getItem('token') || localStorage.getItem('token')
  token && (config.headers.Authorization = `Bearer ${token}`)
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器标志位，判断同一时间是否有多个相同错误，默认为false
let isErrorPrinted = false;

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么，例如：直接返回服务器的响应结果对象

  // console.log('App组件打印的response数据如下：')
  // console.log(response)

  //从响应头里面获取最新token
  if (response.headers.authorization !== undefined) {
    const newToken = response.headers.authorization
    if (newToken !== undefined) {
      const token = jwtDecode(newToken) as Token
      console.log('isAdmin', token)
      if (token.value.isAdmin !== undefined && token.value.isAdmin === '1') sessionStorage.setItem('token', newToken)
      else localStorage.setItem('token', newToken)
    }
  }


  const result = response.data.data
  if (result.status === 200) return response.data
      // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么，例如：统一对 401 身份验证失败情况做出处理
  else if (result.status > 299 && result.status < 400) {
    ElMessage.info(result.msg)
    return response.data
  } else if (result.status === 400 && isErrorPrinted === false) {
    //更改标志，使下一个相同的报错不显示提醒
    isErrorPrinted = true
    setTimeout(() => {
      isErrorPrinted = false
    }, 2000)
    ElMessage.error(result.msg)
    Promise.reject(result)
  } else if (result.status === 401 || result.status === 402) {//token过期或者未登录
    localStorage.removeItem('token')
    sessionStorage.clear()
    alert(result.msg)
    location.href = '/'
  }
  return Promise.reject(result);//抛出返回的其他错误信息
}, function (error) {
  // 对响应错误做点什么
  console.dir(error)
  if (error.code === 'ERR_NETWORK' && isErrorPrinted === false) {
    //更改标志，使下一个相同的报错不显示提醒
    isErrorPrinted = true
    setTimeout(() => {
      isErrorPrinted = false
    }, 2000)
    ElMessage.error('抱歉，暂时无法连接服务器。')
  }

  return Promise.reject(error)
});

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
  height: 50px;

  z-index: 1000;
}

.footer {
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0;
  flex-direction: column;
  height: 50px;
}

@media (min-width: 981px) {
  .footer {
    background-color: transparent;
    border: transparent;
    height: 25px;
  }
}

@media (max-width: 980px) {
  .shade {
    padding: 0;
    position: fixed;
    width: 100%;
  }

  .footer {
    position: fixed;
    height: 25px;
  }
}


</style>