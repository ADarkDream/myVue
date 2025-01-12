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
    /**版本数字-名称字典*/
    const versionNameDictionary = computed(() => versionInfo.value.reduce((dict: Record<number, string>, { version, versionName }) => {
        dict[version] = versionName
        return dict;
    }, {}))

    /**角色id-名称字典*/
    const roleNameDictionary = computed(() => allRoleInfo.value.reduce((dict: Record<number, string>, role) => {
        dict[role.id] = role.name;
        return dict;
    }, {}))

    /**根据阵营分类的角色树*/
    const roleTree = computed(() => campInfo.value.map(camp => {
        const children = allRoleInfo.value.map(role => {//去除已删除的角色，将角色根据阵营分组
            if (role.status !== 0 && role.camp === camp.name) return { label: role.name, value: role.id }
        }).filter(item => item !== undefined)//过滤掉空值
        return { label: camp.name, value: camp.name, children }
    }))



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
        console.log("当前面板序号：", index);
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
            case 3:
            case 'versions':
                router.push({ name: 'versions' })
                activePanelIndex.value = 3
                break
            default:
                router.push({ name: 'download' })
                activePanelIndex.value = 0
                ElMessage.info('开发中')
                break
        }
    }

    return { activePanelIndex, versionInfo, allRoleInfo, diffRoleInfo, campInfo, raceInfo, versionNameDictionary, roleNameDictionary, roleTree, versionOption, statusOptions, changePanelIndex }
}, {
    persist: {
        pick: ['versionInfo', 'allRoleInfo', 'diffRoleInfo', 'campInfo', 'raceInfo', 'versionOption'],
        storage: sessionStorage
    }
}
)
