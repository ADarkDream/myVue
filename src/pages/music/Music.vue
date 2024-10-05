<template>
  <el-container :style="'height:'+(containerHeight)+'px'">
    <el-header>
      <el-button :icon="Plus" @click="activeName='3'" >添加歌曲</el-button>
<!--      <el-button :icon="Setting"></el-button>-->
      <el-button @click="activeName='2'">
        <SVG_music_list class="el-icon" style="transform: scale(1.5)"/>&ensp;播放列表
      </el-button>
      <el-button :icon="Search" @click="isShowSearchPanel=true">搜索</el-button>
    </el-header>
    <el-main style="background-color: transparent">


      <el-collapse style="text-align: left;background-color: transparent" v-model="activeName" accordion>
        <el-collapse-item title="备忘" name="0">
          <span style="background-color: transparent;">1、会员歌曲和播放失败的不能自动跳过,在resetUrl里面改逻辑</span>
          <div>2、七牛云链接后加上?avinfo可以获得音频源数据</div>
          <div>3、用第三方库 lyric-parser 进行处理。实现显示歌词、拖动进度条歌词同步滚动、歌词跟随歌曲进度高亮。</div>
          <div>4、歌单界面和歌词界面</div>
          <div>5、顺序播放到最后一首会重复播放</div>
          <div>6、重复播放同一首换成暂停和播放，或者做出提醒</div>
          <div>7、播放设置和播放列表存本地</div>
        </el-collapse-item>
        <el-collapse-item title="歌单列表(开发中，暂不可用)" name="1">
          <MusicList/>
        </el-collapse-item>
        <el-collapse-item title="播放列表" name="2">
          <PlayList/>
        </el-collapse-item>
        <el-collapse-item title="添加音乐" name="3">
          <el-form v-model="newMusic" label-width="auto" label-position="top"
                   style="width: 100%;" :size="elSize">
            <el-form-item label="输入音乐ID获取音频链接(仅支持网易云免费音乐)">
              <el-row :gutter="24">
                <el-col :span="16">
                  <el-input v-model.trim="cloudMusicID" placeholder="输入网易云音乐ID"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="addCloudMusic(cloudMusicID,true)" type="primary" plain>添加并播放
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="src" label="输入音频链接">
              <el-row :gutter="24" class="add_music">
                <el-col :span="16">
                  <el-input v-model="musicUrl" placeholder="输入音频链接"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="addMusic(musicUrl)" type="success" plain>添加并播放</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-main>

    <el-drawer class="searchDrawer" v-model="isShowSearchPanel" :with-header="false"
               :size="drawerSize-(isPC?72:39) +'px'"
               direction="btt" show-close>
      <SearchMusic :addCloudMusic="addCloudMusic" :closeSearchPanel="closeSearchPanel"/>
    </el-drawer>
  </el-container>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {Plus, Search, Setting} from "@element-plus/icons-vue";
import {SongInfo} from "@/types/music";
import SearchMusic from "@/pages/music/components/SearchMusic.vue";


import PlayList from "@/pages/music/components/PlayList.vue";
import MusicList from "@/pages/music/components/MusicList.vue";

import useResponsive from "@/hooks/useResponsive";
import {useRoute, useRouter} from "vue-router";
import {useMusicPlayStore} from "@/store/music/useMusicPlayStore";
import SVG_music_list from '@/assets/music/music_list.svg?component'


const musicPlayStore = useMusicPlayStore()
const {isPC, elSize, drawerSize, containerHeight} = useResponsive()

const {addCloudMusic, addMusic} = musicPlayStore

//是否显示
const activeName = ref('3')
const route = useRoute()
const router = useRouter()

//是否显示搜索面板
const isShowSearchPanel = ref(false)

/*关闭搜索面板*/
const closeSearchPanel = () => {
  isShowSearchPanel.value = false
}


const newMusic = ref<SongInfo>({
  name: '',
  artists: [{name: '', pic_url: ''}],
  album: {name: '', pic_url: ''},
  src: ''
})

const cloudMusicID = ref()
const musicUrl = ref('')


onMounted(async () => {
  //分享功能，从路径中获取音乐id，播放并清除路径参数
  const {cloud_music_id} = route.query
  if (cloud_music_id) {
    await addCloudMusic(Number(cloud_music_id), true)
    await router.replace({name: 'music'})
  }


  // await Promise.all([

  // ])
})


</script>

<style scoped>
.el-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  background-color: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(5px);
  /*   backdrop-filter: blur(30px) saturate(125%);
      background-color: rgb(217 200 200 / 16%);*/
}

.el-container::after {
  content: '';
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.el-header {
  display: flex;
  justify-content: space-between;
}


/*移动端布局*/
@media (max-width: 780px) {

}

/*夜间模式*/
.dark .player {
  --btnColor: gray;
  --infoColor: rgba(194, 192, 192, 0.8); /* rgba(196, 182, 193, 0.85);   */
}

</style>
<style>

/*移动端布局*/
@media (max-width: 780px) {
  .searchDrawer .el-drawer__body {
    padding: 5px 0;
  }
}
</style>
