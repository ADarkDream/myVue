<template>
  <el-header v-if="isPC" class="header1"> 内容管理 </el-header>
  <el-header class="header2">
    <el-switch v-model="tableVisible" active-text="表格" inactive-text="矩形" size="large" />
    <el-switch v-show="tableVisible" v-model="draftVisible" active-text="文章" inactive-text="草稿" size="large" />
    <el-button v-show="tableVisible" @click="clearFilter">清空全部筛选</el-button>
  </el-header>
  <!--    表格模式-->
  <el-main v-if="tableVisible" style="padding: 0">
    <!--      文章-->
    <template v-if="draftVisible">
      <el-button class="title" text type="info">文章列表</el-button>
      <el-divider>{{ allArticleList.length }}</el-divider>
      <!--    表格模式；文章-->
      <el-table
        ref="articleRef"
        border
        :data="allArticleList"
        :default-sort="{ prop: 'id', order: 'descending' }"
        highlight-current-row
        max-height="500"
        stripe
        table-layout="auto"
      >
        <el-table-column fixed label="ID" prop="id" sortable />
        <el-table-column label="文章标题" prop="title" />
        <el-table-column label="作者" prop="author" />
        <el-table-column
          :filter-method="filterHandler"
          :filters="[
            { text: '文章', value: '文章' },
            { text: '板块一', value: '板块一' },
          ]"
          label="板块"
          prop="area"
        >
          <template #default="scope">
            <div v-if="scope.row.area == '文章'">文章</div>
            <div v-else-if="scope.row.area === '板块一'">板块一</div>
          </template>
        </el-table-column>
        <el-table-column
          :filter-method="filterHandler"
          :filters="[
            { text: '标签b', value: '标签b' },
            { text: '散文', value: '散文' },
          ]"
          label="标签"
          prop="tags"
        >
          <template #default="scope">
            <div v-if="scope.row.tags == '标签b'">标签b</div>
            <div v-else-if="scope.row.tags === '散文'">散文</div>
          </template>
        </el-table-column>
        <!--    <el-table-column prop="text" label="文章内容" width="300">-->
        <!--      <template #default="scope">-->
        <!--        <div v-if="isEditRow===scope.$index">-->
        <!--          <el-input type="text" v-model="article.text"/>-->
        <!--        </div>-->
        <!--      </template>-->
        <!--    </el-table-column>-->

        <el-table-column
          :filter-method="filterHandler"
          :filters="[
            { text: '待审核', value: 0 },
            { text: '已发布', value: 1 },
            { text: '未过审', value: 2 },
          ]"
          label="文章状态"
          prop="status"
        >
          <template #default="scope">
            <el-button v-if="scope.row.status === 0" text type="primary">待审核</el-button>
            <el-button v-else-if="scope.row.status === 1" text type="info">已发布</el-button>
            <el-button v-else-if="scope.row.status === 2" text type="danger">未过审</el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="140" prop="created_time">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column label="修改时间" min-width="140" prop="created_time">
          <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="140">
          <template #default="scope">
            <el-button v-if="scope.row.status === 1" link size="small" type="primary" @click="goArticle(scope.row, 1)"
              >查看
            </el-button>
            <el-button v-else link size="small" type="primary" @click="goArticle(scope.row, 0)">查看 </el-button>
            <el-button link size="small" type="primary" @click="goEdit(scope.row, 0)">编辑 </el-button>
            <el-button link size="small" type="danger" @click="deleteRow(scope.row.id, 0)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--      草稿-->
    <template v-else>
      <el-button class="title" text type="info">草稿箱</el-button>
      <el-divider>{{ draftList.length }}</el-divider>
      <el-table
        ref="draftRef"
        border
        :data="draftList"
        :default-sort="{ prop: 'id', order: 'descending' }"
        highlight-current-row
        max-height="500"
        stripe
        style="width: 100%"
        table-layout="auto"
      >
        <el-table-column fixed label="ID" prop="id" sortable />
        <el-table-column label="草稿标题" prop="title" />
        <el-table-column
          :filter-method="filterHandler"
          :filters="[
            { text: '文章', value: '文章' },
            { text: '板块一', value: '板块一' },
          ]"
          label="板块"
          prop="area"
        >
          <template #default="scope">
            <div v-if="scope.row.area == '文章'">文章</div>
            <div v-else-if="scope.row.area === '板块一'">板块一</div>
          </template>
        </el-table-column>
        <el-table-column
          :filter-method="filterHandler"
          :filters="[
            { text: '标签b', value: '标签b' },
            { text: '散文', value: '散文' },
          ]"
          label="标签"
          prop="tags"
        >
          <template #default="scope">
            <div v-if="scope.row.tags == '标签b'">标签b</div>
            <div v-else-if="scope.row.tags === '散文'">散文</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="140" prop="created_time">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column label="修改时间" min-width="140" prop="created_time">
          <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100">
          <template #default="scope">
            <el-button link size="small" type="primary" @click="goEdit(scope.row, 1)">编辑</el-button>
            <el-button link size="small" type="danger" @click="deleteRow(scope.row.id, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </el-main>
  <!--    矩形模式-->
  <el-footer v-if="!tableVisible">
    <!--    草稿箱-->
    <div class="div">
      <el-container>
        <el-main class="cards">
          <el-button class="title" text type="info">草稿箱</el-button>
          <el-divider>{{ draftList.length }}</el-divider>
          <el-card v-for="(item, index) in draftList" :key="index" class="card">
            <template #header>标题：{{ item.title || "空" }}</template>
            <el-space spacer="|">
              <span>板块：{{ item.area || "空" }}</span>
              <span>标签：{{ item.tags || "空" }}</span>
            </el-space>
            <el-divider></el-divider>
            上次修改时间：{{ getTime(item.created_time) }}
            <template #footer>
              <div class="footer">
                <el-button type="primary" @click="goEdit(item, 1)">编辑</el-button>
                <el-button type="danger" @click="deleteMyDraft(item.id)">删除</el-button>
              </div>
            </template>
          </el-card>
        </el-main>
      </el-container>
    </div>
    <!--    待审核-->
    <div class="div">
      <el-container>
        <el-main class="cards">
          <el-button class="title" text>待审核</el-button>
          <el-divider> {{ noSubmitArticleList.length }}</el-divider>
          <el-card v-for="(item, index) in noSubmitArticleList" :key="index" shadow="hover" class="card">
            <template #header>{{ item.title }}——作者：{{ item.author }}</template>
            <el-space spacer="|">
              <span>板块：{{ item.area }}</span>
              <span>标签：{{ item.tags }}</span>
            </el-space>
            <el-divider />
            创建时间：{{ getTime(item.created_time) }}<br />
            上次修改时间：{{ getTime(item.created_time) }}
            <template #footer>
              <div class="footer">
                <el-button type="info" @click="goArticle(item, 0)">查看</el-button>
                <el-button type="primary" @click="goEdit(item, 0)">编辑</el-button>
                <el-button type="danger" @click="deleteMyArticle(item.id)">删除</el-button>
              </div>
            </template>
          </el-card>
        </el-main>
      </el-container>
    </div>
    <!--    审核未通过-->
    <div class="div">
      <el-container>
        <el-main class="cards">
          <el-button class="title" text type="danger">审核未通过(修改之后可再次审核)</el-button>
          <el-divider>{{ failedArticleList.length }}</el-divider>
          <el-card v-for="(item, index) in failedArticleList" :key="index" class="card">
            <template #header>标题：{{ item.title }}</template>
            <el-space spacer="|">
              <span>板块：{{ item.area }}</span>
              <span>标签：{{ item.tags }}</span>
            </el-space>
            <el-divider />
            上次修改时间：{{ getTime(item.created_time) }}
            <template #footer>
              <div class="footer">
                <el-button type="info" @click="goArticle(item, 0)">查看</el-button>
                <el-button type="primary" @click="goEdit(item, 1)">编辑</el-button>
                <el-button type="danger" @click="deleteMyArticle(item.id)">删除</el-button>
              </div>
            </template>
          </el-card>
        </el-main>
      </el-container>
    </div>
    <!--    已发布-->
    <div class="div">
      <el-container>
        <el-main class="cards">
          <el-button class="title" text type="primary">已发布</el-button>
          <el-divider>{{ articleList.length }}</el-divider>
          <el-card v-for="(item, index) in articleList" :key="index" shadow="hover" class="card">
            <template #header>{{ item.title }}——作者：{{ item.author }}</template>
            <el-space spacer="|">
              <span>板块：{{ item.area }}</span>
              <span>标签：{{ item.tags }}</span>
            </el-space>
            <el-divider />
            创建时间：{{ getTime(item.created_time) }}<br />
            修改时间：{{ getTime(item.created_time) }}
            <template #footer>
              <div class="footer">
                <el-button type="info" @click="goArticle(item, 1)">查看</el-button>
                <el-button type="primary" @click="goEdit(item, 1)">编辑</el-button>
                <el-button type="danger" @click="deleteMyArticle(item.id)">删除</el-button>
              </div>
            </template>
          </el-card>
        </el-main>
      </el-container>
    </div>
  </el-footer>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, ElMessageBox, type TableColumnCtx, type TableInstance } from "element-plus"
import momo from "@/apis"

//stores
import { useResponsiveStore } from "@/store/useResponsiveStore"
//hooks
import useTimeStamp from "@/hooks/useTimestamp"
//utils
import { emitter } from "@/utils/emitter"
//types

const router = useRouter()
const responsiveStore = useResponsiveStore()
const { isPC } = toRefs(responsiveStore)

//查看文章
const goArticle = (item: Article, isSubmit: number) => {
  const { id } = item
  router.push({ name: "article", query: { id, isSubmit } })
}
//编辑文章或草稿
const goEdit = (item: Article, isDraft: number) => {
  const { id, title, area, tags, text: html } = item
  emitter.emit("pageRender", 3)
  router.push({
    name: "userEdit",
    query: { id, title, area, tags, html, isDraft },
  })
}

//时间戳转换
const { getTime } = useTimeStamp()

const allArticleList = reactive([]) //所有列表
const draftList = ref([]) //草稿箱
const noSubmitArticleList = reactive<Article>([]) //待审核
const failedArticleList = reactive([]) //审核未通过
const articleList = reactive([]) //已发表

//文章类型声明
interface Article {
  id: number
  title: string
  status: number
  author: string
  text: string
  area: string
  tags: string
  created_time: number
  updated_time: number
}

getDraftList()
getArticleList()

//获取草稿
function getDraftList() {
  momo
    .get("/getDraftList")
    .then((result) => {
      // console.log(result)

      // console.log(result.status)
      if (result.code === 200) {
        const tempArr = result.list
          .map((item: Article) => {
            // console.log(item.status === 0)
            //除了草稿要判断，文章的请求也要判断！！！
            if (Number(item.status) === 0) return item //草稿
            // else if (Number(item.status) === 1) failedArticleList.push(item)//审核未通过的
          })
          .filters(Boolean)
        draftList.value = tempArr
      }
    })
    .catch((error) => {
      console.dir("发生错误：" + error)
    })
}

//region获取已发布文章
function getArticleList() {
  momo
    .get("/getUserArticleList", {
      isSubmit: true,
    })
    .then((result) => {
      // console.log(result)
      const list = result.list
      //清除旧数据
      allArticleList.splice(0, allArticleList.length)
      noSubmitArticleList.splice(0, noSubmitArticleList.length)
      failedArticleList.splice(0, failedArticleList.length)
      articleList.splice(0, articleList.length)
      //添加新数据
      // console.log(result.status)
      if (result.code === 200)
        list.forEach((item: Article) => {
          allArticleList.push(item)
          if (Number(item.status) === 0)
            noSubmitArticleList.push(item) //待审核的
          else if (Number(item.status) === 1)
            articleList.push(item) //审核通过的
          else if (Number(item.status) === 2) failedArticleList.push(item) //审核未通过的
        })
    })
    .catch((error) => {
      console.dir("发生错误：" + error)
    })
}

//删除草稿
function deleteMyDraft(id: number) {
  momo
    .delete("/deleteMyDraft", { id })
    .then((result) => {
      // console.log(result)
      const { msg } = result
      ElMessage.success(msg)
      //删除之后刷新列表
      getDraftList()
    })
    .catch((error) => {
      console.dir("发生错误：" + error)
    })
}

//删除文章
function deleteMyArticle(id: number) {
  momo
    .delete("/deleteMyArticle", { id })
    .then((result) => {
      // console.log(result)
      const { msg } = result
      ElMessage.success(msg)
      //删除之后刷新列表
      getArticleList()
    })
    .catch((error) => {
      console.dir("发生错误：" + error)
    })
}

//下面是表格模式
const tableVisible = ref(true)
const draftVisible = ref(true)
const draftRef = ref<TableInstance>()
const articleRef = ref<TableInstance>()

//清空全部筛选条件
const clearFilter = () => {
  draftRef.value!.clearFilter()
  articleRef.value!.clearFilter()
}

//筛选器
const filterHandler = (value: string, row: Article, column: TableColumnCtx<Article>) => {
  const property = column["property"]
  return row[property] === value
}

//删除文章确认
const deleteRow = (id: number, isDraft: number) => {
  let str = "文章"
  if (isDraft === 1) str = "草稿"
  ElMessageBox.confirm(`确认删除该${str}吗?`, "Warning", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消删除",
    type: "warning",
    showClose: false,
  })
    .then(() => {
      if (isDraft === 0) deleteMyArticle(id)
      else if (isDraft === 1) deleteMyDraft(id)
    })
    .catch(() => ElMessage.info("删除操作已取消"))
}
</script>

<style scoped>
.div {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 25px;
  font-family: 华文行楷, serif;
  margin-top: 15px;
}

.cards {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.card {
  width: 30%;
  margin: 10px;
  border: #181818 solid 1px;
  border-radius: 10px;
}

@media (max-width: 780px) {
  .card {
    width: 100%;
  }
}
</style>
