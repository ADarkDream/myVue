<template>

  <el-card class="msg" shadow="hover">
    <h1>404 NOT FOUND</h1>
    <el-text>对不起，您访问的页面不存在。</el-text><br>
 <el-text>Sorry, the page you visited does not exist.</el-text>
    <template #footer>
      <el-text type="primary">{{ time }}</el-text>
      <el-button text>秒后自动<el-link @click="router.replace({name: 'home'})">返回首页</el-link></el-button>
<el-link href="tencent://message/?uin=1224021291">联系站长</el-link>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import {onBeforeRouteLeave, useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter()

const time = ref(10)
const timer1=ref(null)
const timer2=ref(null)

timer1.value= setTimeout(() => {
  router.replace({name: 'home'})
}, 11000)

timer2.value= setInterval(() => {
  time.value--
  console.log(111)
}, 1000)

onBeforeRouteLeave(()=>{
  console.log('计时器和倒计时已清除')
  clearTimeout(timer1.value)
  clearInterval(timer2.value)
})
</script>

<style scoped>
.msg{
  border: transparent;
  width: 50%;
  margin: 10% auto;
}

h1 {
  color: gray;
  font-size: 30px;
}


</style>