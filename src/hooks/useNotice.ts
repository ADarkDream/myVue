import { ElMessage } from 'element-plus'

//stores
import { useNoticeStore } from '@/store/useNoticeStore'
//hooks
import useTimeStamp from "@/hooks/useTimestamp";
//apis
import { api_getNotice, api_submitFeedBack } from '@/apis/notice'
//types
import { Notice } from "@/types/global";

export default function () {
    const noticeStore = useNoticeStore()
    const { updateNotes, noUpdated, completed, unCompleted, others, feedback } = toRefs(noticeStore)
    const { clearFeedback } = noticeStore
    const { getDiffTime } = useTimeStamp()

    //获取已发布公告
    const getNotices = async (types: string[]) => {
        try {
            const temp_types = new Set(types)
            let temp_updateNotes: Notice[] = []
            let temp_noUpdated: Notice[] = []
            let temp_completed: Notice[] = []
            let temp_unCompleted: Notice[] = []
            let temp_others: Notice[] = []

            //清除本地已有的请求
            types.forEach((type: string) => {
                console.log("本地已有公告类型：", type);

                if (type === 'updateNotes' && updateNotes.value.length !== 0) {
                    // temp_updateNotes = updateNotes.value
                    temp_types.delete(type)
                }
                else if (type === 'noUpdated' && noUpdated.value.length !== 0) {
                    // temp_noUpdated = noUpdated.value
                    temp_types.delete(type)
                }
                else if (type === 'completed' && completed.value.length !== 0) {
                    // temp_completed = completed.value
                    temp_types.delete(type)
                }
                else if (type === 'unCompleted' && unCompleted.value.length !== 0) {
                    // temp_unCompleted = unCompleted.value
                    temp_types.delete(type)
                }
                else if (type === 'others' && others.value.length !== 0) {
                    // temp_others = others.value
                    temp_types.delete(type)
                }
            })
            if (temp_types.size === 0) return

            const rest_types = [...temp_types]
            const { data } = await api_getNotice(rest_types)
            const { noticeList } = data!

            noticeList.forEach((item: Notice) => {
                if (item.created_time === item.updated_time) item.time = '发布时间：' + getDiffTime(item.created_time)
                else item.time = '发布时间：' + getDiffTime(item.created_time) + '  上次修订于：' + getDiffTime(item.updated_time)

                if (item.sort === 'updateNotes') temp_updateNotes.push(item)
                else if (item.sort === 'noUpdated') temp_noUpdated.push(item)
                else if (item.sort === 'completed') temp_completed.push(item)
                else if (item.sort === 'unCompleted') temp_unCompleted.push(item)
                else if (item.sort === 'others') temp_others.push(item)
            })

            rest_types.forEach((type: string) => {
                if (type === 'updateNotes') updateNotes.value = temp_updateNotes
                else if (type === 'noUpdated') noUpdated.value = temp_noUpdated
                else if (type === 'completed') completed.value = temp_completed
                else if (type === 'unCompleted') unCompleted.value = temp_unCompleted
                else if (type === 'others') others.value = temp_others
            })
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }


    //上传反馈内容
    const submitFeedback = async () => {
        if (feedback.value.contact.length > 30) return ElMessage.error('联系方式超出长度限制')
        if (feedback.value.content.length < 5 || feedback.value.content.length > 200) return ElMessage.error('反馈内容应为5-200个字符')
        try {
            const { status, msg } = await api_submitFeedBack(feedback.value)
            if (status == 200) {
                clearFeedback()
                ElMessage.success(msg)
            }
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }

    return { getNotices, submitFeedback }
}
