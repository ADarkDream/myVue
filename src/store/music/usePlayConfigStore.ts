// 引入defineStore用于创建store
import { defineStore } from "pinia"
import { ref } from "vue"

// 定义并暴露一个store
export const usePlayConfigStore = defineStore(
  "play_config",
  () => {
    //当前播放模式的序号
    const modeIndex = ref(0)

    return {
      modeIndex,
    }
  },
  {
    persist: true,
  }
)
