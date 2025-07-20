<template>
  <div class="musicDiv" :class="{ isActive: songInfo.id === activeItemId }" @click="activeItemId = songInfo.id">
    <div>
      <div class="songInfo">
        <el-text
          >{{ index + 1 }}、{{ songInfo.name || "未命名" }} -
          {{ songInfo.artists.length !== 0 ? songInfo.artists.map((artist) => artist.name).join("&") : "未知艺术家" }} </el-text
        >&ensp;
        <el-text v-if="songInfo.fee === 1" type="danger">[VIP]</el-text>
      </div>
      <div class="btns">
        <el-button link size="small" type="primary" @click="playTheMusic(songInfo, index)"> 播放 </el-button>
        <el-button link size="small" type="primary" @click="showMusicListDrawer([songInfo.id])"> 收藏 </el-button>
        <el-button
          v-if="songInfo.cloud_music_id || songInfo.id"
          link
          size="small"
          type="primary"
          @click="musicPlayUtils.shareMusicLink(songInfo)"
        >
          分享
        </el-button>
        <el-button
          v-if="songInfo.cloud_music_id"
          link
          size="small"
          target="_blank"
          type="primary"
          @click="musicListUtils.goToCloudMusic(songInfo.cloud_music_id)"
        >
          前往网易云
        </el-button>
        <el-button link type="danger" @click="deleteMusicFromPlayList(songInfo.id)">删除</el-button>
      </div>
    </div>
    <div class="playIcon">
      <SVG_music_playing_indicator v-show="songInfo.id === thisMusic.id" />
    </div>
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

const responsiveStore = useResponsiveStore()
const musicListStore = useMusicListStore()
const mainPanelConfigStore = useMainPanelConfigStore()

const { drawerSize } = toRefs(responsiveStore)
const { thisMusic } = toRefs(musicListStore)
const { deleteMusicFromPlayList, clearPlayList } = musicListStore
const { changePanelIndex } = mainPanelConfigStore

const { showMusicListDrawer } = useMusic()
const { toggleMusic, play } = useMusicPlay()
const { songInfo, index } = defineProps(["songInfo", "index"]) as {
  songInfo: CloudSongInfo
  index: number
}

/**当前选中的元素的id*/
const activeItemId = defineModel("activeItemId", { type: Number, default: -1 })

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
}

.musicDiv {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  text-align: left;
  transition: all 0.2s linear;
  cursor: pointer;
  /* 音乐底部菜单 */
  .btns {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease;
  }
  /* 播放图标 */
  .playIcon {
    /* 限制宽度*/
    flex: 0 0 30px;
    fill: skyblue;
    display: flex;
    align-items: center;
  }
}

.musicDiv:hover,
.isActive {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 5px;
  .btns {
    height: 22px;
  }
}

.musicDiv button:hover {
  color: currentColor;
  transform: scale(1.1);
  background-color: transparent;
}
</style>
