<template>
  <!--音乐上传框-->
  <div class="uploadAudio" :style="isAdmin ? '' : 'flex-direction: column;'">
    <el-upload
      ref="upload"
      :auto-upload="false"
      class="uploadDiv"
      accept="image/img,image/png,image/jpg,image/jpeg"
      drag
      :limit="1"
      :on-change="fileChange"
      :on-exceed="handleExceed"
      :show-file-list="false"
    >
      <el-image
        class="uploadImg"
        :class="{ isBg: options.sort === 'bg' && options.url }"
        fit="cover"
        :src="options.url"
        title="点击上传图像"
      >
        <template #error>
          <div style="width: 100%">
            <SVG_plus class="svg" />
            <el-text v-if="isPC" tag="p" type="info">支持拖拽上传</el-text><br />
          </div>
        </template>
      </el-image>
      <template #tip>
        <div class="upload_desc">
          <el-text type="info">.mp4/m4a/flac</el-text>
          <el-text type="info">&lt;{{ options.maxSize }}MB</el-text>
        </div>
      </template>
    </el-upload>
    <div class="options">
      <div v-if="changeBtnsFlag && isAdmin">
        <div>
          <span>选择分类：</span>
          <el-select v-model="options.sort" class="select" default-first-option placeholder="选择分类(默认为头像)">
            <el-option label="头像" value="headImg" />
            <el-option label="背景" value="bg" />
            <el-option v-if="isAdmin" label="黑名单" style="color: red" value="blacklist" />
          </el-select>
        </div>
        <div v-if="isAdmin">
          选择状态：
          <el-select v-model="options.status" default-first-option placeholder="选择状态(默认为待审核)">
            <el-option label="待审核" :value="0" />
            <el-option label="审核通过" :value="1" />
            <el-option label="黑名单" style="color: red" :value="2" />
          </el-select>
        </div>
      </div>
      <div v-show="changeBtnsFlag" class="changeBtns">
        <el-button-group>
          <el-button type="danger" @click="cancelUpload">删除</el-button>
          <el-button @click="imgFullDialogVisible = true">浏览</el-button>
          <el-button :loading="isLoading" type="primary" @click="uploadImage(uploadFile!)">{{
            isLoading ? "审核中" : "上传"
          }}</el-button>
        </el-button-group>
      </div>
    </div>

    <!--  头像大图浏览框-->
    <el-dialog
      v-model="imgFullDialogVisible"
      fullscreen
      :show-close="false"
      style="background-color: transparent"
      @click="imgFullDialogVisible = !imgFullDialogVisible"
    >
      <img alt="Preview Image" :src="options.url" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"

//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useUploadFileStore } from "@/store/upload/uploadFileStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
//hooks

import useUploadImage from "@/hooks/upload/useUploadImage"
//files
import SVG_plus from "@/assets/music/plus.svg?component"

const userInfoStore = useUserInfoStore()
const uploadFileStore = useUploadFileStore()
const responsiveStore = useResponsiveStore()
const { isAdmin } = toRefs(userInfoStore)
const { options, isLoading, uploadFile, changeBtnsFlag } = toRefs(uploadFileStore)
const { cancelUpload } = uploadFileStore
const { isPC } = toRefs(responsiveStore)
const { fileChange, computedMd5, uploadImage } = useUploadImage()

/**
 *  控制是否全屏浏览
 */
const imgFullDialogVisible = ref(false)

import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus"

const upload = ref<UploadInstance>()

/**
 * 已有文件之后，onchange事件不再触发，此函数覆盖上传
 * @param files
 */
const handleExceed: UploadProps["onExceed"] = (files) => {
  //清除上传输入框的内容
  // upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  computedMd5(file)
  changeBtnsFlag.value = true
  options.value.url = URL.createObjectURL(file)
  uploadFile.value = file
}
</script>

<style scoped>
.uploadImage {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  align-items: center;
  --borderColor: rgba(141, 139, 139, 0.8);
}

.uploadDiv {
  .uploadImg {
    box-sizing: border-box;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    border: 2px solid var(--borderColor);
    border-radius: 15px;
    transition: box-shadow 0.5s ease;
    background: no-repeat center center/cover;

    .svg {
      width: 50px;
      transition: scale 0.5s ease;
      fill: var(--borderColor);
    }

    .upload_desc {
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
    }
  }

  /* 上传背景图时，高度和宽度自适应 */
  .isBg {
    width: 50%;
    height: auto;
  }
}

.options {
  .el-select {
    width: 100px;
    margin: 5px;
  }

  .changeBtns {
    display: block;
    margin-top: 25px;
  }
}

@media (hover: hover) {
  .uploadImg:hover {
    box-shadow: 0 0 2px 2px var(--borderColor);
    cursor: pointer;

    .svg {
      scale: 1.2;
    }
  }
}

@media (max-width: 780px) {
  .uploadDiv {
    .uploadImg {
      width: 110px;
      height: 110px;
    }
  }
}
</style>
<style>
.uploadAudio {
  /* 去除拖拽上传的边框 */
  .el-upload-dragger,
  .el-upload-dragger.is-dragover {
    border: none;
    padding: 0;
    border-radius: 15px;
    margin: 0;
    background-color: transparent;
  }

  .el-image {
    margin: 0 auto;
  }
}
</style>
