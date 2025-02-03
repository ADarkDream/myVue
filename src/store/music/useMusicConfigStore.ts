// 引入defineStore用于创建store
import { defineStore } from "pinia"
import { ref } from "vue"

// 定义并暴露一个store
export const useMusicConfigStore = defineStore(
  "music_config",
  () => {
    //播放设置
    const is_show_player_before_play = ref(true)

    return { is_show_player_before_play }
  },
  {
    persist: [
      {
        pick: ["is_show_player_before_play"],
        storage: localStorage,
      },
    ],
  }
)
