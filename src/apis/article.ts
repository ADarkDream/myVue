import momo from "@/apis"
import { ArticleParams, Article } from "@/types/articles"

/**
 * 请求论坛文章列表
 * @param params -公告类型数组
 * @returns
 */
export const api_getArticleList = async (params: ArticleParams) => {
  const result = await momo.get<{ list: Article[] }>("/getArticleList", params)
  // console.log(result)
  const { code, data } = result
  if (code === 200) return data!.list
  else return []
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
