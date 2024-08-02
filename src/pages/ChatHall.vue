<template>
  <el-container :style="isPC? {  width: '50%',margin: '5% 25%'}:{height:screenHeight-40+'px' }">
    <el-header><h1>大厅</h1></el-header>
    <el-main>
      <el-form :model="formData">
        <el-form-item label="RoomID">
          <el-input placeholder="请输入房间号" v-model.lazy.trim="formData.roomID" maxlength="30"/>
        </el-form-item>
        <el-form-item label="NickName">
          <el-input placeholder="请输入昵称" v-model.trim="formData.playerName" maxlength="10"/>
        </el-form-item>
        <el-button type="primary" @click="enterTheRoom">创建/加入</el-button>
      </el-form>
    </el-main>

  </el-container>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useRouter, useRoute} from "vue-router";
import useUserInfo from "@/hooks/useUserInfo";
import useResponsive from "@/hooks/useResponsive";
import {io} from "socket.io-client";


const router = useRouter();
const route = useRoute()
const {isAdmin} = useUserInfo()
const {screenHeight, isPC} = useResponsive()


//表单数据
const formData = reactive({
  roomID: '',
  playerName: ''
})

// let token = sessionStorage.getItem('token') || localStorage.getItem('token')



//region Socket.io
const socketUrl = import.meta.env.DEV === true ? 'http://192.168.1.194:9999' : 'https://muxidream.cn/socket/'
const socket = io(socketUrl)


//进入房间或创建房间
const enterTheRoom = () => {
  if (formData.roomID && formData.playerName) {
    socket.emit('room-join', formData)
    // formData.playerName = ''
    // formData.roomID = ''
  }
}


onMounted(() => {
  //监听加入房间的信息
  socket.on('room-join', res => {
    console.log('room-join收到消息：', res)
    const {status, msg, data} = res
    ElMessage.success(msg)
    setTimeout(() => {
      ElMessage.success('即将跳转')
      router.push({name: 'room', query: {roomID: data.roomID,from:'hall'}})
      sessionStorage.setItem('playerName',formData.playerName)
    }, 1000)

    // list2.push(msg)
    // history.pushState(null, '房间', route.path + '/room=' + data.roomID)//要保留的当前页面的参数,标题栏名,新的网址
    // console.log('route.path', route.path)
  })
})


// socket.on('room-message', msg => {
//   console.log('socket.io收到消息：', msg)
//   list2.push(msg)
// })


//监听离开房间的信息
// socket.on('room-leave', msg => {
//   console.log('socket.io收到消息：', msg)
//   list2.push(msg)
// })


//关闭连接
const closeConnection2 = () => {
  // if (server.readyState === WebSocket.OPEN) {
  //   server.close(1000, '关掉了')
  // }
}

//退出,删除全部监听
onUnmounted(() => {
  socket.removeAllListeners()
  console.log('已移除大厅的socket监听')
})


//endregion

</script>
<style scoped>
.el-container {
  background-color: var(--el-bg-color);
  padding: 1% 5% 2%;
  opacity: 0.8;
}
</style>

