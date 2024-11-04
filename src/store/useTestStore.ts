// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'


// 定义并暴露一个store
export const useTestStore = defineStore('test', () => {
    const playerInfo = reactive({
        playerID: '',
        playerName: '',
        roomID: '',
        roomName: '',
        // token
    })
    const testArr1 = reactive([1])
    const testArr2 = reactive([2])
    const testArr3 = reactive([3])

    return { playerInfo, testArr1, testArr2, testArr3 }
}, { persist: true }
)
