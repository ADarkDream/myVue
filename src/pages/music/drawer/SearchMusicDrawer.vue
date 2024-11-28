<template>
  <div class="searchMusicDrawer">
    <div class="header">
      <div class="searchDiv">
        <el-button :icon="Back" size="small" @click="isShowSearchPanel = false"></el-button>
        <el-input class="search" v-model.trim="keyWords" @keyup.enter="searchMusic()" placeholder="歌曲名或歌手名" clearable />
        <el-button size="small" type="primary" @click="searchMusic()">搜索</el-button>
      </div>
      <el-radio-group v-model="searchConfig.type" size="small" style="height: 30px;">
        <el-radio-button label="单曲" :value="1" />
        <el-radio-button label="专辑" :value="10" />
        <el-radio-button label="歌手" :value="100" />
        <el-radio-button label="歌单" :value="1000" />
        <el-radio-button label="用户" :value="1002" />
        <el-radio-button label="歌词" :value="1006" />
      </el-radio-group>
      <HotSearchWords :changeKeyWords="changeKeyWords" style="height: 30px;overflow: hidden;" />
    </div>
    <div v-if="showResult">
      <music-list-songs-list v-if="searchResultType === 1 && showResult" :songsList="searchResult"
        :height="searchDivHeight" :isSearchList="true" />
      <div v-else-if="searchResultType === 10 && showResult">
        <div class="songInfo" v-for="(album, index) in searchResult" :key="index">
          <el-text>{{ index + 1 }}、{{ album.name || '未命名' }} -
            <!-- {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }} -->
          </el-text>&ensp;
          <!-- <el-text>{{ album.publish_time }}</el-text> -->
        </div>
      </div>
      <div class="footer">
        <el-pagination v-model:current-page="page" :page-size="10"
          :layout="isPC ? 'prev, pager, next,total' : 'prev, pager, next'" :total="totalNum"
          @current-change="searchMusic()" />
      </div>
    </div>
    <el-empty v-else description=" " style="padding: 0" image="/fool.png" :image-size="350" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { Back } from "@element-plus/icons-vue";
//stores
import { useMusicSearchStore } from "@/store/music/useMusicSearchStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
//components
import HotSearchWords from "@/pages/music/components/HotSearchWords.vue";
import MusicListSongsList from "@/pages/music/components/MusicListSongsList.vue";

const searchStore = useMusicSearchStore()
const responsiveStore = useResponsiveStore()

const { isPC, drawerSize } = toRefs(responsiveStore)


const searchDivHeight = ref(isPC.value ? (drawerSize.value - 210) : (drawerSize.value - 180))

const { isShowSearchPanel, searchConfig, totalNum, searchResultType } = toRefs(searchStore)
const searchResult = computed(() => searchStore.searchResult)

const { search } = searchStore
const page = ref(1)
// const songCount = computed(() => searchStore.songCount)
const showResult = ref(false)
//限制单次查询的条数，作为常量
const limitNum = searchConfig.value.limit
//搜索关键词
const keyWords = ref('')

const changeKeyWords = (newWords: string) => {
  keyWords.value = newWords
  searchMusic()
}

//搜索前预检查
const searchMusic = async () => {
  //没有搜索值，返回
  if (!keyWords.value) return ElMessage.info('搜索不能为空')
  searchConfig.value.s = keyWords.value

  const offset = (page.value - 1) * limitNum
  if (offset < 0 || offset > totalNum.value) return ElMessage.info('页码错误')
  //最后一页不满limit的数量，需要额外处理
  if (totalNum.value) {
    const restNum = totalNum.value - offset
    //设置本次查询的条数
    searchConfig.value.limit = restNum < limitNum ? restNum : limitNum
  }

  //设置本次查询的偏移条数
  searchConfig.value.offset = offset

  const result = await search()
  showResult.value = true
  console.log('searchMusic', result)
}
</script>

<style scoped>
.searchMusicDrawer {
  --timing: 0.3s;
  --width-of-input: 80%;
  --height-of-input: 40px;
  --border-height: 2px;
  --input-bg: #e1e4ea;
  --border-color: #5891ff;
  --border-radius: 30px;
  --after-border-radius: 1px;
  height: var(--height-of-input);

}


/*region 输入框*/
/* From Uiverse.io by satyamchaudharydev */
/* From uiverse.io by @satyamchaudharydev */
/* removing default style of button */

.searchDiv button {
  border: none;
  background: none;
  color: currentColor;
}

.header {
  margin: 0 auto;
}


.searchDiv {
  position: relative;
  width: var(--width-of-input);
  height: var(--height-of-input);
  display: flex;
  align-items: center;
  padding-inline: 0.8em;
  border-radius: var(--border-radius);
  transition: border-radius 0.5s ease;
  background: var(--input-bg, #fff);
  justify-content: space-between;
  margin: 0 auto;
}

.search:focus {
  outline: none;
  border: none;
}


/*夜间模式*/
.dark .searchDiv {
  /*  --input-bg: #b3aeb4;*/
  --input-bg: #000;
}

/*移动端布局*/
@media (max-width: 780px) {
  .searchMusicDrawer {
    --width-of-input: 100%;
    --height-of-input: 25px;
  }


  .searchDiv {
    width: 95%;
    font-size: 7px;
  }
}
</style>
<style>
.searchDiv .el-input__wrapper {
  background: transparent;
  border: none;
  box-shadow: none;
}

.searchDiv .el-input {
  border: none;
}


.searchDiv .el-input__wrapper:focus {
  box-shadow: none;
  border: none;
}

.searchDiv .el-input__inner:focus {
  box-shadow: none;
  border: none;
}

.searchDiv .el-input:focus {
  box-shadow: none;
  border: none;
}

.footer {
  height: 30px;
  display: flex;
  justify-content: center;
}
</style>
