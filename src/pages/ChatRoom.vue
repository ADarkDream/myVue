<template>
  <el-container>
    <el-header>
      <h1>聊天室</h1>
      <!--      <el-input placeholder="请输入房间号" v-model.trim="roomNum"/>-->
      <!--      <el-input placeholder="请输入昵称" v-model.trim="playerName"/>-->
    </el-header>
    <el-main>

      <div>
        <h2>socket.io测试</h2>
        <div style="display: flex;justify-content:space-between;width: 95%;min-height: 300px; ">
          <el-card style="width: 50%">
            <template #header>
              <el-text type="primary">发送的信息</el-text>
            </template>
            <el-input placeholder="输入要发送的信息" v-model="msg2" type="textarea"></el-input>
            <br>
            <template #footer>
              <el-button-group>
                <el-button type="success" @click="enterTheRoom()">加入房间</el-button>
                <el-button type="primary" @click="sendMsg2()">发送</el-button>
                <el-button type="danger" @click="closeConnection2()">关闭连接</el-button>
                <el-button type="danger" @click="">断开连接</el-button>
              </el-button-group>
            </template>
          </el-card>
          <el-card style="width: 50%">
            <template #header>
              <el-text type="primary">socket.io 收到的信息</el-text>
            </template>
            <el-text type="warning" v-if="list2.length===0">暂无返回的消息</el-text>
            <div v-else v-for="(item,index) in list2" :key="index">
              <el-text type="success">第{{ index }}条</el-text>
              ：{{ item }}
            </div>
          </el-card>
        </div>
      </div>
    </el-main>

  </el-container>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import type {FormInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRouter, useRoute} from "vue-router";
import useUserInfo from "@/hooks/useUserInfo";
import useTimestamp from "@/hooks/useTimestamp";
import {io} from "socket.io-client";

const router = useRouter();
const route = useRoute()
const {isAdmin} = useUserInfo()
const {getTime} = useTimestamp()
const roomID = ref<string>(route.query.roomID as string || '')//房间ID
const playerName = ref<string>(sessionStorage.getItem('playerName') || '')//玩家昵称

onMounted(() => {
  // ElMessage.success(route.path)
  console.log('roomID：', roomID.value)
  console.log('playerName：', playerName.value)
  console.log(route.query.from!=='hall')
  if(route.query.from!=='hall') enterTheRoom() //如果不是从大厅来的，则重新加入房间

  //管理员登录判断
  // if (!isAdmin.value) {
  //   if (document.referrer.includes('muxidream')) return router.back()
  //   return router.push({name: 'home'})
  // }
})


let token = sessionStorage.getItem('token') || localStorage.getItem('token')
const baseUrl = 'ws://localhost:9999'


//region Socket.io
const socket = io('http://192.168.1.194:9999')
//信息内部全部可改
const msg2 = ref<string>('')
//收到的信息
const list2 = reactive<string[]>([])

//开启链接，首次发送信息
const enterTheRoom = () => {
  if (roomID.value && playerName.value) {
    socket.emit('room-join', {roomID: roomID.value, playerName: playerName.value})
  } else router.push({name: 'hall'})
}


//发送信息
const sendMsg2 = () => {
  if (msg2.value) {
    socket.emit('room-message', msg2.value)
    msg2.value = ''
  }
}


socket.on('room-message', res => {
  console.log('socket.io收到消息：', res)
  const {status, msg, data} = res
  list2.push(data.message)
  sessionStorage.setItem(roomID.value, JSON.stringify(list2))
})

//监听加入房间的信息
socket.on('room-join', res => {
  console.log('room-join收到消息：', res)
  const {status, msg, data} = res
  ElMessage.info(msg)

})


//监听离开房间的信息
socket.on('room-leave', msg => {
  console.log('socket.io收到消息：', msg)
  list2.push(msg)
})


//关闭连接
const closeConnection2 = () => {
  // if (server.readyState === WebSocket.OPEN) {
  //   server.close(1000, '关掉了')
  // }
}

//退出,删除全部监听
onUnmounted(() => {
  console.log('已移除room页面全部socket监听')
  socket.removeAllListeners()
})


//endregion

</script>
<style scoped>
.el-container {
  background-color: var(--el-bg-color)
}
</style>

