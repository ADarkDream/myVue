import { ref, toRefs } from "vue"
import { ElMessage } from "element-plus"
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import userInfo from "@/utils/userInfo"
import type { Token } from "@/types/user"
import { jwtDecode } from "jwt-decode"

export default function () {
  const userInfoStore = useUserInfoStore()
  const { token, token_admin, token_user } = toRefs(userInfoStore)
  const { updateLocalUserInfo } = userInfoStore

  //检查newToken是管理员的还是用户的
  const setTokenByType = (newToken: string) => {
    console.log("得到了newToken", newToken)
    if (!newToken) return ElMessage.info("newToken不存在")
    if (newToken === token.value) return
    const tokenInfo: Token = jwtDecode(newToken)
    if (tokenInfo.value.isAdmin === "1") {
      token_admin.value = newToken
    } else token_user.value = newToken
  }
  /**
   * 从服务器获取新的用户信息来更新本地信息
   */
  const updateUserInfo = async () => {
    try {
      const user_info = await userInfo.getUserInfo()
      if (user_info) {
        updateLocalUserInfo(user_info)
      }
    } catch (err) {
      console.error("出错了:")
      console.error(err)
    }
  }

  return { setTokenByType, updateUserInfo }
}
