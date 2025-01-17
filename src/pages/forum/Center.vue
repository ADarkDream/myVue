<template>
  <el-container class="container">
    <el-main class="content">
      <div class="searchDiv">
        <!--   文章筛选区-->
        <el-collapse style="background-color: var(--el-color-primary-light-9);margin: 10px 20px;">
          <el-collapse-item title="&ensp;&ensp;&ensp;文章筛选条件">
            <el-form class="search" size="small" :inline="true" :model="data" label-position="left">
              <el-form-item label="文章标题">
                <el-input v-model="data.title" placeholder="填写文章标题" clearable :prefix-icon="Search"
                  @keyup.enter="getArticleList" />
              </el-form-item>
              <el-form-item label="文章作者">
                <el-input v-model="data.author" placeholder="填写作者昵称" clearable :prefix-icon="Search"
                  @keyup.enter="getArticleList" />
              </el-form-item>
              <el-form-item label="发布板块">
                <el-select v-model="data.area" placeholder="All">
                  <el-option label="全选" value="" />
                  <el-option label="文章" value="文章" />
                  <el-option label="教程" value="教程" />
                </el-select>
              </el-form-item>
              <el-form-item label="选择标签">
                <el-select v-model="data.tags" placeholder="All">
                  <el-option label="全选" value="" />
                  <el-option label="散文" value="散文" />
                  <el-option label="小说" value="小说" />
                  <el-option label="前端" value="前端" />
                  <el-option label="教程" value="教程" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
              <div class="btn">
                <el-button @click="clearForm">重置</el-button>
                <el-button type="primary" @click="getArticleList">查询</el-button>
              </div>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!--文章列表区-->
      <div class="card" v-for="item in articleList" @click="toArticle(item.id)">
        <div class="articleCover">
          <el-image :src="item.coverUrl" fit="cover">
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
            <el-text size="small" tag="sub" truncated>板块：{{ item.area }}&ensp;&ensp;&ensp;标签：{{
              item.tags
            }}
            </el-text>
          </div>
          <div class="footer">
            <el-text size="small" tag="b" style="width: 30%" truncated>{{ item.author }}</el-text>
            <el-text size="small" truncated>
              &ensp;&ensp;发布于:{{ getDiffTime(item.created_time) }}
            </el-text>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import axios from "axios";
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { Search, Picture as IconPicture } from '@element-plus/icons-vue'
//hooks
import useTimeStamp from '@/hooks/useTimestamp'
//types
import { Article } from '@/types/articles';

const { getDiffTime } = useTimeStamp()


//路由跳转，前往文章页
const router = useRouter();
const toArticle = (id: number) => {
  router.push({ name: 'article', query: { id } })

};


const data = reactive({
  title: '',
  author: '',
  area: '',
  tags: '',
})



//从文章页跳转过来的数据
const route = useRoute()
const { author, area, tags } = route.query as unknown as Article
if (author !== '' && author !== undefined) data.author = author
if (area !== '' && area !== undefined) data.area = area
if (tags !== '' && tags !== undefined) data.tags = tags


//清除查询表单
function clearForm() {
  data.title = ''
  data.author = ''
  data.area = ''
  data.tags = ''
  router.push({ name: 'center' })
  getArticleList()
}

//用来接收查询的文章列表
let articleList = reactive<Article[]>([])

//region文章刷新获取
function getArticleList() {
  axios({
    url: '/getArticleList',
    params: {
      title: data.title.trim(),
      author: data.author.trim(),
      area: data.area,
      tags: data.tags,
    }
  }).then(result => {
    // console.log(result)
    const { msg, list } = result.data
    // ElMessage.success(msg)
    articleList.splice(0, articleList.length)
    Object.assign(articleList, list)
  }).catch(error => {
    if (error.status === 400) ElMessage.error(error.msg)
  })
}

getArticleList()


</script>


<style scoped>
.container {
  display: flex;
  justify-content: center;
  border: none;
}

el-main {
  border: none;
}

.searchDiv {
  width: 100%;
  border-radius: 20px;
  opacity: 0.8;
}

.el-form-item {
  width: 20%;
}


/*
.btn {
  display: flex;
  justify-content: center;
}
*/


.content {
  padding: 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow-x: hidden;
}

.card {
  margin: 10px auto 0;
  padding: 5px;
  width: 30%;
  border-radius: 10px;
  background-color: var(--el-bg-color);
  opacity: 0.9;
}

.image-slot {
  width: 50px;
  height: 50px;
  background-color: gray;
}

@media (max-width: 780px) {
  .container {
    margin: 0;
  }

  .el-form-item {
    width: 80%;
    margin: 3px auto;
  }

  .content {
    padding-left: 0;
    padding-right: 0;
  }

  .card {
    width: 90%;
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
}
</style>