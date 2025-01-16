// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive, ref } from "vue";


// 定义并暴露一个store
export const useMainPanelConfigStore = defineStore('main_panel_config', () => {
    //页面背景配置
    const bgSettings = reactive({
        '--main-panel-bg-color': '#DDE6E8',
        '--main-panel-bg-opacity': 0.7, /*背景透明度*/
        '--main-panel-bg-filter': 3, /*背景模糊度*/
        '--main-panel-bg-saturate': 1, /*背景饱和度*/
    })

    //当前面板序号
    const activePanelIndex = ref(1)

    //切换面板
    const changePanelIndex = (index: number) => {
        activePanelIndex.value = index
    }

    return { bgSettings, activePanelIndex, changePanelIndex }
}, {
    persist: [{
        pick: ['bgSettings'],
        storage: localStorage
    },
    {
        pick: ['activePanelIndex'],
        storage: sessionStorage
    }]
})
