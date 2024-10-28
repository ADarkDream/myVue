<template>
  <el-container :style="isPC ? { width: '50%', margin: '5% 25%' } : { height: screenHeight - 40 + 'px' }">
    <el-header>
      <h1>大厅</h1>
    </el-header>
    <el-main>
      <el-form :model="formData" require-asterisk-position="right">
        <el-form-item label="房间号">
          <el-input placeholder="请输入房间号" v-model.lazy.trim="formData.roomID" clearable maxlength="20" />
        </el-form-item>
        <el-form-item label="昵称" required>
          <el-input placeholder="请输入昵称" v-model.trim="formData.playerName" clearable maxlength="10" />
        </el-form-item>
        <el-button type="primary" @click="addRoom" :loading="isLoading">创建房间</el-button>
        <el-button type="primary" @click="joinRoom" :loading="isLoading">加入房间</el-button>
        <el-button type="primary" plain @click="socket.connect()" :loading="isLoading">连接</el-button>
        <el-button type="warning" plain @click="socket.disconnect()" :loading="isLoading" v-if="false">断联</el-button>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from 'element-plus'
//stores
import { useChatInfoStore } from '@/store/useChatInfoStore'
//hooks
import useResponsive from "@/hooks/useResponsive";



const router = useRouter()
const route = useRoute()

const { screenHeight, isPC } = useResponsive()
const playerInfo = useChatInfoStore()//本地用户信息
const socket = playerInfo.socket


const isLoading = ref(false)

//表单数据
const formData = reactive({
  roomID: playerInfo.roomID,
  playerName: playerInfo.playerName
})

onMounted(() => {
  if (route.query.roomID || route.query.playerName) {
    if (route.query.roomID) {
      playerInfo.roomID = route.query.roomID as string
      formData.roomID = route.query.roomID as string
    }
    if (route.query.playerName) {
      playerInfo.playerName = route.query.playerName as string
      formData.playerName = route.query.playerName as string
    }
    router.push({ name: 'hall' })
  }

  // console.log(playerInfo, JSON.parse(localStorage.getItem('chatInfo')||'')?.playerInfo)
})


//创建房间
const addRoom = () => {
  console.log('尝试创建房间')
  console.log(formData)
  if (!formData.playerName) return ElMessage.error('昵称不能为空')
  else if (formData.playerName.length > 10) return ElMessage.error('昵称不能超过十个字符')

  // playerInfo.playerName = formData.playerName
  playerInfo.setPName(formData.playerName)
  // playerInfo.updateData('rid',playerInfo.playerID)
  const { playerID, playerName, roomID, roomName } = playerInfo
  console.log(1, playerInfo.playerName, 2, formData.playerName)
  socket.emit('room-add', {
    playerInfo: { playerID, playerName, roomID, roomName }
  })
  loading()
}

//进入房间
const joinRoom = () => {
  console.log('尝试加入房间')
  console.log(formData)
  if (!formData.roomID || !formData.playerName) return ElMessage.error('房间号和昵称不能为空')
  else if (formData.playerName.length > 10) return ElMessage.error('昵称不能超过十个字符')
  playerInfo.setPName(formData.playerName)
  playerInfo.setRID(formData.roomID)
  const { playerID, playerName, roomID, roomName } = playerInfo
  console.log(playerInfo)
  // Object.assign(playerInfo, formData)
  socket.emit('room-join', {
    playerInfo: { playerID, playerName, roomID, roomName }
  })
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
