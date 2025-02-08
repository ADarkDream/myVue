// 引入defineStore用于创建store
import { NavigationObj, WebsiteInfoItem } from "@/types/url"
import { defineStore } from "pinia"
import { ref, shallowRef } from "vue"

// 定义并暴露一个store
export const useWebsiteStore = defineStore(
  "website",
  () => {
    /**分类名:导航列表*/
    const localListObj = shallowRef<NavigationObj>({}) //从本地获取
    //查询到的数据存储到本地
    const localList = shallowRef<WebsiteInfoItem[]>([]) //从本地获取
    const cloudList = shallowRef<WebsiteInfoItem[]>([]) //云端最新的列表

    /** type:name 导航名键值对*/
    const nameMap = ref<Record<string, string>>({})
    /**当前激活的导航分类*/
    const activeType = ref("tool")
    /**当前激活的导航分类名称*/
    const activeName = computed(() => nameMap.value[activeType.value] || "")

    return { activeType, activeName, nameMap, localListObj, localList, cloudList }
  },
  {
    persist: [
      {
        pick: ["localListObj", "localList"],
        storage: localStorage,
      },
      {
        pick: ["cloudList"],
        storage: sessionStorage,
      },
    ],
  }
)
