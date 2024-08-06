// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import axios from "axios";


// 定义并暴露一个store
export const useBaseUrlStore = defineStore('baseUrl', () => {
    //配置axios基地址，根据本环境配置的DEV参数判断是生产环境还是开发环境
    axios.defaults.baseURL = import.meta.env.DEV === true ? 'http://127.0.0.1:9000' : 'https://muxidream.cn/api/'
    //聊天服务器基地址
    const chatBaseUrl =  import.meta.env.DEV === true ? 'http://192.168.1.154:9999' :'https://muxidream.cn/chatting/'

    //七牛云存储基地址
    const qiniuBaseUrl = 'http://qiniufree.muxidream.cn'
    // const qiniuBaseUrl='https://qiniu.muxidream.cn'  //HTTPS收费，需要去七牛云控制台开启，域名控制台开启解析

    return {chatBaseUrl, qiniuBaseUrl}
})
