import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useChatInfoStore } from "@/store/user/chat/useChatInfoStore";
import type { ChatMsg } from '@/types/chat';



// 定义并暴露一个store
export const useChatMsgStore = defineStore('chatMsgInfo', () => {
    const { playerInfo } = useChatInfoStore()//本地用户信息

    const roomMsg = ref<ChatMsg[]>([])

    return {
        roomMsg
    }
}, {
    persist: {
        storage: sessionStorage,
    }

})
