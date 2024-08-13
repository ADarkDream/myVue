<template>
  <!--搜索框区域-->
  <div class="searchDiv">
    <!-- 当前的搜索引擎-->
    <el-button class="engine" style="margin-left: 5px">
      <img class="searchEngine thisSearchEngine" :src="searchImg" :alt="engineName" @click="showEngines = !showEngines">&ensp;
    </el-button>
    <template v-if="showEngines">
      <!--    默认的搜索引擎列表-->
      <template class="engines" v-for="item in searchEngines" :key="item.id">
        <el-button class="engine" v-show="engineId!==item.id && item.isShow">
          <img class="searchEngine" :src="item.src" :alt="item.name" @click="changeEngine(item)">
        </el-button>
      </template>
      <!--    自定义的搜索引擎列表-->
      <template class="engines" v-for="item in userEngines" :key="item.id">
        <el-button class="engine" v-show="engineId!==item.id && item.isShow">
          <img class="searchEngine" :src="item.src" :alt="item.name" @click="changeEngine(item)">
        </el-button>
      </template>
    </template>
    <!--    添加自定义搜索引擎-->
    <el-button plain type="primary" class="engine" :icon="More" v-if="showEngines"
               @click="engineOption=!engineOption"/>
    <!--    搜索引擎切换-->
    <el-button class="change" style="margin-left: 0" @click="showEngines = !showEngines" :icon="Sort"/>
    <!--    输入框-->
    <input class="search" type="text" :placeholder="placeholder" v-model.trim="keyword" @keyup.enter="search">

    <el-button class="searchBtn" @click="search" :icon="Search"/>
  </div>
  <!-- 用户更改搜索引擎列表-->
  <el-dialog title="更改搜索引擎列表" :width="dialogWidth" v-model="engineOption" :fullscreen="!isPC">
    <EditEngines :userEngines="userEngines" :engineId="engineId" :getEngineList="getEngineList" :hideList="hideList"
                 :hideUserEngine="hideUserEngine" :closeEngineOption="closeEngineOption"/>
  </el-dialog>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {More, Search, Sort} from "@element-plus/icons-vue";
import emitter from "@/utils/emitter";

import axios from "axios";
import useUserInfo from "@/hooks/useUserInfo";
import useResponsive from "@/hooks/useResponsive";
import {useLocalEnginesStore} from "@/store/useLocalEnginesStore";


import {EngineData} from "@/types/url";
import EditEngines from "@/components/EditEngines.vue";

const {isScroll, isPC, dialogWidth} = useResponsive()
const {isLogin} = useUserInfo()
const {searchEngines} = useLocalEnginesStore()



const placeholder = ref('海内存知己')
// 显示和隐藏
const showEngines = ref(false)
//内容区是否显示
const isShow = ref(false)
// 切换类名
const timeClass = ref('time')


const userEngines = reactive<EngineData[]>(JSON.parse(localStorage.getItem('userEngines') || '[]'))
//当前显示的搜索引擎的信息
const localThisEngine = localStorage.getItem('thisEngine') || '{}'
//当前的搜索引擎，如果本地存储为空，则使用默认的第一个搜索引擎
const thisEngine = reactive<EngineData>(localThisEngine !== '{}' ? JSON.parse(localThisEngine) : searchEngines[0])
const engineId = ref(Number(thisEngine.engineId) || 0)
const engineName = ref(thisEngine.name || searchEngines[engineId.value].name)
const baseUrl = ref<string>(thisEngine.baseUrl || searchEngines[engineId.value].baseUrl)//搜索引擎的主地址
const searchUrl = ref<string>(baseUrl.value + thisEngine.searchUrl || searchEngines[engineId.value].searchUrl!)//搜索引擎的搜索字段
const searchImg = ref(thisEngine.searchImg || searchEngines[engineId.value].src)//搜索引擎的图片
const keyword = ref<string>('')//搜索框输入的内容
const hideList = reactive(JSON.parse(localStorage.getItem('hideList') || '[]'))
const hideUserList = reactive(JSON.parse(localStorage.getItem('hideUserList') || '[]'))//登录用户使用
const hideLocalList = reactive(JSON.parse(localStorage.getItem('hideLocalList') || '[]'))//未用户使用
const searchFlag = ref(localStorage.getItem('searchFlag') !== '0')//控制搜索结果是否在新窗口打开
//删除搜索引擎
const engineOption = ref(false)





const getHitokoto = async () => {
  try {
    const result = await axios.get('https://v2.jinrishici.com/token')
    console.log(result.data.hitokoto)
    placeholder.value = result.data.hitokoto as string

  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
    placeholder.value = '海内存知己'
  }
}


//region 显示内容区
emitter.on('showContent', () => {
  //为侧边栏注册的显示事件，如果点击侧边栏时Content组件未显示，则显示Content
  if (isShow.value === false) showContent()
})

//显示下方内容区,isShow.value=false不显示
function showContent() {
  console.log('是否显示内容区,isShow：', isShow.value)
  isShow.value = !isShow.value
  if (isShow.value && isPC.value) {
    timeClass.value = 'timeUp'
  } else timeClass.value = 'time'
  if (!isPC.value) {
    isShow.value ? isScroll(true) : isScroll(true)
  }
}

//endregion


//搜索框搜索功能
function search() {
  if (keyword.value) {
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
    engineId: item.id,
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
    hideUserList[engine.index!] = {id: engine.id, isShow: engine.isShow}
    localStorage.setItem('hideUserList', JSON.stringify(hideUserList))
  } else {
    hideLocalList[engine.index!] = {id: engine.id, isShow: engine.isShow}
    localStorage.setItem('hideLocalList', JSON.stringify(hideLocalList))
  }
}


//关闭添加搜索引擎界面
const closeEngineOption = () => {
  engineOption.value = false
}


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
    const engineList = JSON.parse(localStorage.getItem('localEngines') || '[]')
    console.log('userEngines', userEngines)
    if (engineList.length !== 0) //如果本地有记录
      userEngines.splice(0, userEngines.length, ...engineList)
    // engineList.forEach((item: EngineData) => {
    //   userEngines.push(item)//将新的数据加入进去
    // })
  }
}


onMounted(async () => {
  await getEngineList()//获取搜索引擎列表
  // getHitokoto()//获取一言

  hideList.forEach((item: EngineData) => {//网页加载，遍历用户设置隐藏默认搜索引擎
    if (item !== null) searchEngines.forEach(engine => {
      if (engine.id === item.id) engine.isShow = item.isShow
    })
  })

  if (isLogin.value && hideUserList.length !== 0) {//网页加载，遍历用户设置隐藏用户自定义的搜索引擎
    hideUserList.forEach((item: EngineData) => {//遍历用户自定义的隐藏列表,将它的id和show状态同步到userEngines列表
      if (item !== null) userEngines.forEach((engine: EngineData) => {
        if (engine.id === item.id) engine.isShow = item.isShow
      })
    })
  } else if (hideLocalList.length !== 0) {//网页加载，遍历用户设置隐藏未登录用户的自定义的搜索引擎
    hideLocalList.forEach((item: EngineData) => {
      if (!!item) userEngines.forEach((engine: EngineData) => {
        if (engine.id === item.id) engine.isShow = item.isShow
      })
    })
  }

})


</script>

<style scoped>
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


@media (max-width: 980px) {
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
}
</style>
