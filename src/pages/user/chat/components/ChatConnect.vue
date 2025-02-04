<template>
  <el-form :model="formData" require-asterisk-position="right">
    <el-form-item label="房间号">
      <el-input v-model="formData.roomID" clearable maxlength="20" placeholder="请输入房间号" />
    </el-form-item>
    <el-form-item label="昵称" required>
      <el-input v-model.trim="formData.playerName" clearable maxlength="10" placeholder="请输入昵称" />
    </el-form-item>
    <el-button :disabled="!!formData.roomID" :loading="isLoading" type="primary" @click="addRoom"
      >创建房间{{ !!formData.roomID ? "不需要房间号" : "" }}</el-button
    >
    <el-button :loading="isLoading" type="primary" @click="joinRoom">加入房间</el-button>
    <el-button :loading="isLoading" plain type="primary" @click="socket.connect()">连接</el-button>
    <el-button v-if="false" :loading="isLoading" plain type="warning" @click="socket.disconnect()">断联</el-button>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from "vue"
//stores
import { useChatInfoStore } from "@/store/user/chat/useChatInfoStore"

const chatInfoStore = useChatInfoStore()
const { socket, playerInfo } = toRefs(chatInfoStore)
const { setPlayerInfo } = chatInfoStore

const isLoading = ref(false)

//表单数据
const formData = reactive({
  roomID: playerInfo.value.roomID,
  playerName: playerInfo.value.playerName,
})

//创建房间
const addRoom = () => {
  console.log("尝试创建房间")
  // console.log(formData)
  if (!formData.playerName) return ElMessage.error("昵称不能为空")
  else if (formData.playerName.length > 10) return ElMessage.error("昵称不能超过十个字符")
  playerInfo.value.playerName = formData.playerName
  socket.value.emit("room-add", {
    playerInfo: playerInfo.value,
  })
  loading()
}

//进入房间
const joinRoom = () => {
  console.log("尝试加入房间")
  console.log(formData)
  if (!formData.roomID || !formData.playerName) return ElMessage.error("房间号和昵称不能为空")
  else if (formData.playerName.length > 10) return ElMessage.error("昵称不能超过十个字符")
  setPlayerInfo(formData)
  socket.value.emit("room-join", {
    playerInfo: playerInfo.value,
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
