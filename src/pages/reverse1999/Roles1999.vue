<template>
  <el-container :style="'height:' + (screenHeight - (isPC ? 80 : 40)) + 'px;overflow:hidden'">
    <!--    移动端筛选框-->
    <el-header>
      <el-collapse style="margin: 0 10px" v-if="!isPC">
        <el-collapse-item title="筛选条件">
          <el-row class="header2">
            <el-col :md="3" v-if="isAdmin">
              <el-button type="primary" @click="dialogVisible = true">添加新角色</el-button>
            </el-col>
            <el-col :md="3" :sm="4">
              <el-input v-model.trim="searchInfo.name" placeholder="角色名称" clearable :prefix-icon="Search" />
            </el-col>
            <el-col :md="3" :sm="4">
              <el-select v-model="searchInfo.camp" default-first-option>
                <el-option label="全选阵营" value="" />
                <el-option v-for="{ name, count } in campInfo" :key="name" :label="name + '[' + count + ']'"
                  :value="name" />
              </el-select>
            </el-col>
            <el-col :md="3" :sm="4">
              <el-select v-model="searchInfo.race" default-first-option>
                <el-option label="全选种族" value="" />
                <el-option v-for="{ name, count } in raceInfo" :key="name" :label="name + '[' + count + ']'"
                  :value="name" />
              </el-select>
            </el-col>
            <el-col :md="3" :sm="4">
              <el-input v-model.trim="searchInfo.otherTags" placeholder="其他标签" clearable :prefix-icon="Search" />
            </el-col>
            <el-col :md="6" :sm="7">
              <el-button @click="filterChange" type="primary">筛选查找</el-button>
              <el-button @click="clearFilter">清空全部筛选</el-button>
              <el-button type="success" plain @click="export_excel()">导出Excel</el-button>
              <el-button type="primary" @click="router.push({ name: 'images' })">点击前往图片表</el-button>
            </el-col>

          </el-row>
        </el-collapse-item>
      </el-collapse>
      <!--    PC筛选框-->
      <el-row class="header2" v-else>
        <el-col :sm="3">
          <!--        <el-button type="primary" @click="dialogVisible=true" >添加新角色</el-button>-->
          <el-button type="primary" @click="router.push({ name: 'images' })">点击前往图片表</el-button>
        </el-col>
        <el-col :sm="4">
          <el-input v-model.trim="searchInfo.name" placeholder="角色名称" clearable :prefix-icon="Search" />
        </el-col>
        <el-col :sm="4">
          <el-select v-model="searchInfo.camp" default-first-option>
            <el-option label="全选阵营" value="" />
            <el-option v-for="{ name, count } in campInfo" :key="name" :label="name + '[' + count + ']'"
              :value="name" />
          </el-select>
        </el-col>
        <el-col :sm="4">
          <el-select v-model="searchInfo.race" default-first-option>
            <el-option label="全选种族" value="" />
            <el-option v-for="{ name, count } in raceInfo" :key="name" :label="name + '[' + count + ']'"
              :value="name" />
          </el-select>
        </el-col>
        <el-col :sm="3">
          <el-input v-model.trim="searchInfo.otherTags" placeholder="其他标签" clearable :prefix-icon="Search" />
        </el-col>
        <el-col :sm="6">
          <el-button @click="filterChange" type="primary">筛选查找</el-button>
          <el-button @click="clearFilter">清空全部筛选</el-button>
          <el-button type="success" plain @click="export_excel()">导出Excel</el-button>
        </el-col>

      </el-row>
    </el-header>
    <el-main>
      <el-text type="primary">个人收集略有不足，如有错漏还请向我反馈。非常感谢！如有乐意帮忙的司辰也欢迎联系我！</el-text>
      <el-table ref="tableRef" :data="tableData" :height="screenHeight - 230" stripe border highlight-current-row
        table-layout="auto" :default-sort="{ prop: 'id', order: 'custom' }" @sort-change="handleSortChange">
        <!--              @filter-change="filterChange">-->
        <el-table-column fixed prop="id" label="序号" min-width="80" align="center" sortable />
        <el-table-column prop="name" label="角色名" min-width="120">
          <template #default="scope">
            <div v-if="isEditRow === scope.$index">
              <el-input v-model="newInfo.name" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="camp" label="所属阵营" min-width="120">
          <template #default="scope">
            <template v-if="isEditRow === scope.$index">
              <el-select placeholder="选择阵营" v-model="newInfo.camp" default-first-option>
                <el-option v-for="{ name, count } in campInfo" :key="name" :label="name + '[' + count + ']'"
                  :value="name" />
              </el-select>
            </template>
            <template v-else>
              {{ scope.row.camp }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="race" label="所属种族" min-width="130" align="center">
          <!--                       :filters="sort" :column-key="'sort'">-->
          <!--                       :filter-method="filterHandler">-->
          <template #default="scope">
            <template v-if="isEditRow === scope.$index">
              <el-select placeholder="选择种族" v-model="newInfo.race" default-first-option>
                <el-option v-for="{ name, count } in raceInfo" :key="name" :label="name + '[' + count + ']'"
                  :value="name" />
              </el-select>
            </template>
            <template v-else>
              {{ scope.row.race }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="otherTags" label="其它标签" min-width="200" align="center">
          <template #default="scope">
            <div v-if="isEditRow === scope.$index">
              <el-input v-model="newInfo.otherTags" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" min-width="70" align="center" v-if="isAdmin">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column prop="updated_time" label="更新时间" min-width="70" align="center">
          <template #default="scope">{{ getDiffTime(scope.row.updated_time) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100" align="center">
          <template #default="scope">
            <div v-if="scope.row.id === 0"></div>
            <div v-else-if="isEditRow !== scope.$index">
              <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button link type="danger" size="small" :disabled="!isAdmin"
                @click="deleteRow(scope.$index, scope.row.id)">
                删除
              </el-button>
            </div>
            <div v-else>
              <el-button link type="info" size="small" @click="handleCancel">取消
              </el-button>
              <el-button link type="primary" size="small" @click.prevent="checkUpdateRow(newInfo, scope.row)">
                更新
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageMenu">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 25, 50, 100]"
          :layout="isPC ? 'total, sizes, prev, pager, next, jumper' : 'total, sizes, prev, pager, next,'" :total="total"
          :small="!isPC" @size-change="render()" @current-change="render()" />
      </div>
    </el-main>

    <!--添加新角色-->
    <el-dialog v-model="dialogVisible" :show-close="false" title="添加新角色">
      <AddRole />
    </el-dialog>
  </el-container>
</template>


<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import type { TableInstance } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import * as XLSX from "xlsx"; // 导入 xlsx
import { saveAs } from "file-saver";
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
import { useReverse1999Store } from '@/store/reverse1999/useReverse1999Store'

//hooks
import useTimeStamp from "@/hooks/useTimestamp";
import useReverse1999 from '@/hooks/reverse1999/useReverse1999';
//components
import AddRole from "@/components/AddRole.vue";
//utils
import myFunction from "@/utils/myFunction";

//types

//files


const router = useRouter()
const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const reverse1999Store = useReverse1999Store()
const { allRoleInfo, campInfo, raceInfo } = toRefs(reverse1999Store)
const { getDiffTime, getTime } = useTimeStamp()
const { diffObj } = myFunction
const { getVersion } = useReverse1999()

//登录判断

//屏幕高度
const { screenHeight, isPC } = toRefs(responsiveStore)
const { isAdmin, isLogin } = toRefs(userInfoStore)

onMounted(async () => {
  await getVersion({ version: false, role: 'all' })
  total.value = allRoleInfo.value.length//底部分页数字
  render()
})

const tableRef = ref<TableInstance>()

//添加角色面板的显示与隐藏
const dialogVisible = ref(false)
//表格内的数据
const tableData = ref<Role[]>([])
//当前页码
const currentPage = ref(1)
//每页显示多少条数据
const pageSize = ref(25)
const total = ref(allRoleInfo.value.length)


//清空全部筛选条件
const clearFilter = () => {
  // tableRef.value!.clearFilter()
  // render()
  // total.value = totalData.length
  searchInfo.name = ''
  searchInfo.camp = ''
  searchInfo.race = ''
  searchInfo.otherTags = ''

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
  const filterName = (item: Role) => !!searchInfo.name ? item.name.toLowerCase().includes(searchInfo.name.toLowerCase()) : true
  const filterCamp = (item: Role) => !!searchInfo.camp ? item.camp === searchInfo.camp : true
  const filterRace = (item: Role) => !!searchInfo.race ? item.race === searchInfo.race : true
  const filterOtherTags = (item: Role) => {
    if (!!item.otherTags || !!searchInfo.otherTags) {
      if (!!item.otherTags) {//角色标签不为空
        return !!searchInfo.otherTags ? item.otherTags.toLowerCase().includes(searchInfo.otherTags.toLowerCase()) : true
      } else return false //角色标签为空
    } else return true //搜索框和角色标签都为空，表示没有搜索，返回true
  }  //开始筛选
  tableData.value = allRoleInfo.value.filter(item => filterName(item) && filterCamp(item) && filterRace(item) && filterOtherTags(item))
  //修改筛选标记(false表示筛选过了)
  flag.value = false
  total.value = tableData.value.length
}







//渲染
function render() {
  //根据当前页码计算出应显示的数据
  tableData.value = allRoleInfo.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
}


const searchInfo = reactive<Role>({
  id: 0,
  name: '',
  camp: '',
  race: '',
  otherTags: '',
})


const newInfo = ref<Role>({
  id: 0,
  name: '',
  camp: '',
  race: '',
  otherTags: '',
})


//编辑标记
const isEditRow = ref<number>(-1)

//编辑角色信息(修改编辑标记)
const handleEdit = (index: number, row: Role) => {
  if (!isLogin.value) return ElMessage.warning('只有用户或管理员才能编辑角色信息')
  isEditRow.value = index
  newInfo.value = Object.assign(newInfo.value, row)
}

//还原编辑标记
function handleCancel() {
  isEditRow.value = -1
}

//对上传的数据进行格式检查
function checkUpdateRow(newData: Role, oldData: Role) {
  const data = <Role>diffObj(newData, oldData)
  //判断网址信息是否修改
  if (Object.keys(data).length === 0) return ElMessage.info('网址信息未修改，已取消上传。')
  else {
    //校验格式


    //uid被洗掉了，手动添加
    updateRow(data, oldData.id, oldData)
  }
}

//上传更新的角色信息
function updateRow(data: Role, id: number, oldData: Role) {
  //   axios({
  //     url: '/updateUrl',
  //     method: 'post',
  //     data: {
  //       data,
  //       id
  //     }
  //   }).then(result => {
  //     // console.log(result)
  //     const {status,msg} = result.data
  //     //更新修订时间为当前时间
  //     data.updated_time = new Date().toISOString()
  //     //将修改后的信息显示出来
  //     Object.assign(oldData, data)
  //     //去除编辑标记
  //     isEditRow.value = -1
  //     if (status === 200)  ElMessage.success(msg)
  //   }).catch(error => {
  //     console.log('发生错误：')
  //     console.log(error)
  //     ElMessage.error(error.msg)
  //   })
}




const deleteRow = (index: number, id: number) => {
  if (!isAdmin.value) return ElMessage.warning('只有管理员才能删除角色信息')
  ElMessageBox.confirm(
    '确认删除该角色信息吗?',
    'Warning',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消删除',
      type: 'warning',
      showClose: false
    }
  )
    .then(() => {
      deleteRole(index, id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除操作已取消',
      })
    })
}

//删除角色
const deleteRole = (index: number, id: number) => {
  //   axios({
  //     url: '/deleteUrl',
  //     method: 'delete',
  //     params: {id}
  //   }).then((result) => {
  //     // console.log(result)
  //     ElMessage.success(result.data.msg)
  //
  //     const newArr = totalData.filter(item => item.id !== id)
  //     totalData.splice(0, totalData.length, ...newArr)
  //     filterChange()
  //     // location.reload()
  //   }).catch(error => {
  //     console.dir('发生错误：' + error)
  //   })
}

//创建excel表头和数据
const cleanData = () => {
  //提取表头和表数据
  const headers = ["序号", "角色名", "所属阵营", "所属种族", "其他标签", "更新时间"]
  const propsIndex = ["id", "name", "camp", "race", "otherTags", "updated_time"] //收集序号
  // this.tablelabels.forEach((label, index) => {
  //     if (index !== 0) headers.push(label.label)
  // })

  // 数据
  const data = allRoleInfo.value.map((row) => {
    return propsIndex.map((prop, index) => {
      // 修改具体值
      if (prop === 'updated_time') return getTime(row[prop])
      return row[prop as keyof Role] || ""
    }).filter(item => item !== undefined)
  })

  // 组合数据，第一行是表头
  return [headers, ...data]

}

//生成Excel文件并保存
const export_excel = () => {
  // 处理数据
  const sheetData = cleanData()
  // 转换为工作表
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "重返未来1999角色表");

  // 导出 Excel
  // XLSX.writeFile(workbook, "1999角色表(部分).xlsx") // 可以直接保存，但saveAs兼容更好
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "重返未来1999角色表(部分).xlsx");
}


</script>


<style scoped>
.el-container {
  background-color: var(--el-color-primary-light-9);
}



.header2 {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.demo-pagination-block+.demo-pagination-block {
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

@media (max-width: 780px) {
  .header2 {
    width: 80%;
    margin: 0 auto;
  }

  .el-col {
    margin: 5px 0;
  }
}
</style>
