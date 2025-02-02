import momo from "@/apis"
import { VersionParams } from '@/types/reverse1999'

/**获取版本列表或角色列表*/
export const api_getVersion = async (params: VersionParams, isAdmin = false) => {
    const result = await momo.get<{ versionList: VersionInfo[], roleList: Role[] }>(isAdmin ? '/getAllVersion' : '/getVersion', params)
    console.log('/返回的数据为：', result)
    return result
}
/**添加1999角色*/
export const api_addVersion = async (versionInfo: VersionInfo) => {
    const result = await momo.post('/addVersion', versionInfo)
    console.log('/api_addVersion返回的数据为：', result)
    const { code, msg } = result
    if (code === 200) {
        ElMessage.success(msg)
        return true
    } else return false
}

/**用户和管理员修改和删除1999版本信息*/
export const api_updateVersion = async (versionInfo: VersionInfo, isAdmin = false) => {
    const result = await momo.post(isAdmin ? '/updateAllVersion' : '/updateVersion', versionInfo)
    console.log('/api_updateVersion返回的数据为：', result)
    const { code, msg } = result
    if (code === 200) {
        ElMessage.success(msg)
        return true
    } else return false
}
/**添加1999角色*/
export const api_addRole = async (roleInfo: Role) => {
    const result = await momo.post('/addRole', roleInfo)
    console.log('/api_addRole返回的数据为：', result)
    const { code, msg } = result
    if (code === 200) {
        ElMessage.success(msg)
        return true
    } else return false
}

/**用户和管理员修改和删除1999角色*/
export const api_updateRole = async (roleInfo: Role, isAdmin = false) => {
    const result = await momo.post(isAdmin ? '/updateAllRole' : '/updateRole', roleInfo)
    console.log('/api_updateRole返回的数据为：', result)
    const { code, msg } = result
    if (code === 200) {
        ElMessage.success(msg)
        return true
    } else return false
}

/**用户和管理员获取图片信息*/
export const api_getImage = async (condition: ImgParams, isAdmin = false) => {
    const result = await momo.get<{ imgList: ReverseImg[] | ReverseImgInfo[], totalNum: number }>(isAdmin ? '/getAllWallpaper' : '/getWallpaper', condition)
    console.log('/api_getImage返回的数据为：', result)
    const { code, data } = result
    if (code === 300 || !data) return//没有查询结果则不进行以下操作
    return data
}

/**用户和管理员更新图片信息*/
export const api_updateImage = async (data: ReverseImgInfo, isAdmin = false) => {
    const result = await momo.post(isAdmin ? '/updateAllWallPaper' : '/updateWallPaper', data)
    console.log('/api_updateImage返回的数据为：', result)
    const { code, msg } = result
    if (code === 200) {
        ElMessage.success(msg)
        return true
    } //没有查询结果则不进行以下操作
    else return false
}

/**检查以影像之是否有更新(未收录图片)*/
export const api_checkReverseUpdate = async () => {
    const result = await momo.get('/checkReverseUpdate')
    console.log('/api_checkReverseUpdate返回的数据为：', result)
    const { code, msg } = result
    if (code === 200) {
        ElMessage.success(msg)
    } else if (code === 201) {
        ElMessage.warning(msg)
        return true
    }
    //没有查询结果则不进行以下操作
    return false
}
