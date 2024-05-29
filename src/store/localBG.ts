// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {ref} from 'vue'
// 定义并暴露一个store
export default defineStore('localBG', () => {
    const bg = ref<string>()
    return {bg};
}, {
    persist: true,
},)
