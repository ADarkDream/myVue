import { defineStore } from "pinia"
import { computed, ref, toRefs } from "vue"

// 定义并暴露一个store
export const useOAuthStore = defineStore("oauth", () => {
  /**登录窗口的Ref*/
  const oauth_window = ref()
  /**定时器*/
  const timer = ref<NodeJS.Timeout>()
  const listener = ref()

  // 向外暴露
  return {
    oauth_window,
    timer,
    listener,
  }
})
