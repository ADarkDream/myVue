<template>
  <div class="container">
    <div class="searchDiv">
      <button @click="searchMusic()">
        <el-icon>
          <Search/>
        </el-icon>
      </button>
      <input class="input" v-model="searchStore.searchConfig.s" @keyup.enter="searchMusic()"
             placeholder="歌曲名或歌手名">
      <button class="reset" @click="searchStore.searchConfig.s=''" v-if="searchStore.searchConfig.s!==''">
        <el-icon>
          <Close/>
        </el-icon>
      </button>
    </div>
    <el-drawer v-model="showResult" :show-close="false" direction="btt" size="75%" title="搜索结果">
      <div style="text-align: left">
        <div v-for="(item,index) in searchStore.searchResult" :key="index" >
          <el-text>{{ page * 10 + index + 1 }}、{{ item.name || '未命名' }} -
            {{
              item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家'
            }}-{{ item.cloud_music_id }}
          </el-text>&ensp;
          <el-text v-if="item.fee===1&&!item.src" type="danger">[VIP]</el-text>
          <el-link v-else @click="addCloudMusic(item.cloud_music_id,true)" size="small" type="primary">
            点击播放
          </el-link>
        </div>
      </div>
      <div>
        <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 100px">
          <span>第{{ page + 1 }}页</span>
          <el-button-group :size="elSize">
            <el-button @click="searchMusic('-')">上一页</el-button>
            <el-button @click="searchMusic('+')">下一页</el-button>
          </el-button-group>
          <span>共{{ songCount }}条搜索结果</span>
        </div>
      </div>

    </el-drawer>
  </div>

</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useMusicSearchStore} from "@/store/music/useMusicSearchStore";
import useResponsive from "@/hooks/useResponsive";
import {ElMessage} from "element-plus";
import {Close, Search} from "@element-plus/icons-vue";

const searchStore = useMusicSearchStore()

const {elSize} = useResponsive()
const {addCloudMusic} = defineProps(['addCloudMusic'])
const page = ref(0)
const songCount = computed(() => searchStore.songCount)
const showResult = ref(false)

const searchMusic = async (flag?: string) => {


  if (flag === '-') {
    if (page.value === 0) return ElMessage.info('当前是第一页')
    page.value--
    searchStore.searchConfig.offset = page.value * 10
    console.log('上一页搜索结果')
  } else if (flag === '+') {
    const offset = (page.value + 1) * 10
    if (offset > songCount.value) return ElMessage.info('当前是最后一页')
    page.value++
    searchStore.searchConfig.offset = offset
    console.log('下一页搜索结果')
  }

  const result = await searchStore.search()
  showResult.value = true
  console.log('searchMusic', result)
}
</script>

<style scoped>
.container {
  --timing: 0.3s;
  --width-of-input: 200px;
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
  color: #8b8ba7;
}

/* styling of whole input container */
.searchDiv {
  position: absolute;
  right: 20px;
  width: var(--width-of-input);
  height: var(--height-of-input);
  display: flex;
  align-items: center;
  padding-inline: 0.8em;
  border-radius: var(--border-radius);
  transition: border-radius 0.5s ease;
  background: var(--input-bg, #fff);

}

/* styling of Input */
.input {
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding-inline: 0.5em;
  padding-block: 0.7em;
  border: none;
}

/* styling of animated border */
.searchDiv:before {
  content: "";
  position: absolute;
  background: var(--border-color);
  transform: scaleX(0);
  transform-origin: center;
  width: 100%;
  height: var(--border-height);
  left: 0;
  bottom: 0;
  border-radius: 1px;
  transition: transform var(--timing) ease;
}

/* Hover on Input */
.searchDiv:focus-within {
  border-radius: var(--after-border-radius);
}

input:focus {
  outline: none;
}

/* here is code of animated border */
.searchDiv:focus-within:before {
  transform: scale(1);
}

/* styling of close button */
/* == you can click the close button to remove text == */
.reset {
  border: none;
  background: none;
  opacity: 0;
  visibility: hidden;
}

/* close button shown when typing */
input:not(:placeholder-shown) ~ .reset {
  opacity: 1;
  visibility: visible;
}

/* sizing svg icons */
.searchDiv svg {
  width: 17px;
  margin-top: 3px;
}


/*endregion*/

/*夜间模式*/
.dark .searchDiv {
  --input-bg: #b3aeb4;
}

/*移动端布局*/
@media (max-width: 780px) {
  .container {
    --width-of-input:150px;
    --height-of-input: 25px;
  }



  .searchDiv {
    right: 10px;
    font-size: 7px;
  }

}


</style>
