<template>
  <el-scrollbar :height="height || (drawerSize-80)">
    <template v-for="(item,index) in songsList" :key="index">
      <div class="musicDiv">
        <el-text>{{ index + 1 }}、{{ item.name || '未命名' }} -
          {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }}
        </el-text>&ensp;
        <el-text v-if="item.fee===1" type="danger">[VIP]</el-text>
        <div v-if="item.fee!==1">
          <el-button link @click="playTheMusic(item,index)" size="small" type="primary">
            点击播放
          </el-button>
          <el-button link size="small" type="primary" @click="ElMessage.info('收藏功能开发中')">
            收藏到歌单
          </el-button>
          <el-button text v-if="item.cloud_music_id!==0"
                     @click="copyText('https://muxidream.cn/music?cloud_music_id='+item.cloud_music_id,'播放链接')"
                     size="small" type="primary">
            分享
          </el-button>
        </div>

      </div>
    </template>
  </el-scrollbar>

</template>

<script setup lang="ts">
import useFunction from "@/hooks/useFunction";
import {ElMessage} from "element-plus";
import {useMusicPlayStore} from "@/store/music/useMusicPlayStore";
import {CloudSongInfo} from "@/types/music";
import useResponsive from "@/hooks/useResponsive";

const musicPlayStore = useMusicPlayStore()

const {drawerSize} = useResponsive()
const {copyText} = useFunction()
const {addCloudMusic, toggleMusic} = musicPlayStore
const {songsList, height} = defineProps(['songsList', 'height']) as { songsList: CloudSongInfo[], height: number }

const playTheMusic = (musicInfo: CloudSongInfo, index: number) => {
  //有网易云音乐id，获取播放链接并播放
  if (musicInfo.cloud_music_id) addCloudMusic(musicInfo.cloud_music_id, true)
  //没有网易云音乐id(自己添加的)，直接播放【暂时是播放列表】
  else toggleMusic({index})
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
