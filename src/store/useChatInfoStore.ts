import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import {io} from "socket.io-client";
import {useBaseUrlStore} from '@/store/useBaseUrlStore'
const baseUrl = useBaseUrlStore()

// 定义并暴露一个store
export const useChatInfoStore = defineStore('chatInfo', () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')

    const playerInfo = reactive({
        playerID: '',
        playerName: '',
        roomID: '',
        roomName: '',
        // token
    })
    const playerID = ref('')
    const playerName = ref('')
    const roomID = ref('')
    const roomName = ref('')
    const roomMessage = reactive([])
    const socket = io(//socket放在pinia中可全局共享，不会创建多余的连接
        baseUrl.chatBaseUrl,//连接的后端主地址
        {
            auth: playerInfo,//每次和服务器交流都会传递playerInfo
            path:'/chatting/',//设置后端socket服务器的接口路径(访问网站主地址/chatting/)
            transports: ["websocket"]
            //默认是"polling"轮询模式，
        },
    )

    return {
        socket,
        playerInfo,
    }
}, {
    persist: {
        storage: localStorage,//开启持久化并存储到sessionStorage中
    }

})
