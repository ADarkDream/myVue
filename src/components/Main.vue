<template>
  <!--  时钟区域-->
  <el-button link type="primary" :class="timeClass" shadow="never" @click="showContent">{{ time }}</el-button>
  <!--搜索框区域-->
  <div class="searchDiv">
    <!-- 当前的搜索引擎-->
    <img class="searchEngine thisSearchEngine" :src="searchImg" :alt="engineName" @click="showEngines = !showEngines">&ensp;
    <!--    默认的搜索引擎列表-->
    <template class="engines" v-for="item in searchEngines" v-if="showEngines" :key="item.id">
      <el-button class="engine" v-show="Number(engineId)!==item.id && item.isShow">
        <img class="searchEngine" :src="item.src" :alt="item.name" @click="changeEngine(item)">
      </el-button>
    </template>
    <!--    自定义的搜索引擎列表-->
    <template class="engines" v-for="item in userEngines" v-if="showEngines" :key="item.id">
      <el-button class="engine" v-show="Number(engineId)!==item.id && item.isShow">
        <img class="searchEngine" :src="item.src" :alt="item.name" @click="changeEngine(item)">
      </el-button>
    </template>
    <!--    添加自定义搜索引擎-->
    <el-button plain type="primary" class="engine" :icon="More" v-if="showEngines"
               @click="engineOption=!engineOption"/>
    <!--        <el-button plain type="primary" class="engine" :icon="More" v-if="showEngines" @click="addEngineFlag=!addEngineFlag"/>-->
    <!--    搜索引擎切换-->
    <el-button class="change" @click="showEngines = !showEngines" :icon="Sort"/>
    <!--    输入框-->
    <input class="search" type="text" placeholder="海内存知己" v-model.trim="keyword" @keyup.enter="search">

    <el-button class="searchBtn" @click="search" :icon="Search"/>
  </div>


  <!--内容区域-->
  <el-collapse-transition v-show="isShow" class="content">
    <Content :showContent="showContent" :changeFlag="changeFlag"/>
  </el-collapse-transition>

  <!--上传导航网址-->
  <el-dialog v-model="dialogVisible" :show-close="false" title="推荐导航网站" :width="dialogWidth">
    <AddUrl/>
  </el-dialog>

  <!-- 用户更改搜索引擎列表-->
  <el-dialog title="更改搜索引擎列表" :width="dialogWidth" v-model="engineOption" :fullscreen="!isPC">
    <EditEngines :userEngines="userEngines" :engineId="engineId" :getEngineList="getEngineList" :hideList="hideList"
                 :hideUserEngine="hideUserEngine" :closeEngineOption="closeEngineOption"/>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {More, Search, Sort} from "@element-plus/icons-vue";
import emitter from "@/utils/emitter";
import AddUrl from "@/components/AddUrl.vue";
import Content from "@/pages/Content.vue";
import EditEngines from "@/components/EditEngines.vue";
import {ElMessage} from "element-plus";
import axios from "axios";
import {ElCollapseTransition} from 'element-plus'
import useUserInfo from "@/hooks/useUserInfo";
import useResponsive from "@/hooks/useResponsive";
import {useLocalEnginesStore} from "@/store/localEngines";
import {onBeforeRouteLeave} from "vue-router";

import {EngineData} from "@/types/url";

const {isScroll, isPC, dialogWidth} = useResponsive()
const {isLogin} = useUserInfo()
const {searchEngines} = reactive(useLocalEnginesStore())

//上传导航网站面板的显示与隐藏
let dialogVisible = ref(false)

function changeFlag() {
  console.log(isLogin.value)
  if (isLogin.value) dialogVisible.value = !dialogVisible.value
  else return ElMessage.info('该功能需要登录后使用！')
}

// 显示和隐藏
const showEngines = ref(false)
const isShow = ref(false)//内容区是否显示
// 切换类名
const timeClass = ref('time')


//传递到Home，用于判断是否显示主页底部备案号

const {showRecord} = defineProps(['showRecord'])
if (!isPC.value) watch(isShow, (newValue, oldValue) => {
  showRecord(isShow.value)
})

const time = ref()
const timer = ref(null)
changeTime()


//region  首页时钟
function changeTime() {
  let hours = (new Date().getHours()).toString()
  let minutes = (new Date().getMinutes()).toString()
  // let seconds = (new Date().getSeconds()).toString()//显示秒
  Number(hours) < 10 ? hours = '0' + hours : hours
  Number(minutes) < 10 ? minutes = '0' + minutes : minutes
  // Number(seconds)<10 ? seconds='0'+seconds : seconds
  time.value = `${hours}:${minutes}`
  // time.value = `${hours}:${minutes}:${seconds}`
}

//每秒倒计时，刷新时间
timer.value = setInterval(() => changeTime(), 1000)

onBeforeRouteLeave(() => {
  console.log('首页时钟定时器已清除')
  clearInterval(timer.value)
})
//endregion


//region 显示内容区
emitter.on('showContent', () => {
  //为侧边栏注册的显示事件，如果点击侧边栏时Content组件未显示，则显示Content
  if (isShow.value === false) showContent()
})

//显示下方内容区,isShow.value=false不显示
function showContent() {
  console.log('是否显示内容区,isShow：' , isShow.value)
  isShow.value = !isShow.value
  if (isShow.value && isPC.value) {
    timeClass.value = 'timeUp'
  } else timeClass.value = 'time'
  if (!isPC.value) {
    isShow.value? isScroll(true) :isScroll(true)
  }
}

//endregion


const userEngines = reactive(JSON.parse(localStorage.getItem('userEngines')) || [])

//当前显示的搜索引擎的信息
const thisEngine = reactive(JSON.parse(localStorage.getItem('thisEngine')) || searchEngines[0])
const engineId = ref(Number(thisEngine.engineId) || 0)
const engineName = ref(thisEngine.name || searchEngines[engineId.value].name)
const baseUrl = ref<string>(thisEngine.baseUrl || searchEngines[engineId.value].baseUrl)//搜索引擎的主地址
const searchUrl = ref<string>(baseUrl.value + thisEngine.searchUrl || searchEngines[engineId.value].searchUrl)//搜索引擎的搜索字段
const searchImg = ref(thisEngine.searchImg || searchEngines[engineId.value].src)//搜索引擎的图片
const keyword = ref<string>('')//搜索框输入的内容
const hideList = reactive(JSON.parse(localStorage.getItem('hideList')) || [])
const hideUserList = reactive(JSON.parse(localStorage.getItem('hideUserList')) || [])//登录用户使用
const hideLocalList = reactive(JSON.parse(localStorage.getItem('hideLocalList')) || [])//未用户使用

//搜索框搜索功能
function search() {
  const searchFlag = ref(localStorage.getItem('searchFlag') !== '0')//控制搜索结果是否在新窗口打开
  if (!!keyword.value) {
    const resultUrl = searchUrl.value + keyword.value
    console.log('即将前往：', searchFlag.value ? '新窗口' : '本页面', resultUrl)
    //在窗口打开搜索结果
    searchFlag.value ? window.open(resultUrl, '_blank') : location.href = resultUrl
  } else {//在当前页打开搜索结果
    searchFlag.value ? window.open(baseUrl.value, '_blank') : location.href = baseUrl.value
  }

}

//切换搜索引擎
function changeEngine(item: EngineData) {
  //当前引擎的信息
  const engine = {
    engineId: item.id.toString(),
    name: item.name,
    baseUrl: item.baseUrl,
    searchUrl: item.searchUrl,
    searchImg: item.src
  }
  //存储当前引擎的信息并修改
  localStorage.setItem('thisEngine', JSON.stringify(engine))
  engineId.value = item.id
  engineName.value = item.name
  baseUrl.value = item.baseUrl
  searchUrl.value = item.baseUrl + item.searchUrl
  searchImg.value = item.src
  showEngines.value = !showEngines
}

//隐藏用户自定义搜索引擎
function hideUserEngine(engine: EngineData) {
  if (isLogin.value) {
    hideUserList[engine.index] = {id: engine.id, isShow: engine.isShow}
    localStorage.setItem('hideUserList', JSON.stringify(hideUserList))
  } else {
    hideLocalList[engine.index] = {id: engine.id, isShow: engine.isShow}
    localStorage.setItem('hideLocalList', JSON.stringify(hideLocalList))
  }

}


//关闭添加搜索引擎界面
const closeEngineOption = () => {
  engineOption.value = false
}

onMounted(async () => {
  await getEngineList()//获取搜索引擎列表

  hideList.forEach((item: EngineData) => {//网页加载，隐藏默认搜索引擎
    if (item !== null) searchEngines.forEach(engine => {
      if (engine.id === item.id) engine.isShow = item.isShow
    })
  })

  if (isLogin.value && hideUserList.length !== 0) {//网页加载，隐藏用户自定义的搜索引擎
    hideUserList.forEach((item: EngineData) => {//遍历用户自定义的隐藏列表,将它的id和show状态同步到userEngines列表
      if (item !== null) userEngines.forEach((engine: EngineData) => {
        if (engine.id === item.id) engine.isShow = item.isShow
      })
    })
  } else {//未登录
    hideLocalList.forEach((item: EngineData) => {
      if (!!item) userEngines.forEach((engine: EngineData) => {
        if (engine.id === item.id) engine.isShow = item.isShow
      })
    })
  }

})

//获取自定义搜索引擎列表
async function getEngineList() {
  //如果登录了，就获取数据库中的搜索引擎
  if (isLogin.value) {
    await axios({
      url: '/getEngines',
    }).then(result => {
      // console.log(result)
      let {engineList} = result.data
      userEngines.splice(0, userEngines.length)
      engineList = engineList.map((item: EngineData) => {
        item.isShow = true
        userEngines.push(item)//将新的数据加入进去
        return item
      })
      localStorage.setItem('userEngines', JSON.stringify(engineList))

    }).catch(error => {
      console.dir('发生错误：')
      console.dir(error)
      //ElMessage.error('发生错误：' + error.message)
    })
  } else {
    //如果未登录，就获取本地存储的搜索引擎
    const engineList = JSON.parse(localStorage.getItem('localEngines')) || []

    userEngines.splice(0, userEngines.length)
    engineList.forEach((item: EngineData) => {
      userEngines.push(item)//将新的数据加入进去
    })
  }
}

//删除搜索引擎
const engineOption = ref(false)


</script>

<style scoped>
.time {
  margin: 5% 25% 2%;
  background-color: transparent;
  border: transparent;
  font-size: 120px;
}

/*

.time:hover {
  animation: timeRotate 1s linear 1;
}

@keyframes timeRotate {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}
*/
.timeUp {
  margin: 0 25% 2%;
  background-color: transparent;
  border: transparent;
  font-size: 120px;
  /*
  margin: 5% auto 2%;
  background-color: transparent;
  border: transparent;
  font-size: 0;
  animation: 0.8s ease TimeUp;
  */
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


.searchDiv {
  position: relative;
  margin: 0 30%;
  padding: 0;
  text-align: center;
  display: flex;
  align-items: center;
  background-color: white;
  backdrop-filter: blur(7px);
  border: white 2px solid;
  border-radius: 25px;
  opacity: 0.7;
}


.engines {
  /* position: absolute;
  */
  border: transparent;
  display: flex;
  justify-content: flex-start;

  top: 60px;
  height: 45px;
  background-color: transparent;
}

.engine {
  height: 40px;
  width: 40px;
  margin-left: -5px;
  background-color: transparent;
  border: transparent;
}

img {
  margin: 0;
}

.searchEngine {
  height: 40px;
  width: 40px;
}

.thisSearchEngine {
  margin-left: 5px;
}

.change {
  height: 50px;
  width: 10px;
  border: transparent;
}


.search {
  width: 100%;
  height: 5%;
  font-size: 23px;
  background-color: transparent;
  outline: none;
  border: transparent;
  color: black;
  font-family: 华文楷体, serif;

}


.searchBtn {
  float: right;
  width: 7%;
  height: 50px;
  border-radius: 0 25px 25px 0;
  background-color: transparent;
  border: none;
  margin: 0;
}


.content {
  width: 80%;
  height: 70%;
  margin: 20px auto 0;
  border-radius: 50px;
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

  .searchDiv {
    margin: 0 auto;
    padding: 0;
    width: 90%;
  }

  .searchEngine {
    width: 20px;
    height: 20px;
  }

  .engine {
    padding: 0;
  }

  .search {
    font-size: 16px;
    height: 15%;
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