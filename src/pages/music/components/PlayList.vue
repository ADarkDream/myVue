<template>
  <div>
    <div class="playListBar">
      <div></div>
      <!-- <el-button :icon="Plus">添加</el-button> -->
      <el-button :icon="Delete" @click="clearPlayList">清空</el-button>
    </div>
    <el-scrollbar :height="(height || (drawerSize - 80)) - 40">
      <template v-for="(item, index) in songsList" :key="index">
        <div class="musicDiv">
          <el-text>{{ index + 1 }}、{{ item.name || '未命名' }} -
            {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }}
          </el-text>&ensp;
          <el-text v-if="item.fee === 1" type="danger">[VIP]</el-text>
          <SVG_music_playing_indicator style="fill: skyblue;height: 30px;"
            v-show="item.id === musicListStore.thisMusic.id" />
          <div>
            <el-button link @click="playTheMusic(item, index)" size="small" type="primary">
              点击播放
            </el-button>
            <el-button link size="small" type="primary" @click="showMusicListDrawer([item.id])">
              收藏到歌单
            </el-button>
            <el-button link v-if="item.cloud_music_id !== 0" @click="musicPlay.shareMusicLink(item)" size="small"
              type="primary">
              分享
            </el-button><el-button link type="danger" @click="deleteMusicFromPlayList(item.id)">删除</el-button>
          </div>
        </div>
      </template>
    </el-scrollbar>
  </div>


</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { Delete } from "@element-plus/icons-vue";
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
//hooks
import useMusicPlay from "@/hooks/music/useMusicPlay";
import useMusic from "@/hooks/music/useMusic";
//utils
import musicPlay from "@/utils/music/musicPlay";
//types
import type { CloudSongInfo } from "@/types/music";
//files
import SVG_music_playing_indicator from '@/assets/music/music_playing_indicator.svg?component'



const musicListStore = useMusicListStore()
const responsiveStore = useResponsiveStore()
const { drawerSize } = toRefs(responsiveStore)
const { deleteMusicFromPlayList, clearPlayList } = musicListStore
const { showMusicListDrawer } = useMusic()

const { toggleMusic, play } = useMusicPlay()
const { songsList, height } = defineProps(['songsList', 'height']) as { songsList: CloudSongInfo[], height: number }


const playTheMusic = (musicInfo: CloudSongInfo, index: number) => {
  //如果是当前播放的歌曲，则暂停
  if (musicInfo.id === musicListStore.thisMusic.id) {
    play({})
  } else toggleMusic({ index })
}

</script>

<style scoped>
.playListBar {
  height: 30px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

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
