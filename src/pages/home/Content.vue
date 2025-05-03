<template>
  <div class="contentContainer">
    <div class="title">
      <el-tooltip content="推荐导航网站" placement="bottom">
        <el-button circle :icon="UploadFilled" type="success" @click="changeFlag()" />
      </el-tooltip>
      <el-text style="font-size: 20px" type="primary">{{ activeName }}</el-text>
      <!--      <el-button v-if="false" @click="addAllUrl(localList[num],targetList[num])">批量上传 {{ nameList[num] }}-->
      <!--        网址到数据库-->
      <!--      </el-button>-->
      <el-tooltip content="隐藏，精简模式" placement="bottom">
        <el-button circle :icon="CloseBold" type="danger" @click="showContent" />
      </el-tooltip>
    </div>
    <div class="websites">
      <div v-for="(item, index) in resultList" :key="index" style="margin: 5px">
        <ToolBox :tool-info="item"></ToolBox>
      </div>
    </div>

    <!--上传导航网址-->
    <el-dialog v-model="dialogVisible" :show-close="false" title="推荐导航网站" :width="dialogWidth" append-to="#app">
      <AddUrl />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRefs } from "vue"
import { CloseBold, UploadFilled } from "@element-plus/icons-vue"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useWebsiteStore } from "@/store/home/useWebsiteStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
//hooks

import useWebsite from "@/hooks/home/useWebsite"
//components
import AddUrl from "@/components/AddUrl.vue"
import ToolBox from "@/components/home/toolBox.vue"
//utils
import { emitter } from "@/utils/emitter"

defineProps(["showContent"])
const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const websiteStore = useWebsiteStore()
const { isLogin } = toRefs(userInfoStore)
const { dialogWidth } = toRefs(responsiveStore)

const { getUrlListInfo, getNewList } = useWebsite()

const activeIndex = ref(0) //导航分类的序号
const { cloudList, activeName, localListObj, activeType } = toRefs(websiteStore)

//底部当前呈现的网址数据
const resultList = computed(() => localListObj.value[activeType.value] || [])

//上传导航网站面板的显示与隐藏
const dialogVisible = ref(false)

//用emitter得到Aside组件里面的点击事件传来的值，用于更改导航列表
const handleGetNewList = async (Num: number) => {
  activeIndex.value = Num
  await getNewList(cloudList.value[activeIndex.value].sort)
}
//endregion

//注册切换导航列表的事件
emitter.on("getListNum", handleGetNewList)

//控制该功能登录后使用
function changeFlag() {
  console.log(111)

  console.log(isLogin.value)
  if (isLogin.value) dialogVisible.value = !dialogVisible.value
  else return ElMessage.info("该功能需要登录后使用！")
}

onMounted(async () => {
  await getUrlListInfo()
  if (cloudList.value[activeIndex.value]) await getNewList(cloudList.value[activeIndex.value].sort)
})

onBeforeUnmount(() => {
  emitter.off("getListNum", handleGetNewList)
  console.log("注销了getListNum的emitter监听")
})

//region 批量上传网址到数据库
// function addAllUrl(urlList, tableName) {
//   urlList.forEach(item => {
//     addUrl(item, tableName)
//   })
// }

//上传一条网址数据到数据库
// const addUrl = async (urlInfo, table) => {
//   try {
//     const result = await momo.post('/addUrl',{urlInfo, table})
//     console.log(result)
//     ElMessage.success(result.msg)
//   } catch (error) {
//     console.log('发生错误：')
//     console.dir(error)
//   }
// }
//endregion
</script>
<style scoped>
.contentContainer {
  background-color: rgba(179, 172, 172, 0.5);
  border-radius: 50px;
  padding: 0;
  width: 80%;
  margin: 20px auto 60px;
  opacity: 0.8;
  max-height: calc(100% - 270px);
  display: flex;
  flex-direction: column;
}

.contentContainer .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 30px;
  height: 60px;
  border-bottom: 1px solid rgb(97, 90, 90);
}
.contentContainer .websites {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 30px;
  display: grid;
  flex: 1;
  overflow: scroll;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

@media (max-width: 780px) {
  .contentContainer {
    width: 100%;
    border-radius: 20px;

    .websites {
      padding: 10px;
    }
  }
}
</style>
