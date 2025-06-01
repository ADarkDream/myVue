//上传图片
import momo from "@/apis"
import { ElMessage } from "element-plus"
import type { Image } from "@/types/upload"
import myFun from "@/utils/myFunction"

const uploadImage = {
  uploadImg: async (formData: FormData) => {
    //检查FormData中是否存在文件
    if (!myFun.hasFileInFormData(formData)) return
    const result = await momo.post<{ imageInfo: Image }>("/uploadImg", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    console.log(result)
    const { code, msg, data } = result
    if (code === 200 && data) {
      ElMessage.success(msg)
      return data.imageInfo
    } else if (code === 300 && data) {
      return data.imageInfo
    }
  },
}
export default uploadImage
