import momo from "@/apis"
import { UserInfo } from "@/types/user"

export async function api_login_admin(params: { email: string, password: string }) {
    const loginParams = { isAdmin: true, ...params }
    const result = await momo.post<{ userInfo: UserInfo }>('/login', loginParams)
    console.log('/返回的数据为：', result)
    return result
}