<template>
  <el-container>
    <el-header class="header1">
      <span v-if="!tableVisible">用户</span><span v-else>管理员</span>管理
    </el-header>
    <div class="header2">
      <el-switch v-if="isSuperAdmin"
                 v-model="tableVisible"
                 size="large"
                 active-text="管理员"
                 inactive-text="用户"
                 @click="getAllAdmins"
      />
      <el-button @click="clearFilter">清空全部筛选</el-button>
    </div>
    <el-main style="padding-bottom:0;padding-top: 0 ">
      <!--      用户-->
      <el-table v-show="!tableVisible" ref="tableRef" :data="tableData" style="width: 100%" max-height="500" stripe
                border
                highlight-current-row
                table-layout="auto" :default-sort="{ prop: 'uid', order: 'custom' }" @sort-change="handleSortChange">
        <el-table-column fixed prop="uid" label="UID" width="80" sortable/>
        <el-table-column prop="username" label="用户昵称" width="200">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newUserInfo.username" minlength="2" maxlength="10" show-word-limit/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="用户邮箱" width="200">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newUserInfo.email"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="signature" label="个性签名" width="250">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newUserInfo.signature" maxlength="30" show-word-limit/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="headImgUrl" sum-text label="用户头像" width="150" align="center">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newUserInfo.headImgId" placeholder="请输入图片ID"/>
            </div>
            <div v-else>
              <el-image :src="scope.row.headImgUrl" alt="" style="width: 50px" loading="lazy"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="headImgStatus" label="头像状态" width="120" :filters="[
           { text: '待审核', value: 0 },{ text: '审核通过', value: 1 },
              { text: '黑名单', value: 2 },
      ]"
                         :filter-method="filterHandler">
          <template #default="scope">
            <!--          <div v-if="isEditRow===scope.$index">-->
            <!--            <el-select placeholder="选择状态(默认为待审核)" v-model="newUserInfo.headImgStatus" default-first-option>-->
            <!--              <el-option label="待审核" :value="0"/>-->
            <!--              <el-option label="审核通过" :value="1"/>-->
            <!--              <el-option label="黑名单" :value="2"/>-->
            <!--            </el-select>-->
            <!--          </div>-->
            <el-button text type="primary" v-if="scope.row.headImgStatus===0">待审核</el-button>
            <el-button text type="info" v-else-if="scope.row.headImgStatus===1">审核通过</el-button>
            <el-button text type="danger" v-else-if="scope.row.headImgStatus===2">黑名单</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="bgUrl" label="背景图" width="150" align="center">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newUserInfo.bgId" placeholder="请输入图片ID"/>
            </div>
            <div v-else>
              <el-image :src="scope.row.bgUrl" alt="" style="width: 50px" loading="lazy"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="bgStatus" label="背景图状态" width="120" :filters="[
           { text: '待审核', value: 0 },{ text: '审核通过', value: 1 },
              { text: '黑名单', value: 2 },
      ]" :filter-method="filterHandler">
          <template #default="scope">
            <!--          <div v-if="isEditRow===scope.$index">-->
            <!--            <el-select placeholder="选择状态(默认为待审核)" v-model="newUserInfo.bgStatus" default-first-option>-->
            <!--              <el-option label="待审核" :value="0"/>-->
            <!--              <el-option label="审核通过" :value="1"/>-->
            <!--              <el-option label="黑名单" :value="2"/>-->
            <!--            </el-select>-->
            <!--          </div>-->
            <el-button text type="primary" v-if="scope.row.bgStatus===0">待审核</el-button>
            <el-button text type="info" v-else-if="scope.row.bgStatus===1">审核通过</el-button>
            <el-button text type="danger" v-else-if="scope.row.bgStatus===2">黑名单</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="150">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column prop="updated_time" label="更新时间" width="150">
          <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
        </el-table-column>
        <el-table-column label="设为管理员" width="100" v-if="isSuperAdmin">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="addAdmin(scope.row.uid)">设为管理员</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <div v-if="isEditRow!==scope.$index">
              <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button link type="danger" size="small" @click="deleteRow(scope.$index,scope.row.uid,false)">
                删除
              </el-button>
            </div>
            <div v-else>
              <el-button link type="primary" size="small" @click="handleCancel">取消
              </el-button>
              <el-button link type="primary" size="small" @click="checkUpdateRow(newUserInfo,scope.row,false)">
                更新
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--    管理员-->
      <el-table v-show="tableVisible" ref="tableRef2" :data="tableData2" style="width: 100%" max-height="500" stripe
                border highlight-current-row
                table-layout="auto" :default-sort="{ prop: 'uid', order: 'custom' }" @sort-change="handleSortChange">
        <el-table-column fixed prop="uid" label="UID" width="80" sortable/>
        <el-table-column prop="username" label="管理员昵称" width="200">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newUserInfo.username" minlength="2" maxlength="10" show-word-limit/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="管理员邮箱" width="200">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newUserInfo.email"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="password" label="管理员密码" width="250">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newUserInfo.password" placeholder="输入可修改密码" minlength="6" maxlength="18"
                        show-word-limit/>
            </div>
            <el-button text type="info" v-else-if="scope.row.password===''">不做展示</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="headImgUrl" sum-text label="用户头像" width="150" align="center">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newUserInfo.headImgId" placeholder="请输入图片ID"/>
            </div>
            <div v-else>
              <el-image :src="scope.row.headImgUrl" alt="" style="width: 50px" loading="lazy"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="headImgStatus" label="头像状态" width="120" :filters="[
           { text: '待审核', value: 0 },{ text: '审核通过', value: 1 },
              { text: '黑名单', value: 2 },
      ]"
                         :filter-method="filterHandler">
          <template #default="scope">
            <el-button text type="primary" v-if="scope.row.headImgStatus===0">待审核</el-button>
            <el-button text type="info" v-else-if="scope.row.headImgStatus===1">审核通过</el-button>
            <el-button text type="danger" v-else-if="scope.row.headImgStatus===2">黑名单</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="isSuperAdmin" label="管理员状态" width="130" :filters="[
           { text: '普通管理员', value: 0 },{ text: '超级管理员', value: 1 },
              { text: '权限冻结', value: 2 },
      ]" :filter-method="filterHandler">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-select placeholder="选择状态(默认为普通管理员)" v-model="newUserInfo.isSuperAdmin"
                         default-first-option>
                <el-option label="普通管理员" :value="0"/>
                <el-option disabled label="超级管理员" :value="1"/>
                <el-option label="权限冻结" :value="2"/>
              </el-select>
            </div>
            <el-button text type="info" v-else-if="scope.row.isSuperAdmin===0">普通管理员</el-button>
            <el-button text type="primary" v-else-if="scope.row.isSuperAdmin===1">超级管理员</el-button>
            <el-button text type="danger" v-else-if="scope.row.isSuperAdmin===2">权限冻结</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="150">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column prop="updated_time" label="更新时间" width="150">
          <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <div v-if="isEditRow!==scope.$index">
              <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button link type="danger" size="small" @click="deleteRow(scope.$index,scope.row.uid,true)">
                删除
              </el-button>
            </div>
            <div v-else>
              <el-button link type="primary" size="small" @click="handleCancel">取消
              </el-button>
              <el-button link type="primary" size="small" @click="checkUpdateRow(newUserInfo,scope.row,true)">
                更新
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import axios from "axios";
import {ElMessage, ElMessageBox, TableColumnCtx, type TableInstance} from "element-plus";
import {reactive, ref} from 'vue'
import useTimeStamp from "@/hooks/useTimestamp";
import useFunction from "@/hooks/useFunction";
import {UserInfo} from "@/types/user"

const {getTime} = useTimeStamp()
const {diffObj} = useFunction()
//控制用户列表和管理员列表
const tableVisible = ref(false)
//判断是否是超级管理员
const adminInfo = JSON.parse(sessionStorage.getItem('userInfo') || '')
const isSuperAdmin = ref((adminInfo?.isSuperAdmin === 1))


const tableRef = ref<TableInstance>()
const tableRef2 = ref<TableInstance>()
//清空全部筛选条件
const clearFilter = () => {
  tableRef.value!.clearFilter()
  tableRef2.value!.clearFilter()
}

//筛选器
const filterHandler = (
    value: string,
    row: UserInfo,
    column: TableColumnCtx<UserInfo>
) => {
  const property = column['property'] as keyof UserInfo
  return row[property] === value
}

//监听排序行为，并修改数组顺序,否则删除会出错
function handleSortChange({prop, order}: Sort) {
  // 根据 column 和 order 对 this.tableData 进行排序
  tableData.sort((a, b) => {
    if (a[prop] < b[prop]) return order === 'ascending' ? -1 : 1;
    if (a[prop] > b[prop]) return order === 'ascending' ? 1 : -1;
    return 0;
  })
  tableData2.sort((a, b) => {
    if (a[prop] < b[prop]) return order === 'ascending' ? -1 : 1;
    if (a[prop] > b[prop]) return order === 'ascending' ? 1 : -1;
    return 0;
  })
}


getAllUsers()


function getAllUsers() {
  axios({
    url: '/getAllUsers',
  }).then(result => {
    console.log(result)

    const {msg, userList} = result.data
    ElMessage.success(msg)
    tableData.splice(0, tableData.length)
    userList.forEach((item: UserInfo) => {
      tableData.push(item)
    })
  }).catch(error => {
    console.log('发生错误：')
    console.dir(error)
  })
}

function getAllAdmins() {
  if (!tableVisible.value) return
  axios({
    url: '/getAllAdmins',
  }).then(result => {
    console.log(result)
    const {msg, userList} = result.data
    ElMessage.success(msg)
    tableData2.splice(0, tableData2.length)
    userList.forEach((item: UserInfo) => {
      tableData2.push(item)
    })
  }).catch(error => {
    console.log('发生错误：')
    console.dir(error)
  })
}

// const now = new Date()
const newUserInfo: UserInfo = reactive({
  uid: 0,
  username: '',
  email: '',
  password: '',
  headImgId: 0,
  headImgUrl: '',
  headImgStatus: 0,
  bgId: null,
  bgUrl: '',
  bgStatus: null,
  signature: '',
  isSuperAdmin: 0,
  created_time: '',
  updated_time: '',
})

let tableData: UserInfo[] = reactive([])
let tableData2: UserInfo[] = reactive([])
//编辑标记
let isEditRow = ref<number>(-1)


//编辑用户信息(修改编辑标记)
const handleEdit = (index: number, row: UserInfo) => {
  isEditRow.value = index
  Object.assign(newUserInfo, row)
}


//还原编辑标记
function handleCancel() {
  isEditRow.value = -1
}

//对上传的数据进行格式检查
function checkUpdateRow(newData: UserInfo, oldData: UserInfo, isAdmin: boolean) {
  const data = <UserInfo>diffObj(newData, oldData)
  //判断用户信息是否修改
  if (Object.keys(data).length === 0) return ElMessage.info('用户信息未修改，已取消上传。')
  else {
    //校验格式

    //清洗多余数据
    Object.keys(data).forEach(key => {
      if (key === 'headImgUrl' || key === 'headImgStatus' || key === 'bgUrl' || key === 'bgStatus')
        delete data[key]
    })
    //如果是管理员信息
    if (isAdmin) Object.keys(data).forEach(key => {
      if (key === 'bgId' || key === 'signature')
        delete data[key]
    })
    else Object.keys(data).forEach(key => {
      if (key === 'isSuperAdmin' || key === 'password')
        delete data[key]
    })

    //uid被洗掉了，手动添加
    updateRow(data, oldData.uid, oldData, isAdmin)
  }
}


//上传新的用户信息
function updateRow(data: UserInfo, uid: number, oldData: UserInfo, isAdmin: boolean) {
  let url = '/updateUserInfo'
  if (isAdmin) url = '/updateAdminInfo'
  axios({
    url,
    method: 'post',
    data: {
      data,
      uid
    }
  }).then(result => {
    console.log(result)
    const {msg} = result.data
    //修改更新时间
    oldData.updated_time = (new Date()).toISOString()
    if (isSuperAdmin) data.password = ''
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


//添加管理员
function addAdmin(uid: number) {
  console.log(uid)
  if (!isSuperAdmin.value) return
  axios({
    url: '/addAdmin',
    method: 'post',
    data: {uid}
  }).then(result => {
    console.log(result)
    const {msg} = result.data
    ElMessage.success(msg)

  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}

//删除确认框
const deleteRow = (index: number, uid: number, isAdmin: boolean) => {
  let str = '用户'
  if (isAdmin) str = '管理员'
  ElMessageBox.confirm(
      `确认删除该${str}吗?`,
      'Warning',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消删除',
        type: 'warning',
        showClose: false
      }
  )
      .then(() => {
        deleteUser(index, uid, isAdmin)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '删除操作已取消',
        })
      })
}

//删除用户账号
const deleteUser = (index: number, uid: number, isAdmin: boolean) => {
  let url = '/deleteUser'
  if (isAdmin) url = '/deleteAdmin'
  axios({
    url,
    method: 'delete',
    data: {uid}
  }).then((result) => {
    console.log(result)
    ElMessage.success(result.data.msg)
    if (isAdmin) tableData2.splice(index, 1)
    else tableData.splice(index, 1)
  }).catch(error => {
    console.dir('发生错误：')
    console.log(error)
  })
}


// const onAddItem = () => {
//   now.setDate(now.getDate() + 1)
//   tableData.push({
//     date: dayjs(now).format('YYYY-MM-DD'),
//     name: 'Tom',
//     state: 'California',
//     city: 'Los Angeles',
//     address: 'No. 189, Grove St, Los Angeles',
//     zip: 'CA 90036',
//   })
// }


</script>


<style scoped>

</style>
