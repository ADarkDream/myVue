<template>
  <div>
    <el-card>
      <template #header>
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input v-model="searchStore.searchConfig.s" placeholder="输入歌曲名"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button @click="searchMusic" type="success" plain>搜索</el-button>
          </el-col>
        </el-row>
      </template>
      <template #default  v-if="searchStore.searchResult.length!==0">
           <div  v-for="(item,index) in searchStore.searchResult" :key="index">
        <el-text>{{ page * 10 + index + 1 }}、{{ item.name || '未命名' }} -
          {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }}
        </el-text>&ensp;
        <el-text v-if="item.fee===1&&!item.src" type="danger">[VIP]</el-text>
        <el-text v-else @click="addCloudMusic(item.cloud_music_id,true)" size="small" type="primary">
          点击播放
        </el-text>
      </div>
      </template>
      <template #footer v-if="searchStore.searchResult.length!==0">
        <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 100px">
          <span>第{{ page + 1 }}页</span>
          <el-button-group :size="elSize">
            <el-button @click="searchMusic('-')">上一页</el-button>
            <el-button @click="searchMusic('+')">下一页</el-button>
          </el-button-group>
          <span>共{{ songCount }}条搜索结果</span>
        </div>
      </template>
    </el-card>
  </div>

</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useMusicSearchStore} from "@/store/music/useMusicSearchStore";
import useResponsive from "@/hooks/useResponsive";
import {ElMessage} from "element-plus";

const searchStore = useMusicSearchStore()

const {elSize} = useResponsive()
const {addCloudMusic} = defineProps(['addCloudMusic'])
const page = ref(0)
const songCount = computed(() => searchStore.songCount)

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
  console.log('searchMusic', result)
}
</script>

<style scoped>

</style>
