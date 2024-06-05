<template>
  <el-card class="content">
    <div class="title">
      <el-tooltip content="推荐导航网站" placement="right">
        <el-button class="refresh" type="success" circle @click="changeFlag" :icon="UploadFilled"/>
      </el-tooltip>
      <el-button link type="primary" style="font-size: 20px">
        {{ nameList[num] }}[{{ listType }}]
      </el-button>
      <el-button v-if="false" @click="addAllUrl(localList[num],targetList[num])">批量上传 {{ nameList[num] }}
        网址到数据库
      </el-button>
      <el-tooltip content="隐藏，精简模式" placement="right">
        <el-button type="danger" circle @click="showContent" :icon="CloseBold"/>
      </el-tooltip>
    </div>
    <el-divider/>
    <div class="mainContent">
      <!--网址显示区域-->
      <el-card class="cards" shadow="hover" v-for="item in resultList">
        <el-button plain link><img class="urlImg" :src="item.img" alt="">
          <el-link :href="item.url" type="primary" :underline="false" target="_blank">{{ item.name }}</el-link>
        </el-button>
        <template #footer>{{ item.detail }}</template>
      </el-card>
    </div>

  </el-card>
</template>

<script setup lang="ts">
import useServerUrl from "@/hooks/useServerUrlData";
import {reactive, ref} from "vue";
import {CloseBold, Refresh, UploadFilled} from "@element-plus/icons-vue";
import {useUrlStore} from "@/store/localUrlData";

import axios from "axios";
import {ElMessage} from "element-plus";
import emitter from "@/utils/emitter";

// import {useRoute} from "vue-router";

defineProps(['showContent', 'changeFlag'])
// const route = useRoute()


// type item = {
//     id: number;
//     url: string;
//     img: string;
// };
//
// const props = defineProps({
//     testMsg: {
//         type: Array as unknown as PropType<item[]>,
//         default: () => [{ id: 1, url: "there is title", img: "there is description" }],
//     },
// });

//   defineComponent({
//   data() {
//     return {
//       items: [{ id: 1, img: 'img1' ,url:'url1',name:'name1',detail:'detail1'}, { id: 2, img: 'img2' ,url:'url2',name:'name2',detail:'detail2'}], // 假设这是一个items数组
//     };
//   },
// });
//region云端数据切换逻辑
//通过useServerUrlData.ts中的getImgUrl()方法请求的服务器数据：urlList就是服务器返回的网页列表
let {getImgUrl, urlList} = useServerUrl()
let allUrl = reactive(urlList)
//endregion

//罗列可以请求的服务器数据库名称
const targetList = reactive(['tool', 'onlineTool', 'robot', 'html', 'video', 'book', 'tutorial', 'vm', 'other', 'webGame'])
const nameList = reactive(['软件下载', '在线工具', '机器人', 'HTML', '观影', '电子书', '教程', '虚拟机', '杂项', '娱乐'])

//本地数据，先从localUrlData.ts中调取出来，再存入localList中
let {
  tool,
  onlineTool,
  robot,
  html,
  video,
  book,
  tutorial,
  vm,
  other,
  webGame
} = reactive(useUrlStore())
let localList = [tool, onlineTool, robot, html, video, book, tutorial, vm, other, webGame]

//region页面初次渲染时加载的数据——因为会失去响应式的原因，3个allUrl和listType获取值和赋值的顺序不要更换！！！
Object.assign(allUrl, localList[0])
let listType = ref('本地')
//endregion


// let resultList = reactive(bookList)
let resultList = reactive(allUrl)


//region,本地数据切换逻辑
//用emitter得到Aside组件里面的点击事件传来的值，用于更改请求列表
let num = ref<number>(0)
emitter.on('getListNum', (Num?: number) => {
  if (typeof Num === "number") {
    //调用方法，获取云端列表,失败则使用本地数据
    num.value = Num
    listType.value = '云端'
    getImgUrl(targetList[Num]).catch((error) => {
      console.error('调用getImgUrl函数时捕获到错误:', error);
      ElMessage.error('云端数据获取失败，将使用本地数据')
      listType.value = '本地'
      resultList.splice(0, resultList.length, ...localList[Num])
    })


    // console.log(Num)
    // console.log(`当前请求的是本地列表`)
    //优先调用本地列表,先清空allUrl，再用Object.assign()合并数组

    // resultList.splice(0, allUrl.length)
    // Object.assign(resultList, localList[Num])
    // //修改num值，如果用户点刷新，就调用服务器刷新
    // num.value = Num
    // listType.value = '本地'
  }

})

//endregion


function refresh() {
  //调用方法，获取云端列表
  listType.value = '云端'
  getImgUrl(targetList[num.value]).catch((error) => {
    console.error('调用getImgUrl函数时捕获到错误:', error);
    ElMessage.error('云端数据获取失败，将使用本地数据')
    listType.value = '本地'
    resultList.splice(0, resultList.length, ...localList[num.value])
  })
  //修改文字
}


//region 批量上传网址到数据库
function addAllUrl(urlList, tableName) {
  urlList.forEach(item => {
    addUrl(item, tableName)
  })
}

//上传一条网址数据到数据库
function addUrl(urlInfo, table) {
  //import axios from "axios";
  //import {ElMessage} from "element-plus";
  axios({
    url: '/addUrl',
    method: 'post',
    data: {
      urlInfo,
      table
    }
  }).then(result => {
    console.log(result)
    ElMessage.success(result.data.msg)
  }).catch(error => {
    console.dir('发生错误：' + error)
  })
}

//endregion


</script>

<style scoped>
.content {
  padding: 0;
}

.title {
  display: flex;
  justify-content: space-between;
  margin: 0 40px;
}

.refresh {
  border: none;
}

.mainContent {
  display: flex;
  justify-content: space-evenly;
  /*flex-flow: wrap;*/
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

.hide {
  display: none;
}

@media (max-width: 980px) {
  .show {
    display: none;
  }

  .hide {
    display: block;
  }

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
}
</style>