<template>
  <el-header class="header1">
    公告管理
  </el-header>
  <div class="header2">
    <el-button type="primary" @click="dialogVisible = true">发布新公告</el-button>
    <el-button @click="clearFilter">清空全部筛选</el-button>
  </div>
  <el-main style="padding-bottom:0;padding-top: 0 ">
    <el-table ref="tableRef" :data="tableData" style="width: 100%" stripe border highlight-current-row
      table-layout="auto" type="type" :default-sort="{ prop: 'id', order: 'custom' }">
      <el-table-column fixed prop="id" label="ID" width="70" sortable />
      <el-table-column prop="title" label="公告标题" width="150">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newNotice.title" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="公告分类" width="150" :filters="noticeSort" :filter-method="filterHandler">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-select placeholder="选择分类(默认为更新说明)" v-model="newNotice.sort" default-first-option>
              <el-option v-for="item in noticeSort" :label="item.text" :value="item.value" />
            </el-select>
          </div>
          <div v-else-if="scope.row.sort === 'updateNotes'">更新说明</div>
          <div v-else-if="scope.row.sort === 'noUpdated'">待更新内容</div>
          <div v-else-if="scope.row.sort === 'completed'">1999已完成内容</div>
          <div v-else-if="scope.row.sort === 'unCompleted'">1999待完成内容</div>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="公告内容" width="300">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input type="textarea" v-model="newNotice.content" />
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" width="120" :filters="[
        { text: '已发布', value: 1 },
        { text: '已撤销', value: 0 },
      ]" :filter-method="filterHandler">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-select placeholder="选择状态(默认为发布中)" v-model="newNotice.status" default-first-option>
              <el-option label="已发布" :value="1" />
              <el-option label="已撤销" :value="0" />
            </el-select>
          </div>
          <el-button text v-else-if="scope.row.status === 1">已发布</el-button>
          <el-button text type="danger" v-else-if="scope.row.status === 0">已撤销</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="created_time" label="创建时间" width="150">
        <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
      </el-table-column>
      <el-table-column prop="created_time" label="修订时间" width="150">
        <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <div v-if="isEditRow !== scope.$index">
            <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteRow(scope.$index, scope.row.id)">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button link type="primary" size="small" @click="handleCancel">取消
            </el-button>
            <el-button link type="primary" size="small" @click.prevent="checkUpdateRow(newNotice, scope.row)">
              更新
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-main>


  <el-dialog v-model="dialogVisible" :show-close="false" title="发布新公告">
    <el-form :model="form" label-width="auto" style="max-width: 600px;margin: 0 auto">
      <el-form-item label="公告标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="公告分类">
        <el-select v-model="form.sort" placeholder="选择公告类型">
          <el-option v-for="item in noticeSort" :label="item.text" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="公告内容">
        <el-input v-model="form.content" type="textarea" />
      </el-form-item>
      <div>
        <el-button @click="dialogVisible = false">取消发布</el-button>
        <el-button type="primary" @click="submitNotice(form)">发布公告</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>


<script setup lang="ts">
import axios from "axios";
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import type { TableColumnCtx, TableInstance } from "element-plus";
//hooks
import useTimeStamp from "@/hooks/useTimestamp";
//utils
import myFunction from "@/utils/myFunction";

const { getTime } = useTimeStamp()
const { diffObj } = myFunction




//发布公告面板的显示与隐藏
let dialogVisible = ref(false)

const tableRef = ref<TableInstance>()
//公告分类
const noticeSort = reactive([
  { text: '更新说明', value: 'updateNotes' },
  { text: '待更新内容', value: 'noUpdated' },
  { text: '1999已完成功能', value: 'completed' },
  { text: '1999待完成功能', value: 'unCompleted' },
])

//清空全部筛选条件
const clearFilter = () => {
  tableRef.value!.clearFilter()
}

//筛选器
const filterHandler = (
  value: string,
  row: Notice,
  column: TableColumnCtx<Notice>
) => {
  const property = column['property']
  return row[property] === value
}

//监听排序行为，并修改数组顺序,否则删除会出错
// function handleSortChange({column, prop, order}) {
//   // 根据 column 和 order 对 this.tableData 进行排序
//   tableData.sort((a, b) => {
//     if (a[prop] < b[prop]) return order === 'ascending' ? -1 : 1;
//     if (a[prop] > b[prop]) return order === 'ascending' ? 1 : -1;
//     return 0;
//   })
// }

let newNotice = reactive<Notice>({
  id: 0,
  title: '',
  sort: '',
  content: '',
  created_time: '',
  status: 0,
})

interface Notice {
  id?: number,
  title?: string,
  sort?: string,
  content?: string,
  created_time?: string,
  updated_time?: string,
  status?: number,
}

//获取全部公告
getNotices()

function getNotices() {
  axios({
    url: '/getAllNotices',
  }).then(result => {
    // console.log(result)
    const { msg, noticeList } = result.data
    ElMessage.success(msg)
    tableData.splice(0, tableData.length)
    noticeList.forEach((item: Notice) => {
      tableData.push(item)
    })
  }).catch(error => {
    console.log('发生错误：')
    console.dir(error)
  })
}


// const now = new Date()
let tableData = reactive([])
//编辑标记
let isEditRow = ref<number>(-1)

//编辑公告信息(修改编辑标记)
const handleEdit = (index: number, row: Notice) => {
  isEditRow.value = index
  newNotice = Object.assign(newNotice, row)
}

//还原编辑标记
function handleCancel() {
  isEditRow.value = -1
}

//对上传的数据进行格式检查
function checkUpdateRow(newData: Notice, oldData: Notice) {
  const data = <Notice>diffObj(newData, oldData)
  //判断公告信息是否修改
  if (Object.keys(data).length === 0) return ElMessage.info('公告信息未修改，已取消上传。')
  else {
    //校验格式


    updateRow(data, oldData)
  }
}

//上传更新的公告信息
function updateRow(data: Notice, oldData: Notice) {
  axios({
    url: '/updateNotice',
    method: 'post',
    data: {
      data,
      id: oldData.id   //id被洗掉了，手动添加
    }
  }).then(result => {
    // console.log(result)
    const { msg } = result.data
    //更新修订时间为当前时间
    data.updated_time = new Date().toISOString()
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


const form = reactive({
  title: '',
  sort: '',
  content: ''
})

//发布新的公告信息
function submitNotice(data: Notice) {
  if (data.title === '' || data.sort === '' || data.content === '') return ElMessage.error('公告标题、分类、内容均不能为空！')
  axios({
    url: '/submitNotice',
    method: 'post',
    data
  }).then(result => {
    // console.log(result)
    const { msg } = result.data
    ElMessage.success(msg)
    location.reload()
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    //ElMessage.error('发生错误：' + error.message)
  })
}



const deleteRow = (index: number, id: number) => {
  ElMessageBox.confirm(
    '确认删除该公告吗?',
    'Warning',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消删除',
      type: 'warning',
      showClose: false
    }
  )
    .then(() => {
      deleteNotice(index, id)
      console.log(index, id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除操作已取消',
      })
    })
}

//删除公告
const deleteNotice = (index: number, id: number) => {
  axios({
    url: '/deleteNotice',
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
