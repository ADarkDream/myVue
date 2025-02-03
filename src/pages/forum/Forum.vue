<template>
  <div ref="ForumRef" class="mainPanel" :style="bgSettings">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="({ name, label, query }, index) in routerBreadcrumb"
        :key="index"
        @click="setRouterBreadcrumb(index, { name, label, query })"
        >{{ label }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!-- 使用 keep-alive 缓存页面, slot props 动态渲染路由组件 -->
    <router-view v-slot="{ Component }">
      <Transition name="shade">
        <keep-alive v-if="isKeepAlive">
          <component :is="Component" :setRouterBreadcrumb="setRouterBreadcrumb" class="forumComponent" />
        </keep-alive>
        <component v-else :is="Component" :setRouterBreadcrumb="setRouterBreadcrumb" class="forumComponent" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
import { ArrowRight } from "@element-plus/icons-vue"
//stores
import { useRoute } from "vue-router"
import { useMainPanelConfigStore } from "@/store/useMainPanelConfigStore"
import { useForumStore } from "@/store/forum/useForumStore"
// import { useResponsiveStore } from "@/store/useResponsiveStore";
//hooks

//utils
import { emitter } from "@/utils/emitter"

const route = useRoute()
// const responsiveStore = useResponsiveStore()
const mainPanelConfigStore = useMainPanelConfigStore()
const forumStore = useForumStore()
// const { containerHeight } = toRefs(responsiveStore)
const { bgSettings } = mainPanelConfigStore

const { routerBreadcrumb } = toRefs(forumStore)
const { setRouterBreadcrumb } = forumStore

// 判断是否需要缓存当前页面
const isKeepAlive = computed(() => {
  const flag = route.meta?.keepAlive ?? false
  console.log("缓存当前页面：", flag)
  return flag
})
interface Scroll {
  scrollLeft: number
  scrollTop: number
}

function scroll({ scrollLeft, scrollTop }: Scroll) {
  console.log("鼠标滚动了", scrollTop, "px")
  emitter.emit("comments-move", scrollTop)
}
</script>
<style>
@import "@/assets/css/mainPanel.css";
</style>
<style scoped>
.el-breadcrumb {
  position: absolute;
  z-index: 15;
  font-size: 16px;
  color: currentColor;
  margin: 10px 0;

  .el-breadcrumb__item {
    cursor: pointer;
  }
}

/*.centerScrollbar {
  margin: 0 ;
width: 90%;
}*/
.forumComponent {
  overflow-y: scroll;
  margin: 40px 0 10px;
  border-radius: 10px;
  width: 100%;
}

@media (max-width: 780px) {
  .centerScrollbar {
    margin: 0;
  }

  .forumComponent {
    margin: 30px 0 10px;
  }

  .el-breadcrumb {
    font-size: 12px;
  }
}
</style>
