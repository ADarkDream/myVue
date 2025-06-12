<template>
  <div class="roles1999">
    <!--PC筛选框-->
    <el-row v-if="isPC" class="header2">
      <el-col :sm="4">
        <el-input
          v-model.trim="searchInfo.name"
          clearable
          placeholder="角色名称"
          :prefix-icon="Search"
          @change="filterChange()"
        />
      </el-col>
      <el-col :sm="4">
        <el-select v-model="searchInfo.camp" default-first-option @change="filterChange()">
          <el-option label="全选阵营" value="" />
          <el-option v-for="{ name, count } in campInfo" :key="name" :label="name + '[' + count + ']'" :value="name" />
        </el-select>
      </el-col>
      <el-col :sm="4">
        <el-select v-model="searchInfo.race" default-first-option @change="filterChange()">
          <el-option label="全选种族" value="" />
          <el-option v-for="{ name, count } in raceInfo" :key="name" :label="name + '[' + count + ']'" :value="name" />
        </el-select>
      </el-col>
      <el-col :sm="3">
        <el-input
          v-model.trim="searchInfo.otherTags"
          clearable
          placeholder="其他标签"
          :prefix-icon="Search"
          @change="filterChange()"
        />
      </el-col>
      <el-col :sm="8">
        <!-- <el-button @click="filterChange" type="primary">查找</el-button> -->
        <el-button @click="clearFilter">清空筛选条件</el-button>
        <el-button type="primary" @click="toggleAddRoleDrawer()">新增角色</el-button>
        <el-button :icon="Refresh" plain title="刷新角色信息" type="success" @click="refreshRole()">刷新</el-button>
        <el-button plain type="success" @click="export_excel()">导出Excel</el-button>
      </el-col>
    </el-row>
    <!--移动端筛选框-->
    <div v-else class="header">
      <el-button type="primary" @click="dialogVisible = true">筛选/查找</el-button>
      <el-button type="primary" @click="toggleAddRoleDrawer()">新增角色</el-button>
      <el-button :icon="Refresh" plain size="small" title="刷新角色信息" type="success" @click="refreshRole()">刷新</el-button>
      <el-button plain type="success" @click="export_excel()">导出Excel</el-button>
    </div>
    <el-table
      ref="tableRef"
      border
      :data="tableData"
      :default-sort="{ prop: 'id', order: 'ascending' }"
      flexible
      highlight-current-row
      :max-height="mainPanelContentHeight - (isPC ? 100 : 70)"
      stripe
      table-layout="auto"
      @sort-change="handleSortChange"
    >
      <!--              @filter-change="filterChange">-->
      <el-table-column align="center" fixed label="ID" min-width="60" prop="id" sortable />
      <el-table-column align="center" :fixed="!isPC" label="角色名" min-width="120" prop="name">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newInfo.name" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属阵营" min-width="120" prop="camp">
        <template #default="scope">
          <template v-if="isEditRow === scope.$index">
            <el-select v-model="newInfo.camp" default-first-option placeholder="选择阵营">
              <el-option v-for="{ name, count } in campInfo" :key="name" :label="name + '[' + count + ']'" :value="name" />
            </el-select>
          </template>
          <template v-else>
            {{ scope.row.camp }}
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属种族" min-width="130" prop="race">
        <template #default="scope">
          <template v-if="isEditRow === scope.$index">
            <el-select v-model="newInfo.race" default-first-option placeholder="选择种族">
              <el-option v-for="{ name, count } in raceInfo" :key="name" :label="name + '[' + count + ']'" :value="name" />
            </el-select>
          </template>
          <template v-else>
            {{ scope.row.race }}
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="其它标签" min-width="200" prop="otherTags">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-input v-model="newInfo.otherTags" />
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="isAdmin" align="center" label="创建时间" min-width="100" prop="created_time">
        <template #default="scope">{{ getDiffTime(scope.row.created_time) }}</template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" min-width="100" prop="updated_time">
        <template #default="scope">{{ getDiffTime(scope.row.updated_time) }}</template>
      </el-table-column>
      <el-table-column v-if="isAdmin" align="center" label="状态" min-width="100" prop="status">
        <template #default="scope">
          <div v-if="isEditRow === scope.$index">
            <el-select v-model="newInfo.status" default-first-option placeholder="选择状态">
              <el-option v-for="{ label, value } in statusOptions" :key="value" :label :value />
            </el-select>
          </div>
          <div v-else>
            {{ statusOptions[scope.row.status!].label }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" :fixed="isPC ? 'right' : false" label="操作" min-width="100">
        <!-- <template #header v-if="isPC">
            <div style="display: flex;justify-content: space-around;">
              <span>操作</span><el-button type="success" size="small" plain @click="refreshRole()" :icon="Refresh"
                title="刷新角色信息"></el-button>
            </div>
          </template> -->
        <template #default="scope">
          <div v-if="isEditRow !== scope.$index">
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
          </div>
          <div v-else>
            <el-button link size="small" type="info" @click="exit_edit()">取消 </el-button>
            <el-button link size="small" type="primary" @click.prevent="checkUpdateRow(newInfo, scope.row)"> 更新 </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageMenu">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :layout="layout"
        :page-sizes="[10, 25, 50, 100]"
        size="small"
        :total="total"
        @current-change="render"
        @size-change="render"
      />
    </div>

    <!--移动端筛选框2-->
    <el-drawer v-model="dialogVisible" :append-to-body="true" direction="btt" :show-close="false" size="40%" title="筛选角色">
      <el-row>
        <el-col :md="3" :sm="4">
          <el-input
            v-model.trim="searchInfo.name"
            clearable
            placeholder="角色名称"
            :prefix-icon="Search"
            @change="filterChange()"
          />
        </el-col>
        <el-col :md="3" :sm="4">
          <el-select v-model="searchInfo.camp" default-first-option @change="filterChange()">
            <el-option label="全选阵营" value="" />
            <el-option v-for="{ name, count } in campInfo" :key="name" :label="name + '[' + count + ']'" :value="name" />
          </el-select>
        </el-col>
        <el-col :md="3" :sm="4">
          <el-select v-model="searchInfo.race" default-first-option @change="filterChange()">
            <el-option label="全选种族" value="" />
            <el-option v-for="{ name, count } in raceInfo" :key="name" :label="name + '[' + count + ']'" :value="name" />
          </el-select>
        </el-col>
        <el-col :md="3" :sm="4">
          <el-input
            v-model.trim="searchInfo.otherTags"
            clearable
            placeholder="其他标签"
            :prefix-icon="Search"
            @change="filterChange()"
          />
        </el-col>
        <el-col :md="6" :sm="7">
          <el-button type="primary" @click="filterChange">查找</el-button>
          <el-button @click="clearFilter">清空筛选条件</el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from "vue"
import type { TableInstance } from "element-plus"
import { Search, Refresh } from "@element-plus/icons-vue"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { useReverse1999Store } from "@/store/reverse1999/useReverse1999Store"
import { useRolesStore } from "@/store/reverse1999/useRolesStore"
//hooks
import useTimeStamp from "@/hooks/useTimestamp"
import useReverse1999 from "@/hooks/reverse1999/useReverse1999"
//components
// import AddRole from "@/pages/reverse1999/components/AddRole.vue";
//utils
import myFunction from "@/utils/myFunction"
import fileProcess from "@/utils/fileProcess"
//types

//files

const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const reverse1999Store = useReverse1999Store()
const { allRoleInfo, campInfo, raceInfo, statusOptions } = toRefs(reverse1999Store)
const { toggleAddRoleDrawer } = useRolesStore()
const { getDiffTime, getTime } = useTimeStamp()
const { diffObj, scrollToTop } = myFunction
const { getVersion, updateRole } = useReverse1999()

//登录判断

//屏幕高度
const { screenHeight, isPC, mainPanelContentHeight } = toRefs(responsiveStore)
const { isAdmin, isLogin } = toRefs(userInfoStore)

const tableRef = ref<TableInstance>()

//添加角色面板的显示与隐藏
const dialogVisible = ref(false)
//表格内的数据
const tableData = ref<Role[]>([])
//当前页码
const currentPage = ref(1)
//每页显示多少条数据
const pageSize = ref(25)
const total = ref(allRoleInfo.value.length) //总数有多少张图
const layout = computed(() => {
  if (!isPC.value) {
    return "total, prev, pager, next"
  } else if (total.value / pageSize.value! > 10) {
    return "total, sizes, prev, pager, next,jumper"
  } else {
    return "total, sizes, prev, pager, next"
  }
})

//清空全部筛选条件
const clearFilter = () => {
  // tableRef.value!.clearFilter()
  // render()
  // total.value = totalData.length
  searchInfo.name = ""
  searchInfo.camp = ""
  searchInfo.race = ""
  searchInfo.otherTags = ""

  render()
  total.value = allRoleInfo.value.length
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
  const filterName = (item: Role) => (searchInfo.name ? item.name.toLowerCase().includes(searchInfo.name.toLowerCase()) : true)
  const filterCamp = (item: Role) => (searchInfo.camp ? item.camp === searchInfo.camp : true)
  const filterRace = (item: Role) => (searchInfo.race ? item.race === searchInfo.race : true)
  const filterOtherTags = (item: Role) => {
    if (item.otherTags || searchInfo.otherTags) {
      if (item.otherTags) {
        //角色标签不为空
        return searchInfo.otherTags ? item.otherTags.toLowerCase().includes(searchInfo.otherTags.toLowerCase()) : true
      } else return false //角色标签为空
    } else return true //搜索框和角色标签都为空，表示没有搜索，返回true
  } //开始筛选
  tableData.value = allRoleInfo.value.filter(
    (item) => filterName(item) && filterCamp(item) && filterRace(item) && filterOtherTags(item)
  )
  //修改筛选标记(false表示筛选过了)
  flag.value = false
  total.value = tableData.value.length
}

//渲染
function render() {
  //根据当前页码计算出应显示的数据
  tableData.value = allRoleInfo.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
  scrollToTop(tableRef)
}

const searchInfo = reactive<Role>({
  id: 0,
  name: "",
  camp: "",
  race: "",
  otherTags: "",
})

const newInfo = ref<Role>({
  id: 0,
  name: "",
  camp: "",
  race: "",
  otherTags: "",
})

//编辑标记
const isEditRow = ref<number>(-1)

//编辑角色信息(修改编辑标记)
const handleEdit = (index: number, row: Role) => {
  if (!isLogin.value) return ElMessage.warning("注册登录后可编辑")
  if (isPC.value) {
    //PC端在表格上修改
    isEditRow.value = index
    newInfo.value = Object.assign(newInfo.value, row)
  } else {
    //移动端用抽屉修改
    toggleAddRoleDrawer(true, row)
  }
}

//还原编辑标记
const exit_edit = () => {
  isEditRow.value = -1
}

//对上传的数据进行格式检查
const checkUpdateRow = async (newData: Role, oldData: Role) => {
  const data = diffObj(newData, oldData) as Role
  //判断角色信息是否修改
  if (Object.keys(data).length === 0) return ElMessage.info("角色信息未修改，已取消上传。")
  else {
    //uid被洗掉了，手动添加
    data.id = newData.id
    await updateRole(data)
    exit_edit() //去除编辑标记
  }
}

//角色是否可编辑
const canEdit = (status: number) => {
  // if (!isLogin.value) return false
  // else
  if (isAdmin.value) return true
  else if (status === 1 || status === 2) return true
  else return false
}

//角色是否可删除
const canDel = (status: number) => {
  if (status === 0) return false
  else if (!isLogin.value) return false
  else if (isAdmin.value) return true
  else if (status === 1 || status === 3) return true
  else return false
}

//刷新角色信息
const refreshRole = async () => {
  try {
    await Promise.all([getVersion({ role: "all" }, true), getVersion({ role: "diff" }, true)])
    ElMessage.success("刷新成功")
  } catch (error) {
    console.error("刷新失败")
    console.error(error)
    ElMessage.error("刷新失败")
  }
}

const deleteRow = (index: number, id: number) => {
  ElMessageBox.confirm("确认删除该角色信息吗?", "Warning", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消删除",
    type: "warning",
    showClose: false,
  })
    .then(() => {
      //uid被洗掉了，手动添加
      updateRole({ status: 0, id } as Role)
    })
    .catch(() => ElMessage.info("删除操作已取消"))
}

/**
 * 处理excel表头和数据，并导出
 * */
const export_excel = () => {
  //提取表头和表数据
  const headers = ["ID", "角色名", "所属阵营", "所属种族", "其他标签", "更新时间"]
  const propsIndex = ["id", "name", "camp", "race", "otherTags", "updated_time"] //收集序号
  // this.tablelabels.forEach((label, index) => {
  //     if (index !== 0) headers.push(label.label)
  // })

  // 数据
  const data = allRoleInfo.value.map((row) => {
    return propsIndex
      .map((prop) => {
        // 修改具体值
        if (prop === "updated_time") return getTime(row[prop])
        return row[prop as keyof Role] || ""
      })
      .filter((item) => item !== undefined)
  })
  // 组合数据，第一行是表头
  const sheetData = [headers, ...data]

  //生成Excel文件并保存
  fileProcess.save_as_excel(sheetData, "重返未来1999角色表", "重返未来1999角色表(部分)")
}

onMounted(async () => {
  await getVersion({ role: "all" })
  total.value = allRoleInfo.value.length //底部分页数字
  render()
  watch(allRoleInfo, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      render()
    }
  })
})
</script>

<style scoped></style>
