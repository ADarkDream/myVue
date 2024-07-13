//定义搜索引擎接口
interface engineData {
  index: number,
  id?: number,
  name: string,
  baseUrl: string,
  searchUrl: string,
  src: string,
  isShow?: boolean,
}

export{engineData}

