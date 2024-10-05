<template>
  <div class="container">
    <div class="header">
      <div class="searchDiv">
        <el-button :icon="Back" size="small" @click="closeSearchPanel()"></el-button>
        <el-input class="search" v-model.trim="searchStore.searchConfig.s" @keyup.enter="searchMusic()"
                  placeholder="歌曲名或歌手名"/>
        <el-button size="small" type="primary" @click="searchMusic()">搜索</el-button>
      </div>
      <el-radio-group v-if="false" v-model="searchStore.searchConfig.type" size="small">
        <el-radio-button label="单曲" :value="1"/>
        <el-radio-button label="专辑" :value="10"/>
        <el-radio-button label="歌手" :value="100"/>
        <el-radio-button label="歌单" :value="1000"/>
        <el-radio-button label="用户" :value="1002"/>
        <el-radio-button label="歌词" :value="1006"/>
      </el-radio-group>
    </div>
    <div v-if="showResult">
      <div style="text-align: left">
        <div v-for="(item,index) in searchStore.searchResult" :key="index">
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
    </div>
    <el-empty v-else description=" " image="src/assets/fool.png" image-size="400"></el-empty>
  </div>

</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useMusicSearchStore} from "@/store/music/useMusicSearchStore";
import useResponsive from "@/hooks/useResponsive";
import {ElMessage} from "element-plus";
import {Back, Search} from "@element-plus/icons-vue";

const searchStore = useMusicSearchStore()
const {elSize} = useResponsive()
const {addCloudMusic, closeSearchPanel} = defineProps(['addCloudMusic', 'closeSearchPanel'])


const page = ref(0)
const songCount = computed(() => searchStore.songCount)
const showResult = ref(false)

const searchMusic = async (flag?: string) => {
  if (!searchStore.searchConfig.s) return
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

.search:focus {
  outline: none;
  border: none;
}


/*endregion*/

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
.el-input__wrapper {
  background: transparent;
  border: none;
  box-shadow: none;
}

.el-input {
  border: none;
}


.el-input__wrapper:focus {
  box-shadow: none;
  border: none;
}

.el-input__inner:focus {
  box-shadow: none;
  border: none;
}

.el-input:focus {
  box-shadow: none;
  border: none;
}
</style>
