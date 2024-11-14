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
    <el-scrollbar v-else :height="(height || (drawerSize - 80)) - 40">
      <template v-for="(item, index) in songsList" :key="index">
        <div class="musicDiv">
          <div>
            <div class="songInfo">
              <el-text>{{ index + 1 }}、{{ item.name || '未命名' }} -
                {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }}
              </el-text>&ensp;
              <el-text v-if="item.fee === 1" type="danger">[VIP]</el-text>
            </div>
            <div class="btns">
              <el-button link @click="playTheMusic(item, index)" size="small" type="primary">
                播放
              </el-button>
              <el-button link size="small" type="primary" @click="showMusicListDrawer([item.id])">
                收藏
              </el-button>
              <el-button link v-if="item.cloud_music_id || item.id" @click="musicPlayUtils.shareMusicLink(item)"
                size="small" type="primary">
                分享
              </el-button>
              <el-button link v-if="item.cloud_music_id" @click="musicListUtils.goToCloudMusic(item.cloud_music_id)"
                target="_blank" size="small" type="primary">
                前往网易云
              </el-button>
              <el-button link type="danger" @click="deleteMusicFromPlayList(item.id)">删除</el-button>

            </div>
          </div>
          <div class="playIcon">
            <SVG_music_playing_indicator v-show="item.id === thisMusic.id" />
          </div>
        </div>
      </template>
    </el-scrollbar>
  </div>


</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ElMessage } from "element-plus";
import { Operation, Delete } from "@element-plus/icons-vue";
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
import { useMusicConfigStore } from "@/store/music/useMusicConfigStore";
//hooks
import useMusicPlay from "@/hooks/music/useMusicPlay";
import useMusic from "@/hooks/music/useMusic";
//utils
import musicPlayUtils from "@/utils/music/musicPlay";
import musicListUtils from "@/utils/music/musicList";
//types
import type { CloudSongInfo } from "@/types/music";
//files
import SVG_music_playing_indicator from '@/assets/music/music_playing_indicator.svg?component'




const musicListStore = useMusicListStore()
const responsiveStore = useResponsiveStore()
const musicConfigStore = useMusicConfigStore()
const { drawerSize } = toRefs(responsiveStore)
const { thisMusic } = toRefs(musicListStore)
const { deleteMusicFromPlayList, clearPlayList } = musicListStore
const { changePanelIndex } = musicConfigStore

const { showMusicListDrawer } = useMusic()
const { toggleMusic, play } = useMusicPlay()
const { songsList, height } = defineProps(['songsList', 'height']) as { songsList: CloudSongInfo[], height: number }


const playTheMusic = (musicInfo: CloudSongInfo, index: number) => {
  //如果是当前播放的歌曲，则暂停
  if (musicInfo.id === thisMusic.value.id) {
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

}

.musicDiv:hover {
  background: rgba(255, 255, 255, 0.25);
}

.musicDiv button:hover {
  color: currentColor;
  transform: scale(1.1);
  background-color: transparent;
}

/* 音乐底部菜单 */
.musicDiv .btns {
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;
}


.musicDiv:hover {
  border-radius: 5px;
}

.musicDiv:hover .btns {
  height: 22px;
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
