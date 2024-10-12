<template>
  <div class="hotWords">
    <el-text type="primary">搜索热词：</el-text>
    <el-button text type="info" @click="changeKeyWords(word)" v-for="word in hotWords" :key="word">{{ word
      }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { useMusicSearchStore } from "@/store/music/useMusicSearchStore";
import { toRefs } from "vue";

const searchStore = useMusicSearchStore()
const { hotWords } = toRefs(searchStore)
const { changeKeyWords } = defineProps(['changeKeyWords'])
</script>

<style scoped>
/*搜索热词*/
.hotWords {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  button {
    padding: 5px;
    margin: 0;
  }

  button:hover {
    color: var(--el-color-primary);
    transform: scale(1.1);
    background-color: transparent;
  }
}


/*移动端布局*/
@media (max-width: 780px) {
  .hotWords {
    justify-content: space-evenly;
    padding: 0 5px
  }
}
</style>
