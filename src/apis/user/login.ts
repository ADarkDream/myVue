import momo from "@/apis"
import { ElMessage } from "element-plus"
import { LoginParams, RegisterParams } from "@/types/params"
import { UserInfo } from "@/types/user"

/**登录请求*/
export async function api_login(params: LoginParams) {
  const tempParams = {
    email: params.email.toLowerCase(),
    password: params.password,
  }
  const result = await momo.post<{ userInfo: UserInfo }>("/login", tempParams)
  console.log("api_login返回的数据为：", result)
  const { code, data } = result
  if (code !== 200 || !data) {
    ElMessage.error("登录失败")
    return
  } else return data.userInfo
}

/**邮箱验证码请求*/
export async function api_get_email_code(email: string) {
  const result = await momo.post("/getEmailCode", { email: email.toLowerCase() })
  console.log("api_get_email_code返回的数据为：", result)
  const { code, msg } = result
  if (code === 200) {
    ElMessage.success(msg)
    return true
  } else {
    ElMessage.error(msg)
    return false
  }
}

/**注册请求*/
export async function api_register(params: RegisterParams) {
  const tempParams = {
    username: params.username,
    email: params.email.toLowerCase(),
    password: params.password,
    code: params.code,
  }
  const result = await momo.post("/register", tempParams)
  console.log("api_register返回的数据为：", result)
  const { code, msg } = result
  if (code === 200) {
    ElMessage.success(msg)
    return true
  } else {
    ElMessage.error(msg)
    return false
  }
}
