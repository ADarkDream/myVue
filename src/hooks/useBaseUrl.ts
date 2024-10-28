// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import axios from "axios";


// 定义并暴露一个store
export const useBaseUrl = defineStore('baseUrl', () => {
    //配置axios基地址，根据本环境配置的DEV参数判断是生产环境还是开发环境
    const isLocal = import.meta.env.DEV === true
    axios.defaults.baseURL = isLocal ? 'http://127.0.0.1:9000' : 'https://muxidream.cn/api/'
    //聊天服务器基地址
    const chatBaseUrl = isLocal ? 'http://127.0.0.1:9999/' : 'https://muxidream.cn/'

    //七牛云存储基地址
    const qiniuHttpUrl = 'http://qiniufree.muxidream.cn'
    const qiniuHttpsUrl = 'https://qiniu.muxidream.cn'  //HTTPS收费，需要去七牛云控制台开启，域名控制台开启解析
    //根据本地环境自动更换七牛url前缀
    const defaultUrl = isLocal ? qiniuHttpUrl : qiniuHttpsUrl
    return { isLocal, chatBaseUrl, qiniuHttpUrl, qiniuHttpsUrl, defaultUrl }
})
