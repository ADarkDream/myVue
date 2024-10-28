<template>
  <el-header class="header1">
    评论管理
  </el-header>
  <div class="header2">
    <span></span>
    <el-button @click="clearFilter">清空全部筛选</el-button>
  </div>
  <el-main style="padding-bottom:0;padding-top: 0 ">
    <el-table ref="tableRef" :data="tableData" style="width: 100%" max-height="500" stripe border highlight-current-row
      table-layout="auto" type="type" :default-sort="{ prop: 'id', order: 'custom' }">
      <el-table-column fixed prop="id" label="ID" width="100" sortable />
      <el-table-column prop="articleId" label="文章ID" width="100">
        <template #default="scope">
          <el-button text type="primary" @click="goArticle(scope.row.articleId)">{{ scope.row.articleId }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="用户ID" width="100" />
      <el-table-column prop="comment" label="评论内容" width="400" />
      <el-table-column prop="status" label="状态" width="120" :filters="[
        { text: '未过审', value: 0 },
        { text: '已发布', value: 1 },
        { text: '待审核', value: 2 },
      ]" :filter-method="filterHandler">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-select placeholder="选择状态(默认为发布中)" v-model="newComment.status" default-first-option>
              <el-option label="已发布" :value="1" />
              <el-option label="未过审" :value="0" />
              <el-option label="待审核" :value="2" />
            </el-select>
          </div>
          <el-button text type="info" v-else-if="scope.row.status === 1">已发布</el-button>
          <el-button text type="danger" v-else-if="scope.row.status === 0">未过审</el-button>
          <el-button text type="primary" v-else-if="scope.row.status === 2">待审核</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="created_time" label="创建时间" width="150">
        <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
      </el-table-column>
      <!--           <el-table-column prop="updated_time" label="更新时间" width="150">-->
      <!--        <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>-->
      <!--      </el-table-column>-->
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template #default="scope">
          <div v-if="isEditRow !== scope.$index">
            <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteRow(scope.$index, scope.row.id)">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button link type="primary" size="small" @click="isEditRow = -1">取消
            </el-button>
            <el-button link type="primary" size="small" @click.prevent="checkUpdateRow(newComment, scope.row)">
              更新
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>


<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import type { TableColumnCtx, TableInstance } from "element-plus";
//hooks
import useTimeStamp from "@/hooks/useTimestamp";
import useFunction from "@/hooks/useFunction";
//types
import { Comment } from "@/types/articles"



const { getTime } = useTimeStamp()
const { diffObj } = useFunction()
const router = useRouter()
const goArticle = (id: number) => {
  router.push({ path: '/forum/article', query: { id, isEdit: 1 } })
}


const tableRef = ref<TableInstance>()
let tableData: Comment[] = reactive([])

//清空全部筛选条件
const clearFilter = () => {
  tableRef.value!.clearFilter()
}

//筛选器
const filterHandler = (
  value: string,
  row: Comment,
  column: TableColumnCtx<Comment>
) => {
  const property = column['property'] as keyof Comment //断言property是Comment中的键名
  return row[property] === value
}

//监听排序行为，并修改数组顺序,否则删除会出错
// function handleSortChange({prop, order}: Sort<Comment>) {
//   // 根据 column 和 order 对 this.tableData 进行排序
//   tableData.sort((a, b) => {
//     const propA = a[prop as keyof typeof a]
//     const propB = b[prop as keyof typeof b]
//     if (propA < propB) return order === 'ascending' ? -1 : 1;
//     if (propA > propB) return order === 'ascending' ? 1 : -1;
//     return 0
//   })
// }


const newComment = reactive<Comment>({
  id: 0,
  uid: 0,
  articleId: 0,
  comment: '',
  status: 0,
  created_time: '',
}
)

//获取全部评论
onMounted(async () => {
  await getComment()
})


const getComment = async () => {
  try {
    const result = await axios({ url: '/getComments', })
    console.log(result)
    const { msg, data } = result.data
    ElMessage.success(msg)
    tableData.splice(0, tableData.length)
    data.forEach((item: Comment) => {
      tableData.push(item)
    })
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}


//编辑标记
const isEditRow = ref<number>(-1)

//编辑评论信息(修改编辑标记)
const handleEdit = (index: number, row: Comment) => {
  isEditRow.value = index
  Object.assign(newComment, row)
}

//对上传的数据进行格式检查
function checkUpdateRow(newData: Comment, oldData: Comment) {
  const data = <Comment>diffObj(newData, oldData)
  //判断评论信息是否修改
  if (Object.keys(data).length === 0) return ElMessage.info('评论信息未修改，已取消上传。')
  else {
    //校验格式


    updateRow(data, oldData)
  }
}



//上传更新的评论信息
function updateRow(data: Comment, oldData: Comment) {
  axios({
    url: '/updateComment',
    method: 'post',
    data: {
      data,
      id: oldData.id    //id被洗掉了，手动添加
    }
  }).then(result => {
    // console.log(result)
    const { msg } = result.data
    //更新修订时间为当前时间
    data.created_time = new Date().toISOString()
    //将修改后的信息显示出来
    Object.assign(oldData, data)
    //去除编辑标记
    isEditRow.value = -1
    ElMessage.success(msg)
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    //ElMessage.error('发生错误：' + error.message)
  })
}


//确认删除评论
const deleteRow = (index: number, id: number) => {
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
      deleteComment(index, id)
      console.log(index, id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除操作已取消',
      })
    })
}

//删除评论
const deleteComment = (index: number, id: number) => {
  axios({
    url: '/deleteComment',
    method: 'delete',
    params: { id }
  }).then((result) => {
    // console.log(result)
    ElMessage.success(result.data.msg)
    tableData.splice(index, 1)
    console.log(tableData)
  }).catch(error => {
    console.dir('发生错误：' + error)
  })
}
</script>


<style scoped></style>
