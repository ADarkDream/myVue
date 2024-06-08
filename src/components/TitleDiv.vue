<template>
  <!--PC端标题-->
  <el-row class="title" v-if="isPC">
    <!--左上角-->
    <el-col :lg="5" :md="6" :sm="8">
      <!--更换背景-->
      <el-button class="bgBtn" @click="changeBG(0)">更换背景</el-button>
      <!--下载背景-->
      <el-button class="bgBtn">
        <el-link :href="bgUrl" target="_blank" :underline="false">下载背景</el-link>
      </el-button>
      <!--日夜切换-->
      <el-switch v-model="isDark" inline-prompt active-text="夜" inactive-text="日" class="isDarkBtn">
        <template #active-action>
          <el-icon>
            <Moon/>
          </el-icon>
        </template>
        <template #inactive-action>
          <el-icon>
            <Sunny/>
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
    <el-col :lg="6" :md="7" :sm="8">
      <el-space>
        <!--登录按钮-->
        <el-button @click="showLogin = true" v-if="!isLogin">登录
          <svg type="primary" style="margin-left: 16px;height: 20px;width: 20px" viewBox="0 0 1024 1024">
            <path
                d="M511.333 63.333c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 832c-51.868 0-102.15-10.144-149.451-30.15-36.011-15.231-69.123-35.67-98.812-60.897 12.177-31.985 42.226-63.875 84.223-88.903C396.189 686.243 456.222 669.53 512 669.53c55.631 0 115.416 16.658 164.026 45.703 41.762 24.953 71.689 56.812 83.863 88.804-29.764 25.342-62.976 45.865-99.106 61.146-47.299 20.006-97.582 30.15-149.45 30.15z m296.268-139.658c-20.493-35.937-54.353-68.855-98.747-95.381C649.75 624.979 579.839 605.53 512 605.53c-67.964 0-138.094 19.488-197.471 54.875-44.644 26.606-78.656 59.594-99.195 95.586-23.835-28.755-43.234-60.652-57.85-95.208-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.3-20.006 97.583-30.15 149.451-30.15 51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-14.563 34.429-33.869 66.22-57.583 94.892z"
                fill=""></path>
            <path
                d="M512 220.223c-88.224 0-160 71.776-160 160s71.776 160 160 160c88.225 0 160-71.775 160-160s-71.775-160-160-160z m0 256c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z"
                fill=""></path>
          </svg>
        </el-button>
        <!--登陆后的按钮-->
        <el-button class="username " type="primary" v-if="isLogin" @click="goCenter">{{ username }}
          <el-image class="headIcon" :src="headImgUrl" alt="" :onerror="errorImage"/>
        </el-button>
        <!--首页-->
        <router-link :to="{name:'home'}" v-if="!isHome" replace>
          <el-button plain :icon="HomeFilled">
            首页
          </el-button>
        </router-link>
        <!--论坛-->
        <router-link :to="{name:'center'}" v-if="isHome" replace>
          <el-button plain :icon="Comment">
            论坛
          </el-button>
        </router-link>
        <!--选项菜单-->
        <el-dropdown>

          <el-button class="option" :icon="Operation">
            选项
          </el-button>
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
              <!--退出登录-->
              <el-dropdown-item v-if="isLogin" @click="exit" :icon="SwitchButton">
                退出登录
              </el-dropdown-item>
              <!--公告-->
              <el-dropdown-item :icon="Comment" @click="showNotice=!showNotice">
                公告
              </el-dropdown-item>
              <!--设置-->
              <el-dropdown-item @click="showSetting=!showSetting" :icon="Tools">
                设置
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </el-col>
  </el-row>

  <!--  移动端标题-->
  <el-row class="title" v-if="!isPC">
    <!--左上角返回-->
    <el-col class="title-left">
      <el-space spacer="">
        <!--论坛-->
        <router-link :to="{name:'center'}" v-if="isHome" style="margin-left: 53px">
          <el-button plain :icon="Comment"/>
        </router-link>
        <!--    返回键-->
        <el-button :icon="ArrowLeftBold" @click="router.back()" v-if="!isHome"/>
        <!--首页-->
        <router-link :to="{name:'home'}" v-if="!isHome">
          <el-button plain :icon="HomeFilled"/>
        </router-link>
      </el-space>

    </el-col>
    <!--中间导航-->
    <el-col class="bar">
      <!--      <el-space>-->


      <!--      </el-space>-->
    </el-col>
    <!--右上角登录和选项-->
    <el-col class="title-right">
      <el-space>
        <el-button class="username " type="primary" v-if="isLogin" @click="goCenter">
          <!--{{ username }}太窄了不够显示-->
          <el-image class="headIcon" :src="headImgUrl" alt="" :onerror="errorImage"/>
        </el-button>
        <!--登录按钮-->
        <el-button @click="showLogin = true" v-if="!isLogin">
          <svg type="primary" style="width: 20px;height: 20px" viewBox="0 0 1024 1024">
            <path
                d="M511.333 63.333c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 832c-51.868 0-102.15-10.144-149.451-30.15-36.011-15.231-69.123-35.67-98.812-60.897 12.177-31.985 42.226-63.875 84.223-88.903C396.189 686.243 456.222 669.53 512 669.53c55.631 0 115.416 16.658 164.026 45.703 41.762 24.953 71.689 56.812 83.863 88.804-29.764 25.342-62.976 45.865-99.106 61.146-47.299 20.006-97.582 30.15-149.45 30.15z m296.268-139.658c-20.493-35.937-54.353-68.855-98.747-95.381C649.75 624.979 579.839 605.53 512 605.53c-67.964 0-138.094 19.488-197.471 54.875-44.644 26.606-78.656 59.594-99.195 95.586-23.835-28.755-43.234-60.652-57.85-95.208-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.3-20.006 97.583-30.15 149.451-30.15 51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-14.563 34.429-33.869 66.22-57.583 94.892z"
                fill=""></path>
            <path
                d="M512 220.223c-88.224 0-160 71.776-160 160s71.776 160 160 160c88.225 0 160-71.775 160-160s-71.775-160-160-160z m0 256c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z"
                fill=""></path>
          </svg>
        </el-button>
        <!--选项下拉菜单-->
        <el-dropdown>
          <el-button class="option" :icon="Operation"/>
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

              <!--退出登录-->
              <el-dropdown-item v-if="isLogin" @click="exit" :icon="SwitchButton">
                退出登录
              </el-dropdown-item>
              <!--更换背景-->
              <el-dropdown-item class="bgBtn" @click="changeBG(1)">更换背景</el-dropdown-item>
              <!--下载背景-->
              <el-dropdown-item class="bgBtn">
                <el-link :href="bgUrl" target="_blank" :underline="false">下载背景</el-link>
              </el-dropdown-item>
              <!--日夜切换-->
              <el-switch v-model="isDark" inline-prompt active-text="夜" inactive-text="日"
                         :inactive-action-icon="Sunny" :active-action-icon="Moon" class="isDarkBtn"/>
              <!--公告-->
              <el-dropdown-item :icon="Comment" @click="showNotice=!showNotice">
                公告
              </el-dropdown-item>
              <!--设置-->
              <el-dropdown-item :icon="Tools" @click="showSetting=!showSetting">
                设置
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </el-col>
  </el-row>


  <!--登录和注册窗口-->
  <el-drawer v-model="showLogin" :before-close="isClose" :size="isPC? '30%':'100%' " :show-close="!isPC"
             destroy-on-close="destroy-on-close">
    <template #header="{titleClass }">
      <el-button v-show="isShow" @click="isShow=!isShow" class="backBtn" :icon="ArrowLeftBold">
        返回
      </el-button>

      <h4 :class="titleClass">{{ title }}</h4>

      <div/>
    </template>

    <div>
      <el-image class="headImg" :src="headImgUrl" v-if="showHeadImg" alt="" :onerror="errorImage"/>
      <svg class="headImg" v-if="!showHeadImg" viewBox="0 0 1024 1024">
        <path
            d="M511.333 63.333c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 832c-51.868 0-102.15-10.144-149.451-30.15-36.011-15.231-69.123-35.67-98.812-60.897 12.177-31.985 42.226-63.875 84.223-88.903C396.189 686.243 456.222 669.53 512 669.53c55.631 0 115.416 16.658 164.026 45.703 41.762 24.953 71.689 56.812 83.863 88.804-29.764 25.342-62.976 45.865-99.106 61.146-47.299 20.006-97.582 30.15-149.45 30.15z m296.268-139.658c-20.493-35.937-54.353-68.855-98.747-95.381C649.75 624.979 579.839 605.53 512 605.53c-67.964 0-138.094 19.488-197.471 54.875-44.644 26.606-78.656 59.594-99.195 95.586-23.835-28.755-43.234-60.652-57.85-95.208-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.3-20.006 97.583-30.15 149.451-30.15 51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-14.563 34.429-33.869 66.22-57.583 94.892z"
            fill=""></path>
        <path
            d="M512 220.223c-88.224 0-160 71.776-160 160s71.776 160 160 160c88.225 0 160-71.775 160-160s-71.775-160-160-160z m0 256c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z"
            fill=""></path>
      </svg>
      <Login v-if="isShow" :flag="flag" :toLogin="toLogin"/>
      <br>
      <div v-show="!isShow">
        <el-button class="bt2" @click="toLogin">登录</el-button>
        <el-button class="bt2" @click="toSubmit">注册</el-button>
      </div>
    </div>

  </el-drawer>
  <!--  公告界面-->
  <el-dialog v-model="showNotice" :width="isPC? '60%':'90%' " :before-close="closeNotice" :show-close="!isPC"
             destroy-on-close>
    <template #header><span style="font-size: 24px">公告</span></template>
    <!--  Notice组件-->
    <Notice/>
  </el-dialog>


  <!--  设置界面-->
  <el-dialog class="setting" v-model="showSetting" :width="isPC?'40%':'80%' " title="设置界面" :show-close="!isPC">
    <el-space>
      <el-card>点击下方按钮会清除所有本地存储的token和账号信息,并且退出账号
        <template #footer>
          <el-button @click="clearAll" type="danger">清除本地缓存信息</el-button>
        </template>
      </el-card>
    </el-space>

  </el-dialog>


</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue'
import Login from "@/pages/Login.vue";
import {
  ArrowLeftBold, Avatar,
  Comment,
  HomeFilled,
  Moon, Operation,
  Sunny, SwitchButton,
  Tools,
  UserFilled
} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useBGUrlStore} from '@/store/1999BG'
import Notice from "@/components/Notice.vue";
import useUserInfo from '@/hooks/useUserInfo'
import {useRouter} from "vue-router";
import useResponsive from "@/hooks/useResponsive";

const {isDark, isPC, isHome} = useResponsive()

const router = useRouter()

const {isLogin, isAdmin, username, headImgUrl, bgUrl, errorImage} = useUserInfo()

// //获取背景图,有用户的且选择使用则使用用户的图，没有则使用默认图
if (localStorage.getItem('useUserBGUrl') !== '1') bgUrl.value = ''
if (bgUrl.value === '') bgUrl.value = localStorage.getItem('bgUrl')

//控制头像的显示
let showHeadImg = ref(false)
//控制公告界面的显示
let showNotice = ref(true)
//控制设置界面的显示
let showSetting = ref(false)
//下拉按钮里面的字，暂时用不上
// let darkStr = ref('夜间模式')
//控制日夜模式切换
// let isDark = ref(sessionStorage.getItem('isDark') === '1' || false)
//登录和注册界面的判断
const showLogin = ref(false)
//登录和注册界面的标题——————待修改，需要响应式
let title = ref('登录/注册')
//登录和注册按钮的显示和隐藏
let flag = ref(true)
//登录相关，控制页面多个组件的显示与隐藏
let isShow = ref(false)
//本地默认存的背景图地址
const {pcBGList, phoneBGList} = reactive(useBGUrlStore())
const bgList = [pcBGList, phoneBGList]

const html = (document.querySelector('html') as HTMLElement)
const body = (document.querySelector('body') as HTMLElement)

//网页初次渲染函数
onMounted(() => {
  //如果本地壁纸为空
  if (bgUrl.value === null || bgUrl.value === '') {
    //响应式布局,判断是手机则用手机背景图
    if (!isPC.value) changeBG(1)
    else changeBG(0)
  } else {
    body.style.backgroundImage = `url(${bgUrl.value})`
    console.log('当前背景图片地址是：' + bgUrl.value)
    if (localStorage.getItem('useUserBGUrl') !== '1') console.log('如需更多壁纸请前往重返未来1999官网：' + 'https://re.bluepoch.com/home/detail.html#wallpaper')
  }
  //判断是否显示头像
  if (localStorage.getItem('userInfo') !== null) showHeadImg.value = true
  //登陆之后不默认显示公告
  if (isLogin.value) showNotice.value = false
  light()
})


//日夜模式切换逻辑
function light() {
  if (isDark.value === false) {
    html.classList.remove('dark')
    body.style.backgroundImage = `url(${bgUrl.value})`
    // darkStr.value = '日间模式'
    sessionStorage.setItem('isDark', '0')
    // console.log('当前为日间模式')
  } else {
    body.style.backgroundImage = ''
    html.classList.add('dark')
    // darkStr.value = '夜间模式'
    sessionStorage.setItem('isDark', '1')
    // console.log('当前为夜间模式')
  }
}


//监视日夜模式切换
watch(isDark, (newValue, oldValue) => {
  if (newValue === oldValue) {
    return
  } else {
    // console.log('isDark变化了,当前为：', newValue)
    light()
  }
})


//更换背景
function changeBG(number: number) {
  //bgList[0]是横屏壁纸，bgList[1]是竖屏壁纸
  const list = bgList[number]
  const num = Number((Math.random() * list.length).toFixed())
  console.log(`一共有${list.length}张图。现在是第${num}张图`)
  console.log('当前背景图片地址是：' + list[num] + '\r\n如需更多壁纸请前往重返未来1999官网：' + 'https://re.bluepoch.com/home/detail.html#wallpaper')
  bgUrl.value = list[num]
  if (!isDark.value) body.style.backgroundImage = `url(${list[num]})`
  localStorage.setItem('bgUrl', list[num])
}

//前往管理中心
function goCenter() {
  if (isAdmin.value) router.push({name: 'adminUsersManagement'})
  else if (isLogin.value) router.push({name: 'userInfo'})
}


//退出登录
function exit() {
  sessionStorage.clear()
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('userEngines')
  localStorage.removeItem('useUserBGUrl')
  localStorage.removeItem('userBGUrl')
// 调用函数清除所有sessionStorage
  ElMessage.info('已退出登录,本地的用户数据已清除')
  ElMessage.info('部分本地信息会保留，如需清除请在右上角选择“选项“→”设置”→“清除全部本地缓存信息”')
  setTimeout(() => {
    location.href = '/'
  }, 2500)
}

//清除全部本地缓存信息
function clearAll() {
  localStorage.clear()
  sessionStorage.clear()
  ElMessage.success('本地信息已全部清除')
  location.reload()
}


//关闭登录和注册窗口时的提示
const isClose = (done: Function) => {
  ElMessageBox.confirm('你想退出登录/注册吗?关闭窗口后已填信息不会保留。', {
    confirmButtonText: '关闭',
    cancelButtonText: '取消',
    showClose: false,
  })
      .then(() => {
        setTimeout(() => {
          done()
          // 动画关闭需要一定的时间
        }, 200)
      })
  // .catch(msg => {
  //   //什么都不选
  //   console.log(msg)
  //   ElMessage.info(msg)
  // })
}


//点击登录按钮
function toLogin() {
  isShow.value = true
  flag.value = true
  console.log(flag.value)
}

//点击注册按钮
function toSubmit() {
  isShow.value = true
  flag.value = false
  console.log(flag.value)
}

//关闭公告时调用
function closeNotice() {
  ElMessage.info('公告可在右上角查看。登录后将不会默认加载')
  showNotice.value = false
}

//判断当前页面
watch(router.currentRoute, (newValue, oldValue) => {
  if (newValue === oldValue) return
  if (newValue.path !== '/') {
    isHome.value = false
    console.log('路由切换了,当前不是主页')
  } else {
    isHome.value = true
    console.log('是主页')
  }
})
// setInterval(() => {
//   // console.log(router.currentRoute.value.path,router.currentRoute.value.path==='/',isHome.value)
//   // if (!isHome.value) console.log(router.currentRoute.value.path)
//   if (isHome.value) console.log('是主页')
//   else console.log('不是主页')
// }, 1000)

</script>

<style scoped>
.title {
  padding: 5px 0;
  justify-content: space-between;
  background-color: -webkit-focus-ring-color;
}


.isDarkBtn {
  margin-left: 10px;
}


.username {
  display: inline;
  /*图片从button里面移除就需要这个调整位置
margin-top: -20px ;
  */
  padding-top: 0;
  background-color: transparent;
  border: transparent;
  font: 20px bold, '华文行楷', serif;
  text-align: center;
  color: gray
}

.username:hover {
  background-color: transparent;
  color: #CFB53B;
}

/*导航栏头像*/
.headIcon {
  margin-left: 10px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
}

/*登录界面的头像图片大小*/
.headImg {
  width: 200px;
}

.bt2 {
  margin-top: 100px;
  width: 120px;
  height: 50px;
  font-size: 18px;
}

.backBtn {
  left: 0;
  position: absolute;
}


.setting {
  display: flex;
  margin: 5% 20%;
  z-index: 999;
  width: 60%;
  height: 70%;
  opacity: 0.9;
}


@media (max-width: 980px) {


  .title-left {
    position: absolute;
    top: 5px;
    left: 0;
  }

  .title-right {
    position: absolute;
    top: 5px;
    right: 0;
  }

  .headIcon {
    margin-left: 0;
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
}
</style>