import { ref } from "vue";
import { ElMessage, type UploadFile } from "element-plus";
import * as SparkMD5 from "spark-md5";//ts中这么导入
import axios from "axios";

export default function () {
    //计算图片的MD5值
    const md5 = ref(sessionStorage.getItem('md5') || '')
    //显示的图片文件
    const imgUrl = ref()

    //用户上传的头像文件
    const avatarFile = ref()
    //上传到服务器的头像文件
    const avatar = ref()
    //控制头像上传按钮是否显示
    const changeHeadImgBtnFlag = ref(false)

    const headImgDialogVisible = ref(false)

    //当用户选择图片之后开始解析图片和计算md5
    function fileChange(file: UploadFile) {
        changeHeadImgBtnFlag.value = true
        let fileReader = new FileReader()
        let Spark = new SparkMD5.ArrayBuffer()
        fileReader.readAsArrayBuffer(file.raw)
        fileReader.onload = function (e: ProgressEvent<FileReader>) {
            // //将用户上传的图片转换成url赋值给头像
            imgUrl.value = URL.createObjectURL(file.raw)
            Spark.append(e.target.result as ArrayBuffer)
            md5.value = Spark.end()
            // console.log(md5.value)
        }

        //上一张图片的md5值
        const oldMd5 = ref(sessionStorage.getItem('md5') || '')
        //取消本次上传的文件
        if (md5.value === oldMd5.value) return
        avatar.value = file.raw
        // updateAvatar(file.raw)
    }

    //头像上传函数
    const updateAvatar = (file: File) => {
        if (file === null) return ElMessage.info('请先选择图片再上传')
        if (['image/png', 'image/jpeg', 'image/jpg'].indexOf(file.type) === -1) return ElMessage.error('仅支持PNG/JPEG/JPG格式')
        if (file.size / 1024 / 1024 > 2) return ElMessage.error('头像文件大小不能超过2MB')
        // 创建form对象,并加入要传递的参数
        let param = new FormData()
        param.append('file', file)
        // console.log('md5:', md5.value)
        param.append('md5', md5.value)
        param.append('sort', 'headImg')
        axios({
            url: '/upload',
            method: 'post',
            // headers: {'Content-Type': 'multipart/form-data'},
            data: param
        }).then(result => {
            // console.log(result)
            const { msg, imgUrl } = result.data as { status: number, msg: string, imgUrl: string }
            ElMessage.success(msg)
            console.log('获取成功：', imgUrl)
            setTimeout(() => {
                location.reload()
            }, 1000)
        }).catch(error => {
            console.log(error)
        })

    };
    //取消上传
    function cancel() {
        //还原成默认头像头像
        headImgUrl.value = getLocalUserInfo('headImgUrl')
        avatarFile.value = ''
        avatar.value = ''
        headImgDialogVisible.value = false
    }

    return { fileChange, updateAvatar, cancel, imgUrl, changeHeadImgBtnFlag, headImgDialogVisible }
}
