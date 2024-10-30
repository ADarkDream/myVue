// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { ref } from "vue";
import type { UploadFile, UploadRawFile } from 'element-plus';
import type { Image } from '@/types/upload';

// 定义并暴露一个store
export const useUploadImageStore = defineStore('upload_image', () => {
    const options = ref({
        sort: 'headImg',//图片类别
        imgUrl: '',//显示的图片文件
        status: 0,//图片状态，0为待审核，1为正常，2为审核未通过
        maxSize: 2//限制图片最大MB
    })


    //上一张图片的md5值
    const oldMd5 = ref('')
    //计算图片的MD5值
    const md5 = ref('')


    //上传到服务器的图片文件
    const uploadImgFile = ref<UploadRawFile>()
    //控制上传菜单按钮是否显示
    const changeBtnsFlag = ref(false)

    //控制上传状态
    const isLoading = ref(false)
    /**
     * 上传之后获取的图片信息
     */
    const imageInfo = ref<Image>()

    /**
     *  取消上传,重置部分参数
     */
    function cancelUpload() {
        md5.value = ''
        uploadImgFile.value = undefined
        // changeBtnsFlag.value = false
        options.value.imgUrl = ''
    }

    /**
     * 重置全部参数
     */
    const resetUpload = () => {
        //还原成默认
        options.value = {
            sort: 'headImg',
            imgUrl: '',
            status: 0,
            maxSize: 2
        }
        cancelUpload()
        oldMd5.value = ''
        changeBtnsFlag.value = false
    }


    return { options, oldMd5, md5, uploadImgFile, changeBtnsFlag, isLoading, imageInfo, cancelUpload, resetUpload }
})
