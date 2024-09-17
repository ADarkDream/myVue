<template>
  <div>
    <div>
            <transition-group name="list">
        <template v-for="item in noticeList" :key="item.id">
          <el-button v-if="item.id===activeItemNum" link type="primary" @click="item.fun">{{ item.str }}</el-button>
        </template>
      </transition-group> <br>
      <el-button link tag="a" type="info"
                 @click="copyText('50011502001039','备案号','https://beian.mps.gov.cn/#/query/webSearch?code=50011502001039')">
        <el-image src="https://beian.mps.gov.cn/favicon.ico" style="width: 20px" alt="图片加载失败"/>
        &ensp;渝公网安备50011502001039
      </el-button>
      <el-text type="info" v-if="noWrap || isPC" style="margin: 0 1px">|</el-text>
      <el-button link tag="a" type="info"
                 @click="copyText('渝ICP备2024030473号','备案号','http://beian.miit.gov.cn/')">
        渝ICP备2024030473号
      </el-button>


    </div>
  </div>
</template>

<script setup lang="ts">
import useResponsive from "@/hooks/useResponsive";
import useFunction from "@/hooks/useFunction";
import {emitter} from "@/utils/emitter";
import {onUnmounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";

const {isPC} = useResponsive()
const {copyText} = useFunction()
const router = useRouter()

//noWrap=true  移动端换行且用 | 隔开，默认为没有竖线隔开
const {noWrap} = defineProps(['noWrap'])
const showContact = () => emitter.emit('showNotice', {showNum: '3', activeNum: '1'})
const showFeedback = () => emitter.emit('showNotice', {showNum: '3', activeNum: '2'})
const gotoDownload = () => router.push({name: 'download'})
const gotoChat = () => router.push({name: 'hall'})
const activeItemNum = ref(0)//当前展示的文本序号
const noticeList = reactive([//底部轮播
  {
    id: 0,
    str: '2024 © MoMo All Rights Reserved.',
    fun: showContact
  }, {
    id: 1,
    str: '点击前往重返未来1999以影像之',
    fun: gotoDownload
  }, {
    id: 2,
    str: '欢迎前往聊天室demo测试',
    fun: gotoChat
  }, {
    id: 3,
    str: '如有bug欢迎反馈',
    fun: showFeedback
  },
])
const length = noticeList.length
const timer = setInterval(() => {
  activeItemNum.value++
  if (activeItemNum.value >= length) activeItemNum.value = 0
  console.log('Approve当前显示的消息序号：',activeItemNum.value)
}, 4000)

//注销定时器
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>
