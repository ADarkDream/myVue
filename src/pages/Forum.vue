<template>
  <!--  PC端-->
  <!--  <div>-->
  <!--  <el-scrollbar :height="screenHeight-100" class="centerScrollbar" v-if="isPC">-->
  <!--      <router-view/>-->
  <!--  </el-scrollbar>-->

  <!--  &lt;!&ndash;移动端&ndash;&gt;-->
  <!--  <router-view class="centerScrollbar" v-else/>-->
  <!--</div>-->
      <el-scrollbar :height="(isPC? screenHeight-80 : screenHeight-40)+'px'  ">
    <router-view/>
    </el-scrollbar>
<!--  <router-view class="centerScrollbar"/>-->
</template>

<script setup lang="ts">
import useResponsive from "@/hooks/useResponsive";

const {isPC, screenHeight} = useResponsive()


</script>

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