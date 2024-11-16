import { Notice, ResultData } from "@/types/global";
import axios from "axios";

/**
 * 请求公告
 * @param sort -公告类型数组
 * @returns 
 */
export async function api_getNotice(sort: string[]) {
    const result = await axios<ResultData<{ noticeList: Notice[] }>>({
        url: '/getNotices',
        params: { sort }
    })
    console.log('/返回的数据为：', result.data)
    return result.data
}

/**
 * 发送反馈
 * @param contact -反馈者联系方式(非必填)
 * @param content -反馈内容(必填)
 * @returns 
 */
export async function api_submitFeedBack(data: { contact: string, content: string }) {
    const result = await axios<ResultData<undefined>>({
        url: '/submitFeedback',
        method: 'post',
        data
    })
    console.log('/返回的数据为：', result.data)
    return result.data
} 