import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { ElMessage } from "element-plus"
import { jwtDecode } from "jwt-decode"
//types
import type { AdminInfo, Token, UserInfo } from "@/types/user"
//files
import BG_PC from "/images/bg_pc.webp"

// 定义并暴露一个store
export const useUserInfoStore = defineStore(
  "user_info",
  () => {
    //获取本地存储的用户信息userInfo中的数据
    const imageSrc =
      import.meta.env.VITE_QINIUTHUMBNAIL_URL +
      "/headImg/hutao_%E7%B1%B3%E6%B8%B8%E7%A4%BE%E7%94%BB%E5%B8%88Love715_1714496199477.png"
    //是否使用本地背景图
    const useUserBGUrl = ref(false)
    //本地背景图
    const localBgUrl = ref(BG_PC)

    const userInfo = ref<UserInfo>({
      username: "",
      email: "",
      signature: "",
      bgUrl: "",
      headImgUrl: imageSrc,
    })

    const adminInfo = ref<AdminInfo>({
      uid: 0,
      username: "",
      email: "",
      headImgUrl: "",
    })

    const token_user = ref("")
    const token_admin = ref("")
    //当前的token
    const token = computed(() => token_admin.value || token_user.value)
    // if (userInfo.headImgUrl === '') userInfo.headImgUrl = imageSrc
    const uid = computed({
      get: () => adminInfo.value.uid || userInfo.value.uid,
      set: (val: number) => (isAdmin.value ? (adminInfo.value.uid = val) : (userInfo.value.uid = val)),
    })
    const email = computed({
      get: () => adminInfo.value.email || userInfo.value.email,
      set: (val: string) => (isAdmin.value ? (adminInfo.value.email = val) : (userInfo.value.email = val)),
    })
    const username = computed({
      get: () => adminInfo.value.username || userInfo.value.username,
      set: (val: string) => (isAdmin.value ? (adminInfo.value.username = val) : (userInfo.value.username = val)),
    })
    const signature = computed({
      get: () => userInfo.value.signature,
      set: (val: string) => (userInfo.value.signature = val),
    })
    const headImgUrl = computed({
      get: () => adminInfo.value.headImgUrl || userInfo.value.headImgUrl,
      set: (val: string) => (isAdmin.value ? (adminInfo.value.headImgUrl = val) : (userInfo.value.headImgUrl = val)),
    })
    const isSuperAdmin = computed({
      get: () => adminInfo.value.isSuperAdmin || false,
      set: (val: boolean) => (adminInfo.value.isSuperAdmin = val),
    })
    /**
     * 用户设置的背景图
     */
    const bgUrl = computed({
      get: () => userInfo.value.bgUrl,
      set: (val: string) => (userInfo.value.bgUrl = val),
    })
    const isLogin = ref(false)
    const isAdmin = ref(false)
    const errorFlag = ref(false) //头像错误标志

    // //切换本地和用户设置的壁纸
    // watch(useUserBGUrl, (newVal, oldVal) => {
    //     if (newVal === oldVal) return
    //     toggleBG({})
    // })

    /**
     * 更新用户信息userInfo
     * !需要修改类型
     * @param newUserInfo
     */
    function updateLocalUserInfo(newUserInfo: UserInfo, is_admin = false) {
      if (is_admin) {
        ;(Object.keys(newUserInfo) as (keyof AdminInfo)[]).forEach((key) => {
          adminInfo.value[key] = newUserInfo[key]
        })
      } else {
        ;(Object.keys(newUserInfo) as (keyof UserInfo)[]).forEach((key) => {
          // 如果 userInfo 没有这个 key，则新建该 key
          if (!(key in userInfo.value)) {
            userInfo.value[key] = undefined // 初始化新键
          }
          userInfo.value[key] = newUserInfo[key]
        })
      }
      console.log("更新了newUserInfo")
      checkLocalToken()
    }

    //true为未过期，false为过期
    function checkLocalToken() {
      // console.log('检查本地token'), token_admin.value, token_user.value)

      if (!token_admin.value && !token_user.value) {
        isLogin.value = false
        isAdmin.value = false
        return
      }
      const tokenInfo: Token = jwtDecode(token_admin.value || token_user.value)
      // ((tokenInfo.exp * 1000 - Date.now() ) / 60000).toFixed()  //距离token过期剩余时间
      if (tokenInfo.exp * 1000 - Date.now() <= 0) {
        ElMessage.info("token已过期，请重新登录")
        loginOut(tokenInfo.value.isAdmin === "1") //退出登录
      } else {
        isLogin.value = true
        isAdmin.value = tokenInfo.value.isAdmin === "1"
        const { tokenVersion, ...tempInfo } = tokenInfo.value
        // console.log('tempInfo', tempInfo);
        if (isAdmin.value) {
          delete tokenInfo.value.isAdmin
          //因为管理员信息没有持久化，所以刷新之后需要重新赋值
          if (!adminInfo.value.username) Object.assign(adminInfo.value, tokenInfo.value)
        } else {
          //刷新或重开浏览器之后需要重新赋值
          Object.assign(userInfo.value, tempInfo)
        }
      }
      //如果用户有背景图且选择使用，则使用用户指定的图，否则使用本地背景图
      if (bgUrl.value && useUserBGUrl.value) {
        localBgUrl.value = bgUrl.value
      }
      // console.log('检查本地token,isLogin:', isLogin.value, tokenInfo.value);
    }

    //检查newToken是管理员的还是用户的
    function setTokenByType(newToken: string) {
      console.log("得到了newToken", newToken)
      if (!newToken) return ElMessage.info("newToken不存在")
      if (newToken === token.value) return
      const tokenInfo: Token = jwtDecode(newToken)
      if (tokenInfo.value.isAdmin === "1") {
        token_admin.value = newToken
      } else token_user.value = newToken
    }

    /**
     * 退出登录,清除token和用户信息
     * @param is_admin 是否是管理员退出登录
     */
    const loginOut = (is_admin = false) => {
      //重置userInfo
      userInfo.value = {
        username: "",
        email: "",
        signature: "",
        bgUrl: "",
        headImgUrl: imageSrc,
      }
      isAdmin.value = false
      isLogin.value = false //退出登录
      if (is_admin) {
        //清除管理员的token
        token_admin.value = ""
        ElMessage.info("已退出管理员登录")
      } else {
        //清除用户的token
        token_user.value = ""
        localStorage.removeItem("token")
        localStorage.removeItem("userInfo.value")
        localStorage.removeItem("userEngines")
        localStorage.removeItem("useUserBGUrl")
        localStorage.removeItem("userBGUrl")
        // 清除所有sessionStorage
        sessionStorage.clear()
        ElMessage.info("已退出登录,本地的用户数据已清除")
        ElMessage.info("部分本地信息会保留，如需清除请在右上角选择“选项“→”设置”→“清除全部本地缓存信息”")
      }
      setTimeout(() => {
        location.reload()
      }, 2500)
    }

    //头像加载错误(链接不对或被屏蔽)
    function errorImage(e: Event) {
      e.preventDefault() // 阻止默认的图片错误行为
      e.stopPropagation() // 阻止事件冒泡
      headImgUrl.value = imageSrc // 替换图片源为备用图片
      console.log("errorImg", imageSrc)
      if (!errorFlag.value) {
        //防止多个报错
        ElMessage.error("头像无法加载，已替换为默认头像。请尝试刷新或更换头像")
        // ElMessage.info('原因：服务器错误；或已被管理员删除')
        errorFlag.value = true
        setTimeout(() => (errorFlag.value = false), 1000)
      }
    }

    // 向外暴露
    return {
      updateLocalUserInfo,
      checkLocalToken,
      setTokenByType,
      errorImage,
      loginOut,
      token,
      token_user,
      token_admin,
      userInfo,
      uid,
      username,
      email,
      signature,
      headImgUrl,
      bgUrl,
      imageSrc,
      isAdmin,
      isSuperAdmin,
      isLogin,
      localBgUrl,
      useUserBGUrl,
    }
  },
  {
    persist: [
      {
        pick: ["userInfo", "token_user", "useUserBGUrl", "localBgUrl"],
        storage: localStorage,
      },
      {
        pick: ["token_admin", "isLogin"],
        storage: sessionStorage,
      },
    ],
  }
)
