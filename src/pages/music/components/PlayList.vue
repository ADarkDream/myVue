<template>
  <template v-for="(item,index) in playList" :key="index">
    <div>
      <el-text>{{ index + 1 }}、{{ item.name || '未命名' }} -
        {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }}
      </el-text>&ensp;
      <el-text v-if="item.fee===1&&!item.src" type="danger">[VIP]</el-text>
      <el-text v-else @click="toggleMusic({index})" size="small" type="primary">
        点击播放
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
  </template>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useMusicStore} from "@/store/music/useMusicStore";
import useFunction from "@/hooks/useFunction";
import {ElMessage} from "element-plus";

const musicStore = useMusicStore()
const playList = computed(() => musicStore.playList)
const {toggleMusic} = defineProps(['toggleMusic'])
const {copyText} = useFunction()

</script>

<style scoped>

</style>
