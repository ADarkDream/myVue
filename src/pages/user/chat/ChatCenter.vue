<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, nextTick, ref, toRefs } from "vue"
import { useRouter } from "vue-router"
import { useRoute } from "vue-router"
//stores
import { useChatInfoStore } from "@/store/user/chat/useChatInfoStore"
import { useChatMsgStore } from "@/store/user/chat/useChatMsgStore"
//utils
import { emitter } from "@/utils/emitter"
//types
import { ChatMsg } from "@/types/chat"
import { ResultData } from "@/types/global"

const router = useRouter()
const route = useRoute()
const chatInfoStore = useChatInfoStore() //本地用户信息
const chatMsgStore = useChatMsgStore()
const { socket, playerInfo } = toRefs(chatInfoStore)
const { setPID } = chatInfoStore

const { roomMsg } = toRefs(chatMsgStore) //本地的聊天信息

onBeforeMount(async () => {
  console.log("爷爷")
  const { roomID, playerName } = route.query
  if (roomID && typeof roomID === "string") {
    playerInfo.value.roomID = roomID
  }
  if (playerName && typeof playerName === "string") {
    playerInfo.value.playerName = playerName
  }
  // await router.replace({ path: route.path })
})

//监听服务器的首次连接，获取信息
socket.value.on("connection", (result: ResultData<{ playerID: string }>) => {
  console.log("connection收到消息：", result)
  const { code, msg, data } = result
  //这里要先判断本地数据，确认是不是断线重连
  if (code === 200 && data) {
    ElMessage.success(msg)
    setPID(data.playerID)
    console.log("playerInfo", playerInfo.value)
  } else ElMessage.error("与聊天服务器连接失败")
})

//监听自己创建房间的消息
socket.value.on("room-add", (result) => {
  console.log("room-add收到消息：", result)
  const { code, msg, data } = result
  if (code === 200) {
    ElMessage.success(msg)
    playerInfo.value = data.playerInfo
    console.log("playerInfo", playerInfo.value)
    setTimeout(() => {
      router.push({ name: "talk", query: { roomID: playerInfo.value.roomID } })
    }, 1000)
  } else ElMessage.error(msg)
})

//监听自己加入房间的消息
socket.value.on("room-join", (result) => {
  console.log("room-join收到消息：", result)
  const { code, msg, data } = result
  if (code === 200) {
    ElMessage.success(msg)
    playerInfo.value = data.playerInfo
    getMsgHistory(data.msgHistory)
    setTimeout(() => {
      router.push({ name: "talk", query: { roomID: playerInfo.value.roomID } })
    }, 1000)
  } else ElMessage.error(msg)
})

//处理获取到的历史消息
const getMsgHistory = (msgData: ChatMsg[]) => {
  const chatMsgInfo = JSON.parse(localStorage.getItem("chatMsgInfo") || "{}")
  if (chatMsgInfo) {
    roomMsg.value = mergeAndSortArrays(chatMsgInfo.roomMsg || [], msgData) //将处理后的消息存入roomMsg

    //接收到消息之后，执行向下滚动
    nextTick(() => emitter.emit("scrollToBottom"))
  }
}

//合并消息数组并按时间排序，删除与本地信息重合的部分(判断时间戳)
const mergeAndSortArrays = (array1: ChatMsg[], array2: ChatMsg[]): ChatMsg[] => {
  // 合并两个数组
  let mergedArray = array1.concat(array2)
  // 按照 time 字段排序
  mergedArray.sort((a, b) => a.time - b.time)
  // 删除 time 相等的项
  const resultArray = []
  for (let i = 0; i < mergedArray.length; i++) {
    if (i === mergedArray.length - 1 || mergedArray[i].time !== mergedArray[i + 1].time) {
      resultArray.push(mergedArray[i])
    } // 如果 time 相等，直接跳过当前项
  }
  return resultArray
}

//房间内的消息
socket.value.on("room-message", (result) => {
  console.log("room-message收到消息：", result)
  const { code, msg, data } = result
  if (code === 200) {
    // data.roomID=
    roomMsg.value.push(data)
    //接收到消息之后，执行向下滚动
    nextTick(() => emitter.emit("scrollToBottom"))
  }
})

//监听其他人加入房间的信息
socket.value.on("player-join", (result) => {
  console.log("player-join收到消息：", result)
  const { code, msg, data } = result
  if (code === 200 && data.playerInfo.playerID !== playerInfo.value.playerID)
    //排除本人
    ElMessage.info(msg)
  //roomMsg.push({type: data.type, message:msg, time: data.time})
  // ElMessage.info(msg)
})

//监听其他人离开房间的信息
socket.value.on("player-leave", (result) => {
  console.log("player-leave收到消息：", result)
  const { code, msg, data } = result
  if (code === 200) ElMessage.info(msg) //roomMsg.push({type: data.type, msg, time: data.time})
  // list2.push(result)
})

const cycle = ref(1)

// 监听连接错误事件
socket.value.on("connect_error", (err) => {
  ElMessage.error("聊天服务器连接失败,正在重试第" + cycle.value + "次")
  cycle.value++
  if (cycle.value > 3) {
    socket.value.close()
    ElMessage.error("聊天服务器连接失败,已关闭连接")
  }
  console.error(err)
})

//监听自己重连房间的消息
// socket.value.on('re-link', result => {
//   console.log('re-link收到消息：', result)
//   const {code, msg, data} = result
//   if (code === 200) {
//     ElMessage.success(msg)
//     Object.assign(playerInfo, data.playerInfo)
//     setTimeout(() => {
//       router.push({name: 'room', query: {roomID: playerInfo.roomID}})
//     }, 1000)
//   } else ElMessage.error(msg)
// })

//退出,删除全部监听
onBeforeUnmount(() => {
  socket.value.close()
  // socket.value.emit('disconnect', {playerInfo, reason: '已与服务器断开连接'})
  socket.value.removeAllListeners()
  console.log("已退出，移除大厅的socket监听")
})
</script>

<style scoped></style>
