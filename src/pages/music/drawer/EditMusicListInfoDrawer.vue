<template>
  <!--新建歌单的窗口-->
  <el-drawer v-model="isShowEditMusicListInfoDrawer" :show-close="false" direction="btt" :append-to-body="true"
    size="50%" destroy-on-close :close="resetUpload()">
    <template #header>
      <div style="display: flex;justify-content: space-between">
        <el-button link @click="isShowEditMusicListInfoDrawer = false">取消</el-button>
        <el-button link @click="editMusicListInfo">完成</el-button>
      </div>
    </template>
    <el-form :model="formData">
      <el-row :gutter="20" style="display: flex;justify-content: center;">
        <el-col :xs="8" :sm="12" :md="12" :lg="6" :xl="6">
          <el-form-item>
            <UploadImage />
          </el-form-item>
        </el-col>
        <el-col :xs="16" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item :required="true">
            <el-input placeholder="歌单命名" v-model.trim="formData.name" />
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" placeholder="歌单介绍" v-model.trim="formData.description" />
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" placeholder="封面地址(若不填则使用歌单最新一首歌的封面)" v-model.trim="formData.pic_url"
              :disabled="isLoading" />
          </el-form-item>
          <el-form-item>
            <label class="container" :class="{ active: isOpen }">
              <input type="checkbox" v-model="isOpen">
              <svg viewBox="0 0 64 64">
                <path
                  d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                  pathLength="575.0541381835938" class="path"></path>
              </svg>
              <span>公开</span>
            </label>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";

//stores
import { useMusicListDrawerStore } from "@/store/music/useMusicListDrawerStore";
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useUploadImageStore } from "@/store/upload/uploadImageStore";
//hooks
import useMusicList from "@/hooks/music/useMusicList"
//components
import UploadImage from "@/components/UploadImage.vue";
//utils
import regexRules from "@/utils/regexRules";

//files


const musicListDrawerStore = useMusicListDrawerStore()
const userInfoStore = useUserInfoStore()
const uploadImageStore = useUploadImageStore()
const { uid } = toRefs(userInfoStore)
const { isShowEditMusicListInfoDrawer, formData } = toRefs(musicListDrawerStore)
const { options, isLoading, imageInfo } = toRefs(uploadImageStore)
const { resetUpload } = uploadImageStore
const { createMusicList } = useMusicList()



//歌单是否公开
const isOpen = ref(false)



onMounted(() => {
  options.value.sort = '/album/cover'
  options.value.imgUrl = computed(() => {
    const { pic_url, default_cover_url } = formData.value
    if (pic_url) return pic_url
    else if (default_cover_url) return default_cover_url
    else return ''
  }).value
})

watch(isLoading, (newVal, oldVal) => {
  if (newVal === oldVal) return
  if (newVal === false && imageInfo.value) {
    formData.value.pic_url = imageInfo.value.imgUrl
  }
})


// 创建歌单
const editMusicListInfo = async () => {
  formData.value.status = isOpen.value ? 2 : 1
  const { name, pic_url } = formData.value

  if (!name) return ElMessage.info('歌单名称不能为空')
  if (pic_url && !regexRules.url.test(pic_url)) return ElMessage.info('请输入一个网址链接')
  await createMusicList(formData.value)

  //重置表单
  formData.value = {
    music_list_id: 0,
    name: '',
    uid: uid.value!,
    pic_url: '',
    default_cover_url: '',
    description: '',
    status: isOpen.value ? 2 : 1,
    songsCount: 0,
    created_time: new Date(),
    updated_time: new Date()
  }
  isOpen.value = false
}



</script>

<style scoped>
.el-form {
  width: 80%;
  margin: 0 auto;

}







/*region单选框样式*/
.container {
  cursor: pointer;
  display: flex;
  color: var(--borderColor)
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
  transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
  stroke-dasharray: 241 9999999;
  stroke-dashoffset: 0;
}

.container input:checked~svg .path {
  stroke-dasharray: 70.5096664428711 9999999;
  stroke-dashoffset: -262.2723388671875;
}

/*endregion*/

.btns {
  margin: 0 auto;
  display: flex;
  justify-content: center;
}


@media (max-width:980px) {
  .el-form {
    width: 95%;
  }

}
</style>
