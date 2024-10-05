<template>
  <div class="container">
        <div  class="title"><span>歌单广场</span><el-button link :icon="Refresh">{{isPC?'刷新':''}}</el-button> </div>
    <div class="openMusicList">
      <div v-for="item in musicLists" :key="item.music_list_id" class="musicList">
        <MusicListCoverComp :musicListInfo="item" @click="ElMessage.info('歌单功能开发中')"/>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="title"><span>我创建的歌单</span> <el-button link :icon="Plus" @click="handleChangeDrawer" >{{isPC?'创建歌单':''}}</el-button></div>
    <div class="openMusicList">
      <el-button text type="primary" v-if="myMusicLists.length===0" style="margin: 0 auto">{{"暂无歌单"}}</el-button>
      <div v-for="item in myMusicLists" :key="item.music_list_id" class="musicList">
        <MusicListCoverComp :musicListInfo="item" @click="ElMessage.info('歌单功能开发中')"/>
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
      <AddMusicList ref="addMusicListComp" :close="closeDrawer"/>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useResponsive from "@/hooks/useResponsive";
import useUserInfo from "@/hooks/useUserInfo";
import axios from "axios";
import {ref, onMounted} from "vue";
import {Refresh,Plus} from "@element-plus/icons-vue";
import AddMusicList from "@/pages/music/components/AddMusicList.vue";
import {MusicList} from "@/types/music";
import MusicListCoverComp from "@/pages/music/components/MusicListCoverComp.vue";
import {ElMessage} from "element-plus";








const {isPC} = useResponsive()
const {isLogin, uid} = useUserInfo()
const showAddMusicList = ref(false)


onMounted(() => {
  getMusicList()
  if (isLogin.value) getMyMusicList(uid.value)
})
const musicLists = ref<MusicList[]>([])
const myMusicLists = ref<MusicList[]>([])

// 获取公开歌单列表
const getMusicList = async (user_id?: number, music_list_id?: number) => {
  try {
    const result = await axios({
      url: '/getMusicListInfo',
      params: {
        user_id, music_list_id
      }
    })
    console.log(result.data)
    const {status, msg, data} = result.data
    musicLists.value = data.music_lists
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}

// 获取用户自己的歌单列表
const getMyMusicList = async (user_id?: number, music_list_id?: number) => {
  try {
    const result = await axios({
      url: '/getMyMusicListInfo',
      params: {
        user_id, music_list_id
      }
    })
    console.log(result.data)
    const {status, msg, data} = result.data
    myMusicLists.value = data.music_lists

  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}

//关闭创建歌单的抽屉
const closeDrawer = () => {
  showAddMusicList.value = false
}

//打开创建歌单的抽屉
const handleChangeDrawer=()=>{
  if (isLogin.value) showAddMusicList.value=true
  ElMessage.info('请先登录')
}

const addMusicListComp = ref<typeof AddMusicList>()

const conplete = () => {
  if (addMusicListComp.value) {
    addMusicListComp.value.addMusicList()
  }
}
</script>

<style scoped>
.title{
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
