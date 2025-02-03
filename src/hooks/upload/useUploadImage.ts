//图片上传相关的方法
import { toRefs } from "vue"
import { ElMessage, ElLoading } from "element-plus"
import type { UploadFile, UploadRawFile } from "element-plus"
import * as SparkMD5 from "spark-md5"
//stores
import { useUploadFileStore } from "@/store/upload/uploadFileStore"
//utils
import uploadImageUtiles from "@/utils/upload/uploadImage"

export default function () {
  const uploadFileStore = useUploadFileStore()
  const { changeBtnsFlag, options, oldMd5, md5, uploadFile, isLoading, fileInfo } = toRefs(uploadFileStore)
  const { cancelUpload } = uploadFileStore

  //当用户选择图片之后开始解析图片和计算md5
  async function fileChange(file: UploadFile) {
    console.log("fileChange")
    //显示菜单组
    changeBtnsFlag.value = true
    //将用户上传的图片转换成url赋值给头像
    options.value.url = URL.createObjectURL(file.raw!)
    //取消本次上传的文件
    uploadFile.value = file.raw
    computedMd5(file.raw!)
  }
  /**
   * 计算文件的MD5值(异步)
   * @param file
   */
  const computedMd5 = (file: UploadRawFile) => {
    const fileReader = new FileReader()
    const Spark = new SparkMD5.ArrayBuffer()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = function (e: ProgressEvent<FileReader>) {
      Spark.append(e.target!.result as ArrayBuffer)
      md5.value = Spark.end()
    }
  }

  /**
   * 图片上传函数
   * @param file
   * @returns
   */
  const uploadImage = async (file: UploadRawFile) => {
    const { sort, status, maxSize } = options.value
    if (!file) return ElMessage.info("请先选择图片再上传")
    else if (md5.value === oldMd5.value) ElMessage.info("请勿重复上传")
    else if (["image/png", "image/jpeg", "image/jpg"].indexOf(file.type) === -1) return ElMessage.error("仅支持PNG/JPEG/JPG格式")
    else if (file.size > maxSize * 1048576) return ElMessage.error(`图片文件大小不能超过${maxSize}MB`)
    // 创建form对象,并加入要传递的参数
    const formData = new FormData()
    formData.append("file", file)
    formData.append("md5", md5.value)
    formData.append("sort", sort)
    formData.append("status", status.toString())
    formData.append("maxSize", maxSize.toString())

    isLoading.value = true
    try {
      fileInfo.value = await uploadImageUtiles.uploadImg(formData)
      isLoading.value = false
      oldMd5.value = md5.value
      //取消上传,重置部分参数
      cancelUpload()
    } catch (error) {
      isLoading.value = false
      cancelUpload()
      console.log(error)
    }
  }

  return { fileChange, computedMd5, uploadImage }
}
