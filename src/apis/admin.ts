import { ResultData } from "@/types/global"
import { UserInfo } from "@/types/user"
import axios from "axios"

export async function api_login_admin(params: { email: string, password: string }) {
    const result = await axios<ResultData<{ userInfo: UserInfo }>>({
        url: '/login',
        method: 'post',
        data: {
            isAdmin: true,
            ...params
        }
    })
    console.log('/返回的数据为：', result.data)
    return result.data
}