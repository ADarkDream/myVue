<template>
<!--      <el-scrollbar :height="  ">-->
   <el-container :style="'height:'+(screenHeight-40)+'px;overflow:hidden' ">
    <el-header class="header1">
      角色列表(仅供壁纸检索)
    </el-header>
    <!--    移动端筛选框-->
    <el-collapse  style="margin: 0 10px" v-if="!isPC">
      <el-collapse-item title="筛选条件">
        <el-row class="header2">
          <el-col :md="3" v-if="isAdmin">
            <el-button type="primary" @click="dialogVisible=true" :size="elSize">添加新角色</el-button>
          </el-col>
          <el-col :md="3" :sm="4">
            <el-input v-model.trim="searchInfo.name" placeholder="角色名称" :size="elSize" clearable
                      :prefix-icon="Search"/>
          </el-col>
          <el-col :md="3" :sm="4">
            <el-select v-model="searchInfo.camp" :size="elSize" default-first-option>
              <el-option label="全选阵营" value=""/>
              <el-option v-for="(item,index) in campInfo" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-col>
          <el-col :md="3" :sm="4">
            <el-select v-model="searchInfo.race" :size="elSize" default-first-option>
              <el-option label="全选种族" value=""/>
              <el-option v-for="(item,index) in raceInfo" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-col>
          <el-col :md="3" :sm="4">
            <el-input v-model.trim="searchInfo.otherTags" placeholder="其他标签" :size="elSize" clearable
                      :prefix-icon="Search"/>
          </el-col>
          <el-col :md="6" :sm="7">
            <el-button @click="filterChange" type="primary" :size="elSize">筛选查找</el-button>
            <el-button @click="clearFilter" :size="elSize">清空全部筛选</el-button>
          </el-col>

        </el-row>
      </el-collapse-item>
    </el-collapse>
    <!--    PC筛选框-->
    <el-row class="header2" v-else>
      <el-col :sm="3" v-if="isAdmin">
        <el-button type="primary" @click="dialogVisible=true" :size="elSize">添加新角色</el-button>
      </el-col>
      <el-col :sm="4">
        <el-input v-model.trim="searchInfo.name" placeholder="角色名称" :size="elSize" clearable :prefix-icon="Search"/>
      </el-col>
      <el-col :sm="4">
        <el-select v-model="searchInfo.camp" :size="elSize" default-first-option>
          <el-option label="全选阵营" value=""/>
          <el-option v-for="(item,index) in campInfo" :key="index" :label="item" :value="item"/>
        </el-select>
      </el-col>
      <el-col :sm="4">
        <el-select v-model="searchInfo.race" :size="elSize" default-first-option>
          <el-option label="全选种族" value=""/>
          <el-option v-for="(item,index) in raceInfo" :key="index" :label="item" :value="item"/>
        </el-select>
      </el-col>
      <el-col :sm="3">
        <el-input v-model.trim="searchInfo.otherTags" placeholder="其他标签" :size="elSize" clearable
                  :prefix-icon="Search"/>
      </el-col>
      <el-col :sm="6">
        <el-button @click="filterChange" type="primary" :size="elSize">筛选查找</el-button>
        <el-button @click="clearFilter" :size="elSize">清空全部筛选</el-button>
      </el-col>

    </el-row>
    <el-main :style="isPC? 'overflow:hidden': 'padding:0 10px' ">
      <!--      <el-form class="search" :model="newInfo" label-position="left" label-width="auto">-->
      <!--        <el-form-item label-width="auto">-->

      <!--        </el-form-item>-->
      <!--      </el-form>-->
      <el-text type="primary">个人收集略有不足，如有错漏还请向我反馈。非常感谢！如有乐意帮忙的司辰也欢迎联系我！</el-text>
      <el-table ref="tableRef" :data="roleInfo" :height="screenHeight-230" stripe border highlight-current-row
                table-layout="auto" type="type" :default-sort="{ prop: 'id', order: 'custom' }"
                @sort-change="handleSortChange">
        <!--              @filter-change="filterChange">-->
        <el-table-column fixed prop="id" label="序号" min-width="80" align="center" sortable/>
        <el-table-column prop="name" label="角色名" min-width="120">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newInfo.name"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="camp" label="所属阵营" min-width="120">
          <template #default="scope">
            <template v-if="isEditRow===scope.$index">
              <el-select placeholder="选择阵营" v-model="newInfo.camp" default-first-option>
                <el-option v-for="(item,index) in campInfo" :key="index" :label="item"
                           :value="item"/>
              </el-select>
            </template>
            <template v-for="(item,index) in campInfo" :key="index" v-else>
              <div v-if="item === scope.row.camp">{{ item }}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="race" label="所属种族" min-width="130" align="center">
          <!--                       :filters="sort" :column-key="'sort'">-->
          <!--                       :filter-method="filterHandler">-->
          <template #default="scope">
            <template v-if="isEditRow===scope.$index">
              <el-select placeholder="选择种族" v-model="newInfo.race" default-first-option>
                <el-option v-for="(item,index) in raceInfo" :key="index" :label="item"
                           :value="item"/>
              </el-select>
            </template>
            <template v-for="(item,index) in raceInfo" :key="index" v-else>
              <div v-if="item === scope.row.race">{{ item }}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="otherTags" label="其它标签" min-width="200" align="center">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-input v-model="newInfo.otherTags"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" min-width="70" align="center" v-if="isAdmin">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column prop="updated_time" label="更新时间" min-width="70" align="center">
          <template #default="scope">{{ getDiffTime(scope.row.updated_time) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100" align="center" v-if="isAdmin">
          <template #default="scope">
            <div v-if="isEditRow!==scope.$index">
              <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button link type="danger" size="small" @click="deleteRow(scope.$index,scope.row.id)">
                删除
              </el-button>
            </div>
            <div v-else>
              <el-button link type="primary" size="small" @click="handleCancel">取消
              </el-button>
              <el-button link type="primary" size="small" @click.prevent="checkUpdateRow(newInfo,scope.row)">
                更新
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageMenu">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 25, 50, 100]"
            :layout="isPC? 'total, sizes, prev, pager, next, jumper' : 'total, sizes, prev, pager, next,' "
            :total="total"
            :small="!isPC"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>


    </el-main>

    <!--添加新角色-->
    <el-dialog v-model="dialogVisible" :show-close="false" title="添加新角色">
      <AddRole/>
    </el-dialog>
  </el-container>
<!--    </el-scrollbar>-->
</template>


<script setup lang="ts">
import AddRole from "@/components/AddRole.vue";
import {useRouter} from 'vue-router'
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import type {TableColumnCtx, TableInstance} from "element-plus";
import {Search} from "@element-plus/icons-vue";
import {reactive, ref, watch} from 'vue'
import useTimeStamp from "@/hooks/useTimestamp";

const {getDiffTime, getTime} = useTimeStamp()

const router = useRouter()

//登录判断
import useUserInfo from "@/hooks/useUserInfo";
import useResponsive from "@/hooks/useResponsive";
//屏幕高度
const {screenHeight, elSize, isPC} = useResponsive()

const {isAdmin} = useUserInfo()


const roleInfo = reactive([]) //存角色信息
const campInfo = reactive([]) //存阵营信息
const raceInfo = reactive([]) //存种族信息

getRoles()

//获取版本列表并添加到菜单
function getRoles() {
  axios({
    url: '/getVersion',
    params: {flag: true}//只查询角色
  }).then(result => {
    console.log(result)
    const {data} = result.data
    //更新角色列表
    roleInfo.splice(0, roleInfo.length, ...data)
    //获取阵营列表
    const campList2 = new Set([])
    const raceList2 = new Set([])
    roleInfo.forEach(item => {
      campList2.add(item.camp)
      raceList2.add(item.race)
      totalData.push(item)
    })
    campList2.delete('')   //删除空值
    campInfo.splice(0, campInfo.length, ...campList2)
    raceInfo.splice(0, campInfo.length, ...raceList2)
    total.value = roleInfo.length//底部分页数字
    render()
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}

//添加导航网站面板的显示与隐藏
let dialogVisible = ref(false)

const tableRef = ref<TableInstance>()

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
  total.value = totalData.length
  flag.value = true
}


//监听排序行为，并修改数组顺序,否则删除会出错
function handleSortChange({column, prop, order}) {
  // 根据 column 和 order 对 totalData 进行排序
  totalData.sort((a, b) => {
    if (a[prop] < b[prop]) return order === 'ascending' ? -1 : 1;
    if (a[prop] > b[prop]) return order === 'ascending' ? 1 : -1;
    return 0;
  })
  if (flag.value) render()
}


//筛选标记(false表示筛选过了)
const flag = ref(true)

//筛选方法
function filterChange() {
  //预设筛选条件
  const filterName = item => !!searchInfo.name ? item.name.toLowerCase().includes(searchInfo.name.toLowerCase()) : true
  const filterCamp = item => !!searchInfo.camp ? item.camp === searchInfo.camp : true
  const filterRace = item => !!searchInfo.race ? item.race === searchInfo.race : true
  const filterOtherTags = item => {
    if (!!item.otherTags || !!searchInfo.otherTags) {
      if (!!item.otherTags) {//角色标签不为空
        return !!searchInfo.otherTags ? item.otherTags.toLowerCase().includes(searchInfo.otherTags.toLowerCase()) : true
      } else return false //角色标签为空
    } else return true //搜索框和角色标签都为空，表示没有搜索，返回true
  }  //开始筛选
  const newArr = totalData.filter(item => filterName(item) && filterCamp(item) && filterRace(item) && filterOtherTags(item))
  //将表格显示的数据清空再填充筛选后的数据
  roleInfo.splice(0, roleInfo.length, ...newArr)
  //修改筛选标记(false表示筛选过了)
  flag.value = false
  total.value = roleInfo.length
}


//表格里的数据

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
  roleInfo.splice(0, roleInfo.length)
  //根据当前页码计算出应显示的数据
  const newData = totalData.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
  newData.forEach((item: Role) => {
    roleInfo.push(item)
  })
}

const handleSizeChange = (val: number) => {
  render()
}
const handleCurrentChange = (val: number) => {
  render()
}

const searchInfo = reactive<Role>({
  id: 0,
  name: '',
  camp: '',
  race: '',
  otherTags: '',
  created_time: '',
  updated_time: ''
})


let newInfo = reactive<Role>({
  id: 0,
  name: '',
  camp: '',
  race: '',
  otherTags: '',
  created_time: '',
  updated_time: ''
})

interface Role {
  id: number,
  name: string,
  camp: string,
  race: string,
  otherTags: string,
  created_time: string,
  updated_time: string,
}


//编辑标记
let isEditRow = ref<number>(-1)

//编辑角色信息(修改编辑标记)
const handleEdit = (index: number, row: Role) => {
  isEditRow.value = index
  newInfo = Object.assign(newInfo, row)
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
//     const {msg} = result.data
//     //更新修订时间为当前时间
//     data.updated_time = new Date().toISOString()
//     //将修改后的信息显示出来
//     Object.assign(oldData, data)
//     //去除编辑标记
//     isEditRow.value = -1
//     ElMessage.success(msg)
//   }).catch(error => {
//     console.log('发生错误：')
//     console.log(error)
//     ElMessage.error(error.msg)
//   })
}


//清除未修改的数据,如果未修改返回{}
function diffObj(newData: Role, oldData: Role) {
  return Object.keys(newData).concat(Object.keys(oldData))
      .filter(key => newData[key] !== oldData[key])
      .reduce((result, key) => {
        result[key] = newData[key]; // 返回newData对象的属性
        return result;
      }, {});
}

const deleteRow = (index: number, id: number) => {
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


</script>


<style scoped>
.el-container {
  background-color: var(--el-color-primary-light-9);
}

.header1 {
  font-size: 25px;
  line-height: 60px;
}

.header2 {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

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

@media (max-width: 980px) {
  .header2 {
    width: 80%;
    margin: 0 auto;
  }

  .el-col {
    margin: 5px 0;
  }
}

</style>
