<template>
  <div class="container">
    <div class="header">
      <div class="searchDiv">
        <el-button :icon="Back" size="small" @click="closeSearchPanel()"></el-button>
        <el-input class="search" v-model.trim="searchConfig.s" @keyup.enter="searchMusic()"
                  placeholder="歌曲名或歌手名" clearable/>
        <el-button size="small" type="primary" @click="searchMusic()">搜索</el-button>
      </div>
      <el-radio-group v-if="false" v-model="searchConfig.type" size="small">
        <el-radio-button label="单曲" :value="1"/>
        <el-radio-button label="专辑" :value="10"/>
        <el-radio-button label="歌手" :value="100"/>
        <el-radio-button label="歌单" :value="1000"/>
        <el-radio-button label="用户" :value="1002"/>
        <el-radio-button label="歌词" :value="1006"/>
      </el-radio-group>
      <HotSearchWords/>
    </div>
    <div v-if="showResult">
      <div style="text-align: left">
        <div v-for="(item,index) in searchResult" :key="index">
          <el-text>{{ (page - 1) * 10 + index + 1 }}、{{ item.name || '未命名' }} -
            {{
              item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家'
            }}-{{ item.cloud_music_id }}
          </el-text>&ensp;
          <el-text v-if="item.fee===1&&!item.src" type="danger">[VIP]</el-text>
          <el-button link v-else @click="addCloudMusic(item.cloud_music_id,true)" size="small" type="primary">
            点击播放
          </el-button>
          <el-button link v-if="item.cloud_music_id!==0&&item.fee!==1"
                     @click="copyText('https://muxidream.cn/music?cloud_music_id='+item.cloud_music_id,'播放链接')"
                     size="small" type="primary">
            分享
          </el-button>
        </div>
      </div>
      <div>
        <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 100px">
          <el-pagination
              v-model:current-page="page"
              :page-size="10"
              layout="prev, pager, next"
              :total="songCount"
              @current-change="searchMusic"
          />
        </div>
      </div>
    </div>
    <el-empty v-else description=" " style="padding: 0" image="/fool.png" :image-size="350" ></el-empty>
  </div>

</template>

<script setup lang="ts">
import {computed, ref, toRefs} from "vue";
import {useMusicSearchStore} from "@/store/music/useMusicSearchStore";

import {ElMessage} from "element-plus";
import {Back} from "@element-plus/icons-vue";
import useFunction from "@/hooks/useFunction";

import HotSearchWords from "@/pages/music/components/HotSearchWords.vue";

const searchStore = useMusicSearchStore()

const {addCloudMusic, closeSearchPanel} = defineProps(['addCloudMusic', 'closeSearchPanel'])
const {copyText} = useFunction()

const {searchConfig, songCount} = toRefs(searchStore)
const searchResult = computed(() => searchStore.searchResult)

const {search} = searchStore
const page = ref(1)
// const songCount = computed(() => searchStore.songCount)
const showResult = ref(false)
//限制单次查询的条数，作为常量
const limitNum = searchConfig.value.limit

const searchMusic = async () => {
//没有搜索值，返回
  if (!searchConfig.value.s) return
  const offset = (page.value - 1) * 10
  if (offset < 0 || offset > songCount.value) return ElMessage.info('页码错误')
  //最后一页不满limit的数量，需要额外处理
  if (songCount.value) {
    const restNum = songCount.value - offset
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
.container {
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
  .container {
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
</style>
