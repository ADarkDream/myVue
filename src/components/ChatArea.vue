<template>
  <div class="chat-area">
    <div class="chat-area-header">
      <el-text type="primary" style="font-size: 22px;">{{isLogin? '':'临时'}}聊天室[Demo]</el-text>
      <el-button type="primary"
                 @click="copyText('https:muxidream.cn/Chat/hall?roomID='+playerInfo.roomID+'&playerName=这里填昵称','房间号')"
                 title="点击复制当前房间号" size="small">复制房间地址
      </el-button>
      <el-button @click="reLink" size="small" type="warning" plain>重连</el-button>
      <!--          <div class="chat-area-group">
                  <img class="chat-area-profile"
                       src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt=""/>
                  <img class="chat-area-profile"
                       src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt="">
                  <img class="chat-area-profile"
                       src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png" alt=""/>
                  <span>+4</span>
                </div>-->
    </div>
    <el-scrollbar>
      <div class="chat-area-main">

        <template v-for="item in roomMsg" :key="item.time">
          <div :class="['chat-msg',item.playerID===playerInfo.playerID?'owner':'guest']">
            <div class="chat-msg-profile">
              <img class="chat-msg-img"
                   :src="imageSrc" alt=""/>
              <el-text class="chat-msg-date">{{ getDiffTime(item.time) }}</el-text>
            </div>
            <div class="chat-msg-content">
              <el-text class="chat-msg-text">{{ item.message }}</el-text>
            </div>
          </div>
        </template>

      </div>
    </el-scrollbar>
    <div class="chat-area-footer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video">
        <path d="M23 7l-7 5 7 5V7z"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip">
        <path
            d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
      </svg>
      <input type="text" v-model="msg" @keyup.enter="sendMsg" placeholder="Type something here..."/>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-smile">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-up">
        <path
            d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {useRouter, useRoute} from "vue-router";
import useUserInfo from "@/hooks/useUserInfo";
import useTimestamp from "@/hooks/useTimestamp";
import {useChatInfoStore} from "@/store/useChatInfoStore";
import {useChatMsgStore} from '@/store/useChatMsgStore'


const {playerInfo, socket} = useChatInfoStore()//本地用户信息
const {roomMsg} = useChatMsgStore()//本地的聊天信息
// import {ChatMsg} from '@/types/chat'
import useFunction from "@/hooks/useFunction";

const router = useRouter();
const route = useRoute()
const {copyText} = useFunction()
const {isLogin, imageSrc} = useUserInfo()
const {getDiffTime} = useTimestamp()



onMounted(() => {
  if (route.query.roomID && route.query.playerName) {
    playerInfo.roomID = route.query.roomID as string
    playerInfo.playerName = route.query.playerName as string
    router.push({name: 'talk'})
  }
  if (!playerInfo.playerName) {//昵称为空，返回主页
    ElMessage.error('请先填写昵称')
    return router.push({name: 'chat', query: {roomID: route.query.roomID}})
  }

  if (!playerInfo.roomID) {//房间号为空，设置为当前房间号
    if (route.query.roomID) playerInfo.roomID = route.query.roomID as string
    else return router.push({name: 'chat'})
  }
  console.log('roomMsg', roomMsg)
  reLink()
  // if (chatMsgInfo) {//pinia刷新之后不能获取复杂数据类型，bug? 手动获取
  //   console.log(chatMsgInfo)
  //   // roomMsg.splice(0, roomMsg.length, chatMsgInfo.roomMsg) //恢复聊天信息
  //   chatMsgInfo.roomMsg.forEach((item:ChatMsg)=>{
  //     console.log(item.roomID===playerInfo.roomID)
  //     roomMsg.push(item)
  //   })
  // }
})


// let token = sessionStorage.getItem('token') || localStorage.getItem('token')


const msg = ref<string>('')
//收到的信息

//尝试重连
const reLink = () => {
  socket.emit('re-link')
}

//发送信息
const sendMsg = () => {
  if (msg.value) {
    socket.emit('room-message', {message: msg.value})
    msg.value = ''
  }
}


//关闭连接
// const closeConnection2 = () => {
  // if (server.readyState === WebSocket.OPEN) {
  //   server.close(1000, '关掉了')
  // }
// }

//阻止用户直接关闭当前标签页
const listener = (event :Event) => {
  event.preventDefault(); // 阻止默认的关闭行为
 // event.returnValue = ''; // 设置警告消息为空字符串，以触发浏览器显示默认的关闭提示
}
window.addEventListener('beforeunload', listener)


//退出,删除全部监听
onUnmounted(() => {
  socket.emit('room-leave', {reason: '离开房间的原因'})
  removeEventListener('beforeunload', listener)
  console.log('已退出chatRoom')
  // socket.removeAllListeners()
})


//endregion

</script>

<style scoped>
.chat-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  &-header {
    display: flex;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: var(--chat-header-bg);
  }

  &-profile {
    width: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  &-title {
    font-size: 18px;
    font-weight: 600;
  }

  &-main {
    flex-grow: 1;
  }
}

.chat-msg-img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-msg-profile {
  flex-shrink: 0;
  /* margin-top: auto;*/
  margin-bottom: -20px;
  position: relative;
}

.chat-msg-date {
  position: absolute;
  left: calc(100% + 12px);
  bottom: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--msg-date);
  white-space: nowrap;
}

.chat-msg {
  display: flex;
  padding: 0 20px 45px;

  &-content {
    margin-left: 12px;
    max-width: 70%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &-text {
    background-color: var(--chat-text-bg);
    padding: 15px;
    border-radius: 20px 20px 20px 0;
    line-height: 1.5;
    font-size: 14px;
    font-weight: 500;

    & + & {
      margin-top: 10px;
    }
  }
}

/*region聊天气泡样式*/
.chat-msg-content {
  text-align: left;
  position: relative;
  display: table;
  height: 30px;
  max-width: 80%;
  padding: 3px 6px;
  line-height: 30px;
  border-radius: 4px;
  overflow-wrap: anywhere;
}

.chat-msg-content::after {
  position: absolute;
  top: 10px;
  content: '';
  border: 4px solid transparent;
}

/*endregion*/

/*聊天文本*/
.chat-msg-text {
  color: var(--chat-text-color);
  font-size: 17px;
}


/*用户的聊天样式*/
.owner {
  flex-direction: row-reverse;

  .chat-msg-content {
    margin: 0 12px 0 0;
    align-items: flex-end;
    background-color: rgb(0, 191, 255, 255);
  }

  .chat-msg-content::after {
    right: -8px;
    border-left-color: rgb(0, 191, 255, 255);
  }

  .chat-msg-name {
    left: auto;
    right: calc(100% + 12px);
  }

  .chat-msg-text {
    font-size: 18px;
    /*    background-color: var(--theme-color);
        color: #fff;
        border-radius: 20px 20px 0 20px;*/
  }

  .chat-msg-date {
    left: auto;
    right: calc(100% + 12px);
  }
}

/*其他用户的聊天样式*/
.guest {
  .chat-msg-content {
    margin: 0 0 0 12px;
    /* background-color: #9cda62;*/
  }

  .chat-msg-content::after {
    left: -8px;
    /*border-right-color: #9cda62;*/
  }
}

.chat-msg-text img {
  max-width: 300px;
  width: 100%;
}

.chat-area-footer {
  display: flex;
  border-top: 1px solid var(--border-color);
  width: 100%;
  padding: 10px 20px;
  align-items: center;
  background-color: var(--theme-bg-color);
  position: sticky;
  bottom: 0;
  left: 0;
}

.chat-area-footer svg {
  color: var(--settings-icon-color);
  width: 20px;
  flex-shrink: 0;
  cursor: pointer;

  &:hover {
    color: var(--settings-icon-hover);
  }

  & + svg {
    margin-left: 12px;
  }
}

.chat-area-footer input {
  border: none;
  color: var(--body-color);
  background-color: var(--input-bg);
  padding: 12px;
  border-radius: 6px;
  font-size: 15px;
  margin: 0 12px;
  width: 100%;

  &::placeholder {
    color: var(--input-chat-color);
  }
}


.dark-mode {
  .search-bar input,
  .detail-area input {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56.966 56.966' fill='%236f7073'%3e%3cpath d='M55.146 51.887L41.588 37.786A22.926 22.926 0 0046.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 00.083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z'/%3e%3c/svg%3e");
  }

  .dark-light svg {
    fill: #ffce45;
    stroke: #ffce45;
  }

  .chat-area-group span {
    color: #d1d1d2;
  }
}

/*region组图的样式*/
.chat-area-group {
  flex-shrink: 1;
  display: flex;
  max-width: 300px;


  * {
    border: 2px solid var(--theme-bg-color);
  }

  * + * {
    margin-left: -5px;
  }

  span {
    width: 32px;
    height: 32px;
    background-color: var(--button-bg-color);
    color: var(--theme-color);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
  }
}

/*endregion*/

@media (max-width: 1120px) {
  .detail-area {
    display: none;
  }
}

@media (max-width: 780px) {
  .conversation-area {
    display: none;
  }

  .search-bar {
    margin-left: 0;
    flex-grow: 1;

    input {
      padding-right: 10px;
    }
  }
}


</style>
