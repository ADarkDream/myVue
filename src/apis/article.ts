import { Notice, ResultData } from "@/types/global";
import { ArticleParams, Article } from '@/types/articles';
import axios from "axios";

/**
 * 请求论坛文章列表
 * @param params -公告类型数组
 * @returns 
 */
export const api_getArticleList = async (params: ArticleParams) => {
    const result = await axios<ResultData<{ list: Article[] }>>({ url: '/getArticleList', params })
    // console.log(result)
    const { status, data } = result.data
    if (status === 200) return data!.list
    else return []
}
/**
 * 请求论坛文章列表
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