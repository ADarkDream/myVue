<template>
  <el-container class="container">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-active="index.toString()">
          <router-link :to="{ name: 'adminUsersManagement' }">
            <el-menu-item index="0" @click="change(0)">用户管理</el-menu-item>
          </router-link>
          <router-link :to="{ name: 'adminArticlesManagement' }">
            <el-menu-item index="1" @click="change(1)">文章管理</el-menu-item>
          </router-link>
          <router-link :to="{ name: 'adminCommentsManagement' }">
            <el-menu-item index="2" @click="change(2)">评论管理</el-menu-item>
          </router-link>
          <router-link :to="{ name: 'adminNoticesManagement' }">
            <el-menu-item index="3" @click="change(3)">公告管理</el-menu-item>
          </router-link>
          <router-link :to="{ name: 'adminUrlsManagement' }">
            <el-menu-item index="4" @click="change(4)">导航管理</el-menu-item>
          </router-link>
          <router-link :to="{ name: 'adminImagesManagement' }">
            <el-menu-item index="5" @click="change(5)">图片管理</el-menu-item>
          </router-link>
          <router-link :to="{ name: 'adminFeedbackManagement' }">
            <el-menu-item index="6" @click="change(6)">反馈管理</el-menu-item>
          </router-link>
          <router-link :to="{ name: 'admin1999ImagesManagement' }">
            <el-menu-item index="7" @click="change(7)">1999图片管理</el-menu-item>
          </router-link>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-main :style="'height:' + (screenHeight - 70) + 'px'">
      <el-scrollbar>
        <router-view></router-view>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue'
import { useRouter } from "vue-router";
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";

const responsiveStore = useResponsiveStore()
const { screenHeight } = toRefs(responsiveStore)
const router = useRouter();
const userInfoStore = useUserInfoStore()

const { isAdmin } = toRefs(userInfoStore)


//侧边栏激活菜单
let index = ref(Number(sessionStorage.getItem('activeNumber')) || 0)

function change(num: number) {
  index.value = num
  sessionStorage.setItem('activeNumber', num.toString())
}


//初始获取进入的页面的页码
function render() {
  const params = window.location.pathname.split('/').pop()
  if (params === 'articles') index.value = 1
  else if (params === 'comments') index.value = 2
  else if (params === 'notices') index.value = 3
  else if (params === 'urls') index.value = 4
  else if (params === 'images') index.value = 5
  else if (params === 'feedback') index.value = 6
  else if (params === '1999Images') index.value = 7
  else index.value = 0
  sessionStorage.setItem('activeNumber', index.value.toString())
}

onMounted(() => {
  //管理员登录判断
  if (!isAdmin.value) {
    if (document.referrer.includes('muxidream')) return router.back()
    return router.push({ name: 'home' })
  }
  render()
})
</script>

<style scoped>
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

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
<style>
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
</style>
