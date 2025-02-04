// 引入defineStore用于创建store
import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

// 定义并暴露一个store
export const useForumStore = defineStore("forum", () => {
  type Breadcrumb = { name: string; label: string; query?: any }
  const router = useRouter()
  /**面包屑路由数组*/
  const routerBreadcrumb = ref<Breadcrumb[]>([
    {
      name: "center",
      label: "论坛",
    },
  ])

  /**增删面包屑
   * @param index -面包屑所在位置
   * @param {{ name: string, label: string, query?: any }} breadcrumb -新的面包屑参数
   * - name - 路由名称
   * - label - 路由显示名称
   * - query - 路由参数
   */
  const setRouterBreadcrumb = (index: number, breadcrumb: Breadcrumb) => {
    if (index === 0) {
      routerBreadcrumb.value = [
        {
          name: "center",
          label: "论坛",
        },
      ]
    } else {
      const tempArr = routerBreadcrumb.value.splice(0, index)
      console.log("tempArr", tempArr.length, index)

      tempArr.push(breadcrumb)
      routerBreadcrumb.value = tempArr
    }
    router.push({ name: breadcrumb.name, query: breadcrumb.query || {} })
  }

  /**初次加载或外部链接跳转到子路径*/
  const initBreadcrumb = (index: number, breadcrumb: Breadcrumb) => {
    console.log(index, breadcrumb)

    if (routerBreadcrumb.value.length < index + 1) setRouterBreadcrumb(index, breadcrumb)
  }

  return { routerBreadcrumb, setRouterBreadcrumb, initBreadcrumb }
})
