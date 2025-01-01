// 引入defineStore用于创建store
import { TableFilterItem } from '@/types/global'
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export const useReverse1999Store = defineStore('reverse1999', () => {
    const router = useRouter()
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
    /**是否可修改、编辑的状态*/
    const statusOptions = ref([
        { label: '已删除', value: 0 },
        { label: '正常', value: 1 },
        { label: '可编辑不可删除', value: 2 },
        { label: '不可编辑可删除', value: 3 },
        { label: '锁定，不可操作', value: 4 }
    ])

    //当前面板序号
    const activePanelIndex = ref(0)

    //切换面板
    const changePanelIndex = (index: number | string) => {
        console.log("index", index);
        switch (index) {
            case 0:
            case 'download':
                router.push({ name: 'download' })
                activePanelIndex.value = 0
                break
            case 1:
            case 'roles':
                router.push({ name: 'roles' })
                activePanelIndex.value = 1
                break
            case 2:
            case 'images':
                router.push({ name: 'images' })
                activePanelIndex.value = 2
                break
            default:
                router.push({ name: 'download' })
                activePanelIndex.value = 0
                break
        }
    }

    return { activePanelIndex, versionInfo, allRoleInfo, diffRoleInfo, campInfo, raceInfo, versionOption, statusOptions, changePanelIndex }
}, {
    persist: {
        pick: ['versionInfo', 'allRoleInfo', 'diffRoleInfo', 'campInfo', 'raceInfo', 'versionOption'],
        storage: sessionStorage
    }
}
)
