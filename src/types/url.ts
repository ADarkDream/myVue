//定义搜索引擎接口
interface EngineData {
  index?: number
  id: number
  engineId?: number
  name?: string
  baseUrl: string
  searchUrl?: string
  src?: string
  searchImg?: string
  isShow?: boolean
}

type ThisEngine = {
  index: number
  id?: number
  engineId?: number
  name: string
  baseUrl: string
  searchUrl: string
  src: string
  searchImg?: string
  isShow?: boolean
}

//首页导航的本地存储
interface NavigationObj {
  [key: string]: Navigation[] // 使用索引签名，任何字符串键都可以，其值为Navigation[]
}

//首页导航的信息
interface Navigation {
  detail: string
  id?: number
  img: string
  name: string
  sort: string
  status?: number
  tags: string
  uid?: number
  updated_time?: string
  url: string
}

//获取的云端网站信息元素
interface WebsiteInfoItem {
  id: number
  name: string
  sort: string
  updated_time: string
}

//表格筛选分类的元素
interface Sort {
  text: string
  value: string
}

export type { EngineData, ThisEngine, Navigation, NavigationObj, WebsiteInfoItem }
