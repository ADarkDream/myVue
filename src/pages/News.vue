<template>
  <el-container>
    <el-header>
      News
      <!--      <el-button @click="getNewsChannel">获取频道</el-button>-->
      <br>
      新闻条数：
      <el-input style="width: 50px;margin-right: 50px" v-model="newsNum" placeholder="新闻条数" />

      <el-button v-for="(item, index) in channelList" :key="index" @click="getNews(item)">{{ item }}</el-button>
    </el-header>
    <el-main>
      <el-scrollbar :height="screenHeight - 175">
        <!--新闻列表区-->
        <div class="card" v-for="item in newsList" @click="">
          <div class="articleCover">
            <el-image :src="item.pic" style="height: 200px;width: 200px; " fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon style="width: 50px">
                    <icon-picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="articleInfo">
            <div>
              <el-text size="large" truncated>{{ item.title }}</el-text>
            </div>
            <div>
              <!--            <el-text size="small" tag="sub" truncated v-html="item.content"></el-text>-->
              <el-link type="primary" :href="item.weburl">PC端</el-link>&ensp;<el-link type="primary" :href="item.url">
                移动端
              </el-link>
            </div>
            <div class="footer">
              <el-text size="small" tag="b" style="width: 30%" truncated>{{ item.src }}</el-text>
              <el-text size="small" truncated>
                &ensp;&ensp;发布于:{{ item.time }}
              </el-text>
            </div>
          </div>
        </div>
      </el-scrollbar>

    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import { Picture as IconPicture } from '@element-plus/icons-vue'
import axios from "axios";
//stores
import { useResponsiveStore } from "@/store/useResponsiveStore";

const responsiveStore = useResponsiveStore()
const { screenHeight } = toRefs(responsiveStore)
const channel = ref('政治')//频道
const newsNum = ref(10)//新闻条数
// const channelList = reactive([])
const channelList = reactive([
  '头条', '新闻', '国内',
  '国际', '政治', '财经',
  '体育', '娱乐', '军事',
  '教育', '科技', 'NBA',
  '股票', '星座', '女性',
  '育儿'
])
const newsList = reactive([])

onMounted(() => {
  // getNewsChannel()//获取频道列表
  getNews(channel.value)//获取新闻列表
})


//获取频道
function getNewsChannel() {
  axios({
    url: '/newsChannel',
  }).then(result => {
    console.log(result)
    const { data } = result.data
    channelList.splice(0, channelList.length, ...data)

  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    //ElMessage.error('发生错误：' + error.message)
  })
}

function getNews(type: string) {
  axios({
    url: '/news',
    params: {
      type,
      num: newsNum.value
    },
  }).then(result => {
    console.log(result)
    const { data } = result.data
    newsList.splice(0, newsList.length, ...data)
  }).catch(error => {
    console.log('发生错误：')
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
  /*width: 100%;*/
  margin: 0 15%;
  display: flex;
  justify-content: space-between;
}

.articleCover {
  display: inline-block;
  width: 20%;
  margin: auto;
}

.articleCover img {
  margin: 0;
}

.articleInfo {
  display: inline-block;
  width: 75%;
  height: 100%;
  text-align: left;
  margin-left: 5%;
}
</style>