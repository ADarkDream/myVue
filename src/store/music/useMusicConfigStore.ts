// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive, ref } from "vue";


// 定义并暴露一个store
export const useMusicConfigStore = defineStore('music_config', () => {
    //页面背景配置
    const bgSettings = reactive({
        '--music-bg-color': '#ffffff',
        '--music-bg-opacity': 0.6, /*背景透明度*/
        '--music-bg-filter': 3, /*背景模糊度*/
        '--music-bg-saturate': 1, /*背景饱和度*/
    })

    //当前面板序号
    const activePanelIndex = ref(1)

    //切换面板
    const changePanelIndex = (index: number) => {
        activePanelIndex.value = index
    }

    return { bgSettings, activePanelIndex, changePanelIndex }
}, {
    persist: [
        {
            paths: ['bgSettings'],
            storage: localStorage
        },
        {
            paths: ['activePanelIndex'],
            storage: sessionStorage
        }]
})
