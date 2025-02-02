//上传图片
import momo from "@/apis"
import { ElMessage } from "element-plus";
import type { Image } from "@/types/upload";

const uploadImage = {
    uploadImg: async (formData: FormData) => {
        const result = await momo.post<{ imageInfo: Image }>('/uploadImg', formData)
        console.log(result)
        const { code, msg, data } = result
        if (code === 200 && data) {
            ElMessage.success(msg)
            return data.imageInfo
        } else if (code === 300 && data) {
            return data.imageInfo
        }
    }


}
export default uploadImage
