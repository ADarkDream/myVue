<template>
  <el-container>
    <el-header>
      <h1>聊天室</h1>
      <!--      <h1>聊天室-{{roomName}}</h1>-->
    </el-header>
    <el-main>
      <div>
        <h2>socket.io测试</h2>
        <div style="display: flex; justify-content: space-between; width: 95%; min-height: 300px">
          <el-card style="width: 50%">
            <template #header>
              <el-text type="primary">发送的信息</el-text>
            </template>
            <el-input placeholder="输入要发送的信息" v-model.trim="msg2" type="textarea"></el-input>
            <br />
            <template #footer>
              <el-button-group>
                <!--                <el-button type="success" @click="enterTheRoom()">加入房间</el-button>-->
                <el-button type="primary" @click="sendMsg2()">发送</el-button>
                <el-button type="primary" @click="addMsg()">重连</el-button>
                <el-button type="danger" @click="closeConnection2()">关闭连接</el-button>
                <el-button type="danger">断开连接</el-button>
              </el-button-group>
            </template>
          </el-card>

          <el-card style="width: 50%">
            <template #header>
              <el-text type="primary">socket.io 收到的信息</el-text>
            </template>
            <el-text type="warning" v-if="roomMsg.length === 0">暂无返回的消息</el-text>
            <div v-for="(item, index) in roomMsg" :key="index">
              <el-text type="success"
                >第{{ index }}条{{ item.roomID === playerInfo.roomID ? "真的" : [item.roomID, playerInfo.roomID] }}
              </el-text>
              ：{{ item.message }}
            </div>
          </el-card>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, toRefs } from "vue"
import { useRouter, useRoute } from "vue-router"
//stores
import { useChatInfoStore } from "@/store/user/chat/useChatInfoStore"
import { useChatMsgStore } from "@/store/user/chat/useChatMsgStore"
//hooks
import useTimestamp from "@/hooks/useTimestamp"

const router = useRouter()
const route = useRoute()
const chatInfoStore = useChatInfoStore()
const chatMsgStore = useChatMsgStore()
const { playerInfo, socket } = toRefs(chatInfoStore) //本地用户信息
const { roomMsg } = toRefs(chatMsgStore) //本地的聊天信息

// const { getTime } = useTimestamp()
// const roomID = ref<string>(route.query.roomID as string || '')//房间ID
// const playerName = ref<string>(sessionStorage.getItem('playerName') || '')//玩家昵称
// const chatMsgInfo = JSON.parse(localStorage.getItem('chatMsgInfo') || '')

onMounted(() => {
  if (!playerInfo.value.playerName) {
    //昵称为空，返回主页
    ElMessage.error("请先填写昵称")
    return router.push({ name: "chat", query: { roomID: route.query.roomID } })
  }

  if (!playerInfo.value.roomID) {
    //房间号为空，设置为当前房间号
    playerInfo.value.roomID = route.query.roomID as string
  }
  console.log("roomMsg", roomMsg)
  // if (chatMsgInfo) {//pinia刷新之后不能获取复杂数据类型，bug? 手动获取
  //   console.log(chatMsgInfo)
  //   // roomMsg.splice(0, roomMsg.length, chatMsgInfo.roomMsg) //恢复聊天信息
  //   chatMsgInfo.roomMsg.forEach((item:ChatMsg)=>{
  //     console.log(item.roomID===playerInfo.roomID)
  //     roomMsg.push(item)
  //   })
  // }

  // if (playerInfo.roomID !== ROOMID) roomMsg.splice(0, roomMsg.length)//如果聊天信息不是当前房间的，则清除

  // if (route.query.from !== 'hall') enterTheRoom() //如果不是从大厅来的，则重新加入房间

  //管理员登录判断
  // if (!isAdmin.value) {
  //   if (document.referrer.includes('muxidream')) return router.back()
  //   return router.push({name: 'home'})
  // }
})

// let token = sessionStorage.getItem('token') || localStorage.getItem('token')
// const baseUrl = 'ws://localhost:9999'

// setInterval(()=>{
//     console.log('roomMsg',roomMsg)
// },1000)
//region Socket.io
// const socket = io('http://127.0.0.1:9999')
//信息内部全部可改
const msg2 = ref<string>("")
//收到的信息
// const roomMessage = reactive<string[]>([])

//开启链接，首次发送信息
// const enterTheRoom = () => {
// }
const addMsg = () => {
  //尝试重连
  socket.value.emit("re-link", { playerInfo: playerInfo.value })
}

//发送信息
const sendMsg2 = () => {
  if (msg2.value) {
    socket.value.emit("room-message", { message: msg2.value })
    msg2.value = ""
  }
}

//关闭连接
const closeConnection2 = () => {
  // if (server.readyState === WebSocket.OPEN) {
  //   server.close(1000, '关掉了')
  // }
}

//阻止用户直接关闭当前标签页
const listener = (event: BeforeUnloadEvent) => {
  event.preventDefault() // 阻止默认的关闭行为
  return // 设置警告消息为空字符串，以触发浏览器显示默认的关闭提示
}
window.addEventListener("beforeunload", listener)

//退出,删除全部监听
onUnmounted(() => {
  socket.value.emit("room-leave", { reason: "离开房间的原因" })
  removeEventListener("beforeunload", listener)
  console.log("已退出chatRoom")
  // socket.removeAllListeners()
})

//endregion
</script>
<style scoped>
.el-container {
  background-color: var(--el-bg-color);
}
</style>
