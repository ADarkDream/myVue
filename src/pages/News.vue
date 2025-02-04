<template>
  <el-container class="mainPanel">
    <el-header>
      <h1>News</h1>
      <!--      <el-button @click="getNewsChannel">获取频道</el-button>-->
      <div style="display: flex; justify-content: center">
        <el-text>新闻条数：</el-text>
        <el-input v-model="newsNum" placeholder="新闻条数" style="width: 75px" />
        &ensp;<el-text>类别：</el-text>
        <div v-if="isPC">
          <el-button v-for="(item, index) in channelList" :key="index" type="text" @click="getNews(item)">{{ item }}</el-button>
        </div>
        <el-select v-else v-model="channel" filterable placeholder="新闻类别" style="width: 75px" @change="getNews(channel)">
          <el-option v-for="(item, index) in channelList" :key="index" :label="item" :value="item"> </el-option>
        </el-select>
      </div>
    </el-header>
    <el-main>
      <el-scrollbar :height="isPC ? screenHeight - 220 : screenHeight - 120">
        <!--新闻列表区-->
        <div v-for="(item, index) in newsList" :key="index" class="card">
          <div class="articleCover">
            <el-image :draggable="false" fit="cover" lazy :src="item.pic">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <icon-picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>

          <div class="articleInfo">
            <el-text class="title" size="large" tag="p" truncated>{{ item.title }}</el-text>

            <!--            <el-text size="small" tag="sub" truncated v-html="item.content"></el-text>-->
            <div class="link">
              <el-link
                :href="isPC ? item.weburl : item.url"
                target="_blank"
                :title="'点击前往' + isPC ? 'PC' : '移动' + '端'"
                type="primary"
                >点击跳转</el-link
              >
            </div>
            <div class="footer">
              <el-text size="small" tag="b" truncated>{{ item.src }}</el-text>
              <el-text size="small" truncated> &ensp;&ensp;发布于:{{ item.time }} </el-text>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue"
import { Picture as IconPicture } from "@element-plus/icons-vue"
import momo from "@/apis"
//stores
import { useResponsiveStore } from "@/store/useResponsiveStore"

const responsiveStore = useResponsiveStore()
const { screenHeight, isPC } = toRefs(responsiveStore)
const channel = ref("政治") //频道
const newsNum = ref(10) //新闻条数
// const channelList = reactive([])
const channelList = reactive([
  "头条",
  "新闻",
  "国内",
  "国际",
  "政治",
  "财经",
  "体育",
  "娱乐",
  "军事",
  "教育",
  "科技",
  "NBA",
  "股票",
  "星座",
  "女性",
  "育儿",
])

type News = {
  title: string
  content: string
  type: string
  pic: string
  weburl: string
  url: string
  src: string
  time: string
}

const newsList = reactive<News[]>([])

onMounted(() => {
  // getNewsChannel()//获取频道列表
  getNews(channel.value) //获取新闻列表
})

//获取频道
function getNewsChannel() {
  momo
    .get("/newsChannel")
    .then((result) => {
      console.log(result)
      const { data } = result
      channelList.splice(0, channelList.length, ...data)
    })
    .catch((error) => {
      console.log("发生错误：")
      console.log(error)
      //ElMessage.error('发生错误：' + error.message)
    })
}

function getNews(type: string) {
  momo
    .get("/news", {
      type,
      num: newsNum.value,
    })
    .then((result) => {
      console.log(result)
      const { data } = result
      newsList.splice(0, newsList.length, ...data)
    })
    .catch((error) => {
      console.log("发生错误：")
      console.log(error)
    })
}

//网上的
</script>

<style scoped>
.el-container {
  /*  background-color: rgba(176, 163, 149, 255)*/
  background: var(--el-color-primary-light-9);
}

.card {
  display: flex;
  padding: 5px 10%;
}

.articleCover,
.articleCover .el-image {
  width: 200px;
  height: 200px;
}

.articleInfo {
  padding-left: 20px;
  text-align: left;

  .title,
  .link,
  .footer {
    padding: 5px 0;
  }
}

@media (max-width: 780px) {
  .card {
    padding: 5px;
  }

  .articleCover,
  .articleCover .el-image {
    width: 100px;
    height: 100px;
  }

  .articleInfo {
    height: 100px;

    .title {
      width: 220px;
    }
  }
}
</style>
