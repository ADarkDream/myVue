<template>
  <el-config-provider :locale="locale" :size="isPC ? 'default' : 'small'">
    <el-container class="app">
      <!-- <LoadingMask :show="isLoading" /> -->
      <!--    顶部导航栏-->
      <el-header class="shade" mode="out-in">
        <TitleDiv />
      </el-header>
      <!-- 主要呈现部分(Home / Forum)-->
      <div class="main">
        <router-view v-slot="{ Component }">
          <Suspense>
            <template #default>
              <transition name="fade">
                <component :is="Component" class="view-component" />
              </transition>
            </template>
            <template #fallback>
              <div class="loading">Loading...</div>
            </template>
          </Suspense>
        </router-view>
      </div>
    </el-container>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue"
import { useRouter } from "vue-router"
import zhCn from "element-plus/es/locale/lang/zh-cn" //elementPlus国际化
import en from "element-plus/es/locale/lang/en" //elementPlus国际化
//components
import TitleDiv from "@/components/TitleDiv.vue"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"

const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()

const { token } = toRefs(userInfoStore)
const { setTokenByType, checkLocalToken } = userInfoStore
const { screenHeight } = toRefs(responsiveStore)

const router = useRouter()

const isPC = ref(true)

// 判断是否是PC端
window.addEventListener("resize", () => checkIsPC())

function checkIsPC() {
  // console.log('屏幕变化了')
  //获取当前屏幕宽度

  isPC.value = document.body.clientWidth > 980
  // 调用函数判断设备类型
  const userAgentInfo = navigator.userAgent
  const agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
  for (let i = 0; i < agents.length; i++) {
    if (userAgentInfo.includes(agents[i])) {
      isPC.value = false
      break
    }
  }
}

checkIsPC()
checkLocalToken()

const language = ref("zh-cn")
const locale = computed(() => (language.value === "zh-cn" ? zhCn : en))

const isLoading = ref(true) // 控制加载状态

// 首次进入网站时显示加载动画
onMounted(() => {
  isLoading.value = false // 首次渲染完成后关闭加载动画
})

// 监听路由跳转
// router.beforeEach((to, from, next) => {
//   isLoading.value = true; // 路由开始跳转时显示加载动画
//   console.log('路由跳转');

//   next();
// });

// router.afterEach(() => {
//   console.log('路由跳转完成');

//   // 等待页面渲染完成，延迟关闭加载动画
//   setTimeout(() => {
//     isLoading.value = false;
//   }, 300); // 根据动画时间调整
// });
</script>
<style>
@import "@/assets/css/mainPanel.css";
</style>
<style scoped>
.shade {
  /*会导致登录窗口被裁减
   backdrop-filter: blur(40px);
 */
  padding: 0;
  height: 40px;
  z-index: 100;
}

.main {
  position: relative;
  height: calc(100vh - 40px);
}

/* 路由页面 */
.view-component {
  position: absolute;
  /* 确保新旧组件占据相同位置 */
  top: 0;
  left: 0;
}
</style>
