<template>
  <div>
    <el-scrollbar>
      <div class="detail-area">
        <div class="detail-area-header">
          <div class="msg-profile group">
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
            >
              <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5" />
              <path d="M22 8.5l-10 7-10-7" />
              <path d="M2 15.5l10-7 10 7M12 2v6.5" />
            </svg>
          </div>
          <div class="detail-title">CodePen Group</div>
          <div class="detail-subtitle">Created by Aysenur, 1 May 2020</div>
          <div class="detail-buttons">
            <button class="detail-button">
              <svg
                viewbox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="0"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-phone"
              >
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                />
              </svg>
              Call Group
            </button>
            <button class="detail-button">
              <svg
                viewbox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="0"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-video"
              >
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Video Chat
            </button>
          </div>
        </div>
        <div class="detail-changes">
          <input type="text" placeholder="Search in Conversation" />
          <div class="detail-change">
            Change Color
            <div class="colors">
              <div class="color blue selected" data-color="blue"></div>
              <div class="color purple" data-color="purple"></div>
              <div class="color green" data-color="green"></div>
              <div class="color orange" data-color="orange"></div>
            </div>
          </div>
          <div class="detail-change">
            Change Emoji
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewbox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-thumbs-up"
            >
              <path
                d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
              />
            </svg>
          </div>
        </div>
        <div class="detail-photos">
          <div class="detail-photo-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewbox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-image"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            Shared photos
          </div>
          <div class="detail-photo-grid">
            <img
              src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1516085216930-c93a002a8b01?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1458819714733-e5ab3d536722?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=933&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2287&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2247&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1301&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2249&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2309&q=80"
            />

            <img
              src="https://images.unsplash.com/photo-1473170611423-22489201d919?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1579613832111-ac7dfcc7723f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2189&q=80"
            />
          </div>
          <div class="view-more">View More</div>
        </div>
        <a href="https://twitter.com/AysnrTrkk" class="follow-me" target="_blank">
          <span class="follow-text">
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
            >
              <path
                d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
              ></path>
            </svg>
            Follow me on Twitter
          </span>
          <span class="developer">
            <img src="https://pbs.twimg.com/profile_images/1253782473953157124/x56UURmt_400x400.jpg" />
            Aysenur Turk — @AysnrTrkk
          </span>
        </a>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
/*.detail-area {

}*/

.detail-area {
  width: 340px;
  flex-shrink: 0;
  border-left: 1px solid var(--border-color);
  margin-left: auto;
  padding: 30px 30px 0 30px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.detail-area-header {
  display: flex;
  flex-direction: column;
  align-items: center;

  .msg-profile {
    margin-right: 0;
    width: 60px;
    height: 60px;
    margin-bottom: 15px;
  }
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.detail-subtitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--msg-date);
}

.detail-button {
  border: 0;
  background-color: var(--button-bg-color);
  /*  padding: 10px 14px;*/
  border-radius: 5px;
  color: var(--button-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-grow: 1;
  font-weight: 500;

  svg {
    width: 18px;
    margin-right: 10px;
  }

  &:last-child {
    margin-left: 8px;
  }
}

.detail-buttons {
  margin-top: 20px;
  display: flex;
  width: 100%;
}

.detail-area input {
  background-color: transparent;
  border: none;
  width: 100%;
  color: var(--body-color);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56.966 56.966' fill='%23c1c7cd'%3e%3cpath d='M55.146 51.887L41.588 37.786A22.926 22.926 0 0046.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 00.083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-size: 16px;
  background-position: 100%;
  font-family: var(--body-font);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--border-color);
  padding: 14px 0;

  &::placeholder {
    color: var(--detail-font-color);
  }
}

.detail-changes {
  margin-top: 40px;
}

.detail-change {
  color: var(--detail-font-color);
  font-family: var(--body-font);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--border-color);
  padding: 14px 0;
  display: flex;

  svg {
    width: 16px;
    margin-left: auto;
  }
}

.colors {
  display: flex;
  margin-left: auto;
}

.color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;

  &.selected {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' stroke='%23fff' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1' viewBox='0 0 24 24'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E");
    background-size: 10px;
    background-position: center;
    background-repeat: no-repeat;
  }

  &:not(:last-child) {
    margin-right: 4px;
  }
}

.detail-photo-title {
  display: flex;
  align-items: center;

  svg {
    width: 16px;
  }
}

.detail-photos {
  margin-top: 30px;
  text-align: center;
}

.detail-photo-title {
  color: var(--detail-font-color);
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 20px;

  svg {
    margin-right: 8px;
  }
}

.detail-photo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 6px;
  grid-row-gap: 6px;
  grid-template-rows: repeat(3, 60px);

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 8px;
    object-position: center;
  }
}

.view-more {
  color: var(--theme-color);
  font-weight: 600;
  font-size: 15px;
  margin: 25px 0;
}

.follow-me {
  text-decoration: none;
  font-size: 14px;
  width: calc(100% + 60px);
  margin-left: -30px;
  display: flex;
  align-items: center;
  margin-top: auto;
  overflow: hidden;
  color: #9c9cab;
  padding: 0 20px;
  height: 52px;
  flex-shrink: 0;
  position: relative;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
}

.follow-text {
  display: flex;
  align-items: center;
  transition: 0.3s;
}

.follow-me:hover {
  .follow-text {
    transform: translateY(100%);
  }

  .developer {
    top: 0;
  }
}

.developer {
  position: absolute;
  color: var(--detail-font-color);
  font-weight: 600;
  left: 0;
  top: -100%;
  display: flex;
  transition: 0.3s;
  padding: 0 20px;
  align-items: center;
  justify-content: center;
  background-color: var(--developer-color);
  width: 100%;
  height: 100%;
}

.developer img {
  border-radius: 50%;
  width: 26px;
  height: 26px;
  object-fit: cover;
  margin-right: 10px;
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

.chat-area-group {
  flex-shrink: 0;
  display: flex;

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

@media (max-width: 1120px) {
  .detail-area {
    display: none;
  }
}

/*
:deep(.el-scrollbar__wrap) {
  overflow-x: hidden !important;
}
:deep(.el-scrollbar__bar.is-horizontal) {
  height: 0 !important;
}*/
</style>
