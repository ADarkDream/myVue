<template>
  <div>
    <el-scrollbar>
      <div class="conversation-area">
        <div class="msg online">
          <img class="msg-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png"
            alt="" />
          <div class="msg-detail">
            <div class="msg-username">Madison Jones</div>
            <div class="msg-content">
              <span class="msg-message">What time was our meet</span>
              <span class="msg-date">20m</span>
            </div>
          </div>
        </div>
        <div class="msg">
          <img class="msg-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png"
            alt="" />
          <div class="msg-detail">
            <div class="msg-username">Miguel Cohen</div>
            <div class="msg-content">
              <span class="msg-message">Adaptogen taiyaki austin jean shorts brunch</span>
              <span class="msg-date">20m</span>
            </div>
          </div>
        </div>
        <div class="msg active">
          <div class="msg-profile group">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
              stroke-linejoin="round" class="css-i6dzq1">
              <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5" />
              <path d="M22 8.5l-10 7-10-7" />
              <path d="M2 15.5l10-7 10 7M12 2v6.5" />
            </svg>
          </div>
          <div class="msg-detail">
            <div class="msg-username">CodePen Group</div>
            <div class="msg-content">
              <span class="msg-message">Aysenur: I love CSS</span>
              <span class="msg-date">28m</span>
            </div>
          </div>
        </div>
        <div class="msg online">
          <img class="msg-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png"
            alt="" />
          <div class="msg-detail">
            <div class="msg-username">Lea Debere</div>
            <div class="msg-content">
              <span class="msg-message">Shoreditch iPhone jianbing</span>
              <span class="msg-date">45m</span>
            </div>
          </div>
        </div>
        <div class="msg online">
          <img class="msg-profile"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29+%281%29.png" alt="" />
          <div class="msg-detail">
            <div class="msg-username">Jordan Smith</div>
            <div class="msg-content">
              <span class="msg-message">Snackwave craft beer raclette, beard kombucha </span>
              <span class="msg-date">2h</span>
            </div>
          </div>
        </div>
        <div class="msg">
          <img class="msg-profile"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%284%29+%281%29.png" alt="" />
          <div class="msg-detail">
            <div class="msg-username">Jared Jackson</div>
            <div class="msg-content">
              <span class="msg-message">Tattooed brooklyn typewriter gastropub</span>
              <span class="msg-date">18m</span>
            </div>
          </div>
        </div>
        <div class="msg online">
          <img class="msg-profile"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="">
          <div class="msg-detail">
            <div class="msg-username">Henry Clark</div>
            <div class="msg-content">
              <span class="msg-message">Ethical typewriter williamsburg lo-fi street art</span>
              <span class="msg-date">2h</span>
            </div>
          </div>
        </div>
        <div class="msg">
          <img class="msg-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/qs6F3dgm.png" alt="" />
          <div class="msg-detail">
            <div class="msg-username">Jason Mraz</div>
            <div class="msg-content">
              <span class="msg-message">I'm lucky I'm in love with my best friend</span>
              <span class="msg-date">4h</span>
            </div>
          </div>
        </div>
        <div class="msg">
          <img class="msg-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%288%29.png"
            alt="" />
          <div class="msg-detail">
            <div class="msg-username">Chiwa Lauren</div>
            <div class="msg-content">
              <span class="msg-message">Pabst af 3 wolf moon</span>
              <span class="msg-date">28m</span>
            </div>
          </div>
        </div>
        <div class="msg">
          <img class="msg-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%289%29.png"
            alt="" />
          <div class="msg-detail">
            <div class="msg-username">Caroline Orange</div>
            <div class="msg-content">
              <span class="msg-message">Bespoke aesthetic lyft woke cornhole</span>
              <span class="msg-date">35m</span>
            </div>
          </div>
        </div>
        <div class="msg">
          <img class="msg-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%286%29.png"
            alt="" />
          <div class="msg-detail">
            <div class="msg-username">Lina Ashma</div>
            <div class="msg-content">
              <span class="msg-message">Migas food truck crucifix vexi</span>
              <span class="msg-date">42m</span>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <button class="add" @click="showConnect"></button>
    <div class="overlay"></div>
    <el-dialog v-model="isShowConnect" :width="isPC ? '40%' : '80%'" title="加入房间" :show-close="!isPC">
      <ChatConnect />
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
//hooks
import useResponsive from "@/hooks/useResponsive";
//components
import ChatConnect from "@/pages/user/chat/components/ChatConnect.vue";


const { isPC } = useResponsive()
const isShowConnect = ref(false)
const showConnect = () => {
  isShowConnect.value = true
  console.log('111')
}
</script>

<style scoped lang="scss">
.conversation-area {
  width: 340px;
  flex-shrink: 0;
}


.conversation-area {
  /*  border-right: 1px solid var(--border-color);*/
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
