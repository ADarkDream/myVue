<template>
  <el-scrollbar height="700px">
    <el-container class="container">
      <el-main class="content">
        <div class="searchDiv">
          <!--   文章筛选区-->
          <el-collapse>
            <el-collapse-item title="文章筛选条件">
              <el-form class="search" :model="data" label-position="left" label-width="auto">
                <el-form-item label="文章标题">
                  <el-input v-model="data.title" placeholder="填写文章标题" clearable :prefix-icon="Search"/>
                </el-form-item>
                <el-form-item label="文章作者">
                  <el-input v-model="data.author" placeholder="填写作者昵称" clearable :prefix-icon="Search"/>
                </el-form-item>
                <el-form-item label="发布板块">
                  <el-select v-model="data.area" placeholder="All">
                    <el-option label="全选" value=""/>
                    <el-option label="文章" value="文章"/>
                    <el-option label="教程" value="教程"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择标签">
                  <el-select v-model="data.tags" placeholder="All">
                    <el-option label="全选" value=""/>
                    <el-option label="散文" value="散文"/>
                    <el-option label="小说" value="小说"/>
                    <el-option label="前端" value="前端"/>
                    <el-option label="教程" value="教程"/>
                    <el-option label="其他" value="其他"/>
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
        <el-card shadow="hover" class="card" v-for="item in articleList" @click="toArticle(item.id)">
          <template #header>{{ item.title }}——作者：{{ item.author }}</template>
          <!--        板块：{{item.area}}-->
          标签：{{ item.tags }}
          <template #footer class="footer">
            创建时间：{{ getTime(item.created_time) }}<br>
            修改时间：{{ getTime(item.created_time) }}
          </template>

        </el-card>
      </el-main>


    </el-container>

  </el-scrollbar>
  <router-view></router-view>

</template>

<script setup lang="ts">
import {reactive} from 'vue'
import {Search} from '@element-plus/icons-vue'
import axios from "axios";
import type {UploadFile,} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRouter, useRoute} from 'vue-router';
//格式化时间戳,将TS 国际时间转化为北京时间
import useTimeStamp from '@/hooks/useTimestamp'

let {getTime} = useTimeStamp()


//路由跳转，前往文章页
const router = useRouter();
const toArticle = (id: number) => {
  router.push({path: '/forum/article', query: {id}})
};


const data = reactive({
  title: '',
  author: '',
  area: '',
  tags: '',
})

interface Article {
  author: string,
  area: string,
  tags: string,
}

//从文章页跳转过来的数据
const route = useRoute()
const {author, area, tags} = route.query as unknown as Article
if (author !== '' && author !== undefined) data.author = author
if (area !== '' && area !== undefined) data.area = area
if (tags !== '' && tags !== undefined) data.tags = tags


//清除查询表单
function clearForm() {
  data.title = ''
  data.author = ''
  data.area = ''
  data.tags = ''
  router.push({name: 'center'})
  getArticleList()
}

//用来接收查询的文章列表
let articleList = reactive([])

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
    const {msg, list} = result.data
    ElMessage.success(msg)
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
  margin: 0 15%;
  justify-content: center;
  border: none;
}

el-main {
  border: none;
}

.searchDiv {
  width: 100%;
  border-radius: 20px;
}

.search {
  margin: 0 10%;
}

.btn {
  display: flex;
  justify-content: center;
}


.content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.card {
  margin: 20px auto;
  width: 30%;
  border-radius: 10px;
}


@media (max-width: 980px) {
  .card {
    width: 80%;
  }
}
</style>