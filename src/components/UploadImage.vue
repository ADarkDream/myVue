<template>
  <!--图片上传框-->
  <el-upload :show-file-list="false"
             v-model="avatarFile"
             @change="fileChange"
             :limit="1"
             :accept="'.img,.png,.jpg,.jpeg'">
    <el-image style="width: 50%" title="上传图像" :src="nullImgUrl"/>
  </el-upload>
  <br>
  <div v-show="changeHeadImgBtnFlag">
    选择分类：
    <el-select style="width: 100px;margin-right: 20px" placeholder="选择分类(默认为头像)" v-model="image.sort"
               default-first-option>
      <el-option label="头像" value="headImg"/>
      <el-option label="背景" value="bg"/>
      <el-option v-if="isAdmin" style="color: red" label="黑名单" value="blacklist"/>
    </el-select>
    <span v-if="isAdmin">选择状态：</span>
    <el-select style="width: 100px" placeholder="选择状态(默认为待审核)" v-model="image.status" v-if="isAdmin"
               default-first-option>
      <el-option label="待审核" :value="0"/>
      <el-option label="审核通过" :value="1"/>
      <el-option style="color: red" label="黑名单" :value="2"/>
    </el-select>
  </div>
  <div style="margin: 10px auto" v-show="changeHeadImgBtnFlag">
    <el-button @click="cancel" type="danger">删除</el-button>
    <el-button @click="headImgDialogVisible=true">浏览</el-button>
    <el-button type="primary" @click="updateAvatar(avatar)">上传</el-button>
  </div>

  <!--  头像大图浏览框-->
  <el-dialog v-model="headImgDialogVisible" style="background-color: transparent;"
             @click="headImgDialogVisible=!headImgDialogVisible" fullscreen :show-close="false">
    <img :src="nullImgUrl" alt="Preview Image"/>
  </el-dialog>
</template>

<script setup lang="ts">

import {Delete} from "@element-plus/icons-vue";

import {reactive, ref} from "vue";
import {ElMessage, UploadFile,ElLoading} from "element-plus";
import * as SparkMD5 from "spark-md5";
import axios from "axios";
import useUserInfo from "@/hooks/useUserInfo";

const {updateLocalUserInfo, headImgUrl} = useUserInfo()
const {isAdmin} = useUserInfo()

//计算图片的MD5值
let md5 = ref(sessionStorage.getItem('md5') || '')
//显示的图片文件
let nullImgUrl = ref('https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png')

//用户上传的头像文件
let avatarFile = ref()
//上传到服务器的头像文件
let avatar = ref()
//控制头像上传按钮是否显示
let changeHeadImgBtnFlag = ref(false)

let headImgDialogVisible = ref(false)

const image = reactive({
  sort: 'headImg',
  status: 0
})


//当用户选择图片之后开始解析图片和计算md5
function fileChange(file: UploadFile) {
  changeHeadImgBtnFlag.value = true
  let fileReader = new FileReader()
  let Spark = new SparkMD5.ArrayBuffer()
  fileReader.readAsArrayBuffer(file.raw)
  fileReader.onload = function (e: ProgressEvent<FileReader>) {
    // //将用户上传的图片转换成url赋值给头像
    nullImgUrl.value = URL.createObjectURL(file.raw)
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
  if (file.size / 1024 / 1024 > 2) return ElMessage.error('图片文件大小不能超过2MB')
  // 创建form对象,并加入要传递的参数
  let param = new FormData()
  param.append('file', file)
  // console.log('md5:', md5.value)
  param.append('md5', md5.value)
  param.append('sort', image.sort)
  param.append('status', image.status.toString())
  //控制全屏加载动画的显示
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  axios({
    url: '/upload',
    method: 'post',
    // headers: {'Content-Type': 'multipart/form-data'},
    data: param
  }).then(result => {
    console.log(result)
    loading.close()
    const {status, msg, imgUrl} = result.data as { status: number, msg: string, imgUrl: string }
    if (status === 200) ElMessage.success(msg)
    if (!isAdmin.value) {
      console.log(111)
      if (image.sort === 'headImg') {
        updateLocalUserInfo({headImgUrl: imgUrl})
        // headImgUrl.value=imgUrl
      } else if (image.sort === 'bg') {
        updateLocalUserInfo({bgUrl: imgUrl})
        //修改背景图
      }
    }

    setTimeout(() => {
      location.reload()
    }, 1000)
  }).catch(error => {
    loading.close()
    console.log(error)
    setTimeout(() => {
      cancel()
    }, 2000)
  })

};

//取消上传
function cancel() {
  //还原成默认头像头像
  nullImgUrl.value = 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
  avatarFile.value = ''
  avatar.value = ''
  changeHeadImgBtnFlag.value = false
}


</script>


<style scoped>

</style>