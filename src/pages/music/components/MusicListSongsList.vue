<template>
  <el-scrollbar ref="containerRef" :height="height || (drawerSize - 80)" @scroll="handleScroll">
    <template v-for="(item, index) in songsList" :key="index">
      <div class="musicDiv">
        <el-text>{{ index + 1 }}、{{ item.name || '未命名' }} -
          {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }}
        </el-text>
        <el-text v-if="item.fee === 1" type="danger">[VIP]</el-text><el-text v-if="isPC" type="info"
          style="margin-left:30px ;">[专辑]{{ item.album.name }}</el-text>
        <SVG_music_playing_indicator style="fill: skyblue;height: 20px;margin-left: 20px;"
          v-show="item.id === musicListStore.thisMusic.id" />
        <div>
          <el-button link @click="playTheMusic(item, index)" size="small" type="primary">
            点击播放
          </el-button>
          <el-button link @click="musicListStore.addMusicList([item], { isReplace: true })" size="small" type="primary">
            添加到播放列表
          </el-button>
          <el-button link size="small" type="primary" @click="showMusicListDrawer([item.id])">
            收藏到歌单
          </el-button>
          <el-button link v-if="item.cloud_music_id !== 0" @click="musicPlay.shareMusicLink(item)" size="small"
            type="primary">
            分享
          </el-button>
        </div>
      </div>
    </template>
    <div style="height: 150px;" v-if="!isPC && !isSearchList && songsList.length > 5"></div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from "vue";
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore";
//hooks
import useResponsive from "@/hooks/useResponsive";
import useMusicPlay from "@/hooks/music/useMusicPlay";
import useMusic from "@/hooks/music/useMusic";
//utils
import musicPlay from "@/utils/music/musicPlay";
//types
import type { CloudSongInfo } from "@/types/music";
//files
import SVG_music_playing_indicator from '@/assets/music/music_playing_indicator.svg?component'


const musicListStore = useMusicListStore()


const { drawerSize, isPC } = useResponsive()
const { showMusicListDrawer } = useMusic()

const { addMusicToPlay, toggleMusic, play } = useMusicPlay()
const { songsList, height, isSearchList } = defineProps(['songsList', 'height', 'isSearchList']) as { songsList: CloudSongInfo[], height: number, isSearchList?: boolean }

const containerRef = ref()

const playTheMusic = (musicInfo: CloudSongInfo, index: number) => {
  //如果是当前播放的歌曲，则暂停
  if (musicInfo.id === musicListStore.thisMusic.id) {
    play({})
  }
  //有网易云音乐id，获取播放链接并播放
  else if (musicInfo.cloud_music_id) addMusicToPlay(musicInfo.cloud_music_id, true)
  //没有网易云音乐id(自己添加的)，直接播放【暂时是播放列表】
  else toggleMusic({ index })
}


const handleScroll = () => {
  // const container = containerRef.value
  // if (container.scrollTop + container.clientHeight >= height || (drawerSize.value - 80)) {
  //   // loadMore()
  //   console.log('到底了');
  // }
}

</script>

<style scoped>
.musicDiv {
  padding: 10px 15px;
  text-align: left;
}

.musicDiv:hover {
  background: rgba(255, 255, 255, 0.25);
  transition: all 0.2s linear;
  cursor: pointer;

}

.musicDiv button:hover {
  color: currentColor;
  transform: scale(1.1);
  background-color: transparent;
}
</style>
