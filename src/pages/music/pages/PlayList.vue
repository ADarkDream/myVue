<template>
  <div>
    <div class="playListBar">
      <el-button :icon="Operation" @click="ElMessage.info('功能开发中')">批量操作</el-button>
      <el-button :icon="Delete" @click="clearPlayList">清空</el-button>
    </div>
    <el-empty v-if="songsList.length === 0" class="emptyDiv" description=" ">
      <template #default>
        <p>请先搜索或添加歌曲</p>
        <el-link type="primary" @click="changePanelIndex(0)">前往搜索</el-link>
      </template>
    </el-empty>
    <el-scrollbar v-else :height="(height || drawerSize - 80) - 40">
      <div v-if="responsiveStore.isPC" class="title"><span>标题</span><span>专辑</span></div>
      <template v-for="(item, index) in songsList" :key="index">
        <PCPlayListItem v-if="responsiveStore.isPC" :song-info="item" :index="index" />
        <PhonePlayListItem v-else :song-info="item" :index="index" /> </template
    ></el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
import { ElMessage } from "element-plus"
import { Operation, Delete } from "@element-plus/icons-vue"
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { useMainPanelConfigStore } from "@/store/useMainPanelConfigStore"
//hooks
import useMusicPlay from "@/hooks/music/useMusicPlay"
import useMusic from "@/hooks/music/useMusic"
//utils
import musicPlayUtils from "@/utils/music/musicPlay"
import musicListUtils from "@/utils/music/musicList"
//types
import type { CloudSongInfo } from "@/types/music"
//files
import SVG_music_playing_indicator from "@/assets/music/music_playing_indicator.svg?component"
import PCPlayListItem from "./PCPlayListItem.vue"
import PhonePlayListItem from "./PhonePlayListItem.vue"

const responsiveStore = useResponsiveStore()
const musicListStore = useMusicListStore()
const mainPanelConfigStore = useMainPanelConfigStore()

const { drawerSize } = toRefs(responsiveStore)
const { thisMusic } = toRefs(musicListStore)
const { deleteMusicFromPlayList, clearPlayList } = musicListStore
const { changePanelIndex } = mainPanelConfigStore

const { showMusicListDrawer } = useMusic()
const { toggleMusic, play } = useMusicPlay()
const { songsList, height } = defineProps(["songsList", "height"]) as {
  songsList: CloudSongInfo[]
  height: number
}

const playTheMusic = (musicInfo: CloudSongInfo, index: number) => {
  //如果是当前播放的歌曲，则暂停
  if (musicInfo.id === thisMusic.value.id) {
    play({})
    console.log("当前播放的歌曲")
  } else toggleMusic({ index })
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

  .title {
    display: grid;
    grid-template-columns: 3fr 2fr 30px;
    padding: 2px 15px;
  }
}
</style>
