<template>
  <el-header class="header1"> 导航管理 </el-header>
  <div class="header2">
    <el-col :span="3">
      <el-button type="primary" @click="dialogVisible = true">发布新导航</el-button>
    </el-col>
    <el-col :span="3">
      <el-input v-model.trim="searchUrl.name" placeholder="网站名" clearable :prefix-icon="Search" />
    </el-col>
    <el-col :span="3">
      <el-input v-model.trim="searchUrl.detail" placeholder="网站简介" clearable :prefix-icon="Search" />
    </el-col>
    <el-col :span="3" v-if="false">
      <el-input v-model.trim="searchUrl.uid" placeholder="上传者uid" clearable :prefix-icon="Search" />
    </el-col>
    <el-col :span="3">
      <el-select v-model.trim="searchUrl.status" placeholder="All">
        <el-option label="网站状态(全选)" :value="2" />
        <el-option label="正在使用" :value="1" />
        <el-option label="待审核" :value="0" />
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select v-model.trim="searchUrl.sort" placeholder="All">
        <el-option label="网站分类(全选)" value="" />
        <el-option v-for="(item, index) in sort" :key="index" :label="item.text" :value="item.value" />
      </el-select>
    </el-col>
    <el-col :span="3" v-if="false">
      <el-input v-model.trim="searchUrl.tags" placeholder="网站标签" clearable :prefix-icon="Search" />
    </el-col>
    <el-col :span="5">
      <el-button @click="filterChange" type="primary">筛选查找</el-button>
      <el-button @click="clearFilter">清空全部筛选</el-button>
    </el-col>
  </div>
  <el-main style="padding: 0">
    <el-form class="search" :model="newUrl" label-position="left" label-width="auto">
      <el-form-item label-width="auto"> </el-form-item>
    </el-form>

    <el-table
      ref="tableRef"
      :data="tableData"
      style="width: 100%"
      max-height="500"
      stripe
      border
      highlight-current-row
      table-layout="auto"
      type="type"
      :default-sort="{ prop: 'id', order: 'custom' }"
      @sort-change="handleSortChange"
    >
      <!--              @filter-change="filterChange">-->
      <el-table-column fixed prop="id" label="ID" width="70" align="center" sortable />
      <el-table-column prop="img" label="图标" width="60" align="center">
        <template #default="scope">
          <el-input v-if="isEditRow === scope.$index" v-model="newUrl.img" />
          <el-image v-else :src="scope.row.img" style="width: 20px" lazy />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="网站名" width="150">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUrl.name" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="detail" label="网站简介" width="150">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUrl.detail" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="网站地址" width="300">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input type="text" v-model="newUrl.url" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="上传用户uid" width="120" align="center">
        <template #default="scope">
          <el-button text v-if="scope.row.uid === 0">管理员</el-button>
          <el-button text v-else type="primary">{{ scope.row.uid }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="网站状态" width="130" align="center">
        <!--                       :filters="[ {text: '待审核', value: 0},{text: '正在使用', value: 1}]" column-key="status">-->
        <!--                       :filter-method="filterHandler">-->
        <template #default="scope">
          <template v-if="isEditRow === scope.$index">
            <el-select placeholder="待审核" v-model="newUrl.status" default-first-option>
              <el-option label="待审核" :value="0" />
              <el-option label="正在使用" :value="1" />
            </el-select>
          </template>
          <template v-else>
            <el-button text v-if="scope.row.status === 1">正在使用</el-button>
            <el-button text type="primary" v-else-if="scope.row.status === 0">待审核</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="网站分类" width="130" align="center">
        <!--                       :filters="sort" :column-key="'sort'">-->
        <!--                       :filter-method="filterHandler">-->
        <template #default="scope">
          <template v-if="isEditRow === scope.$index">
            <el-select placeholder="选择分类(默认为更新说明)" v-model="newUrl.sort" default-first-option>
              <el-option v-for="(item, index) in sort" :key="index" :label="item.text" :value="item.value" />
            </el-select>
          </template>
          <template v-else>
            <div>{{ getText(scope.row.sort) }}</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="120" align="center" v-if="false" />

      <el-table-column prop="updated_time" label="更新时间" width="150" align="center">
        <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template #default="scope">
          <div v-if="isEditRow !== scope.$index">
            <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteRow(scope.$index, scope.row.id)"> 删除 </el-button>
          </div>
          <div v-else>
            <el-button link type="primary" size="small" @click="handleCancel">取消 </el-button>
            <el-button link type="primary" size="small" @click.prevent="checkUpdateRow(newUrl, scope.row)"> 更新 </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageMenu">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 25, 50, 100]"
        :layout="total / pageSize > 10 ? 'total, sizes, prev, pager, next,jumper' : 'total, sizes, prev, pager, next'"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-main>

  <!--添加导航网站-->
  <el-dialog v-model="dialogVisible" :show-close="false" title="发布新网址">
    <AddUrl />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import momo from "@/apis"
import { Search } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import type { TableInstance } from "element-plus"
//hooks
import useTimeStamp from "@/hooks/useTimestamp"
//components
import AddUrl from "@/components/AddUrl.vue"
//utils
import myFunction from "@/utils/myFunction"

const { getTime } = useTimeStamp()
const { diffObj } = myFunction

//添加导航网站面板的显示与隐藏
let dialogVisible = ref(false)

const tableRef = ref<TableInstance>()

//清空全部筛选条件
const clearFilter = () => {
  // tableRef.value!.clearFilter()
  // render()
  // total.value = totalData.length
  searchUrl.name = ""
  searchUrl.detail = ""
  // searchUrl.uid=''
  searchUrl.status = 2
  searchUrl.sort = ""
  // searchUrl.tags=''
  render()
  total.value = totalData.length
  flag.value = true
}

//监听排序行为，并修改数组顺序,否则删除会出错
function handleSortChange() {
  // 根据 column 和 order 对 totalData 进行排序
  // totalData.sort((a, b) => {
  //   if (a[prop] < b[prop]) return order === 'ascending' ? -1 : 1;
  //   if (a[prop] > b[prop]) return order === 'ascending' ? 1 : -1;
  //   return 0;
  // })
  if (flag.value) render()
}

//筛选标记(false表示筛选过了)
const flag = ref(true)

//筛选方法
function filterChange() {
  //预设筛选条件
  const filterName = (item) => (searchUrl.name === "" ? true : item.name.toLowerCase().includes(searchUrl.name.toLowerCase()))
  const filterDetail = (item) =>
    searchUrl.detail === "" ? true : item.detail.toLowerCase().includes(searchUrl.detail.toLowerCase())
  // const filterUid = item => item.uid.toString().includes(searchUrl.uid.toString())
  const filterStatus = (item) => (searchUrl.status === 2 ? true : item.status === searchUrl.status)
  const filterSort = (item) => (searchUrl.sort === "" ? true : item.sort.includes(searchUrl.sort))
  const filterTags = (item) => (searchUrl.tags === "" ? true : item.tags.includes(searchUrl.tags))
  //开始筛选
  const newArr = totalData.filter((item) => filterName(item) && filterDetail(item) && filterStatus(item) && filterSort(item))
  //将表格显示的数据清空再填充筛选后的数据
  tableData.splice(0, tableData.length, ...newArr)
  //修改筛选标记(false表示筛选过了)
  flag.value = false
  total.value = tableData.length
}

//表格里的数据
let tableData = reactive([])
//总的数据
const totalData = reactive([])
//当前页码
const currentPage = ref(1)
//每页显示多少条数据
const pageSize = ref(25)
const total = ref(totalData.length)
watch(pageSize, (value, oldValue, onCleanup) => {
  console.log(value)
})

function render() {
  //清空表格显示的数据
  tableData.splice(0, tableData.length)
  //根据当前页码计算出应显示的数据
  const newData = totalData.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
  newData.forEach((item: Url) => {
    tableData.push(item)
  })
}

const handleSizeChange = (val: number) => {
  render()
}
const handleCurrentChange = (val: number) => {
  render()
}

let searchUrl = reactive<Url>({
  id: 0,
  img: "",
  name: "",
  detail: "",
  uid: 0,
  url: "",
  sort: "",
  tags: "",
  status: 2,
  updated_time: "",
})

let newUrl = reactive<Url>({
  id: 0,
  img: "",
  name: "",
  detail: "",
  url: "",
  sort: "",
  tags: "",
  status: 1,
  updated_time: "",
})

interface Url {
  id?: number
  img?: string
  name?: string
  detail?: string
  url?: string
  sort?: string
  tags?: string
  status?: number
  uid?: number
  updated_time?: string
}

interface Sort {
  text: string
  value: string
}

let sort = reactive<Sort[]>([
  { text: "软件下载", value: "tool" },
  { text: "在线工具", value: "onlineTool" },
  { text: "机器人", value: "robot" },
  { text: "HTML", value: "html" },
  { text: "观影", value: "video" },
  { text: "电子书", value: "book" },
  { text: "教程", value: "tutorial" },
  { text: "虚拟机", value: "vm" },
  { text: "杂项", value: "other" },
  { text: "娱乐", value: "webGame" },
])

const getText = (value: string) => sort.find((item) => item.value === value)

//获取全部网址
getAllUrlList()

function getAllUrlList() {
  momo
    .get("/getAllUrlList")
    .then((result) => {
      console.log(result)
      const { msg, urlList } = result
      ElMessage.success(msg)
      total.value = urlList.length

      // tableData.splice(0, tableData.length)
      // urlList.forEach((item: Url) => {
      //   tableData.push(item)
      // })
      totalData.splice(0, totalData.length)
      urlList.forEach((item: Url) => {
        totalData.push(item)
      })
      render()
    })
    .catch((error) => {
      console.log("发生错误：")
      console.dir(error)
    })
}

//编辑标记
let isEditRow = ref<number>(-1)

//编辑网址信息(修改编辑标记)
const handleEdit = (index: number, row: Url) => {
  isEditRow.value = index
  newUrl = Object.assign(newUrl, row)
}

//还原编辑标记
function handleCancel() {
  isEditRow.value = -1
}

//对上传的数据进行格式检查
function checkUpdateRow(newData: Url, oldData: Url) {
  const data = diffObj(newData, oldData) as Url
  //判断网址信息是否修改
  if (Object.keys(data).length === 0) return ElMessage.info("网址信息未修改，已取消上传。")
  //校验格式
  updateRow(data, oldData.id, oldData)
}

//上传更新的网址信息
function updateRow(data: Url, id: number, oldData: Url) {
  momo
    .post("/updateUrl", {
      data,
      id,
    })
    .then((result) => {
      // console.log(result)
      const { msg } = result
      //更新修订时间为当前时间
      data.updated_time = new Date().toISOString()
      //将修改后的信息显示出来
      Object.assign(oldData, data)
      //去除编辑标记
      isEditRow.value = -1
      ElMessage.success(msg)
    })
    .catch((error) => {
      console.log("发生错误：")
      console.log(error)
      ElMessage.error(error.msg)
    })
}

const deleteRow = (index: number, id: number) => {
  ElMessageBox.confirm("确认删除该导航网站吗?", "Warning", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消删除",
    type: "warning",
    showClose: false,
  })
    .then(() => {
      deleteUrl(index, id)
    })
    .catch(() => ElMessage.info("删除操作已取消"))
}

//删除网址
const deleteUrl = (index: number, id: number) => {
  momo
    .delete("/deleteUrl", { id })
    .then((result) => {
      // console.log(result)
      ElMessage.success(result.msg)

      const newArr = totalData.filter((item) => item.id !== id)
      totalData.splice(0, totalData.length, ...newArr)
      filterChange()
      // location.reload()
    })
    .catch((error) => {
      console.dir("发生错误：" + error)
    })
}
</script>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

.pageMenu {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}
</style>
