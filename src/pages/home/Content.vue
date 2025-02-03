<template>
  <div>
    <el-card class="content">
      <div class="title">
        <el-tooltip content="推荐导航网站" placement="bottom">
          <el-button type="success" circle @click="changeFlag" :icon="UploadFilled" />
        </el-tooltip>
        <el-text type="primary" style="font-size: 20px">{{ sortName }}</el-text>
        <!--      <el-button v-if="false" @click="addAllUrl(localList[num],targetList[num])">批量上传 {{ nameList[num] }}-->
        <!--        网址到数据库-->
        <!--      </el-button>-->
        <el-tooltip content="隐藏，精简模式" placement="bottom">
          <el-button type="danger" circle @click="showContent" :icon="CloseBold" />
        </el-tooltip>
      </div>
      <el-divider />
      <div class="mainContent">
        <!--网址显示区域-->
        <el-card class="cards" shadow="hover" v-for="item in resultList">
          <el-button plain link
            ><img class="urlImg" :src="item.img" alt="" />
            <el-link :href="item.url" type="primary" :underline="false" target="_blank"> {{ item.name }}</el-link>
          </el-button>
          <template #footer>{{ item.detail }}</template>
        </el-card>
      </div>
    </el-card>
    <!--上传导航网址-->
    <el-dialog v-model="dialogVisible" style="opacity: 1" :show-close="false" title="推荐导航网站" :width="dialogWidth">
      <AddUrl />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, toRefs } from "vue"
import { CloseBold, UploadFilled } from "@element-plus/icons-vue"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
//hooks
import { useResponsiveStore } from "@/store/useResponsiveStore"
//components
import AddUrl from "@/components/AddUrl.vue"
//utils
import { emitter } from "@/utils/emitter"
//types
import { NavigationObj, Navigation, WebsiteInfoItem } from "@/types/url"
//apis
import { api_get_url_list, api_get_url_list_info } from "@/apis/home/content"

defineProps(["showContent"])
const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const { isLogin } = toRefs(userInfoStore)
const { dialogWidth } = toRefs(responsiveStore)

const activeIndex = ref<number>(0) //导航分类的序号
const sortName = ref<string>("") //导航分类标题
//查询到的数据存储到本地
const localListObj = reactive<NavigationObj>(JSON.parse(localStorage.getItem("localListObj") || "{}")) //从本地获取
//查询到的数据存储到本地
const localList = reactive<WebsiteInfoItem[]>(JSON.parse(localStorage.getItem("localList") || "[]")) //从本地获取
const cloudList = reactive<WebsiteInfoItem[]>(JSON.parse(sessionStorage.getItem("cloudList") || "[]")) //云端最新的列表
//底部当前呈现的网址数据
const resultList = reactive<Navigation[]>([])

//上传导航网站面板的显示与隐藏
const dialogVisible = ref(false)

//region本地数据切换逻辑

//获取导航分类信息
const getUrlListInfo = async () => {
  try {
    const result = await api_get_url_list_info()
    const { code, msg, data } = result
    if (code !== 200 || !data) return ElMessage.error(msg)
    console.log("getUrlListInfo", result)

    cloudList.splice(0, cloudList.length, ...data!)
    sessionStorage.setItem("cloudList", JSON.stringify(cloudList))
    let isChangeFlag = localList.length === 0 //如果不存在本地列表，则直接修改
    console.log("localList", localList)
    if (!isChangeFlag)
      //本地列表存在，则检查是否是最新数据
      //遍历本地导航信息是否为最新，不为最新则删除localListObj中对应的键
      localList.forEach(item => {
        // 在cloudList中查找匹配的infoItem,返回的是数组
        const thisItem = cloudList.filter(infoItem => item.sort === infoItem.sort && item.updated_time === infoItem.updated_time) //类型一致但时间相等，不修改
        if (item.sort === "tool") console.log(item, thisItem)
        if (thisItem.length === 0) {
          // thisItem中无结果，则表示未找到或找不到一致的,删除localListObj中对应的键(导航分类)
          delete localListObj[item.sort]
          console.log("导航分类已更新", item.sort)
          isChangeFlag = true
        }
      })
    //本地列表不存在或被修改，更新本地列表
    if (isChangeFlag) {
      localStorage.setItem("localListObj", JSON.stringify(localListObj))
      localStorage.setItem("localList", JSON.stringify(cloudList))
      console.log("本地导航列表已更新")
    }
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//获取新一页分类的导航数据
const getNewList = async (sort: string) => {
  try {
    //如果本地localListObj有对应的导航信息，则直接加载
    if (!!localListObj[sort]) {
      sortName.value = localList[activeIndex.value].name //修改分类的标题名
      console.log("正在使用本地缓存的导航数据", sort)
      return resultList.splice(0, resultList.length, ...localListObj[sort])
    }
    const result = await api_get_url_list(sort)
    console.log("getNewList", result)

    const { code, msg, data } = result
    if (code !== 200 || !data) return ElMessage.error(msg)

    resultList.splice(0, resultList.length, ...data!) //显示在页面上
    localListObj[sort] = data //将本分类导航加入到localListObj
    localList[activeIndex.value] = cloudList[activeIndex.value] //将本分类导航的信息加入到localList
    sortName.value = localList[activeIndex.value].name //修改分类的标题名
    //存入本地
    localStorage.setItem("localList", JSON.stringify(localList))
    localStorage.setItem("localListObj", JSON.stringify(localListObj))
  } catch (error) {
    console.log("调用getNewList函数时捕获到错误:")
    console.error(error)
    ElMessage.error("云端数据获取失败")
  }
}

//用emitter得到Aside组件里面的点击事件传来的值，用于更改导航列表
const handleGetNewList = async (Num: number) => {
  activeIndex.value = Num
  await getNewList(cloudList[activeIndex.value].sort)
}
//endregion

//注册切换导航列表的事件
emitter.on("getListNum", handleGetNewList)

//控制该功能登录后使用
function changeFlag() {
  console.log(isLogin.value)
  if (isLogin.value) dialogVisible.value = !dialogVisible.value
  else return ElMessage.info("该功能需要登录后使用！")
}

onMounted(async () => {
  if (cloudList.length === 0 || localList.length === 0) await getUrlListInfo()
  if (cloudList[activeIndex.value]) await getNewList(cloudList[activeIndex.value].sort)
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
.content {
  border-radius: 50px;
  padding: 0;
}

.title {
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
}

.mainContent {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  align-content: flex-start;
}

.cards {
  border-radius: 5px;
  width: 20%;
  height: 300px;
  flex-shrink: 2;
}

.cards:hover {
  flex-shrink: 0;
  flex-grow: 2;
  height: 300px;
}

.urlImg {
  margin-right: 5px;
  width: 15px;
}

@media (max-width: 780px) {
  .mainContent {
    display: block;
    justify-content: space-between;
    flex-flow: wrap;
    padding: 0;
  }

  .cards {
    display: inline-block;
    height: 100px;
    width: 45%;
    margin: 0 auto;
    font-size: 12px;
  }

  .cards:hover {
    height: 100px;
    font-size: 12px;
    width: 90%;
    transition: initial 0.5s;
  }

  .title {
    margin: 0 20px;
  }
}
</style>
