<template>
  <div class="admin-container mainPanel">
    <div v-show="asideVisible" class="aside">
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
        <router-link :to="{ name: 'images' }">
          <el-menu-item index="7" @click="change(7)">1999图片管理</el-menu-item>
        </router-link>
      </el-menu>
    </div>
    <div class="main" :style="{ height: screenHeight - 70 + 'px' }">
      <el-button
        v-if="!isPC"
        :icon="Switch"
        style="position: absolute; right: 10px; top: 10px"
        @click="toggleVisible"
      ></el-button>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from "vue"
import { useRouter } from "vue-router"
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { Switch } from "@element-plus/icons-vue"

const responsiveStore = useResponsiveStore()
const { screenHeight, isPC } = toRefs(responsiveStore)
const router = useRouter()
const userInfoStore = useUserInfoStore()

const { isAdmin } = toRefs(userInfoStore)

//侧边栏激活菜单
let index = ref(Number(sessionStorage.getItem("activeNumber")) || 0)

function change(num: number) {
  index.value = num
  sessionStorage.setItem("activeNumber", num.toString())
}

//初始获取进入的页面的页码
function render() {
  const params = window.location.pathname.split("/").pop()
  if (params === "articles") index.value = 1
  else if (params === "comments") index.value = 2
  else if (params === "notices") index.value = 3
  else if (params === "urls") index.value = 4
  else if (params === "images") index.value = 5
  else if (params === "feedback") index.value = 6
  else if (params === "1999Images") index.value = 7
  else index.value = 0
  sessionStorage.setItem("activeNumber", index.value.toString())
}

const asideVisible = ref(true)
const toggleVisible = () => {
  asideVisible.value = !asideVisible.value
}

onMounted(() => {
  //管理员登录判断
  if (!isAdmin.value) {
    if (document.referrer.includes("muxidream")) return router.back()
    return router.push({ name: "home" })
  }
  render()
})
</script>

<style scoped>
.admin-container {
  display: flex;
  justify-content: center;

  .aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-10);
    opacity: 0.8;
    padding: 10px 10px 10px 0;
    width: 200px;
  }

  .main {
    flex: 1;
    width: calc(100% - 200px);
    padding: 0 0 10px 0;
  }

  /*子组件使用*/
  :deep(.header1) {
    font-size: 25px;
    line-height: 60px;
    padding-top: 0;
  }

  :deep(.header2) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  :deep(.el-table) {
    height: calc(100vh - 210px);
  }
}
@media (max-width: 780px) {
  .admin-container {
    .aside {
      width: auto;
    }
  }
}
</style>
