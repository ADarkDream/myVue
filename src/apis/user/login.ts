import momo from "@/apis"
import { ElMessage } from "element-plus"
import { LoginParams } from "@/types/params"
import { UserInfo } from "@/types/user"

/**登录请求*/
export async function api_login(params: LoginParams) {
  const { email, password } = params
  const result = await momo.post<{ userInfo: UserInfo }>("/login", { email, password })
  console.log("/api_login返回的数据为：", result)
  const { code, data } = result
  if (code !== 200 || !data) {
    ElMessage.error("登录失败")
    return
  } else return data.userInfo
}
