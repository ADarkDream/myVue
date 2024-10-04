<template>
  <template v-for="(item,index) in playList" :key="index">
    <div class="musicDiv">
      <el-text>{{ index + 1 }}、{{ item.name || '未命名' }} -
        {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }}
      </el-text>&ensp;
      <el-text v-if="item.fee===1&&!item.src" type="danger">[VIP]</el-text>
      <div v-if="true">
            <el-text  @click="toggleMusic({index})" size="small" type="primary">
        点击播放{{index}}
      </el-text>
      <el-button text size="small" type="primary" @click="ElMessage.info('收藏功能开发中')">
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
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useMusicListStore} from "@/store/music/useMusicListStore";
import useFunction from "@/hooks/useFunction";
import {ElMessage} from "element-plus";

const musicStore = useMusicListStore()
const playList = computed(() => musicStore.playList)
const {toggleMusic} = defineProps(['toggleMusic'])
const {copyText} = useFunction()

</script>

<style scoped>
.musicDiv{
  padding: 10px 15px;
}

.musicDiv:hover{
    background: rgba(255, 255, 255, 0.25);
   transition: all 0.2s linear;
cursor: pointer;
}

</style>
