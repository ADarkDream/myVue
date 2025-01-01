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

