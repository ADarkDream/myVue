<template>
  <el-container :style="'height:'+(isPC? screenHeight-80 : screenHeight-40)+'px'">
    <el-header class="header" v-if="isPC">
      <div class="logo">
        <svg viewBox="0 0 513 513" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M256.025.05C117.67-2.678 3.184 107.038.025 245.383a240.703 240.703 0 0085.333 182.613v73.387c0 5.891 4.776 10.667 10.667 10.667a10.67 10.67 0 005.653-1.621l59.456-37.141a264.142 264.142 0 0094.891 17.429c138.355 2.728 252.841-106.988 256-245.333C508.866 107.038 394.38-2.678 256.025.05z"/>
          <path
              d="M330.518 131.099l-213.825 130.08c-7.387 4.494-5.74 15.711 2.656 17.97l72.009 19.374a9.88 9.88 0 007.703-1.094l32.882-20.003-10.113 37.136a9.88 9.88 0 001.083 7.704l38.561 63.826c4.488 7.427 15.726 5.936 18.003-2.425l65.764-241.49c2.337-8.582-7.092-15.72-14.723-11.078zM266.44 356.177l-24.415-40.411 15.544-57.074c2.336-8.581-7.093-15.719-14.723-11.078l-50.536 30.744-45.592-12.266L319.616 160.91 266.44 356.177z"
              fill="#fff"/>
        </svg>
      </div>
      <div class="search-bar">
        <input type="text" placeholder="Search..."/>
      </div>
      <div class="user-settings">
<!--        <div class="dark-light" @click="changeDark">-->
<!--          <svg viewBox="0 0 24 24" stroke="CurrentColor" stroke-width="1.5" fill="none" stroke-linecap="round"-->
<!--               stroke-linejoin="round">-->
<!--            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>-->
<!--          </svg>-->
<!--        </div>-->
        <div class="settings" @click="isShowDetail">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="CurrentColor"
               stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </div>
        <img class="user-profile account-profile"
             :src="imageSrc" alt="">
      </div>
    </el-header>
    <el-main class="wrapper">
      <ChatConversation v-if="isPC"/>
      <ChatArea/>
      <ChatDetail v-if="isShowDetailFlag&&isPC"/>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">

import useResponsive from "@/hooks/useResponsive";
import ChatDetail from "@/components/ChatDetail.vue";
import ChatArea from "@/components/ChatArea.vue";
import ChatConversation from "@/components/ChatConversation.vue";
import {ref} from 'vue'
import useUserInfo from "@/hooks/useUserInfo";
const {isLogin, imageSrc} = useUserInfo()

const {screenHeight,isPC} = useResponsive()
// const toggleButton = document.querySelector('.dark-light');
const colors = document.querySelectorAll('.color');

colors.forEach(color => {
  color.addEventListener('click', (e) => {
    colors.forEach(c => c.classList.remove('selected'));
    const theme = color.getAttribute('data-color');
    document.body.setAttribute('data-theme', theme);
    color.classList.add('selected');
  });
});

// toggleButton.addEventListener('click', () => {
//   document.body.classList.toggle('dark');
// });

const isShowDetailFlag = ref(false)
const isShowDetail = () => {
  isShowDetailFlag.value = !isShowDetailFlag.value
}


const changeDark = () => {
  document.body.classList.toggle('dark');
}



</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Manrope:300,400,500,600,700&display=swap&subset=latin-ext");

:root {
 --body-bg-color: #e5ecef;
 --theme-bg-color: #fff;
 --settings-icon-hover: #9fa7ac;
 --developer-color: #f9fafb;
 --input-bg: #f8f8fa;
 --input-chat-color: #a2a2a2;
 --border-color: #eef2f4;
 --body-font: "Manrope", sans-serif;
 --body-color: #273346;
 --settings-icon-color: #c1c7cd;
 --msg-message: #969eaa;
 --chat-text-bg: #f1f2f6;
 --theme-color: #0086ff;
 --msg-date: #c0c7d2;
 --button-bg-color: #f0f7ff;
 --button-color: var(--theme-color);
 --detail-font-color: #919ca2;
 --msg-hover-bg: rgba(238, 242, 244, 0.4);
 --active-conversation-bg: linear-gradient(
  to right,
  rgba(238, 242, 244, 0.4) 0%,
  rgba(238, 242, 244, 0) 100%
 );
 --overlay-bg: linear-gradient(
  to bottom,
  rgba(255, 255, 255, 0) 0%,
  rgba(255, 255, 255, 1) 65%,
  rgba(255, 255, 255, 1) 100%
 );
 --chat-header-bg: linear-gradient(
  to bottom,
  rgba(255, 255, 255, 1) 0%,
  rgba(255, 255, 255, 1) 78%,
  rgba(255, 255, 255, 0) 100%
 );
}

[data-theme="purple"] {
 --theme-color: #9f7aea;
 --button-color: #9f7aea;
 --button-bg-color: rgba(159, 122, 234, 0.12);
}

[data-theme="green"] {
 --theme-color: #38b2ac;
 --button-color: #38b2ac;
 --button-bg-color: rgba(56, 178, 171, 0.15);
}

[data-theme="orange"] {
 --theme-color: #ed8936;
 --button-color: #ed8936;
 --button-bg-color: rgba(237, 137, 54, 0.12);
}

.dark {
 --body-bg-color: #1d1d1d;
 --theme-bg-color: #27292d;
 --border-color: #323336;
 --body-color: #d1d1d2;
 --active-conversation-bg: linear-gradient(
  to right,
  rgba(47, 50, 56, 0.54),
  rgba(238, 242, 244, 0) 100%
 );
 --msg-hover-bg: rgba(47, 50, 56, 0.54);
 --chat-text-bg: #383b40;
 --chat-text-color: #b5b7ba;
 --msg-date: #626466;
 --msg-message: var(--msg-date);
 --overlay-bg: linear-gradient(
  to bottom,
  rgba(0, 0, 0, 0) 0%,
  #27292d 65%,
  #27292d 100%
 );
 --input-bg: #2f3236;
 --chat-header-bg: linear-gradient(
  to bottom,
  #27292d 0%,
  #27292d 78%,
  rgba(255, 255, 255, 0) 100%
 );
 --settings-icon-color: #7c7e80;
 --developer-color: var(--border-color);
 --button-bg-color: #393b40;
 --button-color: var(--body-color);
 --input-chat-color: #6f7073;
 --detail-font-color: var(--input-chat-color);
}

.blue {
 background-color: #0086ff;
}

.purple {
 background-color: #9f7aea;
}

.green {
 background-color: #38b2ac;
}

.orange {
 background-color: #ed8936;
}

* {
 outline: none;
 box-sizing: border-box;
}
</style>


<style scoped>
.el-container {
  display: flex;
  flex-direction: column;
  background-color: var(--theme-bg-color);
  max-width: 1600px;
  /* height: 100vh;*/
  height: 500px;
  margin: 0 auto;
  overflow: hidden;
}

.header {
  height: 60px;
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.wrapper {
  padding: 0 20px;
  width: 100%;
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.conversation-area {
  width: 340px;
  flex-shrink: 0;
}


.search-bar {
  height: 80px;
  z-index: 3;
  position: relative;
  margin-left: 280px;

  input {
    height: 100%;
    width: 100%;
    display: block;
    background-color: transparent;
    border: none;
    color: var(--body-color);
    padding: 0 54px;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56.966 56.966' fill='%23c1c7cd'%3e%3cpath d='M55.146 51.887L41.588 37.786A22.926 22.926 0 0046.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 00.083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: 25px 48%;
    font-family: var(--body-font);
    font-weight: 600;
    font-size: 15px;

    &::placeholder {
      color: var(--input-chat-color);
    }
  }
}

.logo {
  color: var(--theme-color);
  width: 38px;
  flex-shrink: 0;

  svg {
    width: 100%;
  }
}

.user-settings {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: auto;
  flex-shrink: 0;

  & > * + * {
    margin-left: 14px;
  }
}

.dark-light {
  width: 22px;
  height: 22px;
  color: var(--settings-icon-color);
  flex-shrink: 0;

  svg {
    width: 100%;
    fill: transparent;
    transition: 0.5s;
  }
}

.user-profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.settings {
  color: var(--settings-icon-color);
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.conversation-area {
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.msg-profile {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;

  &.group {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--border-color);

    svg {
      width: 60%;
    }
  }
}

.msg {
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: 0.2s;
  position: relative;

  &:hover {
    background-color: var(--msg-hover-bg);
  }

  &.active {
    background: var(--active-conversation-bg);
    border-left: 4px solid var(--theme-color);
  }

  &.online:before {
    content: "";
    position: absolute;
    background-color: #23be7e;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border: 2px solid var(--theme-bg-color);
    left: 50px;
    bottom: 19px;
  }
}

.msg-username {
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 15px;
}

.msg-detail {
  overflow: hidden;
}

.msg-content {
  font-weight: 500;
  font-size: 13px;
  display: flex;
}

.msg-message {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--msg-message);
}

.msg-date {
  font-size: 14px;
  color: var(--msg-date);
  margin-left: 3px;

  &:before {
    content: "•";
    margin-right: 2px;
  }
}

.add {
  position: sticky;
  bottom: 25px;
  background-color: var(--theme-color);
  width: 60px;
  height: 60px;
  border: 0;
  border-radius: 50%;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-plus'%3e%3cpath d='M12 5v14M5 12h14'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 28px;
  box-shadow: 0 0 16px var(--theme-color);
  margin: auto auto -55px;
  flex-shrink: 0;
  z-index: 1;
  cursor: pointer;
}

.overlay {
  position: sticky;
  bottom: 0;
  left: 0;
  width: 340px;
  flex-shrink: 0;
  background: var(--overlay-bg);
  height: 80px;
}


.chat-msg-text img {
  max-width: 300px;
  width: 100%;
}


.dark {
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
