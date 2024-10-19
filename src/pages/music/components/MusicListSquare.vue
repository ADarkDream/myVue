<template>
  <div class="container">
    <div class="title"><span>歌单广场[暂时只显示最近十个歌单]</span>
      <el-button link :icon="Refresh" @click="getAllMusicListsInfo()">{{ isPC ? '刷新' : '' }}</el-button>
    </div>
    <div class="openMusicList" @touchstart="stopTouch" @touchend="stopTouch">
      <div v-for="item in musicLists" :key="item.music_list_id" class="musicList"
        @click="toggleToMusicList({ music_list_id: item.music_list_id })">
        <MusicListCoverComp :musicListInfo="item" />
      </div>
    </div>
    <el-divider />
    <div class="title"><span>我创建的歌单</span>
      <el-button link :icon="Plus" @click="handleChangeDrawer">{{ isPC ? '创建歌单' : '' }}</el-button>
    </div>
    <div class="openMusicList" @touchstart="stopTouch" @touchend="stopTouch">
      <el-button text type="primary" v-if="myMusicLists.length === 0" style="margin: 0 auto">{{ "暂无歌单" }}</el-button>
      <div v-for="item in myMusicLists" :key="item.music_list_id" class="musicList"
        @click="toggleToMusicList({ music_list_id: item.music_list_id })">
        <MusicListCoverComp :musicListInfo="item" />
      </div>
    </div>
    <!--新建歌单的窗口-->
    <el-drawer v-model="showAddMusicList" :show-close="false" direction="btt" destroy-on-close>
      <template #header>
        <div style="display: flex;justify-content: space-between">
          <el-button link @click="closeDrawer">取消</el-button>
          <el-button link @click="conplete">完成</el-button>
        </div>
      </template>
      <AddMusicList ref="addMusicListComp" :close="closeDrawer" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useResponsive from "@/hooks/useResponsive";
import useUserInfo from "@/hooks/useUserInfo";
import { ref, onMounted } from "vue";
import { Refresh, Plus } from "@element-plus/icons-vue";
import AddMusicList from "@/pages/music/components/AddMusicList.vue";
import type { QueryMusicLists, MusicListInfo } from "@/types/music";
import MusicListCoverComp from "@/pages/music/components/MusicListCoverComp.vue";
import { ElMessage } from "element-plus";
import { useMusicListStore } from "@/store/music/useMusicListStore";

const { isPC } = useResponsive()
const { isLogin, uid } = useUserInfo()
const showAddMusicList = ref(false)
const { toggleToMusicList } = defineProps(['toggleToMusicList'])
const musicListStore = useMusicListStore()

onMounted(async () => {
  await getAllMusicListsInfo()
})
const musicLists = ref<MusicListInfo[]>([])
const myMusicLists = ref<MusicListInfo[]>([])

// 获取公开歌单列表
const getMusicLists = async ({ isLogin, user_id, music_list_id }: QueryMusicLists) => {
  try {
    const { status, list, msg } = await musicListStore.getMusicListsInfo({ isLogin, user_id, music_list_id }, true)
    if (status === 0 || !list) return ElMessage.error(msg)
    if (!isLogin) musicLists.value = list
    else myMusicLists.value = list
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}


//获取公开歌单列表和用户个人的歌单列表
const getAllMusicListsInfo = async () => {
  //获取公开歌单列表
  await getMusicLists({ isLogin: false })
  //如果用户登录了，获取个人歌单列表
  if (isLogin.value) await getMusicLists({ isLogin: true, user_id: uid.value })
  ElMessage.success('获取最新歌单成功')
}


//关闭创建歌单的抽屉
const closeDrawer = () => {
  showAddMusicList.value = false
}

//打开创建歌单的抽屉
const handleChangeDrawer = () => {
  if (isLogin.value) showAddMusicList.value = true
  else ElMessage.info('请先登录')
}

const addMusicListComp = ref<typeof AddMusicList>()

const conplete = () => {
  if (addMusicListComp.value) {
    addMusicListComp.value.addMusicList()
  }
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
