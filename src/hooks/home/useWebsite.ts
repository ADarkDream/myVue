import { ElMessage } from "element-plus"
import { useWebsiteStore } from "@/store/home/useWebsiteStore"
import { api_get_url_list, api_get_url_list_info } from "@/apis/home/website"

export default function () {
  const websiteStore = useWebsiteStore()
  const { activeType, nameMap, localListObj, localList, cloudList } = toRefs(websiteStore)
  /**获取导航分类信息*/
  const getUrlListInfo = async () => {
    try {
      const websiteInfoList = await api_get_url_list_info()
      if (!websiteInfoList) return

      cloudList.value = websiteInfoList
      const map: Record<string, string> = {}
      websiteInfoList.forEach((item) => {
        map[item.sort] = item.name
      })
      nameMap.value = map

      if (!localList.value.length) {
        //本地列表不存在或被修改，更新本地列表
        localList.value = websiteInfoList
        return
      }
      //本地列表存在，则检查是否是最新数据
      //遍历本地导航信息是否为最新，不为最新则删除localListObj中对应的键
      localList.value.forEach((item) => {
        // 在cloudList中查找匹配的infoItem,返回的是数组
        const thisItem = cloudList.value.find(
          (infoItem) => item.sort === infoItem.sort && item.updated_time === infoItem.updated_time
        ) //类型一致但时间相等，不修改
        if (!thisItem) {
          // thisItem中无结果，则表示未找到或找不到一致的,重置localListObj中对应的键(导航分类)
          localListObj.value[item.sort] = []
          console.log("导航分类已更新", item.sort)
        }
      })
    } catch (error) {
      console.log("获取导航分类信息错误：")
      console.dir(error)
    }
  }

  /**获取新一页分类的导航数据*/
  const getNewList = async (sort: string) => {
    try {
      //如果本地localListObj有对应的导航信息，则直接加载
      if (localListObj.value[sort]) {
        console.log("正在使用本地缓存的导航数据", sort)
        activeType.value = sort
        return localListObj.value[sort]
      }
      //本地没有缓存，从云端获取
      const websiteList = await api_get_url_list(sort)
      if (!websiteList) return []

      localListObj.value[sort] = websiteList //将本分类导航加入到localListObj
      activeType.value = sort
      return websiteList
    } catch (error) {
      console.log("获取新一页分类的导航数据错误:")
      console.error(error)
      ElMessage.error("云端数据获取失败")
      return []
    }
  }
  return { getUrlListInfo, getNewList }
}
