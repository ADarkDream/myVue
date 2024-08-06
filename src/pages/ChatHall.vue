<template>
  <el-container :style="isPC? {  width: '50%',margin: '5% 25%'}:{height:screenHeight-40+'px' }">
    <el-header><h1>大厅</h1></el-header>
    <el-main>
      <el-form :model="formData" require-asterisk-position="right">
        从房间退出，没有RoomID，RoomID持久化
        <el-form-item label="房间号">
          <el-input placeholder="请输入房间号" v-model.lazy.trim="formData.roomID" clearable maxlength="20"/>
        </el-form-item>
        <el-form-item label="昵称" required>
          <el-input placeholder="请输入昵称" v-model.trim="formData.playerName" clearable maxlength="10"/>
        </el-form-item>
        <el-button type="primary" @click="socket.connect()" :loading="isLoading">重连</el-button>
        <el-button type="primary" @click="addRoom" :loading="isLoading">创建房间</el-button>
        <el-button type="primary" @click="joinRoom" :loading="isLoading">加入房间</el-button>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useRouter, useRoute} from "vue-router";

import useResponsive from "@/hooks/useResponsive";
import {useChatInfoStore} from '@/store/useChatInfoStore'


const router = useRouter();
const route = useRoute()

const {screenHeight, isPC} = useResponsive()
const {playerInfo, socket} = useChatInfoStore()//本地用户信息


const isLoading = ref(false)

//表单数据
const formData = reactive({
  roomID: playerInfo.roomID,
  playerName: playerInfo.playerName
})

onMounted(() => {
  if (route.query.roomID){
    playerInfo.roomID=route.query.roomID as string
  }
})


//创建房间
const addRoom = () => {
  console.log('尝试创建房间')
  if (!formData.playerName) return ElMessage.error('昵称不能为空')
  else if (formData.playerName.length > 10) return ElMessage.error('昵称不能超过十个字符')
  playerInfo.playerName = formData.playerName
  socket.emit('room-add', {playerInfo})
  loading()
}

//进入房间
const joinRoom = () => {
  console.log('尝试加入房间')
  if (!formData.roomID || !formData.playerName) return ElMessage.error('房间号和昵称不能为空')
  else if (formData.playerName.length > 10) return ElMessage.error('昵称不能超过十个字符')
  socket.emit('room-join', {formData, playerInfo})
  loading()
}


//防抖
const loading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}


</script>
<style scoped>
.el-container {
  background-color: var(--el-bg-color);
  padding: 1% 5% 2%;
  opacity: 0.8;
}
</style>

