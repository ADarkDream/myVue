import { ResultData } from "@/types/global";
import axios from "axios";

/**
 * 请求重定向链接
 * @param sort -公告类型数组
 * @returns 
 */
export async function api_getRedirectUrl(url: string) {
    const result = await axios<ResultData<{ redirectUrl: string }>>({
        url: '/getRedirectUrl',
        params: { url }
    })
    console.log('/getRedirectUrl返回的数据为：', result.data)
    return result.data
}