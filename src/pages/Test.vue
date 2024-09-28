<template>
  <el-container>
<el-main>
  <h1>本页面为功能测试页</h1>
  <div style="margin-top: 30px;padding: 20px">
    <el-button @click="router.push({name:'chat'})">点击前往聊天室demo</el-button>
  </div>
  <div><el-button @click="router.push({name:'music'})">点击前往音乐播放器demo</el-button></div>
</el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";
const router=useRouter()



</script>
<style scoped>
.el-container {
  background-color: var(--el-bg-color);
  display: flex;
  justify-content: center;
}
</style>
