<template>
  <el-container class="homePanel" style="overflow: hidden">
    <!--  侧边栏-->
    <Aside :show-content="showContent" />
    <div class="home-main">
      <!--首页时钟-->
      <Time :class="timeClass" @click="showContent(true)" />
      <!--搜索框区域-->
      <SearchEngine />
      <!--内容区域-->
      <el-collapse-transition v-if="isShow" v-motion-slide-bottom class="content">
        <Content :show-content="showContent" />
      </el-collapse-transition>
    </div>

    <Approve :no-wrap="true" class="home-footer" />
  </el-container>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"
import { ElCollapseTransition } from "element-plus"
//hooks
import { useResponsiveStore } from "@/store/useResponsiveStore"
//components
import Aside from "@/components/Aside.vue"
import Approve from "@/components/Approve.vue"
import SearchEngine from "@/pages/home/SearchEngine.vue"
import Content from "@/pages/home/Content.vue"
const responsiveStore = useResponsiveStore()
const { isPC } = toRefs(responsiveStore)
const { isScroll } = responsiveStore

const isSticky = ref(false)

isPC.value ? isScroll(false) : isScroll()

//内容区是否显示
const isShow = ref(false)
// 切换类名
const timeClass = ref("time")

//显示下方内容区,isShow.value=false不显示,isHide=true代表点击时间时关闭
//!函数需修改 isSticky 部分，现在在移动端不会自动下滑
function showContent(isHide = false) {
  console.log("是否显示内容区,isShow：", isShow.value)
  if (isHide || isShow.value === false) {
    isShow.value = !isShow.value //点击时间时开关，点击侧边栏时只开不关
    if (!isPC.value) isSticky.value = true //开启底部粘性定位
  }

  if (isShow.value && isPC.value) {
    timeClass.value = "timeUp"
  } else timeClass.value = "time"

  if (!isPC.value) {
    isScroll(true) //允许纵向滚动
    if (!isShow.value)
      setTimeout(() => {
        isSticky.value = false //关闭底部粘性定位
      }, 200)
  }
}
</script>

<style scoped>
.homePanel {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .home-main {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 80%;
  }
  .home-footer {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}

.time {
  margin: 5% 25% 2%;
  background-color: transparent;
  border: transparent;
  font-size: 120px;
}

.timeUp {
  margin: 0 25%;
  background-color: transparent;
  border: transparent;
  font-size: 120px;
}

@keyframes TimeUp {
  from {
    font-size: 120px;
  }

  to {
    transform: translateY(-200px);
    font-size: 0;
  }
}

/*
.el-main {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
*/

#jinrishici-sentence {
  font-size: 20px;
  bottom: 20px;
}

.contentUp {
  transform: translateY(-50px);
}

@media (max-width: 780px) {
  .time {
    font-size: 100px;
    width: 45%;
    margin-top: 15%;
  }

  .el-footer {
    padding: 0;
    --el-footer-height: 40px;
  }

  /*
 .footer {

    display: none;
   position: fixed;
   bottom: 30px;

 }
*/
  /*
  #jinrishici-sentence {
    font-size: 10px;
    position: absolute;
    bottom: 0;
  }

  Aside {
    position: fixed;
    top: 0;
    width: 60px;
    height: 10%;
  }
*/

  .contentUp {
    transform: translateY(0);
    width: 100%;
  }
}
</style>
