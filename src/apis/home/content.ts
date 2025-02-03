import momo from "@/apis"
import { Navigation, WebsiteInfoItem } from "@/types/url"

/**获取首页导航分类信息*/
export const api_get_url_list_info = async () => {
  const result = await momo.get<WebsiteInfoItem[]>("/getUrlListInfo")
  console.log("获取首页导航分类信息：", result)
  return result
}

/**
 * 获取新一页分类的导航信息
 * @param className -导航分类名称
 */
export const api_get_url_list = async (className: string) => {
  const result = await momo.get<Navigation[]>("/getUrlList", { className })
  console.log("获取新一页分类的导航信息：", result)
  return result
}
