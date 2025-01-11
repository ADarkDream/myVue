<template>
  <el-header class="header1">
    文章管理
  </el-header>
  <div class="header2">
    <el-switch v-model="tableVisible" size="large" active-text="表格" inactive-text="矩形" />
    <el-button @click="clearFilter" v-show="tableVisible">清空全部筛选</el-button>
  </div>
  <el-scrollbar height="500px">
    <el-main style="padding-bottom:0;padding-top: 0 " v-if="tableVisible">
      <el-table ref="tableRef" :data="allArticleList" max-height="500" stripe border highlight-current-row
        table-layout="auto" type="type" :default-sort="{ prop: 'id', order: 'custom' }">
        <el-table-column fixed prop="id" label="ID" width="70" sortable />
        <el-table-column fixed prop="title" label="文章标题" width="200" />
        <el-table-column prop="author" label="作者" width="150" />
        <el-table-column prop="area" label="板块" width="100" :filters="[
          { text: '文章', value: '文章' },
          { text: '教程', value: '教程' },
        ]" :filter-method="filterHandler">
          <template #default="scope">
            <div v-if="scope.row.area == '文章'">文章</div>
            <div v-else-if="scope.row.area === '教程'">教程</div>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="100" :filters="[
          { text: '散文', value: '散文' },
          { text: '小说', value: '小说' },
          { text: '前端', value: '前端' },
          { text: '教程', value: '教程' },
          { text: '其他', value: '其他' },
        ]" :filter-method="filterHandler">
          <template #default="scope">
            <div v-if="scope.row.tags === '散文'">散文</div>
            <div v-else-if="scope.row.tags === '小说'">小说</div>
            <div v-else-if="scope.row.tags === '前端'">前端</div>
            <div v-else-if="scope.row.tags === '教程'">教程</div>
            <div v-else-if="scope.row.tags === '其他'">其他</div>

          </template>
        </el-table-column>
        <!--    <el-table-column prop="text" label="文章内容" width="300">-->
        <!--      <template #default="scope">-->
        <!--        <div v-if="isEditRow===scope.$index">-->
        <!--          <el-input type="text" v-model="article.text"/>-->
        <!--        </div>-->
        <!--      </template>-->
        <!--    </el-table-column>-->

        <el-table-column prop="status" label="文章状态" width="120" :filters="[
          { text: '待审核', value: 0 },
          { text: '已发布', value: 1 },
          { text: '未过审', value: 2 },
        ]" :filter-method="filterHandler">
          <template #default="scope">
            <el-button text type="primary" v-if="scope.row.status === 0">待审核</el-button>
            <el-button text type="info" v-else-if="scope.row.status === 1">已发布</el-button>
            <el-button text type="danger" v-else-if="scope.row.status === 2">未过审</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="150">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column prop="created_time" label="修改时间" width="150">
          <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="goArticle(scope.row, 1)">审核
            </el-button>
            <el-button link type="danger" size="small" @click="deleteRow(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-main v-if="!tableVisible">
      <!--    待审核-->
      <div class="div">
        <el-container>
          <el-main class="cards">
            <el-button text class="title">待审核</el-button>
            <el-divider> {{ noSubmitArticleList.length }}</el-divider>
            <el-card shadow="hover" class="card" v-for="item in noSubmitArticleList">
              <template #header>{{ item.title }}——作者：{{ item.author }}</template>
              <el-space spacer="|">
                <span>板块：{{ item.area }}</span>
                <span>标签：{{ item.tags }}</span>
              </el-space>
              <el-divider></el-divider>
              <el-space>
                创建时间：{{ getTime(item.created_time) }}<br>
                修改时间：{{ getTime(item.created_time) }}
              </el-space>
              <template #footer class="footer">
                <el-button type="primary" @click="goArticle(item, 1)">审核</el-button>
                <el-button type="danger" @click="deleteRow(item.id)">删除</el-button>
              </template>
            </el-card>

          </el-main>
        </el-container>
      </div>
      <!--    审核未通过-->
      <div class="div">
        <el-container>
          <el-main class="cards">
            <el-button text type="danger" class="title">审核未通过</el-button>
            <el-divider>{{ failedArticleList.length }}</el-divider>
            <el-card v-for="item in failedArticleList" class="card">
              <template #header>标题：{{ item.title }}</template>
              <el-space spacer="|">
                <span>板块：{{ item.area }}</span>
                <span>标签：{{ item.tags }}</span>
              </el-space>
              <el-divider></el-divider>
              <el-space>
                创建时间：{{ getTime(item.created_time) }}<br>
                修改时间：{{ getTime(item.created_time) }}
              </el-space>
              <template #footer class="footer">
                <el-button type="primary" @click="goArticle(item, 1)">审核</el-button>
                <el-button type="danger" @click="deleteRow(item.id)">删除</el-button>
              </template>
            </el-card>
          </el-main>
        </el-container>
      </div>
      <!--    已发布-->
      <div class="div">
        <el-container>
          <el-main class="cards">
            <el-button text type="primary" class="title">已发布</el-button>
            <el-divider>{{ articleList.length }}</el-divider>
            <el-card shadow="hover" class="card" v-for="item in articleList">
              <template #header>{{ item.title }}——作者：{{ item.author }}</template>
              <el-space spacer="|">
                <span>板块：{{ item.area }}</span>
                <span>标签：{{ item.tags }}</span>
              </el-space>
              <el-divider></el-divider>
              <el-space>
                创建时间：{{ getTime(item.created_time) }}<br>
                修改时间：{{ getTime(item.created_time) }}
              </el-space>
              <template #footer class="footer">
                <el-button type="primary" @click="goArticle(item, 1)">审核</el-button>
                <el-button type="danger" @click="deleteRow(item.id)">删除</el-button>
              </template>
            </el-card>

          </el-main>
        </el-container>
      </div>
    </el-main>

  </el-scrollbar>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import axios from "axios";
import { ElMessage, ElMessageBox, type TableColumnCtx, type TableInstance } from "element-plus";
import { onMounted, reactive, ref } from "vue";
//hooks
import useTimeStamp from '@/hooks/useTimestamp'
//types
import type { Article } from "@/types/articles"

const router = useRouter()
const goArticle = (item: Article, isEdit: number) => {
  // const {id, title, area, tags, text} = item
  router.push({ path: '/forum/article', query: { id: item.id, isEdit } })
}

//时间戳转换
const { getTime } = useTimeStamp()

const allArticleList: Article[] = reactive([])//所有列表

const noSubmitArticleList: Article[] = reactive([])//待审核
const failedArticleList: Article[] = reactive([])//审核未通过
const articleList: Article[] = reactive([])//已发表


//管理员
onMounted(async () => {
  await getAllArticleList()
})

//region获取所有文章
const getAllArticleList = async () => {
  try {
    const result = await axios({
      url: '/getAllUserArticleList',
    })
    console.log(result)
    const { msg, list } = result.data
    ElMessage.success(msg)
    //清除旧数据
    allArticleList.splice(0, allArticleList.length)
    noSubmitArticleList.splice(0, noSubmitArticleList.length)
    failedArticleList.splice(0, failedArticleList.length)
    articleList.splice(0, articleList.length)
    //添加新数据
    list.forEach((item: Article) => {
      allArticleList.push(item)
      if (Number(item.status) === 0) noSubmitArticleList.push(item)//待审核的
      else if (Number(item.status) === 1) articleList.push(item)//审核通过的
      else if (Number(item.status) === 2) failedArticleList.push(item)//审核未通过的
    })
  } catch (error) {
    console.log('发生错误：')
    console.log(error)
  }
}

//endregion
const deleteRow = (id: number) => {
  ElMessageBox.confirm(
    '确认删除该文章吗?',
    'Warning',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消删除',
      type: 'warning',
      showClose: false
    }
  )
    .then(() => {
      deleteArticle(id)
    })
    .catch(() => ElMessage.info('删除操作已取消'))
}

//删除文章
const deleteArticle = async (id: number) => {
  try {
    const result = await axios({
      url: '/deleteArticle',
      method: 'delete',
      params: { id }
    })
    // console.log(result)
    const { msg } = result.data
    ElMessage.success(msg)
    //删除之后刷新列表

    await getAllArticleList()
  } catch (error) {
    console.log('发生错误：')
    console.error(error)
  }
}


//下面是表格模式
const tableVisible = ref(true)
const tableRef = ref<TableInstance>()

//清空全部筛选条件
const clearFilter = () => {
  tableRef.value!.clearFilter()
}

//筛选器
const filterHandler = (
  value: string,
  row: Article,
  column: TableColumnCtx<Article>
) => {
  const property = column['property'] as keyof Article //断言property是Article中的键名
  return row[property] === value
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
</style>
