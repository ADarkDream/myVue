<template>
  <div class="userPreference">
    <el-header v-if="isPC" class="header1">
      偏好设置<el-text v-if="isLoading" type="warning">&ensp;审核中...</el-text>
    </el-header>
    <el-main>
      <div style="margin-bottom: 20px">
        自定义网站背景图。图片上传之后会自动审核。若图片没有成功加载,可能是<el-text type="warning">图片违规</el-text>或<el-text
          type="danger"
          >服务器错误</el-text
        >
      </div>
      <div>
        <el-space v-if="isShow && !dialogVisible">
          <el-switch v-model="useUserBGUrl" active-text="应用" inactive-text="去除" inline-prompt size="large" />
          <el-button :icon="UploadFilled" type="primary" @click="dialogVisible = true">上传</el-button>
          <el-button :icon="Delete" type="danger" @click="deleteRow()">删除</el-button>
        </el-space>
      </div>

      <el-image v-if="isShow && !dialogVisible" :src="bgUrl" style="width: 50%" />
      <!--图片上传框-->
      <UploadImage v-if="!isShow || dialogVisible" />
      <el-button v-if="dialogVisible" style="margin-top: 10px" type="primary" @click="dialogVisible = false">取消上传</el-button>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, watch, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { Delete, UploadFilled } from "@element-plus/icons-vue"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { useUploadFileStore } from "@/store/upload/uploadFileStore"
//hooks
import useTitleDiv from "@/hooks/useTitleDiv"
//components
import UploadImage from "@/components/UploadImage.vue"
//utils
import userInfo from "@/utils/userInfo"

const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const uploadFileStore = useUploadFileStore()

//获取本地存储的用户信息
const { bgUrl, useUserBGUrl } = toRefs(userInfoStore)
const { updateLocalUserInfo } = userInfoStore
const { isPC } = toRefs(responsiveStore)
const { options, isLoading, fileInfo } = toRefs(uploadFileStore)
const { resetUpload } = uploadFileStore
const { toggleBG } = useTitleDiv()
const { updateImgUrl } = userInfo

const changeBgUrl = () => {
  options.value = {
    sort: "bg",
    url: "",
    status: 0,
    maxSize: 2,
  }

  watch(isLoading, async (newVal, oldVal) => {
    if (newVal === oldVal) return
    if (newVal === false && fileInfo.value) {
      const image_info = await updateImgUrl(fileInfo.value)
      if (!image_info) throw Error

      updateLocalUserInfo({ bgId: image_info.id })
      toggleBG({ newBgUrl: image_info.imgUrl })
      useUserBGUrl.value = true
      resetUpload()
      dialogVisible.value = false
    }
  })
}

const dialogVisible = ref(false)
//是否显示菜单
const isShow = computed(() => !!bgUrl.value)

onMounted(() => {
  changeBgUrl()
})

//删除背景图确认
const deleteRow = () => {
  ElMessageBox.confirm(`注意：该图片不会从服务器删除，只是不会在你的背景图列表显示。`, "确认删除该背景图吗?", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消删除",
    type: "warning",
    showClose: false,
  })
    .then(() => {
      updateImgUrl({ sort: "bg" })
      useUserBGUrl.value = false
      bgUrl.value = ""
      toggleBG({})
    })
    .catch(() => ElMessage.info("删除操作已取消"))
}
</script>

<style scoped></style>
