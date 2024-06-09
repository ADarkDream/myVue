<template>
  <!--  时钟区域-->
  <el-button link type="primary" :class="timeClass" shadow="never" @click="showContent">{{ time }}</el-button>
  <!--搜索框区域-->
  <div :class="searchClass">
    <!-- 当前的搜索引擎-->
    <img class="searchEngine thisSearchEngine" :src="searchImg" :alt="engineName">&ensp;
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
    <input class="search" type="text" placeholder="海内存知己" v-model="keyword" @keyup.enter="search">

    <el-button class="searchBtn" @click="search" :icon="Search"/>
  </div>
  <!-- 用户更改搜索引擎列表-->
  <el-dialog title="更改搜索引擎列表" :width="dialogWidth" v-model="engineOption" :fullscreen="!isPC">
    <el-divider>【当前使用的搜索引擎不可隐藏且不在此展示】</el-divider>
    <el-scrollbar height="400">
      <el-divider>默认搜索引擎</el-divider>
      <el-card v-for="item in searchEngines" v-show="item.id!==engineId" :key="item.id" class="engineOption">
        <el-button text><img :src="item.src" alt="" class="searchEngine  ">{{ item.name }}</el-button>
        <el-switch v-model="item.isShow" @click="hideEngine(item)" inline-prompt active-text="显示"
                   inactive-text="隐藏"/>

      </el-card>
      <el-divider>自定义搜索引擎</el-divider>
      <el-card v-for="item in userEngines" v-show="item.id!==engineId" :key="item.id" class="engineOption">
        <el-button text><img :src="item.src" alt="" class="searchEngine  ">{{ item.name }}</el-button>
        <el-space>
          <el-switch v-model="item.isShow" @click="hideUserEngine(item)" inline-prompt active-text="显示"
                     inactive-text="隐藏"/>
          <el-button type="danger" :icon="Delete" @click="deleteEngine(item.id)" circle/>
        </el-space>
      </el-card>
    </el-scrollbar>
    <br>
    <el-button plain type="primary" @click="addEngineFlag=!addEngineFlag">添加自定义搜索引擎</el-button>
    <el-button type="primary" @click="engineOption=!engineOption">确认修改</el-button>
  </el-dialog>

  <!-- 用户添加自定义搜索引擎-->
  <el-dialog v-model="addEngineFlag" title="添加搜索引擎" :width="dialogWidth2" :show-close="false">
    <el-form
        ref="addEngineFormRef"
        status-icon
        :model="addEngineForm"
        label-width="auto"
        label-position="left"
    >
      <!--显示网站图标-->
      <el-card>
        <img :src='src' alt="该地址无法获取默认图标" style="width: 40px;height: 40px"></el-card>
      <!--      网址主要地址-->
      <el-form-item>
        <el-col :span="5">
          <el-form-item prop="protocol">
            <el-select placeholder="https://" v-model="addEngineForm.protocol" default-first-option>
              <el-option label="https://" value="https://"/>
              <el-option label="http://" value="http://"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="18">
          <el-form-item prop="baseUrl" :rules="[ { required: true, message: '主要地址是必需的' }]">
            <el-input v-model="addEngineForm.baseUrl" @blur="checkIco"
                      placeholder="输入网站域名或主要地址(例:www.baidu.com)"/>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!--      网址搜索参数-->
      <el-form-item>
        <el-col :span="5">
          <el-form-item prop="name">
            <el-input v-model="addEngineForm.name" placeholder="命名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="18">
          <el-form-item prop="searchUrl" :rules="[{ required: true, message: '搜索参数是必需的' }]">
            <el-input v-model="addEngineForm.searchUrl" placeholder="输入网站搜索参数(地址栏可见，例:/s?wd=)"/>
          </el-form-item>
        </el-col>
      </el-form-item>

      <div class="btn">
        <el-button @click="addEngineFlag = false;reset(addEngineFormRef)">取消</el-button>
        <el-button type="primary" @click="submit(addEngineFormRef)">添加</el-button>
      </div>
    </el-form>
  </el-dialog>


  <!--内容区域-->
  <el-collapse-transition v-show="isShow" class="content">
    <Content :showContent="showContent" :changeFlag="changeFlag"/>
    <!--  <Content :showContent="showContent" :class="contentClass" v-show="isShow"/>-->
  </el-collapse-transition>

  <!--上传导航网址-->
  <el-dialog v-model="dialogVisible" :show-close="false" title="推荐导航网站" :width="dialogWidth">
    <AddUrl/>
  </el-dialog>

</template>

<script setup lang="ts">
import {onUnmounted, reactive, ref, watch} from "vue";
import {Delete, More, Search, Sort} from "@element-plus/icons-vue";
import emitter from "@/utils/emitter";
import AddUrl from "@/components/AddUrl.vue";
import Content from "@/pages/Content.vue";
import {ElMessage} from "element-plus";
import type {FormInstance} from "element-plus";
import axios from "axios";
import {ElCollapseTransition} from 'element-plus'
import useUserInfo from "@/hooks/useUserInfo";
import useResponsive from "@/hooks/useResponsive";

import ico_baidu from '@/assets/baidu.png';
import ico_bilibili from '@/assets/bilibili.png';
import ico_bing from '@/assets/bing.png';
import ico_google from '@/assets/google.png';
import ico_360 from '@/assets/360.png';
import ico_custom from '@/assets/custom.png';
import {onBeforeRouteLeave} from "vue-router";

const {screenWidth, isPC, dialogWidth, dialogWidth2} = useResponsive()
const {isLogin} = useUserInfo()


//上传导航网站面板的显示与隐藏
let dialogVisible = ref(false)

function changeFlag() {
  console.log(isLogin.value)
  if (isLogin.value) dialogVisible.value = !dialogVisible.value
  else return ElMessage.info('该功能需要登录后使用！')
}

// 显示和隐藏
let showEngines = ref(false)
const isShow = ref(false)
// 切换类名
let timeClass = ref('time')
let searchClass = ref('searchDiv')

//传递到Home，用于判断是否显示主页底部备案号

const {showRecord} = defineProps(['showRecord'])
if (!isPC.value) watch(isShow, (newValue, oldValue) => {
  showRecord(isShow.value)
})

const time = ref()
const timer=ref(null)
changeTime()


//region  首页时钟
function changeTime() {
  let hours = (new Date().getHours()).toString()
  let minutes = (new Date().getMinutes()).toString()
  // let seconds = (new Date().getSeconds()).toString()
  Number(hours) < 10 ? hours = '0' + hours : hours
  Number(minutes) < 10 ? minutes = '0' + minutes : minutes
  // Number(seconds)<10 ? seconds='0'+seconds : seconds
  time.value = `${hours}:${minutes}`
}

//每秒倒计时，刷新时间
 timer.value = setInterval(() => {
  changeTime()
  console.log(111)
}, 1000)

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
  // console.log('是否显示内容区')
  // console.log('isShow' + isShow.value)
  isShow.value = !isShow.value
  if (isShow.value && isPC.value) timeClass.value = 'timeUp'
  else timeClass.value = 'time'
}

//endregion


//定义搜索引擎接口
interface engineData {
  index: number,
  id?: number,
  name: string,
  baseUrl: string,
  searchUrl: string,
  src: string,
  isShow?: boolean,
}


//默认搜索引擎列表
let searchEngines = reactive([
  {
    id: 0,
    name: '百度',
    index: 0,
    src: ico_baidu,
    baseUrl: 'https://www.baidu.com',
    searchUrl: '/s?wd=',
    isShow: true
  },
  {
    id: 1,
    name: '哔哩哔哩',
    index: 1,
    src: ico_bilibili,
    baseUrl: 'https://search.bilibili.com',
    searchUrl: '/all?keyword=',
    isShow: true
  },
  {
    id: 2,
    name: '必应',
    index: 2,
    src: ico_bing,
    baseUrl: 'https://cn.bing.com',
    searchUrl: '/search?q=',
    isShow: true
  },
  {
    id: 3,
    name: '谷歌',
    index: 3,
    src: ico_google,
    baseUrl: 'https://www.google.com',
    searchUrl: '/search?q=',
    isShow: true
  },
  {
    id: 4,
    name: '360',
    index: 4,
    src: ico_360,
    baseUrl: 'https://www.so.com',
    searchUrl: '/s?q=',
    isShow: true
  },
])
//自定义搜索引擎列表
let userEngines = reactive(JSON.parse(localStorage.getItem('userEngines')) || [])

//当前显示的搜索引擎的信息
let thisEngine = reactive(JSON.parse(localStorage.getItem('thisEngine')) || searchEngines[0])
let engineId = ref(Number(thisEngine.engineId) || 0)
let engineName = ref(thisEngine.name || searchEngines[engineId.value].name)
let baseUrl = ref<string>(thisEngine.baseUrl || searchEngines[engineId.value].baseUrl)
let searchUrl = ref<string>(baseUrl.value + thisEngine.searchUrl || searchEngines[engineId.value].searchUrl);
let searchImg = ref(thisEngine.searchImg || searchEngines[engineId.value].src)
let keyword = ref<string>('')
let hideList = reactive(JSON.parse(localStorage.getItem('hideList')) || [])
let hideUserList = reactive(JSON.parse(localStorage.getItem('hideUserList')) || [])
let hideLocalList = reactive(JSON.parse(localStorage.getItem('hideLocalList')) || [])

//网页加载，隐藏默认搜索引擎
hideList.forEach((item: engineData) => {
  if (item !== null) searchEngines.forEach(engine => {
    if (engine.id === item.id) engine.isShow = item.isShow
  })
})

//网页加载，隐藏用户自定义的搜索引擎
if (isLogin.value) {
  hideUserList.forEach((item: engineData) => {
    if (item !== null) userEngines.forEach((engine: engineData) => {
      if (engine.id === item.id) engine.isShow = item.isShow
    })
  })
} else {
  hideLocalList.forEach((item: engineData) => {
    if (item !== null) userEngines.forEach((engine: engineData) => {
      if (engine.id === item.id) engine.isShow = item.isShow
    })
  })
}

//搜索框搜索功能
function search() {
  //当前页面打开
  // if (keyword.value.trim() === '') location.href = baseUrl.value
  // else location.href = searchUrl.value + keyword.value
  //新窗口打开网页
  console.log(searchUrl.value + keyword.value,)
  if (keyword.value.trim() === '') window.open(baseUrl.value, '_blank')
  else window.open(searchUrl.value + keyword.value, '_blank')
  // console.log(searchUrl.value + keyword.value)
}

//切换搜索引擎
function changeEngine(item: engineData) {
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

//隐藏默认搜索引擎
function hideEngine(engine: engineData) {
  hideList[engine.index] = {id: engine.id, isShow: engine.isShow}
  localStorage.setItem('hideList', JSON.stringify(hideList))
}

//隐藏用户自定义搜索引擎
function hideUserEngine(engine: engineData) {
  if (isLogin.value) {
    hideUserList[engine.index] = {id: engine.id, isShow: engine.isShow}
    localStorage.setItem('hideUserList', JSON.stringify(hideUserList))
  } else {
    hideLocalList[engine.index] = {id: engine.id, isShow: engine.isShow}
    localStorage.setItem('hideLocalList', JSON.stringify(hideLocalList))
  }

}

//region 添加搜索引擎
let addEngineFlag = ref(false)

//新加搜索引擎的图标
let src = ref(ico_custom)

const addEngineFormRef = ref<FormInstance>()
const addEngineForm = reactive({
  name: '',
  protocol: 'https://',
  baseUrl: '',
  searchUrl: '',
})


//展示网址图片
function checkIco() {
  if (addEngineForm.baseUrl.trim() !== '') src.value = 'https://quaint-tomato-hare.faviconkit.com/' + addEngineForm.baseUrl
  else src.value = ico_custom
}

//重置添加导航网站的表单
const reset = (val: FormInstance | undefined) => {
  if (!val) return
  val.resetFields()
}

//验证添加导航网站的表单
const submit = (val: FormInstance | undefined) => {
  //数据为空返回
  if (!val) return
  //数据验证通过
  val.validate((valid) => {
    if (valid) {
      addEngine()
      reset(addEngineFormRef.value)
    } else {
      ElMessage.error('添加失败')
      return false
    }
  })
}

//添加搜索引擎
function addEngine() {
  const data = <engineData>{
    index: userEngines.length,
    name: addEngineForm.name,
    baseUrl: addEngineForm.protocol + addEngineForm.baseUrl,
    searchUrl: addEngineForm.searchUrl,
    src: src.value
  }
  if (isLogin.value) {
    axios({
      url: '/addEngine',
      method: 'post',
      data
    }).then(result => {
      // console.log(result)
      const {msg} = result.data
      ElMessage.success(msg)
      getEngineList()
      addEngineFlag.value = false
      // location.reload()
    }).catch(error => {
      console.dir('发生错误：')
      console.dir(error)
      //ElMessage.error('发生错误：' + error.message)
    })
  } else {
    let localEngines = JSON.parse(localStorage.getItem('localEngines')) || []
    data.isShow = true
    data.id = Date.now()
    localEngines.push(data)
    localStorage.setItem('localEngines', JSON.stringify(localEngines))
    addEngineFlag.value = false
    getEngineList()
    ElMessage.success('添加搜索引擎到本地成功')
  }
}

//endregion

getEngineList()

//获取自定义搜索引擎列表
function getEngineList() {
  //如果登录了，就获取数据库中的搜索引擎
  if (isLogin.value) {
    axios({
      url: '/getEngines',
    }).then(result => {
      // console.log(result)
      let {engineList} = result.data
      userEngines.splice(0, userEngines.length)
      engineList = engineList.map((item: engineData) => {
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
    engineList.forEach((item: engineData) => {
      userEngines.push(item)//将新的数据加入进去
    })
  }
}

//删除搜索引擎（差未登录）
let engineOption = ref(false)

function deleteEngine(id: number) {

  if (isLogin.value) {
    axios({
      url: '/deleteEngine',
      method: 'delete',
      params: {id}
    }).then(result => {
      // console.log(result)
      const {msg} = result.data
      const newEngines = userEngines.filter((item: engineData) => item.id !== id)
      userEngines.splice(0, userEngines.length)
      newEngines.forEach((item: engineData) => {
        userEngines.push(item)//将新的数据加入进去
      })
      localStorage.setItem('userEngines', JSON.stringify(userEngines))
      // getEngineList()
      ElMessage.success(msg)
    }).catch(error => {
      console.dir('发生错误：')
      console.dir(error)
      //ElMessage.error('发生错误：' + error.message)
    })
  } else {
    //如果未登录，就删除本地存储的搜索引擎
    let engineList = JSON.parse(localStorage.getItem('localEngines')) || []
    //过滤掉要删除的搜索引擎
    engineList = engineList.filter((item: engineData) => item.id !== id)
    //将过滤(删除)结果存储到engineList
    localStorage.setItem('localEngines', JSON.stringify(engineList))
    //清空自定义搜索引擎列表userEngines
    userEngines.splice(0, userEngines.length)
    //如果本地自定义列表不为空，则更新自定义搜索引擎列表userEngines
    if (engineList.length !== 0) engineList.forEach((item: engineData) => userEngines.push(item))
  }
}

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

.searchDivUp {
  transform: translateY(-150%);
  margin: 0 30%;
  animation: ease 0.8s;
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


.engineOption {
  display: inline-block;
  justify-content: flex-start;
  width: 45%;
  height: 30%;
  padding: 0;
}


.addEngine {
  width: 70px;
  height: 70px;
}

.content {
  width: 80%;
  height: 70%;
  margin: 2% auto;
  border-radius: 50px;
  opacity: 0.8;
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
    margin: 10% auto;
    padding: 0;
    width: 80%;
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

  .searchDivUp {
    transform: translateY(-15%);
    animation: ease 0.8s;
    height: 20%;
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