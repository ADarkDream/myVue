<template>
  <div class="container">
    <div class="title"><span>歌单广场[暂时只显示最近十个歌单]</span>
      <el-button link :icon="Refresh" @click="getAllMusicListsInfo()">{{ isPC ? '刷新' : '' }}</el-button>
    </div>
    <div class="openMusicList" @touchstart="stopTouch" @touchend="stopTouch">
      <div v-for="item in publicMusicListInfo" :key="item.music_list_id" class="musicList"
        @click="toggleToMusicList({ music_list_id: item.music_list_id })">
        <MusicListCoverComp :musicListInfo="item" />
      </div>
    </div>
    <br>
    <div class="title"><span>我创建的歌单</span>
      <el-button link :icon="Plus" @click="showEditMusicListInfoDrawer(true)">{{ isPC ? '创建歌单' : '' }}</el-button>
    </div>
    <div class="openMusicList" @touchstart="stopTouch" @touchend="stopTouch">
      <el-button text type="primary" v-if="myMusicListInfo.length === 0" style="margin: 0 auto">{{ "暂无歌单" }}</el-button>
      <div v-for="item in myMusicListInfo" :key="item.music_list_id" class="musicList"
        @click="toggleToMusicList({ music_list_id: item.music_list_id }, isLogin)">
        <MusicListCoverComp :musicListInfo="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, toRefs } from "vue";
import { Refresh, Plus } from "@element-plus/icons-vue";
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
//hooks

import useMusicList from "@/hooks/music/useMusicList";
import useMusic from "@/hooks/music/useMusic";
//components

import MusicListCoverComp from "@/pages/music/components/MusicListCoverComp.vue";

const responsiveStore = useResponsiveStore()
const { isPC } = toRefs(responsiveStore)
const userInfoStore = useUserInfoStore()
const musicListStore = useMusicListStore()
const { isLogin, uid } = toRefs(userInfoStore)
const { publicMusicListInfo, myMusicListInfo } = toRefs(musicListStore)
const { getMusicListsInfo } = useMusicList()
const { showEditMusicListInfoDrawer } = useMusic()
const { toggleToMusicList } = defineProps(['toggleToMusicList'])

onMounted(async () => {
  await getAllMusicListsInfo()
})


//获取公开歌单列表和用户个人的歌单列表
const getAllMusicListsInfo = async () => {
  //获取公开歌单列表
  await getMusicListsInfo({ is_login: false }, true)
  //如果用户登录了，获取个人歌单列表
  if (isLogin.value) await getMusicListsInfo({ is_login: true, user_id: uid.value }, true)
  ElMessage.success('获取最新歌单成功')
}


//阻止左右滑动触发翻页
const stopTouch = (e: TouchEvent) => {
  e.stopPropagation()
}
</script>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
}

.openMusicList {
  display: flex;
  justify-content: flex-start;
  overflow-x: scroll;
}

.musicList {
  margin: 10px;
  position: relative;
  display: flex;
}

.albumImg {
  width: 100%;
}

.albumName {
  width: 100%;
  text-align: center;
  color: currentColor;
  font-size: 18px;
}
</style>

<style>
.el-card__header {
  padding: 0;
  text-align: center;
}

.el-card__body {
  padding: 10px;
  text-align: center;
}

.el-drawer__header {
  margin: 0;
  justify-content: space-between;
}

.el-drawer__body {
  height: auto;
}
</style>
