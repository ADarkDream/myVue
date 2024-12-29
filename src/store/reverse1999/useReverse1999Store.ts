// 引入defineStore用于创建store
import { TableFilterItem } from '@/types/global'
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'


export const useReverse1999Store = defineStore('reverse1999', () => {
    //版本信息
    const versionInfo = ref<VersionInfo[]>([])
    //全部角色列表
    const allRoleInfo = ref<Role[]>([])
    //部分(有壁纸的)角色列表
    const diffRoleInfo = ref<Role[]>([])
    //角色阵营列表
    const campInfo = ref<{ name: string, count: number }[]>([])
    //角色种族列表
    const raceInfo = ref<{ name: string, count: number }[]>([])
    //版本选项
    const versionOption = ref<TableFilterItem<number>[]>([])



    return { versionInfo, allRoleInfo, diffRoleInfo, campInfo, raceInfo, versionOption }
}, {
    persist: {
        pick: ['versionInfo', 'allRoleInfo', 'diffRoleInfo', 'campInfo', 'raceInfo', 'versionOption'],
        storage: sessionStorage
    }
}
)
