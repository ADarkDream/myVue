<template>
  <el-header class="header1">
    图片管理
  </el-header>
  <div class="header2">
    <el-button type="primary" @click="dialogVisible = true">上传图片</el-button>
    <el-button @click="clearFilter">清空全部筛选</el-button>
  </div>
  <el-main style="padding-bottom:0;padding-top: 0 ">
    <el-table ref="tableRef" :data="tableData" style="width: 100%" max-height="500" stripe border highlight-current-row
      table-layout="auto" type="type" :default-sort="{ prop: 'id', order: 'custom' }">
      <el-table-column fixed prop="id" label="ID" width="70" sortable />

      <el-table-column fixed prop="sort" label="分类" width="120" :filters="[{ text: '头像', value: 'headImg' },
      { text: '背景', value: 'bg' },
      { text: '黑名单', value: 'blacklist' },]" :filter-method="filterHandler">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-select placeholder="选择状态" v-model="urlInfo.sort">
              <el-option label="头像" value="headImg" />
              <el-option label="背景" value="bg" />
              <el-option label="黑名单" value="blacklist" />
            </el-select>
          </div>
          <el-button text type="danger" v-else-if="scope.row.sort === 'blacklist' || scope.row.status === 2">黑名单
          </el-button>
          <el-button text v-else-if="scope.row.sort === 'headImg'">头像</el-button>
          <el-button text v-else-if="scope.row.sort === 'bg'">背景</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed prop="status" label="状态" width="120" :filters="[
        { text: '待审核', value: 0 }, { text: '审核通过', value: 1 },
        { text: '黑名单', value: 2 },
      ]" :filter-method="filterHandler">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-select placeholder="选择状态(默认为待审核)" v-model="urlInfo.status" default-first-option>
              <el-option label="待审核" :value="0" />
              <el-option label="审核通过" :value="1" />
              <el-option label="黑名单" :value="2" />
            </el-select>
          </div>
          <el-button text type="primary" v-else-if="scope.row.status === 0">待审核</el-button>
          <el-button text type="info" v-else-if="scope.row.status === 1">审核通过</el-button>
          <el-button text type="danger" v-else-if="scope.row.status === 2">黑名单</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="imgUrl" sum-text label="网址" width="150" align="center">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="urlInfo.imgUrl" placeholder="请输入图片链接" />
          </div>
          <div v-else>
            <el-image :src="scope.row.imgUrl" alt="" style="width: 50px" loading="lazy" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="imgName" label="图片名" width="200">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="urlInfo.imgName" placeholder="请输入图片名称" />
          </div>
          <div v-else>
            {{ scope.row.imgName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="imgPath" sum-text label="服务器存储路径" width="150" align="center" />
      <el-table-column prop="imgMD5" label="MD5值" width="100" />
      <el-table-column prop="uid" label="上传用户UID" width="100" sortable />
      <el-table-column prop="created_time" label="修改时间" width="150">
        <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
      </el-table-column>
      <el-table-column prop="created_time" label="创建时间" width="150">
        <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <div v-if="isEditRow !== scope.$index">
            <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteRow(scope.$index, scope.row)">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button link type="primary" size="small" @click="handleCancel">取消
            </el-button>
            <el-button link type="primary" size="small" @click.prevent="checkUpdateRow(urlInfo, scope.row)">
              更新
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-main>

  <!--图片上传框-->
  <el-dialog v-model="dialogVisible" :show-close="false" title="上传图片">
    <UploadImage />
  </el-dialog>
</template>


<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import type { TableColumnCtx, TableInstance } from "element-plus";
//hooks
import UploadImage from "@/components/UploadImage.vue";
//components
import useTimeStamp from "@/hooks/useTimestamp";
import useFunction from "@/hooks/useFunction";

const { getTime } = useTimeStamp()
const { diffObj } = useFunction()


//上传图片面板的显示与隐藏
let dialogVisible = ref(false)

const tableRef = ref<TableInstance>()

//清空全部筛选条件
const clearFilter = () => {
  tableRef.value!.clearFilter()
}

//筛选器
const filterHandler = (
  value: string,
  row: Image,
  column: TableColumnCtx<Image>
) => {
  const property = column['property'] as keyof Image
  return row[property] === value
}

//监听排序行为，并修改数组顺序,否则删除会出错
// function handleSortChange({prop, order}: Sort<Image>) {
//   // 根据 column 和 order 对 this.tableData 进行排序
//   tableData.sort((a, b) => {
//     const propA = a[prop as keyof typeof a]
//     const propB = b[prop as keyof typeof b]
//     if (propA < propB) return order === 'ascending' ? -1 : 1;
//     if (propA > propB) return order === 'ascending' ? 1 : -1;
//     return 0
//   })
// }

//当前修改的图片信息
let urlInfo: Image = reactive({
  id: 0,
  uid: 0,
  sort: '',
  status: 0,
  imgUrl: '',
  imgPath: '',
  imgMD5: '',
  imgName: '',
  created_time: '',
  updated_time: '',
})



//获取全部图片
getImages()

function getImages() {
  axios({
    url: '/getImages',
  }).then(result => {
    console.log(result)
    const { msg, data } = result.data
    ElMessage.success(msg)
    tableData.splice(0, tableData.length)
    data.forEach((item: Image) => {
      tableData.push(item)
    })
  }).catch(error => {
    console.log('发生错误：')
    console.dir(error)
  })
}


const tableData: Image[] = reactive([])
//编辑标记
const isEditRow = ref<number>(-1)

//编辑图片信息(修改编辑标记)
const handleEdit = (index: number, row: Image) => {
  isEditRow.value = index
  urlInfo = Object.assign(urlInfo, row)
}

//还原编辑标记
function handleCancel() {
  isEditRow.value = -1
}

//对上传的数据进行格式检查
function checkUpdateRow(newData: Image, oldData: Image) {
  //判断是否修改为黑名单
  if (newData.status === 2) newData.sort = 'blacklist'
  const data = <Image>diffObj(newData, oldData)
  //判断公告信息是否修改
  if (Object.keys(data).length === 0) return ElMessage.info('图片信息未修改，已取消上传。')
  else {
    //校验格式


    //id被洗掉了，手动添加
    updateRow(data, oldData.id, oldData)
  }
}

//上传更新的图片信息
function updateRow(data: Image, id: number, oldData: Image) {
  axios({
    url: '/updateImage',
    method: 'post',
    data: {
      data,
      id
    }
  }).then(result => {
    // console.log(result)
    const { msg, newPath } = result.data
    //判断是否修改文件路径
    if (newPath !== undefined) data.imgPath = newPath
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


//图片删除确认
const deleteRow = (index: number, info: Image) => {
  ElMessageBox.confirm(
    '确认删除该图片吗?',
    'Warning',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消删除',
      type: 'warning',
      showClose: false
    }
  )
    .then(() => {
      deleteImage(index, info)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除操作已取消',
      })
    })
}

//删除图片
const deleteImage = (index: number, data: Image) => {
  axios({
    url: '/deleteImage',
    method: 'delete',
    data
  }).then((result) => {
    // console.log(result)
    ElMessage.success(result.data.msg)
    tableData.splice(index, 1)
    ElMessage.info('因为浏览器和CDN缓存，图片链接可能一段时间后才失效')
  }).catch(error => {
    console.dir('发生错误：' + error)
  })
}
</script>


<style scoped></style>
