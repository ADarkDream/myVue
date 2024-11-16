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
    const { updateNotes, noUpdated, feedback } = toRefs(noticeStore)
    const { clearFeedback } = noticeStore
    const { getDiffTime } = useTimeStamp()

    //获取已发布公告
    const getNotices = async () => {
        try {
            const { data } = await api_getNotice(['updateNotes', 'noUpdated'])
            const { noticeList } = data!

            const temp_updateNotes: Notice[] = []
            const temp_noUpdated: Notice[] = []
            noticeList.forEach((item: Notice) => {
                if (item.created_time === item.updated_time) item.time = '发布时间：' + getDiffTime(item.created_time)
                else item.time = '发布时间：' + getDiffTime(item.created_time) + '  上次修订于：' + getDiffTime(item.updated_time)

                if (item.sort === 'updateNotes') temp_updateNotes.push(item)
                else if (item.sort === 'noUpdated') temp_noUpdated.push(item)
            })
            updateNotes.value = temp_updateNotes
            noUpdated.value = temp_noUpdated
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
