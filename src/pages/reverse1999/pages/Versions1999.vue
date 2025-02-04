<template>
  <div class="versions1999">
    <div class="header">
      <el-button :icon="Plus" type="primary" @click="toggleAddVersionDrawer(true)">新增版本信息</el-button>
      <el-button :icon="Refresh" plain type="success" @click="refreshVersion()">刷新</el-button>
    </div>
    <el-table
      ref="tableRef"
      border
      class="myCustomElTable"
      :data="tableData"
      flexible
      highlight-current-row
      :max-height="mainPanelContentHeight - (isPC ? 75 : 35)"
      stripe
      table-layout="auto"
    >
      <el-table-column align="center" label="ID" min-width="50" prop="id" />
      <el-table-column align="center" label="版本名称" min-width="140" prop="versionName" />
      <el-table-column align="center" label="版本值" min-width="60" prop="version" />
      <el-table-column align="center" label="官方上传时间" min-width="130" prop="time">
        <template #default="scope">
          <el-tag v-for="time in scope.row.time" :key="time" type="primary">{{ time }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="isAdmin" align="center" label="状态" min-width="100" prop="status">
        <template #default="scope">
          {{ statusOptions[scope.row.status!].label }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="上次修改时间" min-width="150" prop="updated_time">
        <template #default="scope">
          {{ getTime(scope.row.updated_time) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100">
        <template #default="scope">
          <el-button
            :disabled="!canEdit(scope.row.status)"
            link
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            :disabled="!canDel(scope.row.status)"
            link
            size="small"
            type="danger"
            @click="deleteRow(scope.$index, scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑版本信息的抽屉-->
    <el-drawer
      v-model="isShowAddVersionDrawer"
      :append-to-body="true"
      :before-close="beforeCloseDrawer"
      direction="btt"
      :show-close="false"
      size="40%"
      :title="isEdit ? '编辑版本信息' : '添加版本信息'"
      @close="reSetFormData()"
    >
      <AddVersion />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"
import type { TableInstance } from "element-plus"
import { Refresh, Plus } from "@element-plus/icons-vue"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { useReverse1999Store } from "@/store/reverse1999/useReverse1999Store"
import { useRolesStore } from "@/store/reverse1999/useRolesStore"
import { useVersionsStore } from "@/store/reverse1999/useVersionsStore"
//hooks
import useTimeStamp from "@/hooks/useTimestamp"
import useReverse1999 from "@/hooks/reverse1999/useReverse1999"
//components
const AddVersion = defineAsyncComponent(() => import("../components/AddVersion.vue"))
//utils
import myFunction from "@/utils/myFunction"
import fileProcess from "@/utils/fileProcess"
//types

//files

const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const reverse1999Store = useReverse1999Store()
const versionsStore = useVersionsStore()
const { allRoleInfo, versionInfo, statusOptions } = toRefs(reverse1999Store)
const { isShowAddVersionDrawer, isEdit } = toRefs(versionsStore)
const { toggleAddVersionDrawer, reSetFormData } = versionsStore
const { getTime } = useTimeStamp()
const { diffObj } = myFunction
const { getVersion, updateVersion } = useReverse1999()

//屏幕高度
const { mainPanelContentHeight, screenHeight, isPC } = toRefs(responsiveStore)
const { isAdmin, isLogin } = toRefs(userInfoStore)

const tableRef = ref<TableInstance>()

//表格内的数据（添加序号）
const tableData = computed(() => versionInfo.value)

//编辑版本信息(修改编辑标记)
const handleEdit = (index: number, row: VersionInfo) => {
  if (!isLogin.value) return ElMessage.warning("注册登录后可编辑")
  // if (isPC.value) {//PC端在表格上修改
  //     isEditRow.value = index
  //     newInfo.value = Object.assign(newInfo.value, row)
  // } else {//移动端用抽屉修改
  toggleAddVersionDrawer(true, row)
  // }
}

//版本是否可编辑
const canEdit = (status: number) => {
  // if (!isLogin.value) return false
  // else
  if (isAdmin.value) return true
  else if (status === 1 || status === 2) return true
  else return false
}

//版本是否可删除
const canDel = (status: number) => {
  if (status === 0) return false
  else if (!isLogin.value) return false
  else if (isAdmin.value) return true
  else if (status === 1 || status === 3) return true
  else return false
}

//刷新版本信息
const refreshVersion = async () => {
  const flag = await getVersion({ version: "all" }, true)
  if (flag) {
    ElMessage.success("刷新成功")
  } else {
    ElMessage.error("刷新失败")
  }
}

const deleteRow = (index: number, id: number) => {
  ElMessageBox.confirm("确认删除该版本信息吗?", "Warning", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消删除",
    type: "warning",
    showClose: false,
  })
    .then(() => {
      //uid被洗掉了，手动添加
      updateVersion({ status: 0, id } as VersionInfo)
    })
    .catch(() => ElMessage.info("删除操作已取消"))
}

const beforeCloseDrawer = () => {
  ElMessageBox.confirm("确认关闭面板吗?关闭后未保存的修改会取消。", "Warning", {
    confirmButtonText: "关闭",
    cancelButtonText: "取消",
    type: "warning",
    showClose: false,
  })
    .then(() => {
      isShowAddVersionDrawer.value = false
    })
    .catch(() => {})
}

/**
 * 处理excel表头和数据，并导出
 * */
const export_excel = () => {
  //提取表头和表数据
  const headers = ["ID", "版本名", "所属阵营", "所属种族", "其他标签", "更新时间"]
  const propsIndex = ["id", "name", "camp", "race", "otherTags", "updated_time"] //收集序号
  // this.tablelabels.forEach((label, index) => {
  //     if (index !== 0) headers.push(label.label)
  // })

  // 数据
  const data = allRoleInfo.value.map((row) => {
    return propsIndex
      .map((prop, index) => {
        return row[prop as keyof Role] || ""
      })
      .filter((item) => item !== undefined)
  })
  // 组合数据，第一行是表头
  const sheetData = [headers, ...data]

  //生成Excel文件并保存
  fileProcess.save_as_excel(sheetData, "重返未来1999版本表", "重返未来1999版本表(部分)")
}

onMounted(async () => {
  await getVersion({ version: "all" }, true)
})
</script>

<style scoped>
.versions1999 {
  .el-tag {
    margin: 2px;
  }

  .myCustomElTable {
    border-radius: 5px;
  }
}

@media (max-width: 780px) {
  .header2 {
    width: 80%;
    margin: 0 auto;
    padding-top: 10px;
  }

  .el-col {
    margin: 5px 0;
  }
}
</style>
