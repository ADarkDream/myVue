import momo from "@/apis"
import { Navigation, WebsiteInfoItem } from "@/types/url"
import { ElMessage } from "element-plus"
/**获取首页导航分类信息*/
export const api_get_url_list_info = async () => {
  const result = await momo.get<{ websiteInfoList: WebsiteInfoItem[] }>("/getUrlListInfo")
  console.log("获取首页导航分类信息：", result)
  const { code, msg, data } = result
  if (code !== 200 || !data) {
    ElMessage.error(msg)
    return
  } else return data.websiteInfoList
}

/**
 * 获取新一页分类的导航信息
 * @param className -导航分类名称
 */
export const api_get_url_list = async (className: string) => {
  const result = await momo.get<{ websiteList: Navigation[] }>("/getUrlList", { className })
  console.log("获取新一页分类的导航信息：", result)
  const { code, msg, data } = result
  if (code !== 200 || !data) {
    ElMessage.error(msg)
    return
  } else return data.websiteList
}

/**
 * 添加导航信息
 * @param params -导航信息
 */
export const api_add_url = async (params: Navigation) => {
  const { img, name, detail, url, sort, tags } = params
  const result = await momo.post<{ websiteList: Navigation[] }>("/addUrl", { img, name, detail, url, sort, tags })
  console.log("上传新的导航网址：", result)
  const { code, msg } = result
  if (code === 200) {
    ElMessage.success(msg)
    return true
  } else {
    ElMessage.error(msg)
    return false
  }
}
