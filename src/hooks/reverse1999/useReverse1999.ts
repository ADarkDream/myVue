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


            console.log(campInfo.value, raceInfo.value);

        } catch (error) {
            console.error('发生错误：')
            console.error(error)
        }
    }


    return { getVersion }
}
