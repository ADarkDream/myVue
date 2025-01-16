<template>
  <div ref="music" class="mainPanel" :style="{ height: containerHeight + 'px', ...bgSettings }">
    <el-tabs class="tabs" v-model="activePanelIndex">
      <el-tab-pane :name="0">
        <template #label>
          <el-text class="tab-label">
            <el-icon>
              <Plus />
            </el-icon>&ensp;添加歌曲
          </el-text>
        </template>
        <MusicAdd />
      </el-tab-pane>
      <el-tab-pane :name="1" :lazy="true">
        <template #label>
          <el-text class="tab-label">
            <SVG_music_list class="el-icon" style="transform: scale(1.5)" />&ensp;歌单广场
          </el-text>
        </template>
        <music-list-square :toggleToMusicList="toggleToMusicList" />
      </el-tab-pane>
      <el-tab-pane :name="2" :lazy="true">
        <template #label>
          <el-text class="tab-label">
            <SVG_music_list class="el-icon" style="transform: scale(1.5)" />&ensp;歌单列表
          </el-text>
        </template>
        <music-list />
      </el-tab-pane>
      <el-tab-pane :name="3" :lazy="true">
        <template #label>
          <el-text class="tab-label">
            <SVG_music_list class="el-icon" style="transform: scale(1.5)" />&ensp;播放列表
          </el-text>
        </template>
        <play-list :songs-list="playList" />
      </el-tab-pane>
      <el-tab-pane :name="4" :lazy="true">
        <template #label>
          <el-text class="tab-label">
            <el-icon>
              <Setting />
            </el-icon>&ensp;设置
          </el-text>
        </template>
        <MusicSettings />
      </el-tab-pane>
      <el-tab-pane :name="5" :lazy="true">
        <template #label>
          <el-text class="tab-label">
            <el-icon>
              <Tickets />
            </el-icon>&ensp;备忘
          </el-text>
        </template>
        <div style="text-align: left">
          <h2>待完善：</h2>
          <el-text tag="p">1、七牛云链接后加上?avinfo可以获得音频源数据</el-text>
          <el-text tag="p"><el-text type="warning">2、歌词界面</el-text>:用第三方库 lyric-parser
            进行处理。实现显示歌词、拖动进度条歌词同步滚动、歌词跟随歌曲进度高亮。</el-text>
          <el-text tag="p" type="warning">3、收藏歌单</el-text>
          <el-text tag="p" type="warning">4、上传自定义歌曲</el-text>
          <el-text tag="p">5、重构歌曲播放样式</el-text>
          <el-text tag="p">6、加提示：批量添加歌曲询问是否覆盖，删除公开歌单告知私有歌单会一并删除</el-text>
          <el-text tag="p">7、加环境变量，基地址等信息存入环境变量</el-text>
          <el-text tag="p" type="warning">8、歌曲分类搜索</el-text>
          <el-text tag="p" type="warning">9、批量操作功能</el-text>
          <h2>问题：</h2>
          <el-text tag="p">1、播放失败的重试函数待测试是否有效</el-text>
          <el-text tag="p">2、浏览器媒体界面，列表最后一首到第一首会出错，播放时间不归位</el-text>

        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 搜索抽屉 -->
    <el-drawer v-model="isShowSearchPanel" :with-header="false" :size="drawerSize - (isPC ? 45 : 45) + 'px'"
      direction="btt" show-close>
      <SearchMusicDrawer />
    </el-drawer>
    <!-- 上传音乐抽屉 -->
    <!-- <UpdateMusic /> -->
    <!-- 歌单列表抽屉 -->
    <el-drawer v-model="isShowMusicListDrawer" :size="drawerSize - (isPC ? 39 : 39) + 'px'" direction="btt" show-close>
      <template #header>
        <div class="title">收藏到歌单</div>
      </template>
      <MusicListDrawer />
    </el-drawer>
    <!--新建歌单的抽屉-->
    <el-drawer v-model="isShowEditMusicListInfoDrawer" :with-header="false" :show-close="false" direction="btt"
      :append-to-body="true" size="50%" destroy-on-close @close="resetUpload()">
      <EditMusicListInfoDrawer />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs, defineAsyncComponent } from 'vue';
import { Plus, Setting, Tickets } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
//stores
import { useUserInfoStore } from '@/store/user/useUserInfoStore';
import { useResponsiveStore } from "@/store/useResponsiveStore";
import { useUploadFileStore } from "@/store/upload/uploadFileStore";
import { useMainPanelConfigStore } from "@/store/useMainPanelConfigStore";
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useMusicSearchStore } from '@/store/music/useMusicSearchStore';
import { useMusicListDrawerStore } from '@/store/music/useMusicListDrawerStore'
//hooks

import useMusicPlay from "@/hooks/music/useMusicPlay";
import useMusicList from "@/hooks/music/useMusicList";
//components
import MusicAdd from '@/pages/music/pages/MusicAdd.vue';
import PlayList from "@/pages/music/pages/PlayList.vue";
import MusicListSquare from "@/pages/music/pages/MusicListSquare.vue";
import MusicSettings from "@/components/MainPanelSettings.vue";
import MusicList from "@/pages/music/pages/MusicList.vue";
import UpdateMusic from '@/pages/music/components/UpdateMusic.vue'
const SearchMusicDrawer = defineAsyncComponent(() => import('@/pages/music/drawer/SearchMusicDrawer.vue'))
const MusicListDrawer = defineAsyncComponent(() => import('@/pages/music/drawer/MusicListDrawer.vue'))
const EditMusicListInfoDrawer = defineAsyncComponent(() => import('@/pages/music/drawer/EditMusicListInfoDrawer.vue'))
// import MusicListDrawer from '@/pages/music/drawer/MusicListDrawer.vue';
// import EditMusicListInfoDrawer from "@/pages/music/drawer/EditMusicListInfoDrawer.vue";
//files
import SVG_music_list from '@/assets/music/music_list.svg?component'



const route = useRoute()
const router = useRouter()


const musicListStore = useMusicListStore()
const searchStore = useMusicSearchStore()
const musicListDrawerStore = useMusicListDrawerStore()
//页面背景配置
const { activePanelIndex } = toRefs(useMainPanelConfigStore())
const { bgSettings, changePanelIndex } = useMainPanelConfigStore()
const { isLogin } = toRefs(useUserInfoStore())
const { isShowSearchPanel } = toRefs(searchStore)
const { isShowMusicListDrawer, isShowEditMusicListInfoDrawer } = toRefs(musicListDrawerStore)
const { isPC, drawerSize, containerHeight } = toRefs(useResponsiveStore())
const { touchstart, positionComputed } = useResponsiveStore()
const { resetUpload } = useUploadFileStore()
const { addMusicToPlay } = useMusicPlay()
const { getCloudMusicList, getMusicList } = useMusicList()

const playList = computed(() => musicListStore.playList)

const music = ref<HTMLDivElement>()


const toggleToMusicList = async ({ cloud_music_list_id, music_list_id, latest }: {
  cloud_music_list_id?: number,
  music_list_id?: number,
  latest?: number
}, is_login = false) => {

  if (!cloud_music_list_id && !music_list_id) return
  if (cloud_music_list_id) {
    const { status } = await getCloudMusicList({ cloud_music_list_id, latest })
    if (status === 0) return
  }
  else if (music_list_id) await getMusicList({ music_list_id, limit: undefined, offset: 0, is_login })
  changePanelIndex(2)
}

onMounted(async () => {


  //分享功能，从路径中获取网易云音乐id，播放并清除路径参数
  let { id, c_id, ml_id } = route.query
  const music_id = Number(id)
  const cloud_music_id = Number(c_id) || Number(route.query.cloud_music_id)
  const music_list_id = Number(ml_id)

  //跳转到播放列表
  if (Number.isInteger(music_id) && music_id > 0) {
    await addMusicToPlay(music_id, isPC.value, true) //移动端不自动播放，没有优化
    router.replace({ name: 'music' })
    changePanelIndex(3)
  } else if (Number.isInteger(cloud_music_id) && cloud_music_id > 0) {
    await addMusicToPlay(cloud_music_id, isPC.value) //移动端不自动播放，没有优化
    router.replace({ name: 'music' })
    changePanelIndex(3)
  }

  //跳转到歌单列表
  if (Number.isInteger(music_list_id) && music_list_id > 0) {
    await getMusicList({ music_list_id, is_login: isLogin.value })
    router.replace({ name: 'music' })
    changePanelIndex(2)
  }


  //设置当前播放的歌曲
  musicListStore.setThisMusic(musicListStore.playingIndex, true)


  //如果是移动端，监听左右滑动
  if (!isPC.value && music.value) {
    music.value.addEventListener("touchstart", touchstart, false)
    //手指离开屏幕
    music.value.addEventListener("touchend", touchend, false)
  }
})

onUnmounted(() => {
  removeEventListener("touchstart", touchstart)
  removeEventListener("touchend", touchend)
})

//手指离开屏幕
const touchend = (e: TouchEvent) => {
  console.log('离开屏幕')
  positionComputed(e, activePanelIndex, 0, 4)
}
</script>

<style scoped></style>