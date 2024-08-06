// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import axios from "axios";


// 定义并暴露一个store
export const useTestStore = defineStore('test', () => {
        const playerInfo = reactive({
            playerID: '',
            playerName: '',
            roomID: '',
            roomName: '',
            // token
        })
        const testArr1 = reactive([])
        const testArr2 = reactive([])
        const testArr3 = reactive([])

        return {playerInfo, testArr1, testArr2, testArr3}
    }, //{persist: true}
    {
        persist: {
            enabled: true,
            strategies: [
                {
                    key: 'test', // 自定义 key
                    storage: localStorage, // 或者 sessionStorage
                },
            ],
        }
    }
)
