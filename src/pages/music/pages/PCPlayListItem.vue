<template>
  <div class="musicDiv" :class="{ isActive: songInfo.id === activeItemId }" @click="activeItemId = songInfo.id">
    <div class="songInfo">
      <div>
        {{ index + 1 }}
        <div class="relative">
          <img class="albumPic" :src="songInfo.album.pic_url" />
          <div class="playIcon absolute z-2 w-1/2 translate-x-1/2">
            <SVG_music_playing_indicator v-show="songInfo.id === thisMusic.id" />
          </div>
        </div>
        <div>
          {{ songInfo.name || "未命名" }}
          <span style="opacity: 0.5">
            &ensp;&#8209;&ensp;{{
              songInfo.artists.length !== 0 ? songInfo.artists.map((artist) => artist.name).join("&") : "未知艺术家"
            }}
          </span>
          &ensp; <el-text v-if="songInfo.fee === 1" type="danger">[VIP]</el-text>
        </div>
        <div class="btns">
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
          <el-button link type="danger" @click="deleteMusicFromPlayList(songInfo.id)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="album">{{ songInfo.album.name }}</div>
    <div class="playIcon">
      <SVG_music_playing_indicator v-show="songInfo.id === thisMusic.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
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

const { drawerSize } = toRefs(responsiveStore)
const { thisMusic, isPlaying } = toRefs(musicListStore)
const { deleteMusicFromPlayList } = musicListStore

const { showMusicListDrawer } = useMusic()
const { toggleMusic, play } = useMusicPlay()
const { songInfo, index } = defineProps(["songInfo", "index"]) as {
  songInfo: CloudSongInfo
  index: number
}

const playTheMusic = (musicInfo: CloudSongInfo, index: number) => {
  //如果是当前播放的歌曲，则暂停
  if (musicInfo.id === thisMusic.value.id) {
    play({})
    console.log("当前播放的歌曲")
  } else toggleMusic({ index })
}

/**当前选中的元素的id*/
const activeItemId = ref(-1)
</script>

<style scoped>
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
    margin: 0 15px;
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

  /* 播放图标 */
  .playIcon {
    /* 限制宽度*/
    flex: 0 0 30px;
    fill: skyblue;
    display: flex;
    align-items: center;
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
</style>
