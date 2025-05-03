<template>
  <div>
    <el-header class="header1"> {{ tableVisible ? "管理员" : "用户" }}管理 </el-header>
    <div class="header2">
      <el-switch
        v-if="isSuperAdmin"
        v-model="tableVisible"
        active-text="管理员"
        inactive-text="用户"
        size="large"
        @click="getAllAdmins"
      />
      <el-button @click="clearFilter">清空全部筛选</el-button>
    </div>

    <!--      用户-->
    <el-table
      v-if="!tableVisible"
      ref="tableRef"
      border
      :data="tableData"
      :default-sort="{ prop: 'uid', order: 'ascending' }"
      highlight-current-row
      stripe
      style="width: 100%"
      table-layout="auto"
      @sort-change="handleSortChange"
    >
      <el-table-column fixed label="UID" prop="uid" sortable min-width="80" />
      <el-table-column label="用户昵称" prop="username" min-width="200">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUserInfo.username" maxlength="10" minlength="2" show-word-limit />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户邮箱" prop="email" min-width="200">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUserInfo.email" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="个性签名" prop="signature" min-width="250">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUserInfo.signature" maxlength="30" show-word-limit />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户头像" prop="headImgUrl" sum-text min-width="150">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUserInfo.headImgId" placeholder="请输入图片ID" />
          </div>
          <div v-else>
            <el-image alt="" loading="lazy" :src="scope.row.headImgUrl" style="width: 50px" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :filter-method="filterHandler"
        :filters="[
          { text: '待审核', value: 0 },
          { text: '审核通过', value: 1 },
          { text: '黑名单', value: 2 },
        ]"
        label="头像状态"
        prop="headImgStatus"
        min-width="120"
      >
        <template #default="scope">
          <!--          <div v-if="isEditRow===scope.$index">-->
          <!--            <el-select placeholder="选择状态(默认为待审核)" v-model="newUserInfo.headImgStatus" default-first-option>-->
          <!--              <el-option label="待审核" :value="0"/>-->
          <!--              <el-option label="审核通过" :value="1"/>-->
          <!--              <el-option label="黑名单" :value="2"/>-->
          <!--            </el-select>-->
          <!--          </div>-->
          <el-button v-if="scope.row.headImgStatus === 0" text type="primary">待审核</el-button>
          <el-button v-else-if="scope.row.headImgStatus === 1" text type="info">审核通过</el-button>
          <el-button v-else-if="scope.row.headImgStatus === 2" text type="danger">黑名单</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="背景图" prop="bgUrl" min-width="150">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUserInfo.bgId" placeholder="请输入图片ID" />
          </div>
          <div v-else>
            <el-image alt="" loading="lazy" :src="scope.row.bgUrl" style="width: 50px" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :filter-method="filterHandler"
        :filters="[
          { text: '待审核', value: 0 },
          { text: '审核通过', value: 1 },
          { text: '黑名单', value: 2 },
        ]"
        label="背景图状态"
        prop="bgStatus"
        min-width="120"
      >
        <template #default="scope">
          <!--          <div v-if="isEditRow===scope.$index">-->
          <!--            <el-select placeholder="选择状态(默认为待审核)" v-model="newUserInfo.bgStatus" default-first-option>-->
          <!--              <el-option label="待审核" :value="0"/>-->
          <!--              <el-option label="审核通过" :value="1"/>-->
          <!--              <el-option label="黑名单" :value="2"/>-->
          <!--            </el-select>-->
          <!--          </div>-->
          <el-button v-if="scope.row.bgStatus === 0" text type="primary">待审核</el-button>
          <el-button v-else-if="scope.row.bgStatus === 1" text type="info">审核通过</el-button>
          <el-button v-else-if="scope.row.bgStatus === 2" text type="danger">黑名单</el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_time" min-width="150">
        <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_time" min-width="150">
        <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
      </el-table-column>
      <el-table-column v-if="isSuperAdmin" label="设为管理员" min-width="100">
        <template #default="scope">
          <el-button link size="small" type="primary" @click="addAdmin(scope.row.uid)">设为管理员</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template #default="scope">
          <div v-if="isEditRow !== scope.$index">
            <el-button link size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button link size="small" type="danger" @click="deleteRow(scope.$index, scope.row, false)"> 删除 </el-button>
          </div>
          <div v-else>
            <el-button link size="small" type="primary" @click="handleCancel">取消 </el-button>
            <el-button link size="small" type="primary" @click="checkUpdateRow(newUserInfo, scope.row, false)"> 更新 </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--    管理员-->
    <el-table
      v-else
      ref="tableRef2"
      border
      :data="tableData2"
      :default-sort="{ prop: 'uid', order: 'ascending' }"
      highlight-current-row
      stripe
      style="width: 100%"
      table-layout="auto"
      @sort-change="handleSortChange"
    >
      <el-table-column fixed label="UID" prop="uid" sortable min-width="80" />
      <el-table-column label="管理员昵称" prop="username" min-width="200">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUserInfo.username" maxlength="10" minlength="2" show-word-limit />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="管理员邮箱" prop="email" min-width="200">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUserInfo.email" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="管理员密码" prop="password" min-width="250">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUserInfo.password" maxlength="18" minlength="6" placeholder="输入可修改密码" show-word-limit />
          </div>
          <el-button v-else-if="scope.row.password === ''" text type="info">不做展示</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户头像" prop="headImgUrl" sum-text min-width="150">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newUserInfo.headImgId" placeholder="请输入图片ID" />
          </div>
          <div v-else>
            <el-image alt="" loading="lazy" :src="scope.row.headImgUrl" style="width: 50px" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :filter-method="filterHandler"
        :filters="[
          { text: '待审核', value: 0 },
          { text: '审核通过', value: 1 },
          { text: '黑名单', value: 2 },
        ]"
        label="头像状态"
        prop="headImgStatus"
        min-width="120"
      >
        <template #default="scope">
          <el-button v-if="scope.row.headImgStatus === 0" text type="primary">待审核</el-button>
          <el-button v-else-if="scope.row.headImgStatus === 1" text type="info">审核通过</el-button>
          <el-button v-else-if="scope.row.headImgStatus === 2" text type="danger">黑名单</el-button>
        </template>
      </el-table-column>
      <el-table-column
        :filter-method="filterHandler"
        :filters="[
          { text: '普通管理员', value: 0 },
          { text: '超级管理员', value: 1 },
          { text: '权限冻结', value: 2 },
        ]"
        label="管理员状态"
        prop="isSuperAdmin"
        min-width="130"
      >
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-select v-model="newUserInfo.isSuperAdmin" default-first-option placeholder="选择状态(默认为普通管理员)">
              <el-option label="普通管理员" :value="0" />
              <el-option disabled label="超级管理员" :value="1" />
              <el-option label="权限冻结" :value="2" />
            </el-select>
          </div>
          <el-button v-else-if="scope.row.isSuperAdmin === 0" text type="info">普通管理员</el-button>
          <el-button v-else-if="scope.row.isSuperAdmin === 1" text type="primary">超级管理员</el-button>
          <el-button v-else-if="scope.row.isSuperAdmin === 2" text type="danger">权限冻结</el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_time" min-width="150">
        <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_time" min-width="150">
        <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template #default="scope">
          <div v-if="isEditRow !== scope.$index">
            <el-button link size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button link size="small" type="danger" @click="deleteRow(scope.$index, scope.row, true)"> 删除 </el-button>
          </div>
          <div v-else>
            <el-button link size="small" type="primary" @click="handleCancel">取消 </el-button>
            <el-button link size="small" type="primary" @click="checkUpdateRow(newUserInfo, scope.row, true)"> 更新 </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import momo from "@/apis"
import { reactive, ref } from "vue"
import { ElMessage, ElMessageBox, TableColumnCtx, type TableInstance } from "element-plus"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
const userInfoStore = useUserInfoStore()

//hooks
import useTimeStamp from "@/hooks/useTimestamp"
//types
import { UserInfo } from "@/types/user"
//utils
import myFunction from "@/utils/myFunction"
import { ResultData } from "@/types/global"

const { getTime } = useTimeStamp()
const { diffObj } = myFunction
//控制用户列表和管理员列表
const tableVisible = ref(false)
//判断是否是超级管理员
const { isSuperAdmin } = userInfoStore

const tableRef = ref<TableInstance>()
const tableRef2 = ref<TableInstance>()
//清空全部筛选条件
const clearFilter = () => {
  tableRef.value!.clearFilter()
  tableRef2.value!.clearFilter()
}

//筛选器
const filterHandler = (value: string, row: UserInfo, column: TableColumnCtx<UserInfo>) => {
  const property = column["property"] as keyof UserInfo
  return row[property] === value
}

//监听排序行为，并修改数组顺序,否则删除会出错
// function handleSortChange({prop, order}: Sort<UserInfo>) {
function handleSortChange() {
  if (isEditRow.value !== -1) isEditRow.value = -1
  // console.log(sortByTime(tableData, prop, order))
  console.log(111)
  // sortByTime(tableData, prop, order)
  // sortByTime(tableData2, prop, order)
}

getAllUsers()

function getAllUsers() {
  momo
    .get<ResultData<{ userList: UserInfo[] }>>("/getAllUsers")
    .then((result) => {
      console.log(result)

      const { msg, userList } = result
      ElMessage.success(msg)
      tableData.splice(0, tableData.length)
      userList.forEach((item: UserInfo) => {
        tableData.push(item)
      })
    })
    .catch((error) => {
      console.log("发生错误：")
      console.dir(error)
    })
}

function getAllAdmins() {
  if (!tableVisible.value) return
  momo
    .get("/getAllAdmins")
    .then((result) => {
      console.log(result)
      const { msg, userList } = result
      ElMessage.success(msg)
      tableData2.splice(0, tableData2.length)
      userList.forEach((item: UserInfo) => {
        tableData2.push(item)
      })
    })
    .catch((error) => {
      console.log("发生错误：")
      console.dir(error)
    })
}

// const now = new Date()
const newUserInfo: UserInfo = reactive({
  uid: 0,
  username: "",
  email: "",
  password: "",
  headImgId: 0,
  headImgUrl: "",
  headImgStatus: 0,
  bgId: null,
  bgUrl: "",
  bgStatus: null,
  signature: "",
  isSuperAdmin: 0,
  created_time: "",
  updated_time: "",
})

const tableData: UserInfo[] = reactive([])
const tableData2: UserInfo[] = reactive([])
//编辑标记
const isEditRow = ref<number>(-1)

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
  const data = diffObj(newData, oldData) as UserInfo
  //判断用户信息是否修改
  if (Object.keys(data).length === 0) return ElMessage.info("用户信息未修改，已取消上传。")

  //清洗多余数据
  let { headImgUrl, headImgStatus, bgUrl, bgStatus, ...restData } = data

  //如果是管理员信息
  if (isAdmin) {
    const { bgId, signature, ...lastData } = data
    restData = lastData
  } else {
    const { isSuperAdmin, password, ...lastData } = data
    restData = lastData
  }

  //uid被洗掉了，手动添加
  updateRow(restData, oldData.uid!, oldData, isAdmin)
}

//上传新的用户信息
function updateRow(data: UserInfo, uid: number, oldData: UserInfo, isAdmin: boolean) {
  let url = "/updateUserInfo"
  if (isAdmin) url = "/updateAdminInfo"
  momo
    .post(url, {
      data,
      uid,
    })
    .then((result) => {
      console.log(result)
      const { msg } = result
      //修改更新时间
      oldData.updated_time = new Date().toISOString()
      if (isSuperAdmin.value) data.password = ""
      //将修改后的信息显示出来
      Object.assign(oldData, data)
      //去除编辑标记
      isEditRow.value = -1
      ElMessage.success(msg)
    })
    .catch((error) => {
      console.log("发生错误：")
      console.log(error)
      //ElMessage.error('发生错误：' + error.message)
    })
}

//添加管理员
function addAdmin(uid: number) {
  console.log(uid)
  if (!isSuperAdmin.value) return
  momo
    .post("/addAdmin", { uid })
    .then((result) => {
      console.log(result)
      const { msg } = result
      ElMessage.success(msg)
    })
    .catch((error) => {
      console.log("发生错误：")
      console.log(error)
    })
}

//删除确认框
const deleteRow = (index: number, row: UserInfo, isAdmin: boolean) => {
  const { uid, username } = row
  console.log(tableData2.splice(1, 1))
  console.log(row)
  // handleSortChange()
  ElMessageBox.confirm(`确认删除${isAdmin ? "管理员" : "用户"}${username},${index}吗?`, "Warning", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消删除",
    type: "warning",
    showClose: false,
  })
    .then(() => {
      deleteUser(index, uid, isAdmin)
    })
    .catch(() => ElMessage.info("删除操作已取消"))
}

//删除用户账号
const deleteUser = (index: number, uid: number, isAdmin: boolean) => {
  let url = "/deleteUser"
  if (isAdmin) url = "/deleteAdmin"
  momo
    .delete(url, { uid })
    .then((result) => {
      console.log(result)
      ElMessage.success(result.msg)
      if (isAdmin) tableData2.splice(index, 1)
      else tableData.splice(index, 1)
    })
    .catch((error) => {
      console.dir("发生错误：")
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

<style scoped></style>
