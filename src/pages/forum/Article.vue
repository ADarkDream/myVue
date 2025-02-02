<template>
  <div>
    <div class="articleBar" v-if="isAdmin">
      <el-button @click="router.back()">
        <el-icon>
          <ArrowLeftBold />
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
      <!--文章区域-->
      <el-container :style="comments.length === 0 ? 'min-height:' + (screenHeight - 250) + 'px' : ''">
        <el-header>
          <h1 class="articleTitle">{{ article.title }}
            <el-text v-if="article.status === 0" type="primary">[待审核]</el-text>
            <el-text v-if="article.status === 2" type="danger">[未过审]</el-text>
          </h1>
          <el-link type="primary" @click="toForumCenter(article.author, '', '')">{{ article.author }}</el-link>
        </el-header>
        <el-divider />
        <el-main style="padding:0 20px">
          <div v-html="article.text" class="articleContent" />
        </el-main>
        <el-divider />
        <el-footer>
          <el-space class="articleFooter" style="text-align: initial;font-size: 14px">
            <span>板块：<el-button link @click="toForumCenter('', article.area, '')" type="primary">
                {{ article.area }}</el-button><br>
              标签：<el-button link @click="toForumCenter('', '', article.tags)" type="primary">
                {{ article.tags }}</el-button></span>
            <span>发布于：{{ getDiffTime(article.created_time) }}<br><template
                v-if="article.created_time !== article.updated_time">修改于：{{
                  getDiffTime(article.updated_time)
                }}</template></span>
          </el-space>
        </el-footer>
      </el-container>
      <!--评论区域-->
      <div class="commentArea">
        <!--评论输入框-->
        <div class="addCommentDiv " v-if="isShow && !isAdmin" ref="commentBox"
          :class="{ '': isFixed, 'fixed': isFixed }">
          <el-row class="addComment" :gutter="10">
            <el-col :lg="2" :md="3" :sm="3" :xs="4" style="display: flex;justify-content: center">
              <el-avatar :src="headImgUrl" shape="circle" />
            </el-col>
            <el-col :lg="20" :md="18" :sm="18" :xs="15">
              <el-input class="input" v-model="comment" maxlength="300" :autosize="true" placeholder="发表你的评论"
                show-word-limit type="textarea"></el-input>
            </el-col>
            <el-col :lg="2" :md="3" :sm="3" :xs="5" style="display: flex">
              <el-button @click="addComment" type="primary">发表</el-button>
            </el-col>
          </el-row>
        </div>
        <div style="margin-bottom: 30px">
          <el-divider>评论区</el-divider>
          <div v-if="comments.length === 0">暂无评论</div>
          <el-row v-else v-for="(item, index) in comments" :key="index" class="comments" :gutter="10">
            <el-col :sm="2" :xs="4" style="align-items: flex-start;"><!--左边头像-->
              <div class="commentsAvatarDiv">
                <el-avatar :src="item.headImgUrl" @error="errorImage" />
              </div>
            </el-col>
            <el-col :sm="22" :xs="20" style="display:flex;flex-wrap: wrap"><!--右边评论区-->
              <div class="commentsBar">
                <el-space spacer="" style="text-align: left;">
                  <el-text type="success" v-if="item.uid === article.authorId">[作者]</el-text>
                  <el-text type="primary"> {{ item.observer }}</el-text>
                </el-space>
                <el-space spacer="" style="margin-right: 10px">
                  <el-text>{{ getDiffTime(item.created_time) }}</el-text>
                  <el-text type="primary">{{ index + 1 }}楼</el-text>
                  <el-dropdown :trigger="isPC ? 'hover' : 'click'">
                    <span>
                      <el-icon class="el-icon--right">
                        <MoreFilled />
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="a" :icon="WarnTriangleFilled">举报</el-dropdown-item>
                        <el-dropdown-item command="b" :icon="Delete"
                          v-if="isAdmin || article.authorId === uid || item.uid === uid" @click="deleteRow(item.id)">删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-space>
              </div><!--评论区顶部菜单-->
              <el-text class="commentsContent">&ensp; &ensp; {{ item.comment }}</el-text><!--评论内容-->
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRefs } from "vue";
import { useRoute, useRouter } from 'vue-router'
import momo from "@/apis"
import { ArrowLeftBold, Refresh, Delete, MoreFilled, WarnTriangleFilled } from "@element-plus/icons-vue";
import hljs from 'highlight.js/lib/common';
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useMainPanelConfigStore } from "@/store/useMainPanelConfigStore";
import { useForumStore } from "@/store/forum/useForumStore";
//hooks
import useTimeStamp from '@/hooks/useTimestamp'
import { useResponsiveStore } from "@/store/useResponsiveStore";
//utils
import { emitter } from "@/utils/emitter";
//types
import { Article, CommentInfo } from '@/types/articles'


const router = useRouter()
const route = useRoute()
const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const mainPanelConfigStore = useMainPanelConfigStore()
const forumStore = useForumStore()

const { isLogin, isAdmin, uid, headImgUrl, errorImage } = toRefs(userInfoStore)
const { screenHeight, containerHeight, isPC } = toRefs(responsiveStore)
const { bgSettings } = mainPanelConfigStore
const { initBreadcrumb, setRouterBreadcrumb } = forumStore

const isShow = ref(true)

const isSubmit = route.query.isSubmit
if (isSubmit === '0') isShow.value = false


const toForumCenter = (author: string, area: string, tags: string) => setRouterBreadcrumb(0, { name: 'center', label: '论坛', query: { author, area, tags } })



//时间戳转换
let { getDiffTime } = useTimeStamp()





//文章信息
const article = ref<Article>({
  id: 0,
  title: '',
  status: 0,
  author: '',
  coverUrl: '',
  text: '',
  area: '',
  tags: '',
  created_time: new Date(),
  updated_time: new Date()
})
//评论列表
const comments = ref<CommentInfo[]>([])

//region刷新，获取文章
async function getArticle() {
  let url = '/getArticle'
  if (isLogin.value) url = '/getTheArticle'
  await momo.get(url, {
    //用路由跳转传来的文章id再次向服务器请求文章数据
    id: route.query.id,
    isAdmin: isAdmin.value
  }
  ).then(async (result) => {
    console.log(result)
    const { comments: commentsData } = result
    console.log(!!comments)
    // ElMessage.success(msg)
    article.value = result.article
    //判断返回的数据中是否有评论
    if (!!commentsData && commentsData.length !== 0) {
      comments.value.splice(0, comments.value.length)
      commentsData.forEach((item: CommentInfo) => {
        comments.value.push(item);
      });
    }
    await nextTick()
    hljs.highlightAll()
    addCodeHighLight()
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    ElMessage.error(error.msg)
  })
}

//给代码块添加高亮
// 复制功能





function addCodeHighLight() {
  const codeBlocks = document.querySelectorAll('[class*="language-"]')
  codeBlocks.forEach((item: HTMLElement) => {

    const language = item.className.match(/language-([a-zA-Z]+)/)[1] //匹配language-javascript的后半部分

    if (!!hljs.getLanguage(language)) //如果支持该语言
      hljs.highlightElement(item)//给代码块高亮
    else console.log(item.classList)
  })

}


// watch(article, () => {
//   const images = document.querySelectorAll('.articleContent p img');
//   images.forEach(img => {
//     // 移除内联样式中的宽度
//     if (img instanceof HTMLElement) img.style.width = '100%';
//   })
// })
//修正图片宽度问题！！！有bug，还需要修改为监听器！！！
// const timer = ref(null)
// timer.value = setTimeout(() => {
//   const images = document.querySelectorAll('.articleContent p img');
//   images.forEach(img => {
//     // 移除内联样式中的宽度
//     if (img instanceof HTMLElement) img.style.width = '100%';
//   })
// }, 400)

//修正图片宽度问题
function fixImageWidth() {
  const images = document.querySelectorAll('.articleContent p img')
  images.forEach((img: HTMLElement) => {
    // 移除内联样式中的宽度
    img.style.width = '100%'// 200 + 'px';
  })
}

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
    momo.post('/addComment', {
        articleId: route.query.id,
        comment: comment.value.trim()
      }
    ).then(result => {
      // console.log(result)
      loading.close()
      const { code, msg } = result
      if (code === 200) {
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
  momo.post( '/checkArticle',
    method: 'post',
    data: {
      id: route.query.id,
      status
    }
  }).then(result => {
    console.log(result)
    ElMessage.success(result.msg)
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
    .catch(() => ElMessage.info('删除操作已取消'))
}

//删除评论
const deleteComment = (id: number) => {
  momo.delete( '/deleteTheComment',{ id }).then((result) => {
    // console.log(result)
    ElMessage.success(result.msg)
    setTimeout(() => {
      location.reload()
    }, 1500)
  }).catch(error => {
    console.dir('发生错误：' + error)
  })
}


//region评论框动态变化
const commentBox = ref<HTMLDivElement | null>(null)
const isFixed = ref(false)
//输入评论框距离页面顶部的距离,默认设置1000
const commentsBoxOffsetTop = ref(1000)

emitter.on('comments-move', (scrollTop) =>
  isFixed.value = scrollTop >= commentsBoxOffsetTop.value
)
// 组件挂载时
onMounted(async () => {
  await getArticle()//获取文章和评论
  initBreadcrumb(1, {
    name: 'article',
    label: article.value.title,
    query: { id: article.value.id }
  })
  await nextTick(() => {//页面渲染完毕才计算高度
    fixImageWidth()//修改图片宽度
    if (comments.value.length === 0) console.log('没有评论')
    else {//有评论时获取输入评论框距离页面顶部的距离
      if (commentBox.value)
        commentsBoxOffsetTop.value = commentBox.value.offsetTop
    }
  })
})
//endregion

</script>

<style scoped>
.mainContent {
  position: relative;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);
}

.el-dropdown :hover {
  border: none;
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
  padding: 0 10px 5px 10px;
}

.el-col {
  /*评论区文字垂直居中*/
  display: flex;
  align-items: center;
  text-align: center;
  align-content: flex-start;
}

.comments {
  display: flex;
  justify-content: space-between;
  margin: 5px 10px;
  padding: 5px 0;
  font-size: 12px;
  background-color: var(--el-bg-color);
  /*
    text-align: initial;
  */
}

/*评论头像框的div'*/
.commentsAvatarDiv {
  padding: 0;
  margin: 0 auto;
}

/*评论上半部分菜单栏*/
.commentsBar {
  width: 100%;
  height: 20px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between
}

.commentsContent {
  width: 100%;
  text-align: left;
  font-size: 16px
}

.fixed {
  position: fixed;
  /*  使评论框根据滚动条固定位置 */
  transition: all 0.5s;
  /* 可选：添加动画平滑滚动 */
  height: 52px;
  left: 20px;
  right: 20px;
  bottom: 0;
  /* 固定在底部 */
  z-index: 1;
  background-color: var(--el-color-primary-light-9);
}

.addCommentDiv {
  padding-top: 10px;
  background-color: var(--el-color-primary-light-9);
}


.addComment {
  display: flex;
  justify-content: center;

}

.input {
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 780px) {
  .articleTitle {
    font-size: 20px;
  }

  .addCommentDiv {
    width: 100%;
    left: 0;
  }
}
</style>
