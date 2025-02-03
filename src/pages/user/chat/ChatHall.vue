<template>
  <el-container :style="isPC ? { width: '50%', margin: '5% 25%' } : { width: '100%', height: screenHeight - 40 + 'px' }">
    <el-header>
      <h1>大厅</h1>
    </el-header>
    <el-main>
      <!-- <el-form :model="formData" require-asterisk-position="right">
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
      </el-form> -->
      <ChatConnect />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, toRefs } from "vue"
import { useRouter, useRoute } from "vue-router"
//stores
import { useChatInfoStore } from "@/store/user/chat/useChatInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
import ChatConnect from "./components/ChatConnect.vue"

const router = useRouter()
const route = useRoute()
const responsiveStore = useResponsiveStore()
const chatInfoStore = useChatInfoStore()
const { screenHeight, isPC } = toRefs(responsiveStore)
const { playerInfo } = toRefs(chatInfoStore)

onMounted(() => {
  const { roomID, playerName } = route.query
  let has_roomID = false
  let has_playerName = false
  if (roomID && typeof roomID === "string") {
    playerInfo.value.roomID = roomID
    has_roomID = true
  }
  if (playerName && typeof playerName === "string") {
    playerInfo.value.playerName = playerName
    has_playerName = true
  }
  if (has_roomID && has_playerName) router.push({ name: "hall" })
})
</script>
<style scoped>
.el-container {
  background-color: var(--el-bg-color);
  padding: 1% 5% 2%;
  opacity: 0.8;
}
</style>
