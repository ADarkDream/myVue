<template>
  <el-scrollbar :height="isPC ? '400' : ''">
    <el-switch v-model="searchFlag" @click="changeSearchFlag()" active-text="在新窗口打开搜索结果" inactive-text="在当前页打开搜索结果" />
    <el-divider>默认搜索引擎</el-divider>
    <el-card v-for="item in searchEngines" v-show="item.id !== engineId" :key="item.id" class="engineOption">
      <el-button text><img :src="item.src" alt="" class="searchEngine  ">{{ item.name }}</el-button>
      <el-switch v-model="item.isShow" @click="hideEngine(item)" inline-prompt active-text="显示" inactive-text="隐藏" />
    </el-card>
    <el-divider>自定义搜索引擎</el-divider>
    <el-card v-for="item in userEngines" v-show="item.id !== engineId" :key="item.id" class="engineOption">
      <el-button text><img :src="item.src" alt="" class="searchEngine  ">{{ item.name }}</el-button>
      <el-space>
        <el-switch v-model="item.isShow" @click="hideUserEngine(item)" inline-prompt active-text="显示"
          inactive-text="隐藏" />
        <el-button type="danger" :icon="Delete" :size="elSize" @click="deleteEngine(item.id)" circle />
      </el-space>
    </el-card>
  </el-scrollbar>
  <br>
  <el-button plain type="primary" @click="addEngineFlag = !addEngineFlag">添加自定义搜索引擎</el-button>
  <el-button type="primary" @click="closeEngineOption">确认修改</el-button>

  <!-- 用户添加或上传自定义搜索引擎-->
  <el-dialog v-model="addEngineFlag" title="添加搜索引擎" :width="dialogWidth2" :show-close="false">
    <AddSearchEngine :getEngineList="getEngineList" :closeDialog="closeDialog" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
//stores
import { useLocalEnginesStore } from "@/store/useLocalEnginesStore";
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
//components
import AddSearchEngine from "@/components/AddSearchEngine.vue";
//types
import { EngineData } from "@/types/url";


const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const { isLogin } = toRefs(userInfoStore)
const { dialogWidth2, elSize, isPC } = toRefs(responsiveStore)


const {
  userEngines,
  engineId,
  getEngineList,
  hideList,
  hideUserEngine,
  closeEngineOption
} = defineProps(['userEngines', 'engineId', 'getEngineList', 'hideList', 'hideUserEngine', 'closeEngineOption'])

const { searchEngines } = useLocalEnginesStore()

const searchFlag = ref(localStorage.getItem('searchFlag') !== '0')//控制搜索结果是否在新窗口打开
const changeSearchFlag = () => {
  // searchFlag.value = !searchFlag.value
  const value = searchFlag.value ? '1' : '0'
  console.log(searchFlag.value, value)
  localStorage.setItem('searchFlag', value)
}

//显示添加搜索引擎界面的标志
const addEngineFlag = ref(false)

//删除搜索引擎
function deleteEngine(id: number) {
  if (isLogin.value) {
    axios({
      url: '/deleteEngine',
      method: 'delete',
      params: { id }
    }).then(result => {
      // console.log(result)
      const { msg } = result.data
      const newEngines = userEngines.filter((item: EngineData) => item.id !== id)
      userEngines.splice(0, userEngines.length)
      newEngines.forEach((item: EngineData) => {
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
    let engineList = JSON.parse(localStorage.getItem('localEngines') || '[]')
    //过滤掉要删除的搜索引擎
    engineList = engineList.filter((item: EngineData) => item.id !== id)
    //将过滤(删除)结果存储到engineList
    localStorage.setItem('localEngines', JSON.stringify(engineList))
    //清空自定义搜索引擎列表userEngines
    userEngines.splice(0, userEngines.length)
    //如果本地自定义列表不为空，则更新自定义搜索引擎列表userEngines
    if (engineList.length !== 0) engineList.forEach((item: EngineData) => userEngines.push(item))
  }
}


//隐藏默认搜索引擎
function hideEngine(engine: EngineData) {
  hideList[engine.index!] = { id: engine.id, isShow: engine.isShow }
  console.log(hideList)
  localStorage.setItem('hideList', JSON.stringify(hideList))
}


//关闭添加搜索引擎界面
const closeDialog = () => {
  addEngineFlag.value = false
}
</script>

<style scoped>
.searchEngine {
  height: 40px;
  width: 40px;
}

.engineOption {
  display: inline-block;
  justify-content: flex-start;
  width: 45%;
  height: 30%;
  padding: 0;
}

@media (max-width: 780px) {
  .searchEngine {
    height: 25px;
    width: 25px;
  }
}
</style>
