// 引入defineStore用于创建store
import { defineStore } from "pinia"
import { ref, reactive } from "vue"
import { Notice } from "@/types/global"

/**公告区store*/
export const useNoticeStore = defineStore(
  "notice",
  () => {
    /**
     * 已更新的公告
     */
    const updateNotes = ref<Notice[]>([])
    /**
     * 未更新的公告
     */
    const noUpdated = ref<Notice[]>([])
    /**
     * 1999已完成功能的公告
     */
    const completed = ref<Notice[]>([])
    /**
     * 1999未完成功能的公告
     **/
    const unCompleted = ref<Notice[]>([])
    /**
     * 1999其他的公告（小费fee）
     **/
    const others = ref<Notice[]>([])

    /**
     * 反馈信息
     */
    const feedback = reactive({
      contact: "",
      content: "",
    })

    /**定时器，公告区底部流动信息*/
    const timer = ref<ReturnType<typeof setTimeout>>()
    /**当前展示的文本序号*/
    const activeItemNum = ref(0)
    /**当前有几个页面在展示公告区底部流动信息**/
    const activePageNum = ref(0)

    /**开启Approve流动信息定时器*/
    const startInterval = (length: number) => {
      activePageNum.value++
      if (timer.value) return
      console.warn("开启Approve流动信息定时器")
      timer.value = setInterval(() => {
        activeItemNum.value++
        if (activeItemNum.value >= length) activeItemNum.value = 0
        console.log("Approve当前显示的消息序号：", activeItemNum.value)
      }, 4000)
    }

    /**关闭Approve流动信息定时器*/
    const stopInterval = () => {
      activePageNum.value--
      //最后一个页面离开时才关闭定时器
      if (timer.value && activePageNum.value <= 0) {
        console.warn("关闭Approve流动信息定时器")
        clearInterval(timer.value)
        timer.value = undefined
      }
    }

    /**
     * 清空反馈信息
     */
    const clearFeedback = () => {
      feedback.contact = ""
      feedback.content = ""
    }

    return {
      updateNotes,
      noUpdated,
      completed,
      unCompleted,
      others,
      feedback,
      activeItemNum,
      startInterval,
      stopInterval,
      clearFeedback,
    }
  },
  {
    persist: {
      pick: ["updateNotes", "noUpdated", "completed", "unCompleted", "others"],
      storage: sessionStorage,
    },
  }
)
