// 引入defineStore用于创建store
import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

export const useReverse1999Store = defineStore(
  "reverse1999",
  () => {
    const router = useRouter()
    //全部版本信息
    const versionInfo = ref<VersionInfo[]>([])
    //部分(有壁纸的)版本信息
    const diffVersionInfo = computed(() => {
      //判断是否为完整的版本信息
      const isFull =
        Array.isArray(versionInfo.value) &&
        versionInfo.value.every((item) => "version" in item && "versionName" in item && !("time" in item) && !("status" in item))

      const Arr = isFull
        ? versionInfo.value
        : (versionInfo.value
            .map(({ version, versionName, time, status }) => (time?.length && status !== 0 ? { version, versionName } : null))
            .filter(Boolean) as VersionInfo[]) // 明确类型
      return Arr.length ? Arr : [{ version: 1999, versionName: "未知版本" }]
    })
    //全部角色列表
    const allRoleInfo = ref<Role[]>([])
    //部分(有壁纸的)角色列表
    const diffRoleInfo = ref<Role[]>([])
    //角色阵营列表
    const campInfo = ref<{ name: string; count: number }[]>([])
    //角色种族列表
    const raceInfo = ref<{ name: string; count: number }[]>([])
    /**版本数字-名称字典*/
    const versionNameDictionary = computed(() =>
      versionInfo.value.reduce((dict: Record<number, string>, { version, versionName }) => {
        dict[version] = versionName
        return dict
      }, {})
    )

    /**角色id-名称字典*/
    const roleNameDictionary = computed(() =>
      allRoleInfo.value.reduce((dict: Record<number, string>, role) => {
        dict[role.id] = role.name
        return dict
      }, {})
    )

    // 渲染角色树,将角色根据阵营分组,供el-tree-v2使用(el-tree-select组件在数据量过大的情况下会内存溢出)
    const renderTree = () => {
      return campInfo.value.map((camp) => {
        const children = allRoleInfo.value
          .map((role) => {
            //去除已删除的角色，将角色根据阵营分组
            if (role.status !== 0 && role.camp === camp.name) return { label: role.name, value: role.id }
          })
          .filter((item) => item !== undefined) //过滤掉空值
        return { label: camp.name, value: camp.name, children }
      })
    }

    /**是否可修改、编辑的状态*/
    const statusOptions = ref([
      { label: "已删除", value: 0 },
      { label: "正常", value: 1 },
      { label: "可编辑不可删除", value: 2 },
      { label: "不可编辑可删除", value: 3 },
      { label: "锁定，不可操作", value: 4 },
    ])

    const pathNameArr = ["download", "roles", "images", "versions"]
    //当前面板序号
    const activePanelIndex = ref(0)
    //面板切换动画方向
    const toRight = ref(true)
    let isRouteChanging = false // 用于标志是否正在进行路由跳转
    //切换面板
    const changePanelIndex = (index: string) => {
      console.log("当前面板序号：/changePanelIndex", index)
      switch (index) {
        case "download":
          activePanelIndex.value = 0
          break
        case "roles":
          activePanelIndex.value = 1
          break
        case "images":
          activePanelIndex.value = 2
          break
        case "versions":
          activePanelIndex.value = 3
          break
        default:
          activePanelIndex.value = 0
          ElMessage.info("开发中")
          break
      }
    }
    watch(activePanelIndex, (newValue, oldValue) => {
      if (newValue === oldValue || isRouteChanging) return
      console.log("当前面板序号修改了：", newValue, oldValue)

      if (newValue > pathNameArr.length) {
        router.back()
        return
      }
      isRouteChanging = true
      router.push({ name: pathNameArr[newValue] })

      toRight.value = newValue > oldValue
      console.log("面板切换动画方向：", newValue > oldValue)
      // 路由跳转完成后，重置标志
      nextTick(() => {
        isRouteChanging = false
      })
    })
    return {
      activePanelIndex,
      toRight,
      diffVersionInfo,
      versionInfo,
      allRoleInfo,
      diffRoleInfo,
      campInfo,
      raceInfo,
      versionNameDictionary,
      roleNameDictionary,
      statusOptions,
      changePanelIndex,
      renderTree,
    }
  },
  {
    persist: {
      pick: ["versionInfo", "allRoleInfo", "diffRoleInfo", "campInfo", "raceInfo"],
      storage: sessionStorage,
    },
  }
)
