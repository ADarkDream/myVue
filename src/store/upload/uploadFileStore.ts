// 引入defineStore用于创建store
import { defineStore } from "pinia"
import { ref } from "vue"
import type { UploadRawFile } from "element-plus"
import type { Options, Image } from "@/types/upload"

// 定义并暴露一个store
export const useUploadFileStore = defineStore("upload_file", () => {
  const options = ref<Options>({
    sort: "headImg", //文件分类(文件夹)
    url: "", //显示的文件地址(如果有的话)
    status: 0, //文件状态，0为待审核，1为正常，2为审核未通过
    maxSize: 2, //限制文件最大兆数(MB)
    type: "image", //文件类型,默认为图片(后缀)
  })

  //上一个文件的md5值
  const oldMd5 = ref("")
  //计算文件的MD5值
  const md5 = ref("")

  //上传到服务器的文件
  const uploadFile = ref<UploadRawFile>()
  //控制上传菜单按钮是否显示
  const changeBtnsFlag = ref(false)

  //控制上传状态
  const isLoading = ref(false)
  /**
   * 上传之后获取的文件信息
   */
  const fileInfo = ref<Image>()

  /**
   *  取消上传,重置部分参数
   */
  function cancelUpload() {
    md5.value = ""
    uploadFile.value = undefined
    // changeBtnsFlag.value = false
    options.value.url = ""
  }

  /**
   * 重置全部参数
   */
  const resetUpload = () => {
    //还原成默认
    options.value = {
      sort: "headImg",
      url: "",
      status: 0,
      maxSize: 2,
      type: "image",
    }
    cancelUpload()
    oldMd5.value = ""
    changeBtnsFlag.value = false
  }

  return { options, oldMd5, md5, uploadFile, changeBtnsFlag, isLoading, fileInfo, cancelUpload, resetUpload }
})
