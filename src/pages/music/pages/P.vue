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
      <div class="musicDiv title"><span>标题</span><span>专辑</span></div>
      <template v-for="(item, index) in songsList" :key="index">
        <div class="musicDiv" :class="{ isActive: item.id === thisMusic.id }">
          <div class="songInfo">
            <div>
              <img class="albumPic" :src="item.album.pic_url" />
              <span
                >{{ index + 1 }}、{{ item.name || "未命名" }} -
                {{ item.artists.length !== 0 ? item.artists.map((artist) => artist.name).join("&") : "未知艺术家" }} </span
              >&ensp; <el-text v-if="item.fee === 1" type="danger">[VIP]</el-text>
            </div>
            <div class="btns">
              <el-button link size="small" type="primary" @click="playTheMusic(item, index)">
                {{ item.id === thisMusic.id && isPlaying ? "暂停" : "播放" }}
              </el-button>
              <el-button link size="small" type="primary" @click="showMusicListDrawer([item.id])"> 收藏 </el-button>
              <el-button
                v-if="item.cloud_music_id || item.id"
                link
                size="small"
                type="primary"
                @click="musicPlayUtils.shareMusicLink(item)"
              >
                分享
              </el-button>
              <el-button
                v-if="item.cloud_music_id"
                link
                size="small"
                target="_blank"
                type="primary"
                @click="musicListUtils.goToCloudMusic(item.cloud_music_id)"
              >
                前往网易云
              </el-button>
              <el-button link type="danger" @click="deleteMusicFromPlayList(item.id)">删除</el-button>
            </div>
          </div>
          <div class="album">{{ item.album.name }}</div>
          <div class="playIcon">
            <SVG_music_playing_indicator v-show="item.id === thisMusic.id" />
          </div>
        </div>
      </template>
    </el-scrollbar>
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

const { drawerSize, isPC } = toRefs(responsiveStore)
const { thisMusic, isPlaying } = toRefs(musicListStore)
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
}

.title {
  pointer-events: none;
  border-bottom: 1px solid #ccc;
}

.musicDiv {
  display: grid;
  grid-template-columns: 3fr 2fr 30px;
  padding: 2px 15px;
  text-align: left;
  align-items: center;
  transition: all 0.2s linear;
  cursor: pointer;

  .albumPic {
    width: 50px;
    height: 50px;
    padding-right: 15px;
  }
  .album {
    opacity: 0.5;
  }

  .songInfo,
  .songInfo div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* flex-direction: column; */
  }
}

.musicDiv button:hover {
  color: currentColor;
  transform: scale(1.1);
  background-color: transparent;
}

/* 音乐底部菜单 */
.musicDiv .btns {
  height: 20px;
  overflow: hidden;
  text-align: right;
  padding-right: 20px;
  opacity: 0;
  transition: all 0.3s ease;
}

.musicDiv:hover,
.isActive {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 5px;
}

.musicDiv:hover .btns {
  opacity: 1;
}

/* 播放图标 */
.musicDiv .playIcon {
  /* 限制宽度*/
  flex: 0 0 30px;
  fill: skyblue;
  display: flex;
  align-items: center;
}
</style>
