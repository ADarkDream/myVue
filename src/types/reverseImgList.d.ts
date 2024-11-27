//数据库返回的图片数据类型
type ReverseImg = {
    imgIndex: number,
    imgName: string,
    imgUrl: string,
    imgPath?: string,
    time: number,
    version: number
}

type ReverseImgInfo = {
    id: number,
    oldName: string
    newName: string,
    imgUrl: string,
    version: number,
    // versionName: string,
    tags: string,//角色ID,例如："3,93"
    newTags?: string,
    roleNames?: string,
    newRoleNames?: string,
    // index: number,
    sort: number,
    time: number,
    imgPath: string,
    created_time?: string,
    imgIndex?: number//前端接收数据后重写的序号
}

//角色阵营的树状选择框
interface SourceData {
    label: string,
    value: number,
    children?: SourceData[]
}

//图片查询的参数
interface ImgParams {
    version: string[],
    roles: number[],
    sort: ImgSort,
    mode: 'accurate' | 'inaccurate',//0是模糊查询
    pageSize?: number,//查询每页条数
    offset?: number//当前页码
    orderBy?: string,//倒序查询的依据
    order?: string //'desc'为倒序查询,与orderBy同时存在时生效
}

//图片分类
declare enum ImgSort {
    Tall = 0,//竖屏图
    Wide = 1,//横屏图
    All = 2//全选
}

//是否精确查询
// enum Accurate {
//     NotAccurate = 0,//模糊查询
//     IsAccurate = 1//精确查询
// }


//1999角色信息
interface Role {
    id: number,
    name: string,
    camp: string,
    race: string,
    otherTags: string,
    created_time?: Date,
    updated_time?: Date
}

//1999版本信息
interface VersionInfo {
    version: number,
    versionName: string
}







