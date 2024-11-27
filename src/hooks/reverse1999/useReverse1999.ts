import { useReverse1999Store } from '@/store/reverse1999/useReverse1999Store'

import { api_getVersion } from '@/apis/reverse1999'
import { VersionParams } from '@/types/reverse1999'
import { TableFilterItem } from '@/types/global'

export default function () {
    const reverse1999Store = useReverse1999Store()
    const { versionInfo, allRoleInfo, diffRoleInfo, campInfo, raceInfo, versionOption } = toRefs(reverse1999Store)
    //获取版本列表并添加到菜单
    const getVersion = async ({ version, role }: VersionParams) => {
        try {
            let temp_v = undefined
            let temp_r = undefined
            if (version && versionInfo.value.length === 0) temp_v = version
            if ((role === 'all' && allRoleInfo.value.length === 0) || (role === 'diff' && diffRoleInfo.value.length === 0)) temp_r = role

            if (!temp_v && !temp_r) return


            const { status, msg, data } = await api_getVersion({ version: temp_v, role: temp_r })
            if (!data) return
            const { versionList, roleList } = data

            //更新版本列表
            if (versionList?.length > 0) {
                versionInfo.value = versionList
                const temp_versionOption: TableFilterItem<number>[] = []  //存版本信息
                versionInfo.value.forEach((item) => temp_versionOption.push({ text: item.versionName, value: item.version }))
                versionOption.value = temp_versionOption
            }

            //更新角色列表
            if (temp_r === 'diff') diffRoleInfo.value = roleList
            else if (temp_r === 'all') allRoleInfo.value = roleList
            else return
            //获取阵营列表
            const campList = new Set<string>()
            const raceList = new Set<string>()
            roleList.forEach(item => {
                campList.add(item.camp)
                raceList.add(item.race)
            })
            console.log('list', campList, raceList);

            campList.delete('')   //删除空值
            raceList.delete('')

            campInfo.value = Array.from(campList)
            raceInfo.value = Array.from(raceList)
            console.log(campInfo.value, raceInfo.value);

        } catch (error) {
            console.error('发生错误：')
            console.error(error)
        }
    }


    return { getVersion }
}
