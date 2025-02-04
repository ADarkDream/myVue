<template>
  <div>
    <transition-group name="list">
      <template v-for="item in noticeList" :key="item.id">
        <el-button v-if="item.id === activeItemNum" link type="primary" @click="item.fun">{{ item.str }}</el-button>
      </template>
    </transition-group>
    <br />
    <el-button
      link
      tag="a"
      type="info"
      @click="copyText('50011502001039', '备案号', 'https://beian.mps.gov.cn/#/query/webSearch?code=50011502001039')"
    >
      <el-image alt="图片加载失败" src="https://beian.mps.gov.cn/favicon.ico" style="width: 20px" />
      &ensp;渝公网安备50011502001039
    </el-button>
    <el-text v-if="noWrap || isPC" style="margin: 0 1px" type="info">|</el-text>
    <el-button link tag="a" type="info" @click="copyText('渝ICP备2024030473号', '备案号', 'http://beian.miit.gov.cn/')">
      渝ICP备2024030473号
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, toRefs } from "vue"
import { useRouter } from "vue-router"
//stores
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { useNoticeStore } from "@/store/useNoticeStore"
//utils
import titleDiv from "@/utils/titleDiv"
import myFunction from "@/utils/myFunction"

const responsiveStore = useResponsiveStore()
const noticeStore = useNoticeStore()
const { isPC } = toRefs(responsiveStore)
const { activeItemNum } = toRefs(noticeStore)
const { startInterval, stopInterval } = noticeStore
const { copyText } = myFunction
const { showNotice } = titleDiv
const router = useRouter()

//noWrap=true  移动端换行且用 | 隔开，默认为没有竖线隔开
const { noWrap } = defineProps(["noWrap"])
const showContact = () => showNotice({ show_num: 3, active_num: 1 })
const showFeedback = () => showNotice({ show_num: 3, active_num: 2 })
const gotoDownload = () => router.push({ name: "download" })
const gotoChat = () => router.push({ name: "hall" })
const gotoMusic = () => router.push({ name: "music" })

const noticeList = reactive([
  //底部轮播
  {
    id: 0,
    str: "2024 © MoMo All Rights Reserved.",
    fun: showContact,
  },
  {
    id: 1,
    str: "点击前往重返未来1999以影像之",
    fun: gotoDownload,
  },
  {
    id: 2,
    str: "欢迎前往聊天室demo测试",
    fun: gotoChat,
  },
  {
    id: 3,
    str: "欢迎前往音乐播放器测试",
    fun: gotoMusic,
  },
  {
    id: 4,
    str: "如有bug欢迎反馈",
    fun: showFeedback,
  },
])

//开启定时器
onMounted(() => startInterval(noticeList.length))

//注销定时器
onUnmounted(() => stopInterval())
</script>

<style scoped></style>
