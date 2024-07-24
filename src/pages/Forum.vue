<template>
  <!--  PC端-->
  <!--  <div>-->
  <!--  <el-scrollbar :height="screenHeight-100" class="centerScrollbar" v-if="isPC">-->
  <!--      <router-view/>-->
  <!--  </el-scrollbar>-->

  <!--  &lt;!&ndash;移动端&ndash;&gt;-->
  <!--  <router-view class="centerScrollbar" v-else/>-->
  <!--</div>-->
        <el-scrollbar :height="(isPC? screenHeight-80 : screenHeight-40)+'px'  " @scroll="scroll">
  <router-view/>
      </el-scrollbar>
  <!--  <router-view class="centerScrollbar"/>-->
</template>

<script setup lang="ts">
import useResponsive from "@/hooks/useResponsive";
import {onMounted, onUnmounted} from "vue";
import emitter from "@/utils/emitter";

const {isScroll,isPC, screenHeight} = useResponsive()
function scroll({ scrollLeft, scrollTop}){
  console.log('鼠标滚动了',scrollTop,'px')
  emitter.emit('comments-move',scrollTop)
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

@media (max-width: 980px) {
  .centerScrollbar {
    margin: 0;
  }
}
</style>