<template>
  <div>
    <div class="playListBar">
      <template v-if="isBatchOperation">
        <el-button :icon="Close" @click="switchBatchOperation()">取消操作</el-button>
        <el-button-group>
          <el-button v-if="isCheckAll" :icon="CircleClose" @click="toggleCheckAll()">取消全选</el-button>
          <el-button v-else :icon="CircleCheck" @click="toggleCheckAll()">全选</el-button>
          <el-button :icon="Star" @click="showMusicListDrawer(checkedIdList)">批量收藏</el-button>
          <el-button :icon="Delete" @click="deleteMusicFromPlayList(checkedIdList)">批量删除</el-button>
        </el-button-group>
      </template>
      <template v-else>
        <el-button :icon="Operation" @click="switchBatchOperation()">批量操作</el-button>
        <el-button :icon="Delete" @click="clearPlayList">清空列表</el-button>
      </template>
    </div>
    <el-empty v-if="songsList.length === 0" class="emptyDiv" description=" ">
      <template #default>
        <p>请先搜索或添加歌曲</p>
        <el-link type="primary" @click="changePanelIndex(0)">前往搜索</el-link>
      </template>
    </el-empty>
    <el-scrollbar v-else :height="(height || drawerSize - 80) - 40">
      <div v-if="responsiveStore.isPC" class="title">
        <span>序号</span><span style="margin: 0 15px">专辑图</span><span>标题</span><span>专辑</span><span>时长</span>
      </div>
      <template v-for="(item, index) in songsList" :key="index">
        <PCPlayListItem
          v-if="responsiveStore.isPC"
          :checked-id-list="checkedIdList"
          :check-music="checkMusic"
          :song-info="item"
          :index="index"
          :is-batch-operation="isBatchOperation"
        />
        <PhonePlayListItem
          v-else
          :checked-id-list="checkedIdList"
          :check-music="checkMusic"
          :song-info="item"
          :index="index"
          :is-batch-operation="isBatchOperation"
        /> </template
    ></el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
import { Operation, Close, Star, Delete, CircleCheck, CircleClose } from "@element-plus/icons-vue"
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { useMainPanelConfigStore } from "@/store/useMainPanelConfigStore"
//hooks
import useMusicPlay from "@/hooks/music/useMusicPlay"
import useMusic from "@/hooks/music/useMusic"
//utils

//types
import type { CloudSongInfo } from "@/types/music"
//files
import PCPlayListItem from "./PCPlayListItem.vue"
import PhonePlayListItem from "./PhonePlayListItem.vue"

const responsiveStore = useResponsiveStore()
const musicListStore = useMusicListStore()
const mainPanelConfigStore = useMainPanelConfigStore()

const { drawerSize } = toRefs(responsiveStore)

const { deleteMusicFromPlayList, clearPlayList } = musicListStore
const { changePanelIndex } = mainPanelConfigStore
const { showMusicListDrawer } = useMusic()

const { songsList, height } = defineProps(["songsList", "height"]) as {
  songsList: CloudSongInfo[]
  height: number
}

/** 是否处于批量操作 */
const isBatchOperation = ref(false)

/** 当前(批量操作)选中的歌曲id列表 */
const checkedIdList = ref<number[]>([])

/** 是否处于全选 */
const isCheckAll = computed(() => {
  return checkedIdList.value.length === songsList.length
})

/**切换批量操作状态*/
const switchBatchOperation = () => {
  isBatchOperation.value = !isBatchOperation.value
  checkedIdList.value = []
}

/**从批量操作列表中添加或删除歌曲Id*/
const checkMusic = (id: number) => {
  if (!isBatchOperation.value) {
    checkedIdList.value = [id]
  } else if (checkedIdList.value.includes(id)) {
    checkedIdList.value = checkedIdList.value.filter((item) => item !== id)
  } else {
    checkedIdList.value.push(id)
  }
}

/** 全选或取消全选 */
const toggleCheckAll = () => {
  if (isCheckAll.value) {
    checkedIdList.value = []
  } else {
    checkedIdList.value = songsList.map((item) => item.id)
  }
}
</script>

<style scoped>
.playListBar {
  height: 30px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;

  .el-text {
    font-size: 20px;
  }
}
.title {
  display: grid;
  grid-template-columns: 45px 80px 2fr 1fr 30px;
  padding: 10px 15px 5px 0;
  text-align: left;
  text-wrap: nowrap;
}
</style>
