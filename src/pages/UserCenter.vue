<template>
  <el-container class="container">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-active="index.toString()">
          <router-link :to="{name:'userInfo'}" replace>
            <el-menu-item index="0" @click="change(0)">个人信息</el-menu-item>
          </router-link>
          <router-link :to="{name:'userPreference'}" replace>
            <el-menu-item index="1" @click="change(1)">偏好设置</el-menu-item>
          </router-link>
          <router-link :to="{name:'userManagement'}" replace>
            <el-menu-item index="2" @click="change(2)">内容管理</el-menu-item>
          </router-link>
          <router-link :to="{name:'userEdit'}" replace>
            <el-menu-item index="3" @click="change(3)">发布文章</el-menu-item>
          </router-link>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-main :style="'height:'+ (screenHeight-70)+'px'">
      <el-scrollbar>
        <router-view/>
      </el-scrollbar>
    </el-main>
  </el-container>

</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {useRouter} from "vue-router";
import useUserInfo from "@/hooks/useUserInfo";
import emitter from "@/utils/emitter";
import useResponsive from "@/hooks/useResponsive";
//屏幕高度
const {screenHeight} = useResponsive()
const router = useRouter();
const {isLogin} = useUserInfo()


let index = ref(Number(sessionStorage.getItem('activeNumber')) || 0)

function change(num: number) {
  index.value = num
  sessionStorage.setItem('activeNumber', num.toString())
}


//初始获取进入的页面的页码,侧边栏激活
const pageRender = (number?: number) => {
  if (!!number) index.value = number//有参数就直接修改
  else {//没有参数就查地址
    const params = window.location.pathname.split('/').pop()
    if (params === 'preference') index.value = 1
    else if (params === 'management') index.value = 2
    else if (params === 'edit') index.value = 3
    else index.value = 0
  }
  sessionStorage.setItem('activeNumber', index.value.toString())
}


onMounted(() => {
  //用户登录判断
  if (!isLogin.value) {
    if (document.referrer.includes('muxidream')) return router.back()
    return router.push({name: 'home'})
  }
  pageRender()
  emitter.on('pageRender', pageRender)
  console.log('开启了pageRender的emitter监听')
})


onBeforeUnmount(() => {
  emitter.off('pageRender', pageRender)
  console.log('注销了pageRender的emitter监听')
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