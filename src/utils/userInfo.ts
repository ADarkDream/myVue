//用户信息的方法
import type { ResultData } from "@/types/global";
import type { Image, ImageUrlType } from "@/types/upload";
import type { UserInfo } from "@/types/user";
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
    getUserInfo: async () => {
        const result = await axios<ResultData<{ userInfo: UserInfo }>>({ url: '/getUserInfo' })
        console.log(result.data)
        const { status, data, msg } = result.data
        if (status === 200 && data) {
            ElMessage.success(msg)
            return data.userInfo
        }
        else if (status === 300 && data) return data.userInfo
    },

    updateImgUrl: async (imgData: ImageUrlType) => {
        const result = await axios<ResultData<{ imageInfo?: Image }>>({
            url: '/updateImgUrl',
            method: 'post',
            data: imgData
        })
        console.log(result.data)
        const { status, data, msg } = result.data
        if ((status === 200 || status === 300) && data) {
            return data.imageInfo
        }
    },
}
