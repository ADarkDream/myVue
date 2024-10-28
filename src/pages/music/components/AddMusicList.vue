<template>

  <el-form :model="formData">
    <el-form-item>
      <el-input placeholder="歌单命名" v-model.trim="formData.name" @keyup.enter="createMusicList" />
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
  </el-form>

</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
//utils
import musicList from "@/utils/music/musicList";


const { close } = defineProps(['close'])


const isOpen = ref(false)

const formData = reactive({
  name: '',
  pic_url: '',
  status: isOpen.value ? 2 : 1
})




const createMusicList = async () => {
  try {
    const { status, msg, data } = await musicList.createMusicList(formData)
    if (status === 200) {
      ElMessage.success(msg + 'music_list_id为：' + data.music_list_id)
      close()
    }

  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}
defineExpose({ addMusicList: createMusicList })
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
</style>
