<template>
  <div ref="music" class="music" :style="{ height: containerHeight + 'px', ...bgSettings }">
    <el-tabs class="tabs" v-model="activePanelIndex">
      <el-tab-pane :name="0">
        <template #label>
          <el-text class="tab-label">
            <el-icon>
              <Plus />
            </el-icon>&ensp;添加歌曲
          </el-text>
        </template>
        <el-button type="success" class="button" :icon="Search" @click="isShowSearchPanel = true">搜索网易云音乐曲库</el-button>
        <el-form v-model="newMusic" label-width="auto" label-position="top" style="width: 100%;margin-top:20px"
          :size="elSize">
          <el-form-item>
            <template #label>输入歌单id&ensp;<el-icon @click="">
                <InfoFilled />
              </el-icon>
              <Transition name="horizontal_slide">
                <el-text v-show="true">
                  用户自行上传的歌曲不可见
                </el-text>
              </Transition>
            </template>
            <el-row :gutter="24">
              <el-col :span="18">
                <el-input v-model.trim.number="cloudMusicListID" placeholder="输入网易云歌单ID或分享链接"></el-input>
              </el-col>
              <el-col :span="6">
                <el-button @click="search_song_or_list(cloudMusicListID, false)" type="success" plain>
                  搜索
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="输入音乐ID获取音频链接(仅支持网易云免费音乐)">
            <el-row :gutter="24">
              <el-col :span="18">
                <el-input v-model.trim.number="cloudMusicID" placeholder="输入网易云音乐ID或分享链接"></el-input>
              </el-col>
              <el-col :span="6">
                <el-button @click="search_song_or_list(cloudMusicID, true)" type="primary" plain>添加并播放
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="src" label="输入音频链接">
            <el-row :gutter="24">
              <el-col :span="18">
                <el-input v-model="musicUrl" placeholder="输入音频链接"></el-input>
              </el-col>
              <el-col :span="6">
                <el-button @click="addMusic(musicUrl)" type="primary" plain>添加并播放</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :name="1">
        <template #label>
          <el-text class="tab-label">
            <SVG_music_list class="el-icon" style="transform: scale(1.5)" />&ensp;歌单广场
          </el-text>
        </template>
        <music-list-square :toggleToMusicList="toggleToMusicList" />
      </el-tab-pane>
      <el-tab-pane :name="2">
        <template #label>
          <el-text class="tab-label">
            <SVG_music_list class="el-icon" style="transform: scale(1.5)" />&ensp;歌单列表
          </el-text>
        </template>
        <music-list />
      </el-tab-pane>
      <el-tab-pane :name="3">
        <template #label>
          <el-text class="tab-label">
            <SVG_music_list class="el-icon" style="transform: scale(1.5)" />&ensp;播放列表
          </el-text>
        </template>
        <play-list :songs-list="playList" />
      </el-tab-pane>
      <el-tab-pane :name="4">
        <template #label>
          <el-text class="tab-label">
            <el-icon>
              <Setting />
            </el-icon>&ensp;设置
          </el-text>
        </template>
        <MusicSettings />
      </el-tab-pane>
      <el-tab-pane :name="5">
        <template #label>
          <el-text class="tab-label">
            <el-icon>
              <Tickets />
            </el-icon>&ensp;备忘
          </el-text>
        </template>
        <div style="text-align: left">
          <el-text tag="p" type="info">1、<del>会员歌曲和播放失败的不能自动跳过,在resetUrl里面改逻辑</del></el-text>
          <el-text tag="p" style="bold">2、七牛云链接后加上?avinfo可以获得音频源数据</el-text>
          <el-text tag="p">3、用第三方库 lyric-parser 进行处理。实现显示歌词、拖动进度条歌词同步滚动、歌词跟随歌曲进度高亮。</el-text>
          <el-text tag="p" type="info">4、<del>歌单界面和</del><el-text>歌词界面</el-text></el-text>
          <el-text tag="p" type="info">5、<del>歌名长度滚动速率没改完</del></el-text>
          <el-text tag="p" type="info">6、<del>重复播放同一首换成暂停和播放，或者做出提醒</del></el-text>
          <el-text tag="p" type="info">7、<del>播放设置和播放列表存本地</del></el-text>
          <el-text tag="p">8、播放失败的重试函数待测试是否有效</el-text>
          <el-text tag="p" type="info">9、<del>移动端的歌单信息按钮组可能因为太长了，UI出错</del></el-text>
          <el-text tag="p">10、浏览器媒体界面，列表最后一首到第一首会出错，播放时间不归位</el-text>
          <el-text tag="p" type="info">11、<del>通过id添加会员歌曲会添加成功但是无法播放，然后出bug</del></el-text>
          <el-text tag="p" type="info">12、<del>部分歌曲歌手id冲突（举例id=28162967）,无法添加</del></el-text>
          <el-text tag="p">13、歌单查询的歌曲排序有问题</el-text>
          <el-text tag="p" type="info">14、<del>播放状态和列表不要持久化，否则下次加载会出问题</del></el-text>
          <el-text tag="p" type="info">15、<del>thisMusic有问题</del></el-text>
          <el-text
            tag="p">16、music_list_store需要重构，手动持久化和自动持久化冲突，thisMusic需要playingIndex和PlayList同时持久化才能使用，否则会出错，但PlayList持久化会导致音乐链接过期，playidList无效</el-text>
          <el-text tag="p">17、清空播放列表清空不了，刷新后又出现</el-text>

        </div>
      </el-tab-pane>
    </el-tabs>
    <el-drawer class="searchDrawer" v-model="isShowSearchPanel" :with-header="false"
      :size="drawerSize - (isPC ? 39 : 39) + 'px'" @touchstart="(e: TouchEvent) => e.stopPropagation()"
      @touchend="(e: TouchEvent) => e.stopPropagation()" direction="btt" show-close>
      <SearchMusic :closeSearchPanel="closeSearchPanel" />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs } from 'vue';
import { InfoFilled, Plus, Search, Setting, Tickets } from "@element-plus/icons-vue";
import { SongInfo } from "@/types/music";
import SearchMusic from "@/pages/music/components/SearchMusic.vue";
import PlayList from "@/pages/music/components/PlayList.vue";
import MusicListSquare from "@/pages/music/components/MusicListSquare.vue";

import useResponsive from "@/hooks/useResponsive";
import { useRoute, useRouter } from "vue-router";
import { useMusicConfigStore } from "@/store/music/useMusicConfigStore";
import { useMusicListStore } from "@/store/music/useMusicListStore";
import SVG_music_list from '@/assets/music/music_list.svg?component'
import MusicSettings from "@/pages/music/components/MusicSettings.vue";
import MusicList from "@/pages/music/components/MusicList.vue";
import { ElMessage } from 'element-plus';
import useMusicPlay from "@/hooks/music/useMusicPlay";
const route = useRoute()
const router = useRouter()

const musicConfigStore = useMusicConfigStore()
const musicListStore = useMusicListStore()
const { isPC, elSize, drawerSize, containerHeight, touchstart, positionComputed } = useResponsive()

const { getLocalMusicList, addMusicToPlay, addMusic } = useMusicPlay()
//页面背景配置
const { activePanelIndex } = toRefs(musicConfigStore)
const { bgSettings, changePanelIndex } = musicConfigStore
const playList = computed(() => musicListStore.playList)
const { getCloudMusicList, getMusicList } = musicListStore


const music = ref<HTMLDivElement>()






//是否显示搜索面板
const isShowSearchPanel = ref(false)

/*关闭搜索面板*/
const closeSearchPanel = () => {
  isShowSearchPanel.value = false
}


const newMusic = ref<SongInfo>({
  name: '',
  artists: [{ name: '', pic_url: '' }],
  album: { name: '', pic_url: '' },
  src: ''
})

const cloudMusicListID = ref()
const cloudMusicID = ref()
const musicUrl = ref('')



//校验分享链接或歌单、歌曲id，进行搜索
const search_song_or_list = async (str: string, isSong: boolean) => {
  str = str.toString()
  //网址规则
  const reg_url = /https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]*)?/
  //歌单规则
  const reg_palylist = /https?:\/\/music\.163\.com\/#\/(?:[a-zA-Z0-9\/]+\/)?playlist\?id=([0-9]+)/
  //歌曲规则
  const reg_song = /https?:\/\/music\.163\.com\/#\/song\?id=([0-9]+)/

  let id = 0

  if (reg_url.test(str)) {//是网址
    const reg = isSong ? reg_song : reg_palylist
    const match = str.match(reg)
    if (match) {//如果匹配
      id = Number(match[1])
    }
  } else {
    id = Number(str)
  }
  console.log(isSong ? '是歌曲' : '是歌单', ',ID为：', id)
  //判断id是不是一个正常的正整数
  if (Number.isInteger(id) && id > 0) {
    if (isSong) await addMusicToPlay(id, true)
    else {
      const { status } = await getCloudMusicList({ cloud_music_list_id: id })
      if (status === 0) return
    }
    changePanelIndex(isSong ? 3 : 2)
  } else ElMessage.error(`请输入有效的${isSong ? '歌曲' : '歌单'}id或分享链接`)
}


const toggleToMusicList = async ({ cloud_music_list_id, music_list_id, latest }: {
  cloud_music_list_id?: number,
  music_list_id?: number,
  latest?: number
}) => {

  if (!cloud_music_list_id && !music_list_id) return
  if (cloud_music_list_id) {
    const { status } = await getCloudMusicList({ cloud_music_list_id, latest })
    if (status === 0) return
  }
  else if (music_list_id) await getMusicList({ music_list_id, limit: undefined, offset: 0 })
  changePanelIndex(2)
}

onMounted(async () => {
  //获取本地播放列表
  await getLocalMusicList()


  //分享功能，从路径中获取网易云音乐id，播放并清除路径参数
  let { id, c_id, ml_id } = route.query
  const music_id = Number(id)
  const cloud_music_id = Number(c_id) || Number(route.query.cloud_music_id)
  const music_list_id = Number(ml_id)

  //跳转到播放列表
  if (Number.isInteger(music_id) && music_id > 0) {
    await addMusicToPlay(music_id, isPC.value, true) //移动端不自动播放，没有优化
    await router.replace({ name: 'music' })
    changePanelIndex(3)
  } else if (Number.isInteger(cloud_music_id) && cloud_music_id > 0) {
    await addMusicToPlay(cloud_music_id, isPC.value) //移动端不自动播放，没有优化
    await router.replace({ name: 'music' })
    changePanelIndex(3)
  }

  //跳转到歌单列表
  if (Number.isInteger(music_list_id) && music_list_id > 0) {
    await getMusicList({ music_list_id })
    await router.replace({ name: 'music' })
    changePanelIndex(2)
  }

  //如果是移动端，监听左右滑动
  if (!isPC.value && music.value) {
    music.value.addEventListener("touchstart", touchstart, false)
    //手指离开屏幕
    music.value.addEventListener("touchend", touchend, false)
  }


  // await Promise.all([

  // ])
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

<style scoped>
.music {
  display: flex;
  justify-content: space-between;
  position: relative;
  box-sizing: border-box;
  padding: 0 10px;
  width: 100%;
  --music-bg-color: #ffffff;
  --music-bg-opacity: 0.5;
  /*背景透明度*/
  --music-bg-filter: 0;
  /*背景模糊度*/
  --music-bg-saturate: 1;
  /*背景饱和度*/
  backdrop-filter: blur(calc(var(--music-bg-filter) * 1px)) saturate(var(--music-bg-saturate));
}

.music:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 10px;
  background-color: var(--music-bg-color);
  opacity: var(--music-bg-opacity);
}

.music .tabs {
  width: 100%;

  .tab-label {
    font-size: 16px;
  }
}

/*region 按钮样式 */
.dark .button {
  background-color: transparent;
}

.button {
  --color: #00A97F;
  padding: 0.8em 1.7em;
  background-color: #e9dee7;
  border-radius: .3em;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: .5s;
  font-weight: 400;
  font-size: 17px;
  border: 1px solid;
  font-family: inherit;
  text-transform: uppercase;
  color: var(--color);
  z-index: 1;
}

.button::before,
.button::after {
  content: '';
  display: block;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  position: absolute;
  border-radius: 50%;
  z-index: -1;
  background-color: var(--color);
  transition: 1s ease;
}

.button::before {
  top: -1em;
  left: -1em;
}

.button::after {
  left: calc(100% + 1em);
  top: calc(100% + 1em);
}

.button:hover::before,
.button:hover::after {
  height: 410px;
  width: 410px;
}

.button:hover {
  color: rgb(10, 25, 30);
}

.button:active {
  filter: brightness(.8);
}

/*endregion*/

/*移动端布局*/
@media (max-width: 780px) {
  .music {
    padding: 0;
    backdrop-filter: none;
  }

  .music:before {
    border-radius: 0;
  }

  .music .tabs {

    .tab-label {
      font-size: 13px;
    }

  }

}

/*夜间模式*/
.dark .music {
  --music-bg-opacity: 0 !important;
}
</style>
<style>
/*.music .el-tabs__content{
  overflow-y: scroll;
}*/

/*移动端布局*/
@media (max-width: 780px) {
  .el-drawer__body {
    padding: 5px;
  }

  .music .tabs {
    .el-tabs__item {
      padding-right: 0;
    }
  }
}
</style>
