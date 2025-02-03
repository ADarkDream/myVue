<template>
  <div ref="reverse1999" class="mainPanel" :style="bgSettings">
    <el-tabs class="tabs" v-model="activePanelIndex">
      <el-tab-pane :name="0">
        <template #label>
          <el-text class="tab-label">
            <el-icon> <Download /> </el-icon>&ensp;以影像之下载
          </el-text>
        </template>
        <!-- <el-scrollbar :height="containerHeight - 60 + 'px'" ref="scrollbar">
                    <Download1999 />
                </el-scrollbar> -->
      </el-tab-pane>
      <el-tab-pane :name="1">
        <template #label>
          <el-text class="tab-label">
            <el-icon> <Document /> </el-icon>&ensp;角色信息
          </el-text>
        </template>
        <!-- <Roles1999 /> -->
      </el-tab-pane>
      <el-tab-pane :name="2">
        <template #label>
          <el-text class="tab-label">
            <el-icon> <Picture /> </el-icon>&ensp;图片信息
          </el-text>
        </template>
        <!-- <Images1999 /> -->
      </el-tab-pane>
      <el-tab-pane :name="3">
        <template #label>
          <el-text class="tab-label">
            <el-icon> <Document /> </el-icon>&ensp;版本信息
          </el-text>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="4">
        <template #label>
          <el-text class="tab-label">
            <el-icon> <Setting /> </el-icon>&ensp;设置
          </el-text>
        </template>
        <MainPanelSettings />
      </el-tab-pane>
      <el-tab-pane :name="5">
        <template #label>
          <el-text class="tab-label">
            <el-icon> <Tickets /> </el-icon>&ensp;备忘
          </el-text>
        </template>
        <div style="text-align: left">
          <h2>待完善：</h2>
          <el-text tag="p">1、七牛云链接后加上?avinfo可以获得音频源数据</el-text>
          <el-text tag="p">
            <el-text type="warning"> 2、歌词界面 </el-text>
            :用第三方库 lyric-parser 进行处理。实现显示歌词、拖动进度条歌词同步滚动、歌词跟随歌曲进度高亮。
          </el-text>
          <el-text tag="p" type="warning">3、收藏歌单</el-text>
          <el-text tag="p" type="warning">4、上传自定义歌曲</el-text>
          <el-text tag="p">5、重构歌曲播放样式</el-text>
          <el-text tag="p">6、加提示：批量添加歌曲询问是否覆盖，删除公开歌单告知私有歌单会一并删除</el-text>
          <el-text tag="p">7、加环境变量，基地址等信息存入环境变量</el-text>
          <el-text tag="p" type="warning">8、歌曲分类搜索</el-text>
          <el-text tag="p" type="warning">9、批量操作功能</el-text>
          <h2>问题：</h2>
          <el-text tag="p">1、播放失败的重试函数待测试是否有效</el-text>
          <el-text tag="p">2、浏览器媒体界面，列表最后一首到第一首会出错，播放时间不归位</el-text>
        </div>
      </el-tab-pane>
      <!-- 使用 keep-alive 缓存页面, slot props 动态渲染路由组件 -->
      <router-view v-slot="{ Component }" v-show="isShowOtherPage">
        <Transition :name="toRight ? 'list' : 'relist'">
          <keep-alive v-if="isKeepAlive">
            <component :is="Component" :style="containerStyle" />
          </keep-alive>
          <component v-else :is="Component" :style="containerStyle" />
        </Transition>
      </router-view>
    </el-tabs>
    <!--新建角色的抽屉-->
    <el-drawer
      v-model="isShowAddRoleDrawer"
      :title="isEdit ? '编辑角色信息' : '添加新角色'"
      :show-close="false"
      direction="btt"
      :append-to-body="true"
      size="40%"
      @close="reSetFormData()"
      :before-close="beforeCloseDrawer"
    >
      <AddRole />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs, defineAsyncComponent } from "vue"
import { Download, Picture, Document, Setting, Tickets } from "@element-plus/icons-vue"
import { useRoute } from "vue-router"
//stores
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { useMainPanelConfigStore } from "@/store/useMainPanelConfigStore"
import { useRolesStore } from "@/store/reverse1999/useRolesStore"
import { useReverse1999Store } from "@/store/reverse1999/useReverse1999Store"
//hooks

//components
const AddRole = defineAsyncComponent(() => import("./components/AddRole.vue"))
import MainPanelSettings from "@/components/MainPanelSettings.vue"
//files

const route = useRoute()
const mainPanelConfigStore = useMainPanelConfigStore()
const responsiveStore = useResponsiveStore()
const rolesStore = useRolesStore()
const reverse1999Store = useReverse1999Store()
//页面背景配置

const { bgSettings } = mainPanelConfigStore
const { containerHeight } = toRefs(responsiveStore)
const { touchstart, positionComputed } = responsiveStore

const { isShowAddRoleDrawer, isEdit } = toRefs(rolesStore)
const { reSetFormData } = rolesStore
const { activePanelIndex, toRight } = toRefs(reverse1999Store)
const { changePanelIndex } = reverse1999Store

const reverse1999 = ref<HTMLDivElement>()

// 判断是否需要缓存当前页面
const isKeepAlive = computed(() => {
  const flag = route.meta?.keepAlive ?? false
  console.log("缓存当前页面：", flag)
  return flag
})

//前四个页面显示子页面，之后的隐藏
const isShowOtherPage = computed(() => [0, 1, 2, 3].includes(activePanelIndex.value))
//子页面高度
const containerStyle = computed(() => ({}))

const beforeCloseDrawer = () => {
  ElMessageBox.confirm("确认关闭面板吗?关闭后未保存的修改会取消。", "Warning", {
    confirmButtonText: "关闭",
    cancelButtonText: "取消",
    type: "warning",
    showClose: false,
  })
    .then(() => {
      isShowAddRoleDrawer.value = false
    })
    .catch(() => {})
}

onMounted(async () => {
  // console.log("route", route);
  const { name } = route
  if (name) {
    changePanelIndex(name || "download")
  }
  // changePanelIndex()
  //如果是移动端，监听左右滑动
  // if (!isPC.value && music.value) {
  //     music.value.addEventListener("touchstart", touchstart, false)
  //     //手指离开屏幕
  //     music.value.addEventListener("touchend", touchend, false)
  // }
})

onUnmounted(() => {
  removeEventListener("touchstart", touchstart)
  removeEventListener("touchend", touchend)
})

//手指离开屏幕
const touchend = (e: TouchEvent) => {
  console.log("离开屏幕")
  // positionComputed(e, activePanelIndex, 0, 4)/
}
</script>
