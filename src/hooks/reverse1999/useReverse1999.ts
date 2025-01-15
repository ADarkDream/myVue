import { useReverse1999Store } from '@/store/reverse1999/useReverse1999Store'
import { useRolesStore } from '@/store/reverse1999/useRolesStore'
import { useVersionsStore } from '@/store/reverse1999/useVersionsStore'
import { useUserInfoStore } from '@/store/user/useUserInfoStore'

import { api_getVersion, api_addVersion, api_updateVersion, api_addRole, api_updateRole } from '@/apis/reverse1999'
import { VersionParams } from '@/types/reverse1999'
import { TableFilterItem } from '@/types/global'

export default function () {
    const reverse1999Store = useReverse1999Store()
    const userInfoStore = useUserInfoStore()
    const rolesStore = useRolesStore()
    const versionsStore = useVersionsStore()
    const { versionInfo, allRoleInfo, diffRoleInfo, campInfo, raceInfo } = toRefs(reverse1999Store)
    const { toggleAddRoleDrawer, reSetFormData } = rolesStore
    const { isAdmin } = toRefs(userInfoStore)
    //获取版本列表并添加到菜单
    const getVersion = async ({ version, role }: VersionParams, latest = false) => {
        try {
            let temp_v = undefined
            let temp_r = undefined
            const no_local_version = versionInfo.value.length === 0
            const no_local_role = role === 'all' ? allRoleInfo.value.length === 0 : diffRoleInfo.value.length === 0
            if ((version === 'all' || version === 'diff') && (latest || no_local_version)) temp_v = version
            if ((role === 'all' || role === 'diff') && (latest || no_local_role)) temp_r = role

            if (!temp_v && !temp_r) return


            const { status, msg, data } = await api_getVersion({ version: temp_v, role: temp_r }, isAdmin.value)
            if (!data) return
            const { versionList, roleList } = data

            //更新版本列表
            if (versionList?.length > 0) {
                versionInfo.value = versionList
            }

            //更新角色列表
            if (temp_r === 'diff') diffRoleInfo.value = roleList
            else if (temp_r === 'all') allRoleInfo.value = roleList
            else if (temp_v) return versionList?.length > 0 //只获取版本信息的情况下，返回是否成功的标注
            else return
            //获取阵营列表
            const campObj = {} as Record<string, number>
            const raceObj = {} as Record<string, number>
            roleList.forEach(item => {
                if (!item.camp || !item.race) return
                if (!campObj[item.camp]) campObj[item.camp] = 1
                else campObj[item.camp] += 1
                if (!raceObj[item.race]) raceObj[item.race] = 1
                else raceObj[item.race] += 1
            })

            campInfo.value = Object.keys(campObj).map(item => {
                return { name: item, count: campObj[item] }
            })
            raceInfo.value = Object.keys(raceObj).map(item => {
                return { name: item, count: raceObj[item] }
            })
            // raceInfo.value = Object.keys(raceObj).map(item => {
            //     return `${item}[${raceObj[item]}]`
            // })


            // console.log(campInfo.value, raceInfo.value)
            //用于验证刷新是否成功
            return true
        } catch (error) {
            console.error('发生错误：')
            console.error(error)
        }
    }
    //新增版本信息
    const addVersion = async (formData: VersionInfo) => {
        const flag = await api_addVersion(formData)
        if (flag) {//操作成功，刷新信息并退出
            await getVersion({ version: 'all' }, true)
            //关闭抽屉
            versionsStore.toggleAddVersionDrawer(false)
            //重置表单
            versionsStore.reSetFormData()
        }
    }

    //修改版本信息
    const updateVersion = async (formData: VersionInfo) => {
        console.log('修改版本信息', formData);

        const flag = await api_updateVersion(formData, isAdmin.value)
        if (flag) {//操作成功，刷新信息并退出
            await getVersion({ version: 'all' }, true)
            //关闭抽屉
            versionsStore.toggleAddVersionDrawer(false)
            //重置表单
            versionsStore.reSetFormData()
        }
    }
    //新增角色
    const addRole = async (formData: Role) => {
        const flag = await api_addRole(formData)
        if (flag) {//操作成功，刷新信息并退出
            await getVersion({ role: 'all' }, true)
            //关闭抽屉
            versionsStore.toggleAddVersionDrawer(false)
            //重置表单
            versionsStore.reSetFormData()
        }
    }

    //修改角色
    const updateRole = async (formData: Role) => {
        const flag = await api_updateRole(formData, isAdmin.value)
        if (flag) {//操作成功，刷新信息并退出
            await getVersion({ role: 'all' }, true)
            //关闭抽屉
            toggleAddRoleDrawer(false)
            //重置表单
            reSetFormData()
        }
    }


    return { getVersion, addVersion, updateVersion, addRole, updateRole }
}
