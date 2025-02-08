import momo from "@/apis"
import { LoginParams } from "@/types/params"
import { UserInfo } from "@/types/user"

export async function api_login_admin(params: LoginParams) {
  const { email, password } = params
  const result = await momo.post<{ userInfo: UserInfo }>("/login", { email, password, isAdmin: true })
  console.log("/api_login_admin返回的数据为：", result)
  const { code, data } = result
  if (code !== 200 || !data) {
    ElMessage.error("登录失败")
    return
  } else return data.userInfo
}
