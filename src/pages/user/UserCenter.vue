<template>
  <el-container class="container mainPanel" :style="'height:' + containerHeight + 'px'">
    <el-aside width="200px" v-if="isPC">
      <el-scrollbar>
        <el-menu :default-active="index.toString()">
          <el-menu-item index="0" @click="change(0)">个人信息</el-menu-item>
          <el-menu-item index="1" @click="change(1)">偏好设置</el-menu-item>
          <el-menu-item index="2" @click="change(2)">发布文章</el-menu-item>
          <el-menu-item index="3" @click="change(3)">内容管理</el-menu-item>
          <el-menu-item index="4" @click="change(4)">账本列表</el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <div class="mobileUserCenter" ref="mobileUserCenter" style="width: 100%">
      <router-view />
      <TabBar v-if="!isPC" :change="change" :index="index" />
    </div>
  </el-container>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, toRefs } from "vue"
import { useRoute, useRouter } from "vue-router"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
//hooks
import { useResponsiveStore } from "@/store/useResponsiveStore"
//components
import TabBar from "@/pages/user/TabBar.vue"
//utils
import { emitter } from "@/utils/emitter"

//屏幕高度
const responsiveStore = useResponsiveStore()
const { isPC, containerHeight } = toRefs(responsiveStore)
const { positionComputed, touchstart } = responsiveStore
const route = useRoute()
const router = useRouter()
const userInfoStore = useUserInfoStore()

const { isLogin } = toRefs(userInfoStore)
const mobileUserCenter = ref<HTMLDivElement>()

const index = ref(Number(sessionStorage.getItem("activeNumber")) || 0)

const routers = ["userInfo", "userPreference", "userEdit", "userManagement", "books"]

function change(num: number) {
  index.value = num
  sessionStorage.setItem("activeNumber", num.toString())
  console.log(num, routers[num])
  router.replace({ name: routers[num] })
}

//初始获取进入的页面的页码,侧边栏激活
const pageRender = (number?: number) => {
  //有参数就直接修改
  if (number) index.value = number
  //没有参数就查地址
  else if (typeof route.name === "string") index.value = routers.indexOf(route.name)

  if (route.name === "book") index.value = 4
  // {//没有参数就查地址
  //const path =  window.location.pathname.split('/').pop()
  // const name=route.name
  // if (name === 'userInfo') index.value = 0
  // else if (name === 'preference') index.value = 1
  // else if (name === 'edit') index.value = 2
  // else if (name === 'management') index.value = 3
  // else if (name === 'books') index.value = 4
  // else index.value = 0
  // console.log( routers.indexOf(route.name))
  // }
  sessionStorage.setItem("activeNumber", index.value.toString())
}

onMounted(() => {
  //用户登录判断
  // if (!isLogin.value) {
  //   if (document.referrer.includes('muxidream')) return router.back()
  //   return router.push({ name: 'home' })
  // }
  pageRender()
  emitter.on("pageRender", pageRender)
  console.log("开启了pageRender的emitter监听")
  if (!isPC.value && mobileUserCenter.value) {
    console.log("开启了滑动翻页监听")
    mobileUserCenter.value.addEventListener("touchstart", touchstart, false)
    //手指离开屏幕
    mobileUserCenter.value.addEventListener("touchend", touchend, false)
  }
})

onBeforeUnmount(() => {
  emitter.off("pageRender", pageRender)
  console.log("注销了pageRender的emitter监听")
  removeEventListener("touchstart", touchstart)
  removeEventListener("touchend", touchend)
})

//手指离开屏幕
const touchend = (e: TouchEvent) => {
  console.log("离开屏幕")
  positionComputed(e, index, 0, 4)
  console.log(index.value)
  router.replace({ name: routers[index.value] })
}

//endregion
</script>

<style scoped>
.container,
.mobileUserCenter {
  background-color: var(--el-color-primary-light-9);
}

.container .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-8);
  color: var(--el-text-color-primary);
}

.container .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.container .el-main {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-9);
}

.container .el-menu {
  border-right: none;
}

.container .el-main {
  padding: 0;
}

.container .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}

/*
.footer {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: var(--el-bg-color);
  font-size: 12px;
}

.footerItem {
  font-size: 14px;
  text-align: center;
  padding-top: 5px;
}

.footerItem > .el-icon {
  width: 100%;
}
*/

.tabBar {
  position: absolute;
  bottom: 0;
}
</style>

<style>
body {
  overflow: hidden;
}

/*子组件使用*/
.header1 {
  font-size: 25px;
  line-height: 60px;
}

.header2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

a {
  color: var(--el-color-info);
}

.active {
  color: var(--el-color-primary);
}
</style>
