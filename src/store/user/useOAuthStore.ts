import { defineStore } from "pinia"
import { computed, ref, toRefs } from "vue"

// 定义并暴露一个store
export const useOAuthStore = defineStore("oauth", () => {
  /**定时器*/
  const timer = ref<NodeJS.Timeout>()
  const listener = ref()

  // 向外暴露
  return {
    timer,
    listener,
  }
})
