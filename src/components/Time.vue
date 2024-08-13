<template>
  <!--  时钟区域-->
  <el-button link type="primary"  shadow="never" >{{ time }}</el-button>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
//时间
const time = ref<string>('')

//获取当前时间
const changeTime = () => {
  let hours = (new Date().getHours()).toString()
  let minutes = (new Date().getMinutes()).toString()
  // let seconds = (new Date().getSeconds()).toString()//显示秒
  Number(hours) < 10 ? hours = '0' + hours : hours
  Number(minutes) < 10 ? minutes = '0' + minutes : minutes
  // Number(seconds)<10 ? seconds='0'+seconds : seconds
  return `${hours}:${minutes}`
  // time.value = `${hours}:${minutes}:${seconds}`
}

//每秒倒计时，刷新时间
const timer = setInterval(() => time.value = changeTime(), 1000)

onMounted(() => {
  console.log('时钟定时器已开启')
  time.value = changeTime()
})

onUnmounted(() => {
  console.log('时钟定时器已清除')
  clearInterval(timer)
})

</script>

<style scoped>

</style>
