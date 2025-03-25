import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { ref } from "vue"
import { ElMessage } from "element-plus" // 确保已安装 element-plus
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { ResultData } from "@/types/global"

// 统一封装 axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
})

//#region 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const userInfoStore = useUserInfoStore()
    if (userInfoStore.token) {
      config.headers.Authorization = `Bearer ${userInfoStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
//#endregion

//region 响应拦截器

// 响应拦截器标志位，避免重复弹出错误
const isErrorPrinted = ref(false)

apiClient.interceptors.response.use(
  (response) => {
    // 提取 token 并更新
    if (response.headers.authorization) {
      const userInfoStore = useUserInfoStore()
      userInfoStore.setTokenByType(response.headers.authorization)
    }
    // console.log("响应拦截器response", response)
    const baseURL = response.config.baseURL
    const result = response.data

    // 处理第三方 API 返回
    if (baseURL?.includes("hitokoto")) {
      return result.code === 200 ? response : Promise.reject(response)
    }

    // 处理后端 API 统一返回格式
    const { code, msg } = result

    if (code >= 200 && code < 300) return response
    if (code > 299 && code < 400) {
      ElMessage.info(msg)
      return response
    }
    if (code === 400) {
      if (!isErrorPrinted.value) {
        ElMessage.error(msg)
        isErrorPrinted.value = true
        setTimeout(() => (isErrorPrinted.value = false), 1000)
      }
      return Promise.reject(response)
    }
    if (code === 401 || code === 402) {
      // 处理未登录或 token 过期
      const userInfoStore = useUserInfoStore()
      userInfoStore.loginOut()
      // localStorage.removeItem('token');
      // sessionStorage.clear();
      alert(result.msg)
      location.href = "/" //"/login" // 跳转登录页
      console.log("没有登录页，跳转到首页")
    }

    return Promise.reject(response)
  },
  (error) => {
    if (error.code === "ERR_NETWORK" && !isErrorPrinted.value) {
      ElMessage.error("抱歉，暂时无法连接服务器。")
      isErrorPrinted.value = true
      setTimeout(() => (isErrorPrinted.value = false), 1000)
    }
    return Promise.reject(error)
  }
)

//#endregion

//#region 封装axios请求函数

// 处理 AxiosResponse，提取 ResultData
const transformResponse = <T>(response: AxiosResponse<ResultData<T>>): ResultData<T> => response.data

// 封装请求方法
const request = async <T = any>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  const response = await apiClient({
    method,
    url,
    data,
    params: method === "get" || method === "delete" ? data : undefined, // get 和 delete 请求需要使用 params
    ...config,
  })
  const result = transformResponse<T>(response)
  console.log("返回的数据", result)
  return result
}

// 通过封装简化各请求方法
const momo = {
  get: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>("get", url, data, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>("post", url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>("put", url, data, config),
  delete: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>("delete", url, data, config),
}
//#endregion

export default momo
