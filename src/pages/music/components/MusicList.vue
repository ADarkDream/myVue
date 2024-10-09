<!--歌单列表-->
<template>
  <div>
    <el-empty v-if="!musicList?.length" description="请先搜索或选择歌单"></el-empty>
    <div>{{ musicListInfo }}</div>
    <play-list :songs-list="musicList"/>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import PlayList from "@/pages/music/components/PlayList.vue";
import {useMusicListStore} from "@/store/music/useMusicListStore";


const musicListStore = useMusicListStore()

const {musicListInfo} = musicListStore
const musicList = computed(() => musicListStore.musicList)

</script>

<style scoped>

</style>
