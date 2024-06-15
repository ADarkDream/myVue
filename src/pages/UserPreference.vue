<template>
  <el-header class="header1">
    偏好设置
  </el-header>
  <el-card header="我的背景图">
    <el-space>
      <el-switch v-model="isOpen" inline-prompt active-text="应用" inactive-text="去除" size="large" v-if="isShow"/>
      <el-button type="primary" @click="dialogVisible=!dialogVisible" :icon="UploadFilled">上传</el-button>
      <el-button type="danger" :icon="Delete" @click="deleteRow"  v-if="isShow">删除</el-button>
    </el-space>
    <template #footer>
      <el-image :src="bgUrl"/>
    </template>
  </el-card>

  <!--图片上传框-->
  <el-dialog v-model="dialogVisible" :show-close="false" title="上传图片">
    <UploadImage/>
  </el-dialog>
</template>

<script setup lang="ts">

import UploadImage from "@/components/UploadImage.vue";
import useUserInfo from '@/hooks/useUserInfo'
import {ref, watch} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Delete, UploadFilled} from "@element-plus/icons-vue";
import axios from "axios";
//获取本地存储的用户信息
const {bgUrl, updateLocalUserInfo} = useUserInfo()
const dialogVisible = ref(false)
const isShow = ref(false)
const isOpen = ref(false)
if ( bgUrl.value !=='') {
  isShow.value = true
  localStorage.setItem('userBGUrl', bgUrl.value)
}else  isShow.value = false
if (localStorage.getItem('useUserBGUrl') === '1') isOpen.value = true

console.log(isShow.value)

const body = (document.querySelector('body') as HTMLElement)


watch(isOpen, (newVal, oldVal) => {
  if (newVal === true) {
    localStorage.setItem('useUserBGUrl', '1')
    body.style.backgroundImage = `url(${bgUrl.value})`
  } else {
    localStorage.setItem('useUserBGUrl', '0')
    body.style.backgroundImage = `url(${localStorage.getItem('bgUrl')})`
  }
})


//删除文章确认
const deleteRow = () => {
  ElMessageBox.confirm(
      `注意：该图片不会从服务器删除，只是不会在你的背景图列表显示。`,
      '确认删除该背景图吗?',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消删除',
        type: 'warning',
        showClose: false
      }
  ).then(() => {
    deleteBGImage()
  })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '删除操作已取消',
        })
      })
}


function deleteBGImage() {
  axios({
    url: '/updateImgUrl',
    method: 'post',
    data:{}
  }).then(result => {
    console.log(result)
    const {msg} = result.data
    ElMessage.success(msg)
    localStorage.removeItem('useUserBGUrl')
    localStorage.removeItem('userBGUrl')
    updateLocalUserInfo({bgUrl: ''})
    bgUrl.value=''
    isShow.value=false
    body.style.backgroundImage = `url(${localStorage.getItem('bgUrl')})`
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    //ElMessage.error('发生错误：' + error.message)
  })
}
</script>

<style scoped>

</style>