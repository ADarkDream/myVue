// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { Notice } from '@/types/global'

// 定义并暴露一个store
export const useNoticeStore = defineStore('notice', () => {
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
        contact: '',
        content: ''
    })




    /**
     * 清空反馈信息
     */
    const clearFeedback = () => {
        feedback.contact = ''
        feedback.content = ''
    }

    return { updateNotes, noUpdated, completed, unCompleted, others, feedback, clearFeedback }
}, {
    persist: {
        pick: ['updateNotes', 'noUpdated', 'completed', 'unCompleted', 'others'],
        storage: sessionStorage
    }
}
)
