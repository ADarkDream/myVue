//用户信息的方法
import type { Image, ImageUrlType } from "@/types/upload"
import type { UserInfo } from "@/types/user"
import momo from "@/apis"
import { ElMessage } from "element-plus"

export default {
  getUserInfo: async () => {
    const result = await momo.get<{ userInfo: UserInfo }>("/getUserInfo")
    console.log(result)
    const { code, data, msg } = result
    if (code === 200 && data) {
      ElMessage.success(msg)
      return data.userInfo
    } else if (code === 300 && data) return data.userInfo
  },

  updateImgUrl: async (imgData: ImageUrlType) => {
    const result = await momo.post<{ imageInfo?: Image }>("/updateImgUrl", imgData)
    console.log(result)
    const { code, data, msg } = result
    if ((code === 200 || code === 300) && data) {
      return data.imageInfo
    }
  },
}
