import { Notice } from "@/types/global"
import momo from "@/apis"

/**
 * 请求公告
 * @param sort -公告类型数组
 * @returns
 */
export async function api_getNotice(sort: string[]) {
  const result = await momo.get<{ noticeList: Notice[] }>("/getNotices", {
    sort,
  })
  console.log("/返回的数据为：", result)
  return result
}

/**
 * 发送反馈
 * @param contact -反馈者联系方式(非必填)
 * @param content -反馈内容(必填)
 * @returns
 */
export async function api_submitFeedBack(data: { contact: string; content: string }) {
  const result = await momo.post<undefined>("/submitFeedback", data)
  console.log("/返回的数据为：", result)
  return result
}
