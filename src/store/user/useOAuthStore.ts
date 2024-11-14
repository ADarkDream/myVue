import { defineStore } from 'pinia'
import { computed, ref, toRefs } from "vue";



// 定义并暴露一个store
export const useOAuthStore = defineStore('oauth', () => {
    const oauth_window = ref()
    const timer = ref<NodeJS.Timeout>()
    const listener = ref()

    // 向外暴露
    return {
        oauth_window, timer, listener
    }
})
