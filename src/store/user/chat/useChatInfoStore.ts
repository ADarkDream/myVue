import { defineStore } from 'pinia'
import { computed, reactive, ref, toRefs } from 'vue'
import { io } from "socket.io-client";
import { useUserInfoStore } from '@/store/user/useUserInfoStore';
import { useBaseUrl } from '@/hooks/useBaseUrl'
import type { PlayerInfo } from '@/types/chat';


const baseUrl = useBaseUrl()

// 定义并暴露一个store
export const useChatInfoStore = defineStore('chatInfo', () => {
    // const userInfoStore = useUserInfoStore()
    // const { token } = toRefs(userInfoStore)


    const playerInfo = reactive<PlayerInfo>({
        playerID: '',
        playerName: '',
        roomID: '',
        roomName: '',
    })


    const playerID = computed(() => playerInfo.playerID) //ref(data.playerID || '')
    const playerName = computed(() => playerInfo.playerName)
    const roomID = computed(() => playerInfo.roomID)
    const roomName = computed(() => playerInfo.roomName)


    const setPID = (playerID: string) => playerInfo.playerID = playerID
    const setPName = (playerName: string) => playerInfo.playerName = playerName
    const setRID = (roomID: string) => playerInfo.roomID = roomID
    const setRName = (roomName: string) => playerInfo.roomName = roomName
    const setPlayerInfo = (newPlayerInfo: PlayerInfo) => {
        const keys = Object.keys(newPlayerInfo)
        keys.forEach(key => {
            if (key in playerInfo)
                playerInfo[key] = newPlayerInfo[key]
        })
        console.log('playerInfo', playerInfo);

    }


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
    // socket.value.io.on('open', () => {
    //     socket.value.auth = playerInfo    //每次和服务器交流都会传递playerInfo
    // })
    return {
        socket,
        playerID,
        playerName,
        roomID,
        roomName,
        playerInfo,
        setPID,
        setPName,
        setRID,
        setRName,
        setPlayerInfo
    }
}, {
    persist: true
})
