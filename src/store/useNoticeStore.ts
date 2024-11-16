// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { Notice } from '@/types/global'

// 定义并暴露一个store
export const useNoticeStore = defineStore('notice', () => {
    /**
     * 已更新的公告
     */
    const updateNotes = reactive<Notice[]>([])
    /**
     * 未更新的公告
     */
    const noUpdated = reactive<Notice[]>([])
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

    return { updateNotes, noUpdated, feedback, clearFeedback }
}, {
    persist: {
        pick: ['updateNotes', 'noUpdated'],
        storage: sessionStorage
    }
}
)
