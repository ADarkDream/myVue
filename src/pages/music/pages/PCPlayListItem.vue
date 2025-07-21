<template>
  <div class="musicDiv" :class="{ isActive: checkedIdList.includes(songInfo.id) }" @click="checkMusic(songInfo.id)">
    <div>{{ index + 1 }}</div>
    <div class="relative">
      <div class="albumPic" :style="{ backgroundImage: `url(${songInfo.album.pic_url})` }"></div>
      <div class="audioSvg fill-[skyblue] absolute z-2 translate-y-[-100%]">
        <SVG_music_playing_indicator v-show="songInfo.id === thisMusic.id" />
        <!-- 播放图标 -->
        <!-- 暂停图标 -->
      </div>
    </div>
    <div class="flex-1 flex justify-between">
      <div class="songName">
        {{ songInfo.name || "未命名" }}
        <span style="opacity: 0.5">
          &ensp;&#8209;&ensp;{{
            songInfo.artists.length !== 0 ? songInfo.artists.map((artist) => artist.name).join("&") : "未知艺术家"
          }}
        </span>
        &ensp; <el-text v-if="songInfo.fee === 1" type="danger">[VIP]</el-text>
      </div>
      <div v-show="!isBatchOperation" class="btns">
        <el-button link size="small" type="primary" @click="playTheMusic(songInfo, index)">
          {{ songInfo.id === thisMusic.id && isPlaying ? "暂停" : "播放" }}
        </el-button>
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
        <el-button link type="danger" @click="deleteMusicFromPlayList([songInfo.id])">删除</el-button>
      </div>
    </div>

    <div class="album">{{ songInfo.album.name }}</div>
    <div class="playIcon">
      {{ getTime(songInfo.duration) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore"
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

const musicListStore = useMusicListStore()

const { thisMusic, isPlaying } = toRefs(musicListStore)
const { deleteMusicFromPlayList } = musicListStore

const { showMusicListDrawer } = useMusic()
const { toggleMusic, play } = useMusicPlay()
const { songInfo, index, isBatchOperation, checkedIdList, checkMusic } = defineProps([
  "songInfo",
  "index",
  "isBatchOperation",
  "checkedIdList",
  "checkMusic",
]) as {
  songInfo: CloudSongInfo
  index: number
  isBatchOperation: boolean
  /**当前选中的歌曲id列表*/
  checkedIdList: number[]
  checkMusic: (id: number) => void
}

const playTheMusic = (musicInfo: CloudSongInfo, index: number) => {
  //如果是当前播放的歌曲，则暂停
  if (musicInfo.id === thisMusic.value.id) {
    play({})
    console.log("当前播放的歌曲")
  } else toggleMusic({ index })
}

/**格式化播放时长*/
const getTime = (time?: number) => {
  if (!time) return ""
  const seconds = Number(time)
  const minutes = Math.floor(seconds / 60)
  let second = (seconds % 60).toFixed(0)
  if (second.length < 2) second = "0" + second
  return `${minutes}:${second}`
}
</script>

<style scoped>
.musicDiv {
  display: grid;
  grid-template-columns: 30px 80px 2fr 1fr 30px;
  padding: 2px 15px;
  text-align: left;
  align-items: center;
  transition: all 0.2s linear;
  cursor: pointer;

  .albumPic {
    width: 50px;
    height: 50px;
    margin: 0 auto;
    background-size: cover;
  }
  .audioSvg {
    width: 50px;
    height: 50px;
    margin: 0 15px;
  }
  .album {
    opacity: 0.5;
  }

  .songInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* flex-direction: column; */
  }

  .songName {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  /* opacity: 0; */
  display: none;
  transition: all 0.3s ease;
}

.musicDiv:hover,
.isActive {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 5px;

  .songName {
    overflow: hidden;
  }
}

.musicDiv:hover .albumPic::after {
  content: "";
  position: absolute;
  margin: 0 15px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(95, 95, 95, 0.7);
  border-radius: var(--borderRadius);
}

.musicDiv:hover .btns {
  /* opacity: 1; */
  display: inline-block;
}
</style>
