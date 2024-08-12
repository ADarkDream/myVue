import {defineStore} from 'pinia'
import {onMounted, reactive, ref} from 'vue'
import {io} from "socket.io-client";
import {useBaseUrlStore} from '@/store/useBaseUrlStore'
import {ElMessage} from "element-plus";

const baseUrl = useBaseUrlStore()

// 定义并暴露一个store
export const useChatInfoStore = defineStore('chatInfo', () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    const data = JSON.parse(localStorage.getItem('chatInfo') || '{}')
    const playerID = ref(data.playerID || '')
    const playerName = ref(data.playerName || '')
    const roomID = ref(data.roomID || '')
    const roomName = ref(data.roomName || '')
    const playerInfo = reactive({
        playerID: playerID.value,
        playerName: playerName.value,
        roomID: roomID.value,
        roomName: roomName.value
    })

    const setPID = (value) => playerID.value = value
    const setPName = (value) => playerName.value = value
    const setRID = (value) => roomID.value = value
    const setRName = (value) => roomName.value = value

    const socket = io(//socket放在pinia中可全局共享，不会创建多余的连接
        baseUrl.chatBaseUrl,//连接的后端主地址
        {
            auth: playerInfo,
            path: '/chatting/',//设置后端socket服务器的接口路径(访问网站主地址/chatting/)
            transports: ["websocket"]
            //默认是"polling"轮询模式，
        },
    )
    // 使用中间件更新 auth 数据
    // socket.io.on('open', () => {
    //     socket.auth = playerInfo    //每次和服务器交流都会传递playerInfo
    // })
    return {
        socket,
        playerID,
        playerName,
        roomID,
        roomName,
        setPID,
        setPName,
        setRID,
        setRName
    }
}, {
    persist: true//开启持久化并存储到sessionStorage中
})
