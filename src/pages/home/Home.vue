<template>
  <el-container>
    <!--  侧边栏-->
    <el-aside direction="vertical">
      <Aside :showContent="showContent"/>
    </el-aside>
    <el-main>
      <!--首页时钟-->
      <Time :class="timeClass" @click="showContent(true)"/>
      <!--搜索框区域-->
      <SearchEngine/>
      <!--内容区域-->
      <el-collapse-transition v-show="isShow" class="content">
        <Content :showContent="showContent"/>
      </el-collapse-transition>
    </el-main>
    <el-footer>
<!--      <div :class="{'footer':true,'sticky':isSticky}">-->
        <!--      <el-button type="primary" link id="jinrishici-sentence">-->
        <!--        命里有时终须有，命里无时梦里有。-->
        <!--      </el-button><br>-->
        <!--备案号-->
        <Approve :noWrap="true"  :class="{'footer':true,'sticky':isSticky}" />
<!--      </div>-->
    </el-footer>
  </el-container>

</template>

<script setup lang="ts">
import {ref} from "vue";
import {ElCollapseTransition} from "element-plus";
import Aside from "@/components/Aside.vue";
import SearchEngine from "@/pages/home/SearchEngine.vue";
import Content from "@/pages/home/Content.vue";
import Approve from "@/components/Approve.vue";
import useResponsive from "@/hooks/useResponsive";

const {isScroll, isPC} = useResponsive()

const isSticky = ref(false)

isPC.value ? isScroll(false) : isScroll()

//内容区是否显示
const isShow = ref(false)
// 切换类名
const timeClass = ref('time')

//显示下方内容区,isShow.value=false不显示,isHide=true代表点击时间时关闭
function showContent(isHide = false) {
  console.log('是否显示内容区,isShow：', isShow.value)
  if (isHide || isShow.value === false) {
    isShow.value = !isShow.value//点击时间时开关，点击侧边栏时只开不关
    if (!isPC.value) isSticky.value = true   //开启底部粘性定位
  }

  if (isShow.value && isPC.value) {
    timeClass.value = 'timeUp'
  } else timeClass.value = 'time'

  if (!isPC.value) {
    isScroll(true) //允许纵向滚动
    if (!isShow.value) setTimeout(() => {
      isSticky.value = false //关闭底部粘性定位
    }, 200)
  }
}

</script>

<style scoped>
Aside {
  position: absolute;
  bottom: 0;
  top: 50px;
  left: 0;
  width: 8%;
  height: 100%;
  z-index: 100;
}

.time {
  margin: 5% 25% 2%;
  background-color: transparent;
  border: transparent;
  font-size: 120px;
}

.timeUp {
  margin: 0 25% 2%;
  background-color: transparent;
  border: transparent;
  font-size: 120px;
}

@keyframes TimeUp {
  from {
    font-size: 120px
  }
  to {
    transform: translateY(-200px);
    font-size: 0
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

.footer {
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0;
  left: 0;
  right: 0;
}

#jinrishici-sentence {
  font-size: 20px;
  bottom: 20px;
}

.sticky {
  position: sticky;
}

.content {
  width: 80%;
  height: 70%;
  margin: 20px auto 0;
  opacity: 0.8;
  /*     min-height: 100%;
          display: grid;
          grid-template-rows: auto 1fr auto;*/
}

.contentUp {
  transform: translateY(-50px);
}

@media (max-width: 980px) {
  .time {
    font-size: 100px;
    width: 45%;
    margin-top: 15%;

  }

  .el-footer {
    padding: 0;
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
  Aside {
    width: 0;
  }

  .content {
    width: 100%;
  }

  .contentUp {
    transform: translateY(0);
    width: 100%;
  }
}

</style>
