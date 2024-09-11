<template>
  <el-container class="container" :style="'height:'+containerHeight+'px'">
    <el-aside width="200px" v-if="isPC">
      <el-scrollbar>
        <el-menu :default-active="index.toString()">

            <el-menu-item index="0" @click="change(0)">个人信息</el-menu-item>

            <el-menu-item index="1" @click="change(1)">偏好设置</el-menu-item>

            <el-menu-item index="2" @click="change(2)">内容管理</el-menu-item>


            <el-menu-item index="3" @click="change(3)">发布文章</el-menu-item>


            <el-menu-item index="4" @click="change(4)">账本列表</el-menu-item>

        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-main>
      <router-view/>
      <TabBar v-if="!isPC" :change="change" :index="index"   style="position: absolute;bottom: 0;"/>
    </el-main>
<!--          <el-icon>-->
<!--            <User/>-->
<!--          </el-icon>-->
<!--    <div v-if="isPC" class="footer">-->
<!--      <router-link :to="{name:'userInfo'}" replace :class="index===0? 'active':'' ">-->
<!--        <div @click="change(0)" class="footerItem">-->
<!--          <el-icon>-->
<!--            <User/>-->
<!--          </el-icon>-->
<!--          个人信息-->
<!--        </div>-->
<!--      </router-link>-->
<!--      <router-link :to="{name:'userPreference'}" replace :class="index===1? 'active':'' ">-->
<!--        <div @click="change(1)" class="footerItem">-->
<!--          <svg class="el-icon" viewBox="0 0 1024 1024" width="200" height="200">-->
<!--            <path-->
<!--                d="M797.184 518.496l-284.384 294.016-284.16-292A162.752 162.752 0 0 1 192 417.6C192 328.512 263.808 256 352 256a159.36 159.36 0 0 1 133.28 72.16L512 368.64l26.72-40.48A159.488 159.488 0 0 1 672 256c88.224 0 160 72.512 160 161.6 0 37.536-12.992 74.08-34.816 100.896M672 192a222.72 222.72 0 0 0-160 67.712A222.624 222.624 0 0 0 352 192c-123.52 0-224 101.216-224 225.6 0 52.288 18.176 103.232 52.96 145.536l285.952 293.984a62.4 62.4 0 0 0 45.088 19.168c17.12 0 33.12-6.816 45.12-19.136l287.744-296.064A226.816 226.816 0 0 0 896 417.6C896 293.216 795.52 192 672 192"-->
<!--                fill="currentColor"></path>-->
<!--          </svg>-->
<!--          偏好设置-->
<!--        </div>-->
<!--      </router-link>-->
<!--      <router-link :to="{name:'userManagement'}" replace :class="index===2? 'active':'' ">-->
<!--        <div @click="change(2)" class="footerItem">-->
<!--          <el-icon>-->
<!--            <Document/>-->
<!--          </el-icon>-->
<!--          内容管理-->
<!--        </div>-->
<!--      </router-link>-->
<!--      <router-link :to="{name:'userEdit'}" replace :class="index===3? 'active':'' ">-->
<!--        <div @click="change(3)" class="footerItem">-->
<!--          <el-icon>-->
<!--            <EditPen/>-->
<!--          </el-icon>-->
<!--          发布文章-->
<!--        </div>-->
<!--      </router-link>-->
<!--      <router-link :to="{name:'books'}" replace :class="index===4? 'active':'' ">-->
<!--        <div @click="change(4)" class="footerItem">-->
<!--          <el-icon>-->
<!--            <EditPen/>-->
<!--          </el-icon>-->
<!--          账本列表-->
<!--        </div>-->
<!--      </router-link>-->

<!--    </div>-->
  </el-container>

</template>

<script lang="ts" setup>
//region
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {useRouter} from "vue-router";
import useUserInfo from "@/hooks/useUserInfo";
import emitter from "@/utils/emitter";
import useResponsive from "@/hooks/useResponsive";
import {BellFilled, Document, Edit, EditPen, User} from "@element-plus/icons-vue";
import TabBar from "@/pages/user/TabBar.vue";
//屏幕高度
const {isPC, screenHeight, containerHeight} = useResponsive()
const router = useRouter()
const {isLogin} = useUserInfo()


const index = ref(Number(sessionStorage.getItem('activeNumber')) || 0)

const routers=['userInfo', 'userPreference', 'userEdit', 'userManagement', 'books']



function change(num: number) {
  index.value = num
  sessionStorage.setItem('activeNumber', num.toString())
  console.log(num,routers[num])
  router.replace({name:routers[num]})
}


//初始获取进入的页面的页码,侧边栏激活
const pageRender = (number?: number) => {
  if (!!number) index.value = number//有参数就直接修改
  else {//没有参数就查地址
    const params = window.location.pathname.split('/').pop()
    if (params === 'preference') index.value = 1
    else if (params === 'management') index.value = 2
    else if (params === 'edit') index.value = 3
    else if (params === 'books') index.value = 4
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

//endregion

</script>

<style scoped>
.container {
  background-color: var(--el-bg-color);
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
