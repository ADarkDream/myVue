<template>
  <el-scrollbar :height="containerHeight + 'px'" @scroll="scroll">
    <router-view />
  </el-scrollbar>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
//hooks
import { useResponsiveStore } from "@/store/useResponsiveStore";
//utils
import { emitter } from "@/utils/emitter";

const responsiveStore = useResponsiveStore()
const { containerHeight } = toRefs(responsiveStore)

interface Scroll {
  scrollLeft: number,
  scrollTop: number
}

function scroll({ scrollLeft, scrollTop }: Scroll) {
  console.log('鼠标滚动了', scrollTop, 'px')
  emitter.emit('comments-move', scrollTop)
}

</script>
<style>
/*全局样式，当前页面及子页面开启滚动*/
body {
  overflow-x: hidden;
  overflow-y: visible;
}
</style>
<style scoped>
/*.centerScrollbar {
  margin: 0 ;
width: 90%;
}*/

@media (max-width: 780px) {
  .centerScrollbar {
    margin: 0;
  }
}
</style>
