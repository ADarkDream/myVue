<template>
  <el-container class="container">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-active="index.toString()">
          <router-link :to="{name:'adminUsersManagement'}">
            <el-menu-item index="0" @click="change(0)">用户管理</el-menu-item>
          </router-link>
          <router-link :to="{name:'adminArticlesManagement'}">
            <el-menu-item index="1" @click="change(1)">文章管理</el-menu-item>
          </router-link>
          <router-link :to="{name:'adminCommentsManagement'}">
            <el-menu-item index="2" @click="change(2)">评论管理</el-menu-item>
          </router-link>
          <router-link :to="{name:'adminNoticesManagement'}">
            <el-menu-item index="3" @click="change(3)">公告管理</el-menu-item>
          </router-link>
          <router-link :to="{name:'adminUrlsManagement'}">
            <el-menu-item index="4" @click="change(4)">导航管理</el-menu-item>
          </router-link>
          <router-link :to="{name:'adminImagesManagement'}">
            <el-menu-item index="5" @click="change(5)">图片管理</el-menu-item>
          </router-link>
          <router-link :to="{name:'adminFeedbackManagement'}">
            <el-menu-item index="6" @click="change(6)">反馈管理</el-menu-item>
          </router-link>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-main style="width: 100%;height: 700px;">
      <el-scrollbar>
        <router-view></router-view>
      </el-scrollbar>
    </el-main>
  </el-container>


</template>

<script lang="ts" setup>
import {ref} from 'vue'

import {useRouter} from "vue-router";
import useUserInfo from "@/hooks/useUserInfo";

const router = useRouter();
const {isAdmin} = useUserInfo()
//管理员登录判断
if (!isAdmin.value) router.push({name: 'home'})


let index = ref(Number(sessionStorage.getItem('activeNumber')) || 0)

function change(num: number) {
  index.value = num
  sessionStorage.setItem('activeNumber', num.toString())
}


render()

//初始获取进入的页面的页码
function render() {
  const params = window.location.pathname.split('/').pop()

  if (params === 'articlesManagement') index.value = 1
  else if (params === 'commentsManagement') index.value = 2
  else if (params === 'noticesManagement') index.value = 3
  else if (params === 'urlsManagement') index.value = 4
  else if (params === 'imagesManagement') index.value = 5
  else if (params === 'feedbackManagement') index.value = 6
  else index.value = 0
  sessionStorage.setItem('activeNumber', index.value.toString())
}

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
  font-size: 30px;
  padding-top: 10px;
}

.header2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


</style>