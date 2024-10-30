//上传图片
import axios from "axios";
import type { ResultData } from "@/types/global";
import { ElMessage } from "element-plus";
import type { Image } from "@/types/upload";

const uploadImage = {
    uploadImg: async (formData: FormData) => {
        const result = await axios<ResultData<{ imageInfo: Image }>>({
            url: '/uploadImg',
            method: 'POST',
            // headers: {'Content-Type': 'multipart/form-data'},
            data: formData
        })
        console.log(result.data)
        const { status, msg, data } = result.data
        if (status === 200 && data) {
            ElMessage.success(msg)
            return data.imageInfo
        } else if (status === 300 && data) {
            return data.imageInfo
        }
    }


}
export default uploadImage
