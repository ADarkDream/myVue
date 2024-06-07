<template>
  <!--  PC端-->
  <el-scrollbar :height="screenHeight-100" class="centerScrollbar" v-if="isPC">
      <router-view/>
  </el-scrollbar>

  <!--移动端-->
  <router-view class="centerScrollbar" v-else/>

</template>

<script setup lang="ts">
import useResponsive from "@/hooks/useResponsive";

const { isPC,screenHeight} = useResponsive()



</script>

<style scoped>
.centerScrollbar {
  margin: 0 15%;
}

@media (max-width: 980px) {
  .centerScrollbar {
    margin: 0;
  }
}
</style>