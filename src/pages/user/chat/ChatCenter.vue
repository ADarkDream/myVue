<template>
  <router-view/>
</template>

<script setup lang="ts">
import {onUnmounted, nextTick, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useChatInfoStore} from "@/store/useChatInfoStore";
import {useRouter} from "vue-router";
import {useChatMsgStore} from "@/store/useChatMsgStore";
import {ChatMsg} from "@/types/chat";
import emitter from "@/utils/emitter";

const playerInfo = useChatInfoStore()//本地用户信息
const socket = playerInfo.socket
const {roomMsg} = useChatMsgStore()//本地的聊天信息
const router = useRouter()


//监听服务器的首次连接，获取信息
socket.on('connection', result => {
  console.log('connection收到消息：', result)
  const {status, msg, data} = result
  //这里要先判断本地数据，确认是不是断线重连
  if (status === 200) {
    ElMessage.success(msg)
    // Object.assign(playerInfo, data)
    playerInfo.setPID(data.playerID)
    console.log('playerInfo', playerInfo)
  } else ElMessage.error('与聊天服务器连接失败')
})

//监听自己创建房间的消息
socket.on('room-add', result => {
  console.log('room-add收到消息：', result)
  const {status, msg, data} = result
  if (status === 200) {
    ElMessage.success(msg)
    Object.assign(playerInfo, data.playerInfo)
    console.log('playerInfo', playerInfo)
    setTimeout(() => {
      router.push({name: 'talk', query: {roomID: playerInfo.roomID}})
    }, 1000)
  } else ElMessage.error(msg)
})


//监听自己加入房间的消息
socket.on('room-join', result => {
  console.log('room-join收到消息：', result)
  const {status, msg, data} = result
  if (status === 200) {
    ElMessage.success(msg)
    Object.assign(playerInfo, data.playerInfo)
    getMsgHistory(data.msgHistory)
    setTimeout(() => {
      router.push({name: 'talk', query: {roomID: playerInfo.roomID}})
    }, 1000)
  } else ElMessage.error(msg)
})

//处理获取到的历史消息
const getMsgHistory = (msgData: ChatMsg[]) => {
  const chatMsgInfo = JSON.parse(localStorage.getItem('chatMsgInfo') || '{}')
  if (chatMsgInfo) {
    const tempArr = mergeAndSortArrays(chatMsgInfo.roomMsg || [], msgData)
    roomMsg.splice(0, roomMsg.length, ...tempArr)//将处理后的消息存入roomMsg
    //接收到消息之后，执行向下滚动
    nextTick(() => emitter.emit('scrollToBottom'))
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
    }// 如果 time 相等，直接跳过当前项
  }
  return resultArray
}


//房间内的消息
socket.on('room-message', result => {
  console.log('room-message收到消息：', result)
  const {status, msg, data} = result
  if (status === 200) {
    // data.roomID=
    roomMsg.push(data)
    //接收到消息之后，执行向下滚动
    nextTick(() => emitter.emit('scrollToBottom'))
  }
})


//监听其他人加入房间的信息
socket.on('player-join', result => {
  console.log('player-join收到消息：', result)
  const {status, msg, data} = result
  if (status === 200 && data.playerInfo.playerID !== playerInfo.playerID) //排除本人
    ElMessage.info(msg)
  //roomMsg.push({type: data.type, message:msg, time: data.time})
  // ElMessage.info(msg)
})


//监听其他人离开房间的信息
socket.on('player-leave', result => {
  console.log('player-leave收到消息：', result)
  const {status, msg, data} = result
  if (status === 200) ElMessage.info(msg)//roomMsg.push({type: data.type, msg, time: data.time})
  // list2.push(result)
})

const cycle = ref(1)

// 监听连接错误事件
socket.on('connect_error', (err) => {
  ElMessage.error('聊天服务器连接失败,正在重试第' + cycle.value + '次')
  cycle.value++
  if (cycle.value > 3) {
    socket.close()
    ElMessage.error('聊天服务器连接失败,已关闭连接')
  }
  console.error(err)
})

//监听自己重连房间的消息
// socket.on('re-link', result => {
//   console.log('re-link收到消息：', result)
//   const {status, msg, data} = result
//   if (status === 200) {
//     ElMessage.success(msg)
//     Object.assign(playerInfo, data.playerInfo)
//     setTimeout(() => {
//       router.push({name: 'room', query: {roomID: playerInfo.roomID}})
//     }, 1000)
//   } else ElMessage.error(msg)
// })


//退出,删除全部监听
onUnmounted(() => {
  socket.close()
  // socket.emit('disconnect', {playerInfo, reason: '已与服务器断开连接'})
  socket.removeAllListeners()
  console.log('已退出，移除大厅的socket监听')
})
</script>

<style scoped>

</style>
