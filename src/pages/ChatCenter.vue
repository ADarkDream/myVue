<template>
  <router-view/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useChatInfoStore} from "@/store/useChatInfoStore";
import {useRouter} from "vue-router";
import {useChatMsgStore} from "@/store/useChatMsgStore";

const {playerInfo, socket} = useChatInfoStore()//本地用户信息
const {roomMsg} = useChatMsgStore()//本地的聊天信息
// let {ROOMID} = useChatMsgStore()//本地的聊天记录的房间号
const router = useRouter()

//监听服务器的首次连接，获取信息
socket.on('connection', result => {
  console.log('connection收到消息：', result)
  const {status, msg, data} = result
  //这里要先判断本地数据，确认是不是断线重连
  if (status === 200) {
    ElMessage.success(msg)
    Object.assign(playerInfo, data)
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
      router.push({name: 'room', query: {roomID: playerInfo.roomID}})
      // sessionStorage.setItem('playerName', formData.playerName)
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
    setTimeout(() => {
      router.push({name: 'room', query: {roomID: playerInfo.roomID}})
    }, 1000)
  } else if (status === 201) {
    ElMessage.success(msg)//重连房间成功
    console.log('msgHistory', data.msgHistory)
    const chatMsgInfo = JSON.parse(localStorage.getItem('chatMsgInfo'))
    if (chatMsgInfo) {
     const tempArr= mergeAndSortArrays(chatMsgInfo.roomMsg,data.msgHistory)
      // const tempArr = [...chatMsgInfo.roomMsg, ...data.msgHistory]
      // tempArr.sort((a, b) => new Date(a.time) - new Date(b.time))//从早到晚排序
      roomMsg.splice(0, roomMsg.length, ...tempArr)
    }
  } else ElMessage.error(msg)
})


function mergeAndSortArrays(array1, array2) {
    // 合并两个数组
    let mergedArray = array1.concat(array2);

    // 按照 time 字段排序
    mergedArray.sort((a, b) => a.time - b.time);

    // 删除 time 相等的项
    let resultArray = [];
    for (let i = 0; i < mergedArray.length; i++) {
        if (i === mergedArray.length - 1 || mergedArray[i].time !== mergedArray[i + 1].time) {
            resultArray.push(mergedArray[i]);
        }
        // 如果 time 相等，直接跳过当前项
    }

    return resultArray;
}



//房间内的消息
socket.on('room-message', result => {
  console.log('room-message收到消息：', result)
  const {status, msg, data} = result
  if (status === 200) {
    // data.roomID=
    roomMsg.push(data)
  }

})


//监听其他人加入房间的信息
socket.on('player-join', result => {
  console.log('player-join收到消息：', result)
  const {status, msg, data} = result
  if (status === 200) ElMessage.success(msg) //roomMsg.push({type: data.type, message:msg, time: data.time})
  // ElMessage.info(msg)
})


//监听其他人离开房间的信息
socket.on('player-leave', result => {
  console.log('player-leave收到消息：', result)
  const {status, msg, data} = result
  if (status === 200) ElMessage.success(msg)//roomMsg.push({type: data.type, msg, time: data.time})
  // list2.push(result)
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
