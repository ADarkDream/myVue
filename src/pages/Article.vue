<template>
  <div>
    <div class="articleBar" v-if="false">
      <el-button @click="router.back()">
        <el-icon>
          <ArrowLeftBold/>
        </el-icon>
        返回
      </el-button>
      <el-button v-if="isAdmin" @click="checkArticle(1)" type="success">审核通过</el-button>
      <el-button v-if="isAdmin" @click="checkArticle(2)" type="danger">审核不通过</el-button>
      <el-button @click="getArticle" :icon="Refresh">
        刷新
      </el-button>
    </div>
    <div class="mainContent">
      <el-container style="min-height: 400px">
        <el-header>
          <h1 class="articleTitle">{{ article.title }}
            <el-text v-if="article.status===0" type="primary">[待审核]</el-text>
            <el-text v-if="article.status===2" type="danger">[未过审]</el-text>
          </h1>
          <el-link type="primary" @click="go(article.author,  '',  '')">{{ article.author }}</el-link>
        </el-header>
        <el-divider/>
        <el-main style="padding:0 20px">
          <el-text v-html="article.text" class="articleContent"/>
        </el-main>
        <el-divider/>
        <el-footer>
          <el-space class="articleFooter" style="text-align: initial;font-size: 14px">
          <span>板块：<el-button link @click="go('',  article.area,'')" type="primary">
            {{ article.area }}</el-button><br>
            标签：<el-button link @click="go('',  '',  article.tags)" type="primary">
              {{ article.tags }}</el-button></span>
            <span>发布于：{{ getTime(article.created_time) }}<br><template
                v-if="article.created_time!==article.updated_time">修改于：{{
                getTime(article.updated_time)
              }}</template></span>
          </el-space>
        </el-footer>
      </el-container>

      <!--    添加评论-->
      <el-card v-if="isShow&&!isAdmin" style="height: 10%;padding: 0">
        <el-row class="addComment" :gutter="10">
          <el-col :lg="2" :md="3" :sm="3" :xs="4">
            <el-avatar :src="headImgUrl" shape="circle"/>
          </el-col>
          <el-col :lg="20" :md="18" :sm="18" :xs="15">
            <el-input class="input" v-model="comment" maxlength="100" size="small"
                      placeholder="发表你的评论"
                      show-word-limit
                      :prefix-icon="Comment"
                      type="textarea"></el-input>
          </el-col>
          <el-col :lg="2" :md="3" :sm="3" :xs="5">
            <el-button @click="addComment" type="primary">发表</el-button>
          </el-col>

        </el-row>
      </el-card>
      <!--评论区-->
      <el-container class="commentArea">
        <el-header style="height: 30px">
          <el-divider>评论区</el-divider>
        </el-header>

        <el-main style="padding: 15px">
          <div v-if="comments.length===0">暂无评论</div>

          <el-row v-else v-for="(item,index) in comments" :key="index" class="comments" :gutter="10">
            <el-col :sm="2" :xs="4">
              <el-button text type="primary" style="padding: 0;margin: 10px 0;" size="small">
                <el-avatar :src="item.headImgUrl" style="width: 40px;" @error="errorImage"/>
              </el-button>
            </el-col>
            <el-col :sm="21" :xs="18">
              <div style="width: 100%;height: 20px;margin-bottom: 5px;display: flex;justify-content: space-between">
                <el-space spacer="" style="text-align: left;">
                  <el-text type="success" v-if="item.uid===article.authorId">[作者]</el-text>
                  <el-text type="primary"> {{ item.observer }}</el-text>
                </el-space>
                <el-space spacer="" style="margin-right: 10px">
                  <el-text>{{ getTime(item.created_time) }}</el-text>
                  <el-text type="primary">{{ index + 1 }}楼</el-text>
                </el-space>
              </div>
              <div style="width: 100%;text-align: left">
                <el-text> {{ item.comment }}</el-text>

              </div>
            </el-col>
            <el-col :sm="1" :xs="2">
              <el-button size="small" v-if="isAdmin||article.authorId===uid || item.uid===uid" type="danger" circle
                         :icon="Delete"
                         @click="deleteRow(item.id)"/>
            </el-col>
            <!--          <el-col :lg="2" :md="3" :sm="3" :xs="4">-->
            <!--            <el-button text type="primary" style="padding: 0;" size="small">-->
            <!--              <el-avatar :src="item.headImgUrl" style="margin: 0 5px;width: 20px;height: 20px" @error="errorImage"/>-->
            <!--              <el-text type="success" v-if="item.uid===article.authorId">[作者]</el-text>-->
            <!--              <el-text style="width: 20%" size="small" truncated> {{ item.observer}}</el-text>-->
            <!--            </el-button>-->
            <!--           <br><el-text style="font-size: 8px " type="primary">{{ index + 1 }}楼</el-text>-->
            <!--          </el-col>-->
            <!--          <el-col :lg="20" :md="18" :sm="18" :xs="15" style="text-align: left;">-->
            <!--           <el-text > {{ item.comment }}</el-text>-->
            <!--          </el-col>-->
            <!--          <el-col :lg="2" :md="3" :sm="3" :xs="5" class="time">-->
            <!--            <el-space>-->
            <!--              <span><el-text style="font-size: 8px " type="primary">{{ index + 1 }}楼</el-text><br>-->
            <!--                <el-text style="font-size: 8px ">{{ getTime(item.created_time) }}</el-text>-->
            <!--              </span>-->
            <!--              <el-button v-if="isAdmin||article.authorId===uid || item.uid===uid" type="danger" circle :icon="Delete"-->
            <!--                         @click="deleteRow(item.id)"/>-->
            <!--            </el-space>-->
            <!--          </el-col>-->
          </el-row>
        </el-main>
      </el-container>

      <!--    添加评论-->
      <el-card class="addCommentDiv" v-if="isShow&&!isAdmin">
        <el-row class="addComment">
          <el-col :span="1">
            <el-avatar :src="headImgUrl" shape="circle"/>
          </el-col>
          <el-col :span="21">
            <el-input class="input" v-model="comment" maxlength="100" size="large"
                      placeholder="发表你的评论"
                      show-word-limit
                      :prefix-icon="Comment"
                      type="textarea"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="addComment" type="primary" style="margin: 0 auto">发表</el-button>
          </el-col>

        </el-row>
      </el-card>
    </div>

  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import useTimeStamp from '@/hooks/useTimestamp'
import {ElMessage, ElMessageBox, ElLoading} from "element-plus";
import {onMounted, reactive, watch} from "vue";
import {ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ArrowLeftBold, Refresh, Comment, Delete} from "@element-plus/icons-vue";
import useUserInfo from "@/hooks/useUserInfo";

const {isLogin, isAdmin, uid, headImgUrl, errorImage} = useUserInfo()
const router = useRouter()
const route = useRoute() // 注意：接收参数的时候不带 ‘r’
const isShow = ref(true)
const isSubmit = route.query.isSubmit
if (isSubmit === '0') isShow.value = false


function go(author: string, area: string, tags: string) {
  router.push({name: 'center', query: {author, area, tags}})
}


//时间戳转换
let {getTime} = useTimeStamp()

//文章类型声明
interface Article {
  title: string,
  author: string,
  authorId: number,
  text: string,
  area: string,
  tags: string,
  status: number,
  created_time: string,
  updated_time: string
}

//评论类型声明
interface Comment {
  id: number,
  observer: string,
  uid: number,
  comment: string,
  created_time: string,
  headImgUrl: string
}

//文章信息
const article = reactive({}) as Article
//评论列表
let comments: Comment[] = reactive([])

//region刷新，获取文章
function getArticle() {
  let url = '/getArticle'
  if (isLogin.value) url = '/getTheArticle'
  axios({
    url,
    params: {
      //用路由跳转传来的文章id再次向服务器请求文章数据
      id: route.query.id,
      isAdmin: isAdmin.value
    }
  }).then(result => {
    console.log(result)
    const {msg, comments: commentsData} = result.data
    console.log(msg)
    // ElMessage.success(msg)
    Object.assign(article, result.data.article)
    //判断返回的数据中是否有评论
    if (commentsData !== undefined) {
      comments.splice(0, comments.length)
      commentsData.forEach((item: Comment) => {
        comments.push(item);
      });
    }
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    ElMessage.error(error.msg)
  })
}

getArticle()

// watch(article, () => {
//   const images = document.querySelectorAll('.articleContent p img');
//   images.forEach(img => {
//     // 移除内联样式中的宽度
//     if (img instanceof HTMLElement) img.style.width = '100%';
//   })
// })
setTimeout(()=>{
    const images = document.querySelectorAll('.articleContent p img');
  images.forEach(img => {
    // 移除内联样式中的宽度
    if (img instanceof HTMLElement) img.style.width = '100%';
  })


},100)

//用户发表评论框输入的值
let comment = ref('')

//评论发言
function addComment() {
  //判断用户是否登录
  if (!isLogin.value) return ElMessage.info('登录后才可以发言')
  if (comment.value.trim().length > 0) {
    //控制全屏加载动画的显示
    const loading = ElLoading.service({
      lock: true,
      text: `正在审核中，请稍后...`,
      background: 'rgba(0, 0, 0, 0.7)',
    })
    axios({
      url: '/addComment',
      method: 'post',
      data: {
        articleId: route.query.id,
        comment: comment.value.trim()
      }
    }).then(result => {
      // console.log(result)
      loading.close()
      const {status, msg} = result.data
      if (status === 200) {
        ElMessage.success(msg)
        // 成功之后刷新
        comment.value = ''
        getArticle()
      }
    }).catch(error => {
      loading.close()
      console.log('发生错误：')
      console.log(error)
    })
  }
}

//管理员审核文章
function checkArticle(status: number) {
  axios({
    url: '/checkArticle',
    method: 'post',
    data: {
      id: route.query.id,
      status
    }
  }).then(result => {
    console.log(result)
    ElMessage.success(result.data.msg)
    // 成功之后返回管理界面
    setTimeout(() => {
      router.back()
    }, 1500)
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}


//确认删除评论
const deleteRow = (id: number) => {
  ElMessageBox.confirm(
      '确认删除该评论吗?',
      'Warning',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消删除',
        type: 'warning',
        showClose: false
      }
  )
      .then(() => {
        console.log(111)
        deleteComment(id)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '删除操作已取消',
        })
      })
}

//删除评论
const deleteComment = (id: number) => {
  axios({
    url: '/deleteTheComment',
    method: 'delete',
    params: {id}
  }).then((result) => {
    // console.log(result)
    ElMessage.success(result.data.msg)
    setTimeout(() => {
      location.reload()
    }, 1500)
  }).catch(error => {
    console.dir('发生错误：' + error)
  })
}

</script>

<style scoped>
.mainContent {
  position: relative;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);

}


.articleBar {
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.articleTitle {
  margin: 10px 0 0 0;
}

.articleContent {
  text-align: initial;
  font-size: 18px
}

.articleContent p img {
  max-width: 100%;
}

.articleFooter {
  display: flex;
  justify-content: space-between;
}

.commentArea {
  min-height: 100px;
}

.el-col { /*评论区文字垂直居中*/
  display: flex;
  align-items: center;
  text-align: center;
  align-content: flex-start;
}

.comments {
  display: flex;
  justify-content: space-between;
  margin: 10px 10px 30px 10px;
  font-size: 12px;
  /*
    text-align: initial;
  */
}

.time {
  text-align: right;
  font-size: 12px;

}

.addCommentDiv {
  /*
   position: absolute;

 margin: 0 10%;
  position: sticky;
  bottom: 0;
  */
  display: none;
  position: absolute;
  width: 100%;
  height: 80px;
  bottom: 0;
}

.addComment {
  display: flex;
  justify-content: center;
}

.input {
  width: 100%;
  margin: 0 auto;
}
</style>