import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import {useChatInfoStore} from "@/store/useChatInfoStore";
import {ChatMsg} from '@/types/chat';

const {playerInfo} = useChatInfoStore()//本地用户信息

// 定义并暴露一个store
export const useChatMsgStore = defineStore('chatMsgInfo', () => {
    const roomMsg = reactive<ChatMsg[]>(JSON.parse(localStorage.getItem('chatMsgInfo'))?.roomMsg || [])

    return {
        roomMsg
    }
}, {
    // persist: {
    //     storage: localStorage,//开启持久化并存储到sessionStorage中
    // }

    persist: {
        enabled: true,
        strategies: [
            {
                storage: sessionStorage, // 或者 sessionStorage
            },
        ],
    }

})
