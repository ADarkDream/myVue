<template>
  <!--新建歌单的窗口-->
  <div class="editMusicListInfoDrawer">
    <div class="header">
      <el-button link @click="isShowEditMusicListInfoDrawer = false">取消</el-button>
      <el-button :disabled="isLoading" link @click="editMusicListInfo">{{ isCreateFlag ? "创建" : "修改" }}</el-button>
    </div>
    <el-form label-position="top" :model="formData">
      <el-row :gutter="20" style="display: flex; justify-content: center">
        <el-col :lg="6" :md="12" :sm="12" :xl="6" :xs="8">
          <el-form-item>
            <UploadImage />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="16">
          <el-form-item label="歌单命名：" :required="true">
            <el-input v-model.trim="formData.name" placeholder="听别人的故事，印证自己的心事" />
          </el-form-item>
          <el-form-item label="歌单介绍：">
            <el-input v-model.trim="formData.description" placeholder="希望是个小小故事，献给小小的人儿。" type="textarea" />
          </el-form-item>
          <el-form-item label="封面地址：">
            <el-input
              v-model.trim="formData.pic_url"
              :disabled="isLoading"
              placeholder="封面地址(若不填则使用歌单最新一首歌的封面)"
              type="textarea"
            />
          </el-form-item>
          <el-form-item>
            <label class="container" :class="{ active: isOpen }">
              <input v-model="isOpen" type="checkbox" />
              <svg viewBox="0 0 64 64">
                <path
                  class="path"
                  d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                  pathLength="575.0541381835938"
                ></path>
              </svg>
              <span>公开</span>
            </label>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, watch } from "vue"
//stores
import { useMusicListDrawerStore } from "@/store/music/useMusicListDrawerStore"
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useUploadFileStore } from "@/store/upload/uploadFileStore"
//hooks
import useMusicList from "@/hooks/music/useMusicList"
//components
import UploadImage from "@/components/UploadImage.vue"
//utils
import regexRules from "@/utils/regexRules"

//files

const musicListDrawerStore = useMusicListDrawerStore()
const userInfoStore = useUserInfoStore()
const uploadFileStore = useUploadFileStore()
const { uid } = toRefs(userInfoStore)
const { isShowEditMusicListInfoDrawer, formData, isCreateFlag } = toRefs(musicListDrawerStore)
const { reSetFormData } = musicListDrawerStore
const { options, isLoading, fileInfo } = toRefs(uploadFileStore)
const { createMusicList, updateMusicList } = useMusicList()

//歌单是否公开
const isOpen = computed({
  get: () => formData.value.status === 2,
  set: (is_open: boolean) => (formData.value.status = is_open ? 2 : 1),
})

onMounted(() => {
  options.value.sort = "album/cover"
  options.value.type = "image"
  options.value.url = computed(() => {
    const { pic_url, default_cover_url } = formData.value
    if (pic_url) return pic_url
    else if (default_cover_url) return default_cover_url
    else return ""
  }).value
})

watch(isLoading, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal === false && fileInfo.value) {
    formData.value.pic_url = fileInfo.value.imgUrl
    options.value.url = formData.value.pic_url
  }
})

/**
 * 创建或更新歌单
 */
const editMusicListInfo = async () => {
  const { name, pic_url } = formData.value

  if (!name) return ElMessage.info("歌单名称不能为空")
  if (pic_url && !regexRules.url.test(pic_url)) return ElMessage.info("请输入一个网址链接")
  if (isCreateFlag.value)
    //创建歌单
    await createMusicList(formData.value) //修改歌单信息
  else await updateMusicList(formData.value)

  //重置表单
  reSetFormData()
  // isOpen.value = false
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.el-form {
  width: 80%;
  margin: 0 auto;
}

/*region单选框样式*/
.container {
  cursor: pointer;
  display: flex;
  color: var(--borderColor);
}

.container input {
  display: none;
}

.container svg {
  overflow: visible;
  width: 15px;
  margin-right: 5px;
}

/*选中的颜色*/
.active {
  color: var(--el-color-primary);
}

.path {
  fill: none;
  stroke: currentColor;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition:
    stroke-dasharray 0.5s ease,
    stroke-dashoffset 0.5s ease;
  stroke-dasharray: 241 9999999;
  stroke-dashoffset: 0;
}

.container input:checked ~ svg .path {
  stroke-dasharray: 70.5096664428711 9999999;
  stroke-dashoffset: -262.2723388671875;
}

/*endregion*/

.btns {
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

@media (max-width: 780px) {
  .el-form {
    width: 95%;
  }
}
</style>
