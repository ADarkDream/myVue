import { ResultData } from "@/types/global";
import axios from "axios";

/**获取版本列表或角色列表*/
export const api_getVersion = async (params: { version?: boolean, role?: 'all' | 'diff' }, isAdmin = false) => {
    const result = await axios<ResultData<{ versionList: VersionInfo[], roleList: Role[] }>>({
        url: isAdmin ? '/getAllVersion' : '/getVersion',
        params
    })
    console.log('/返回的数据为：', result.data)
    return result.data
}

/**添加1999角色*/
export const api_addRole = async (roleInfo: Role) => {
    const result = await axios({
        url: '/addRole',
        method: "POST",
        data: roleInfo
    })
    console.log('/api_addRole返回的数据为：', result.data)
    const { status, msg } = result.data
    if (status === 200) {
        ElMessage.success(msg)
        return true
    } else return false
}

/**用户和管理员修改和删除1999角色*/
export const api_updateRole = async (roleInfo: Role, isAdmin = false) => {
    const result = await axios({
        url: isAdmin ? '/updateAllRole' : '/updateRole',
        method: "POST",
        data: roleInfo
    })
    console.log('/api_updateRole返回的数据为：', result.data)
    const { status, msg } = result.data
    if (status === 200) {
        ElMessage.success(msg)
        return true
    } else return false
}

/**用户和管理员获取图片信息*/
export const api_getImage = async (condition: ImgParams, isAdmin = false) => {
    const result = await axios<ResultData<{ imgList: ReverseImg[] | ReverseImgInfo[], totalNum: number }>>({
        url: isAdmin ? '/getAllWallpaper' : '/getWallpaper',
        params: condition,
    })
    console.log('/api_getImage返回的数据为：', result.data)
    const { status, data } = result.data
    if (status === 300 || !data) return//没有查询结果则不进行以下操作
    return data
}

/**用户和管理员更新图片信息*/
export const api_updateImage = async (data: ReverseImgInfo, isAdmin = false) => {
    const result = await axios({
        url: isAdmin ? '/updateAllWallPaper' : '/updateWallPaper',
        method: 'post',
        data
    })
    console.log('/api_updateImage返回的数据为：', result.data)
    const { status, msg } = result.data
    if (status === 200) {
        ElMessage.success(msg)
        return true
    } //没有查询结果则不进行以下操作
    else return false
}
