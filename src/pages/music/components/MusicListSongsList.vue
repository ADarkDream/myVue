<template>
  <el-scrollbar ref="containerRef" :height="height || (drawerSize - 80)" v-if="songsList.length !== 0">
    <template v-for="(item, index) in songsList" :key="index">
      <!-- <div class="musicDiv">
        <el-text>{{ index + 1 }}、{{ item.name || '未命名' }} -
          {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }}
        </el-text>
        <el-text v-if="item.fee === 1" type="danger">[VIP]</el-text><el-text v-if="isPC" type="info"
          style="margin-left:30px ;">[专辑]{{ item.album.name }}</el-text>
        <SVG_music_playing_indicator style="fill: skyblue;height: 20px;margin-left: 20px;"
          v-show="item.id === thisMusic.id" />
        <div class="btns">
          <el-button link @click="playTheMusic(item, index)" size="small" type="primary">
            播放
          </el-button>
          <el-button link @click="addMusicList([item], { isReplace: true })" size="small" type="primary">
            添加到播放列表
          </el-button>
          <el-button link size="small" type="primary" @click="showMusicListDrawer([item.id])">
            收藏
          </el-button>
          <el-button link v-if="item.cloud_music_id" @click="musicPlayUtils.shareMusicLink(item)" size="small"
            type="primary">
            分享
          </el-button>
          <el-button link v-if="item.cloud_music_id" @click="musicListUtils.goToCloudMusic(item.cloud_music_id)"
            target="_blank" size="small" type="primary">
            前往网易云
          </el-button>
          <el-button link v-if="isOwner" @click="deleteMusic(item.id, index)" size="small" type="danger">
            删除
          </el-button>
        </div>
      </div> -->
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
            <el-button link @click="addMusicList([item], { isReplace: true })" size="small" type="primary">
              添加
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
            <el-button link v-if="isOwner" @click="deleteMusic(item.id, index)" size="small" type="danger">
              删除
            </el-button>
          </div>
        </div>
        <div class="playIcon">
          <SVG_music_playing_indicator v-show="item.id === thisMusic.id" />
        </div>
      </div>
    </template>
    <!-- 占位盒子 -->
    <div style="height: 150px;" v-if="!isPC && !isSearchList && songsList.length > 5"></div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useMusicListDrawerStore } from "@/store/music/useMusicListDrawerStore";
//hooks
import { useResponsiveStore } from "@/store/useResponsiveStore";
import useMusicPlay from "@/hooks/music/useMusicPlay";
import useMusic from "@/hooks/music/useMusic";
import useMusicList from "@/hooks/music/useMusicList";
//utils
import musicPlayUtils from "@/utils/music/musicPlay";
import musicListUtils from "@/utils/music/musicList";
//types
import type { CloudSongInfo } from "@/types/music";
//files
import SVG_music_playing_indicator from '@/assets/music/music_playing_indicator.svg?component'


const musicListStore = useMusicListStore()
const responsiveStore = useResponsiveStore()
const musicListDrawerStore = useMusicListDrawerStore()


const { drawerSize, isPC } = toRefs(responsiveStore)
const { music_id_list } = toRefs(musicListDrawerStore)
const { musicListInfo, thisMusic } = toRefs(musicListStore)
const { addMusicList } = musicListStore
const { showMusicListDrawer } = useMusic()

const { addMusicToPlay, toggleMusic, play } = useMusicPlay()
const { deleteMusicFromList } = useMusicList()

const { songsList, height, isSearchList, isOwner } = defineProps(['songsList', 'height', 'isSearchList', 'isOwner']) as { songsList: CloudSongInfo[], height: number, isSearchList?: boolean, isOwner: boolean }

const containerRef = ref()



const playTheMusic = (musicInfo: CloudSongInfo, index: number) => {
  //如果是当前播放的歌曲，则暂停
  if (musicInfo.id === thisMusic.value.id) {
    play({})
  }
  //有网易云音乐id，获取播放链接并播放
  else if (musicInfo.cloud_music_id) addMusicToPlay(musicInfo.cloud_music_id, true)
  //没有网易云音乐id(自己添加的)，直接播放【暂时是播放列表】
  else toggleMusic({ index })
}


const deleteMusic = async (id: number, index: number) => {
  music_id_list.value = [id]
  await deleteMusicFromList(musicListInfo.value!.music_list_id, index)
}


//分段懒加载
// const handleScroll = () => {
// const container = containerRef.value
// if (container.scrollTop + container.clientHeight >= height || (drawerSize.value - 80)) {
//   // loadMore()
//   console.log('到底了');
// }
//   console.log('滚动了');
// }

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
