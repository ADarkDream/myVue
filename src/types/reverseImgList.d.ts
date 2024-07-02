//数据库返回的图片数据类型
type ReverseImg = {
    imgIndex: number,
    imgName: string,
    imgUrl: string,
    time: string,
    version: string
}

//图片查询的参数
interface ImgParams {
    version?: string[],
    roles?: number[],
    sort?: Sort,
    accurate?: Accurate
}

//图片分类
enum Sort {
    Tall = 0,//竖屏图
    Wide = 1,//横屏图
    All = 2//全选
}

//是否精确查询
enum Accurate {
    NotAccurate = 0,//模糊查询
    IsAccurate = 1//精确查询
}

//1999角色信息
interface Role {
  id: number,
  name: string,
  camp: string,
  race: string,
  otherTags: string,
  created_time: string,
}

//1999版本信息
interface versionInfo{
    version: number,
    versionName: string
}

//公告
interface Notice {
  id: number,
  title: string,
  sort: string,
  content: string,
  created_time: string,
  updated_time: string,
  status: number,
  time?: string
}