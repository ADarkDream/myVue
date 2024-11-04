<template>
  <el-container class="titleDiv">
    <!--PC端标题-->
    <el-row class="title" v-if="isPC">
      <!--左上角-->
      <el-col :lg="5" :md="6" :sm="8" class="title-left">
        <!--    返回键-->
        <el-button :icon="ArrowLeftBold" @click="router.back()" v-if="!isHome">返回</el-button>
        <!--首页-->
        <el-button @click="goTo('home')" plain :icon="HomeFilled" v-if="!isHome">首页</el-button>
        <!--更换壁纸-->
        <el-button :icon="Switch" class="bgBtn" @click="toggleBG({ getNewBg: true })" v-if="isHome">更换壁纸</el-button>
        <!--重返未来-->
        <el-button :icon="Download" class="bgBtn" @click="goTo('download')" v-if="isHome">
          重返未来
        </el-button>
        <!--日夜切换-->
        <el-switch v-model="isDark" inline-prompt active-text="夜" inactive-text="日" class="isDarkBtn">
          <template #active-action>
            <el-icon>
              <Moon />
            </el-icon>
          </template>
          <template #inactive-action>
            <el-icon>
              <Sunny />
            </el-icon>
          </template>
        </el-switch>
      </el-col>
      <!--中间导航-->
      <el-col :lg="13" :md="11" :sm="8">
        <!--            <el-space spacer="">-->
        <!--              &lt;!&ndash;        首页&ndash;&gt;-->
        <!--              <router-link :to="{name:'home'}" replace>-->
        <!--                <el-button plain :icon="HomeFilled" v-show="isHome">-->
        <!--                  首页-->
        <!--                </el-button>-->
        <!--              </router-link>-->
        <!--              &lt;!&ndash;        论坛&ndash;&gt;-->
        <!--              <router-link :to="{name:'center'}" v-show="!isHome" replace >-->
        <!--                <el-button plain :icon="Comment">-->
        <!--                  论坛-->
        <!--                </el-button>-->
        <!--              </router-link>-->
        <!--            </el-space>-->
      </el-col>
      <!--右上角-->
      <el-col :lg="6" :md="7" :sm="8" class="title-right">
        <el-space>
          <!--播放指示器-->
          <el-button link @click="togglePlayerVisible()" v-if="showPlayer">
            <el-tooltip content="显示播放器" placement="bottom" effect="light">
              <SVG_music class="musicIcon" :class="{ paused: !isPlaying }" />
            </el-tooltip>
          </el-button>
          <!--登录按钮-->
          <el-button @click="showLogin = true" v-if="!isLogin">
            <svg class="headIcon" viewBox="0 0 1024 1024">
              <path
                d="M511.333 63.333c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 832c-51.868 0-102.15-10.144-149.451-30.15-36.011-15.231-69.123-35.67-98.812-60.897 12.177-31.985 42.226-63.875 84.223-88.903C396.189 686.243 456.222 669.53 512 669.53c55.631 0 115.416 16.658 164.026 45.703 41.762 24.953 71.689 56.812 83.863 88.804-29.764 25.342-62.976 45.865-99.106 61.146-47.299 20.006-97.582 30.15-149.45 30.15z m296.268-139.658c-20.493-35.937-54.353-68.855-98.747-95.381C649.75 624.979 579.839 605.53 512 605.53c-67.964 0-138.094 19.488-197.471 54.875-44.644 26.606-78.656 59.594-99.195 95.586-23.835-28.755-43.234-60.652-57.85-95.208-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.3-20.006 97.583-30.15 149.451-30.15 51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-14.563 34.429-33.869 66.22-57.583 94.892z"
                fill="CurrentColor"></path>
              <path
                d="M512 220.223c-88.224 0-160 71.776-160 160s71.776 160 160 160c88.225 0 160-71.775 160-160s-71.775-160-160-160z m0 256c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z"
                fill="CurrentColor"></path>
            </svg>
            &ensp;登录
          </el-button>
          <!--登陆后的按钮-->
          <el-button class="username " type="primary" v-if="isLogin" @click="goCenter">
            <el-image class="userImg" :src="headImgUrl" alt="" :onerror="errorImage" />
            &ensp;{{ username }}
          </el-button>
          <!--论坛-->
          <el-button @click="goTo('center')" plain :icon="Comment" v-if="!isForum">论坛</el-button>
          <!--选项菜单-->
          <el-dropdown>
            <span>
              <el-button class="option" :icon="Operation">
                选项
              </el-button>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <!--管理中心-->
                <el-dropdown-item v-if="isAdmin" :icon="Avatar" @click="goCenter">
                  管理中心
                </el-dropdown-item>
                <!--用户中心-->
                <el-dropdown-item v-else-if="isLogin" :icon="UserFilled" @click="goCenter">
                  用户中心
                </el-dropdown-item>
                <!--记账本功能-->
                <!--              <el-dropdown-item v-if="isLogin" :icon="Notebook" @click="goTo('books')">-->
                <!--                前往账本-->
                <!--              </el-dropdown-item>-->
                <!--退出登录-->
                <el-dropdown-item v-if="isLogin" @click="loginOut()" :icon="SwitchButton">
                  退出登录
                </el-dropdown-item>
                <!--退出登录 -->
                <el-dropdown-item v-if="isLogin && isAdmin" @click="loginOut(true)" :icon="SwitchButton">
                  退出管理员登录
                </el-dropdown-item>
                <!--更换壁纸-->
                <el-dropdown-item v-if="!isHome" @click="toggleBG({ getNewBg: true })"
                  :icon="Switch">更换壁纸</el-dropdown-item>
                <!--新闻-->
                <el-dropdown-item @click="goTo('news')">
                  <SVG_news class="el-icon" />
                  &ensp;新闻
                </el-dropdown-item>
                <!--公告-->
                <el-dropdown-item :icon="BellFilled" @click="showNotice = !showNotice">
                  公告
                </el-dropdown-item>
                <!--临时聊天室-->
                <el-dropdown-item @click="goTo('hall')" :icon="Comment">
                  聊天室demo
                </el-dropdown-item>
                <!--音乐播放器-->
                <el-dropdown-item @click="goTo('music')">
                  <SVG_music class="el-icon" />
                  &ensp;音乐播放器demo
                </el-dropdown-item>
                <!--设置-->
                <el-dropdown-item @click="showSetting = !showSetting" :icon="Tools">
                  设置
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-space>
      </el-col>
    </el-row>

    <!--  移动端标题-->
    <el-row class="title" v-if="!isPC" :style="(isPC || route.path === '/') ? '' : 'background-color: rgba(0,0,0,0.4)'">
      <!--左上角-->

      <el-space class="title-left" spacer="">
        <!--侧边导航栏-->
        <el-button @click="emitter.emit('showAsideBtn', 2)" plain :icon="MoreFilled" v-if="isHome" />
        <!--重返未来1999-->
        <el-button @click="goTo('download')" plain :icon="Download" v-if="isHome" />
        <!--    返回键-->
        <el-button :icon="ArrowLeftBold" @click="router.back()" plain v-if="!isHome" />
        <!--首页-->
        <el-button @click="goTo('home')" plain :icon="HomeFilled" v-if="!isHome" />
        <!--日夜切换-->
        <el-switch v-model="isDark" inline-prompt active-text="夜" inactive-text="日" :inactive-action-icon="Sunny"
          :active-action-icon="Moon" />
      </el-space>

      <!--中间导航-->
      <div class="bar">
        <!--      <el-space>-->
        <!--      </el-space>-->
      </div>
      <!--右上角登录和选项-->

      <el-space class="title-right">
        <!--播放指示器-->
        <el-button link @click="togglePlayerVisible()" v-if="showPlayer">
          <SVG_music class="musicIcon" :class="{ paused: !isPlaying }" />
        </el-button>
        <!--登录按钮-->
        <el-button @click="showLoginDrawer" v-if="!isLogin">
          <svg class="headIcon" viewBox="0 0 1024 1024">
            <path
              d="M511.333 63.333c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 832c-51.868 0-102.15-10.144-149.451-30.15-36.011-15.231-69.123-35.67-98.812-60.897 12.177-31.985 42.226-63.875 84.223-88.903C396.189 686.243 456.222 669.53 512 669.53c55.631 0 115.416 16.658 164.026 45.703 41.762 24.953 71.689 56.812 83.863 88.804-29.764 25.342-62.976 45.865-99.106 61.146-47.299 20.006-97.582 30.15-149.45 30.15z m296.268-139.658c-20.493-35.937-54.353-68.855-98.747-95.381C649.75 624.979 579.839 605.53 512 605.53c-67.964 0-138.094 19.488-197.471 54.875-44.644 26.606-78.656 59.594-99.195 95.586-23.835-28.755-43.234-60.652-57.85-95.208-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.3-20.006 97.583-30.15 149.451-30.15 51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-14.563 34.429-33.869 66.22-57.583 94.892z"
              fill="CurrentColor"></path>
            <path
              d="M512 220.223c-88.224 0-160 71.776-160 160s71.776 160 160 160c88.225 0 160-71.775 160-160s-71.775-160-160-160z m0 256c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z"
              fill="CurrentColor"></path>
          </svg>
        </el-button>
        <el-button class="username " type="primary" v-else @click="goCenter">
          <!--{{ username }}太窄了不够显示-->
          <el-image class="headIcon" :src="headImgUrl" alt="" :onerror="errorImage" />
        </el-button>
        <!--论坛-->
        <el-button @click="goTo('center')" plain :icon="Comment" />
        <!--选项下拉菜单-->
        <el-dropdown trigger="click">
          <span>
            <el-button class="option" :icon="Operation" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!--管理中心-->
              <el-dropdown-item v-if="isAdmin" :icon="Avatar" @click="goCenter">
                管理中心
              </el-dropdown-item>
              <!--用户中心-->
              <el-dropdown-item v-else-if="isLogin" :icon="UserFilled" @click="goCenter">
                用户中心
              </el-dropdown-item>
              <!--记账本功能-->
              <!--              <el-dropdown-item v-if="isLogin" :icon="Notebook" @click="goTo('books')">-->
              <!--                前往账本-->
              <!--              </el-dropdown-item>-->
              <!--退出登录-->
              <el-dropdown-item v-if="isLogin" @click="loginOut()" :icon="SwitchButton">
                退出登录
              </el-dropdown-item>
              <!--退出登录 -->
              <el-dropdown-item v-if="isLogin && isAdmin" @click="loginOut(true)" :icon="SwitchButton">
                退出管理员登录
              </el-dropdown-item>
              <!--更换壁纸-->
              <el-dropdown-item :icon="Switch" class="bgBtn" @click="toggleBG({ getNewBg: true })">更换壁纸
              </el-dropdown-item>
              <!--重返未来-->
              <el-dropdown-item :icon="Download" class="bgBtn" @click="goTo('download')" v-if="!isHome">重返未来
              </el-dropdown-item>
              <!--新闻-->
              <el-dropdown-item @click="goTo('news')">
                <SVG_news class="el-icon" />
                &ensp;新闻
              </el-dropdown-item>
              <!--公告-->
              <el-dropdown-item :icon="BellFilled" @click="showNotice = !showNotice">
                公告
              </el-dropdown-item>
              <!--临时聊天室-->
              <el-dropdown-item @click="goTo('hall')" :icon="Comment">
                聊天室demo
              </el-dropdown-item>
              <!--音乐播放器-->
              <el-dropdown-item @click="goTo('music')">
                <SVG_music class="el-icon" />
                &ensp;音乐播放器demo
              </el-dropdown-item>
              <!--设置-->
              <el-dropdown-item :icon="Tools" @click="showSetting = !showSetting">
                设置
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>

    </el-row>


    <!--登录和注册窗口-->
    <el-drawer v-model="showLogin" :before-close="isClose" :size="isPC ? '30%' : '100%'" :with-header="!isPC"
      :destroy-on-close="true" :z-index="300">
      <el-image class="headImg" :src="headImgUrl" v-if="showHeadImg" alt="" :onerror="errorImage" />
      <svg class="headImg" v-if="!showHeadImg" viewBox="0 0 1024 1024">
        <path
          d="M511.333 63.333c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 832c-51.868 0-102.15-10.144-149.451-30.15-36.011-15.231-69.123-35.67-98.812-60.897 12.177-31.985 42.226-63.875 84.223-88.903C396.189 686.243 456.222 669.53 512 669.53c55.631 0 115.416 16.658 164.026 45.703 41.762 24.953 71.689 56.812 83.863 88.804-29.764 25.342-62.976 45.865-99.106 61.146-47.299 20.006-97.582 30.15-149.45 30.15z m296.268-139.658c-20.493-35.937-54.353-68.855-98.747-95.381C649.75 624.979 579.839 605.53 512 605.53c-67.964 0-138.094 19.488-197.471 54.875-44.644 26.606-78.656 59.594-99.195 95.586-23.835-28.755-43.234-60.652-57.85-95.208-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.3-20.006 97.583-30.15 149.451-30.15 51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-14.563 34.429-33.869 66.22-57.583 94.892z" />
        <path
          d="M512 220.223c-88.224 0-160 71.776-160 160s71.776 160 160 160c88.225 0 160-71.775 160-160s-71.775-160-160-160z m0 256c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z" />
      </svg>
      <LoginFormComp ref="loginForm" :toLogin="toLogin" v-if="isShowLoginPage" />
      <RegisterFormComp ref="registerForm" :toLogin="toLogin" v-else />
    </el-drawer>
    <!--  公告界面-->
    <el-dialog v-model="showNotice" :width="isPC ? '60%' : '90%'" :style="{ padding: isPC ? '20ps' : '10px' }"
      :before-close="closeNotice" :show-close="!isPC" :z-index="500" destroy-on-close>
      <template #header><span style="font-size: 24px">公告</span></template>
      <!--  Notice组件-->
      <Notice v-if="!isLogin || showNotice" :showFlag="showFlag" :changePage="changePage" />
    </el-dialog>


    <!--  设置界面-->
    <el-dialog class="setting" v-model="showSetting" :width="isPC ? '40%' : '80%'" title="设置界面" :show-close="!isPC">
      <el-space>
        <el-card>点击下方按钮会清除所有本地存储的token和账号信息,并且退出账号
          <template #footer>
            <el-button @click="clearAll" type="danger">清除本地缓存信息</el-button>
          </template>
        </el-card>
      </el-space>

    </el-dialog>

    <!--音量控制面板-->
    <Transition name="fade">
      <VolumeComp v-if="isShowVolumePanel" :min="0" :max="100" :value="volume * 100"
        @click="toggleVolumePanelVisible" />
    </Transition>
    <!--播放器-->
    <div class="music_div">
      <Player v-if="showPlayer" />
    </div>


  </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, toRefs } from 'vue'
import {
  ArrowLeftBold, Avatar, BellFilled,
  Comment, Download,
  HomeFilled,
  Moon, MoreFilled, Operation,
  Sunny, Switch, SwitchButton,
  Tools,
  UserFilled
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
//stores
import { useMusicPlayStore } from "@/store/music/useMusicPlayStore";
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
//hooks
import useTitleDiv from '@/hooks/useTitleDiv';
//components
import Notice from "@/components/Notice.vue";
import Player from "@/pages/music/components/Player.vue";
import LoginFormComp from "@/components/form/LoginFormComp.vue";
import RegisterFormComp from "@/components/form/RegisterFormComp.vue";
import VolumeComp from "@/components/smallComp/VolumeComp.vue";
//utils
import { emitter } from "@/utils/emitter";
//types
import { NoticeActiveNum } from "@/types/global";
//files
import SVG_music from '@/assets/music/music.svg?component'
import SVG_news from '@/assets/TitleDiv/news.svg?component'


const router = useRouter()
const route = useRoute()
const musicPlayStore = useMusicPlayStore()
const musicListStore = useMusicListStore()
const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const { togglePlayerVisible, toggleVolumePanelVisible } = musicPlayStore
const { isShowVolumePanel, volume } = toRefs(musicPlayStore)
const { isPlaying } = toRefs(musicListStore)
const { isLogin, isAdmin, username, headImgUrl, localBgUrl, useUserBGUrl, errorImage } = toRefs(userInfoStore)
const { loginOut } = userInfoStore
const { isDark, isPC, isHome, isForum } = toRefs(responsiveStore)
const { toggleBG } = useTitleDiv()



const showPlayer = ref(false)



//控制头像的显示
const showHeadImg = ref(isLogin.value)
//控制公告界面的显示,登陆之后默认不显示
const showNotice = ref(!isLogin.value)
//控制设置界面的显示
const showSetting = ref(false)
//登录和注册界面的判断
const showLogin = ref(false)
//登录相关的多个组件的显示与隐藏
const isShowLoginPage = ref(true)

const html = (document.querySelector('html') as HTMLElement)
const body = (document.querySelector('body') as HTMLElement)

const goTo = (name: string) => router.push({ name })


//网页初次渲染函数
onMounted(() => {
  //如果本地壁纸为空
  if (!localBgUrl.value) //{//如果背景图不存在
    toggleBG({ getNewBg: true })
  //响应式布局,判断是电脑则用横屏背景图
  // changeBG(isPC.value ? 1 : 0)
  // } else {
  //   console.log(333, bgUrl.value)
  //   // body.style.backgroundImage = 'url('+bgUrl.value+')'
  //
  //   console.log('当前背景图片地址是：' + bgUrl.value)
  //   if (localStorage.getItem('useUserBGUrl') !== '1') console.log('如需更多壁纸请前往重返未来1999官网：' + 'https://re.bluepoch.com/home/detail.html#wallpaper')
  // }
  //判断是否显示头像
  // if (localStorage.getItem('userInfo') !== null) showHeadImg.value = true
  //登陆之后不默认显示公告
  // showNotice.value =!isLogin.value
  light()
})


//日夜模式切换逻辑
function light() {

  if (isDark.value) {
    body.style.backgroundImage = ''
    html.classList.add('dark')
    // darkStr.value = '夜间模式'
    sessionStorage.setItem('isDark', '1')
    // console.log('当前为夜间模式')
  } else {
    html.classList.remove('dark')
    toggleBG({})
    // body.style.backgroundImage = `url(${localBgUrl.value})`
    // darkStr.value = '日间模式'
    sessionStorage.setItem('isDark', '0')
    // console.log('当前为日间模式')
  }

}


//监视日夜模式切换
watch(isDark, (newValue, oldValue) => {
  if (newValue === oldValue) return
  // console.log('isDark变化了,当前为：', newValue)

  light()

})


//更换壁纸,1为横屏，0为竖屏
// async function changeBG(number: number) {
//   const resImgList = await getBG(number)
//   localBgUrl.value = !!resImgList ? resImgList[0].imgUrl : ''
//   console.log('当前背景图片地址是：' + localBgUrl.value + '\r\n如需更多壁纸请前往重返未来1999官网：' + 'https://re.bluepoch.com/home/detail.html#wallpaper')
//   if (!isDark.value) body.style.backgroundImage = `url(${localBgUrl.value})`
//   useUserBGUrl.value = false //取消用户个人信息的背景设置
// }


//前往管理中心
function goCenter() {
  if (isAdmin.value) router.push({ name: 'adminUsersManagement' })
  else if (isLogin.value) router.push({ name: 'userInfo' })
}




//清除全部本地缓存信息
function clearAll() {
  localStorage.clear()
  sessionStorage.clear()
  ElMessage.success('本地信息已全部清除')
  location.reload()
}

//打开登录窗口
function showLoginDrawer() {
  showLogin.value = true;
  setTimeout(() => {
    emitter.emit('showAsideBtn', 0)//移动端的Aside按钮会挡住左上角
  }, 200)
}


//登录和注册界面跳转
const toLogin = (toLogin = false) => {
  isShowLoginPage.value = toLogin
}


//关闭登录和注册窗口时的提示
const isClose = (done: Function) => {
  ElMessageBox.confirm('你想退出登录/注册吗?关闭窗口后已填信息不会保留。', {
    confirmButtonText: '关闭',
    cancelButtonText: '取消',
    showClose: false,
  }).then(() => setTimeout(() => {
    emitter.emit('showAsideBtn', 1)//移动端的Aside按钮会挡住左上角
    done()
    // 动画关闭需要一定的时间
  }, 200)
  )
  // .catch(msg => {
  //   //什么都不选
  //   console.log(msg)
  //   ElMessage.info(msg)
  // })
}

//关闭公告时调用
function closeNotice() {
  ElMessage.info('公告可在右上角查看。登录后将不会默认加载')
  showNotice.value = false
  // showFlag.showNum = '1'
  // showFlag.activeNum = '1'
  Object.assign(showFlag, {
    showNum: '1',
    activeNum: '1'
  })
}

//判断当前页面,改变导航栏的按钮显隐
// checkRoute(router.currentRoute.value.path)

function checkRoute(path: string) {
  console.log('路由切换了')
  if (path === '/') {
    isHome.value = true
    isForum.value = false
    console.log('当前是首页')
  } else if (path.includes('/forum')) {
    console.log(path)
    isHome.value = false
    isForum.value = true
    console.log('当前是论坛')
  } else {
    if (path.includes('/music')) {
      showPlayer.value = true
    }
    isHome.value = false
    isForum.value = false
  }
}

watch(router.currentRoute, (newValue, oldValue) => {
  if (newValue === oldValue) return
  checkRoute(newValue.path)
})

//切换本地和用户设置的壁纸
watch(useUserBGUrl, (newVal, oldVal) => {
  if (newVal === oldVal) return
  toggleBG({})
})

//公告列表面板序号
const showFlag = reactive<NoticeActiveNum>({
  show_num: 1,
  active_num: 1
})

//切换公告页面
const changePage = (showNum: number, activeNum = 1) => {
  showFlag.show_num = showNum
  console.log('前往', showNum, activeNum)
  setTimeout(() => showFlag.active_num = activeNum, 300)
}

//打开公告列表
emitter.on('showNotice', (item: NoticeActiveNum) => {
  showNotice.value = true
  changePage(item.show_num, item.active_num)
})

</script>

<style scoped>
.titleDiv {
  width: 100%;

}

.title {
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
  height: 40px;
  background-color: -webkit-focus-ring-color;
}

.title-left {
  text-align: left;
}

.title-right {
  text-align: right;
}

.isDarkBtn {
  margin-left: 10px;
}

/*导航栏音乐图标*/
.musicIcon {
  width: 30px;
  height: 30px;
  fill: white;
  animation: rotation 3s infinite linear;
}


/*暂停动画*/
.paused {
  animation-play-state: paused;
}


.username {
  padding-top: 10px;
  background-color: transparent;
  border: transparent;
  font: 20px bold, '华文行楷', serif;
  text-align: center;
  color: gray
}


/*导航栏头像*/
.headIcon {
  width: 20px;
  height: 20px;
  border-radius: 15px;
}

/*PC端登陆之后的头像*/
.userImg {
  border-radius: 15px;
  width: 30px;
  height: 30px
}

/*登录界面的头像矢量图大小*/
.headImg {
  width: 200px;
  margin-bottom: 20px;
  fill: CurrentColor
}

.setting {
  display: flex;
  margin: 5% 20%;
  z-index: 999;
  width: 60%;
  height: 70%;
  opacity: 0.9;
}

.music_div {
  width: 100%;
  height: 0;
  overflow-y: visible;
  position: fixed;
  bottom: 70px;
}

@media (hover: hover) {
  .username:hover {
    background-color: transparent;
    color: #CFB53B;
  }
}

@media (max-width: 780px) {
  .title {
    padding: 5px 10px;
  }

  .username {
    padding: 0;
  }

  .headImg {
    width: 100px;
  }

  /*
    .loginBtn {
      position: absolute;
      background-color: transparent;
      border: none;
      right: 0;
    }

    .loginBtn:active {
      background-color: transparent;
      border: none;
    }


  */
  .bar {
    display: flex;
    justify-content: center;
  }

  .musicIcon {
    height: 20px;
    width: 20px;
  }

  .music_div {
    width: 100%;
    padding: 0;
    margin: 0;
  }
}
</style>
<style>
.el-drawer__header {
  margin-bottom: 0;
}
</style>
