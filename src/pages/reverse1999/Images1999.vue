<template>
  <el-container>
    <el-header>
      <!--    移动端筛选框-->
      <el-collapse style="margin: 0 10px" v-if="!isPC">
        <el-collapse-item title="筛选条件">
          <el-row class="header2">
            <!--   <el-col :md="3">
               <el-button v-if="isAdmin" type="primary" @click="dialogVisible = true">添加图片</el-button> 
            </el-col> -->
            <el-col :md="3" :sm="4">
              <el-select placeholder="选择版本" v-model="condition.version" multiple :suffix-icon="Search">
                <el-option v-for="item in versionOption" :key="item.value" :label="item.text" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :md="3" :sm="4">
              <el-tree-select placeholder="包含角色" v-model="condition.roles" :data="sourceData" multiple
                :render-after-expand="false" :filter-node-method="filterNodeMethod" @change="updateRoleNames(true)"
                filterable :suffix-icon="Search" />
            </el-col>
            <el-col :md="3" :sm="4">
              <el-select v-model.trim="condition.orderBy" placeholder="排序根据">
                <el-option label="默认排序" value="" />
                <el-option label="根据id" value="id" />
                <el-option label="创建时间" value="created_time" />
              </el-select>
            </el-col>
            <el-col :md="3" :sm="4">
              <el-select :disabled="!condition.orderBy" v-model.trim="condition.order" placeholder="排序方向">
                <el-option label="默认排序" value="" />
                <el-option label="正序" value="asc" />
                <el-option label="倒序" value="desc" />
              </el-select>
            </el-col>
            <el-select v-model.trim="condition.mode" placeholder="是否精确查找">
              <el-option label="精准查询" value="accurate" />
              <el-option label="模糊查询" value="inaccurate" />
            </el-select>
            <el-select v-model.trim="condition.sort" placeholder="图片类型">
              <el-option label="全选" :value="2" />
              <el-option label="横屏" :value="1" />
              <el-option label="竖屏" :value="0" />
            </el-select>
            <el-col :md="6" :sm="7">
              <el-button @click="render" type="primary">筛选/查找</el-button>
              <el-button @click="clearFilter">清除筛选</el-button>
              <el-button type="primary" @click="router.push({ name: 'roles' })">点击前往角色表</el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row v-else class="header_pc" style="width: 100%;">
        <el-col :span="3">
          <!-- <el-button type="primary" @click="dialogVisible = true">上传图片</el-button> -->
          <el-button type="primary" @click="router.push({ name: 'roles' })">点击前往角色表</el-button>
        </el-col>
        <el-col :span="3">
          <el-select placeholder="选择版本" v-model="condition.version" multiple :suffix-icon="Search">
            <el-option v-for="item in versionOption" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-tree-select placeholder="包含角色" v-model="condition.roles" :data="sourceData" multiple
            :render-after-expand="false" :filter-node-method="filterNodeMethod" @change="updateRoleNames(true)"
            filterable :suffix-icon="Search" />
        </el-col>
        <el-col :span="2">
          <el-select v-model.trim="condition.orderBy" placeholder="排序根据">
            <el-option label="默认排序" value="" />
            <el-option label="根据id" value="id" />
            <el-option label="创建时间" value="created_time" />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select :disabled="!condition.orderBy" v-model.trim="condition.order" placeholder="排序方向">
            <el-option label="正序" value="" />
            <el-option label="倒序" value="desc" />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select v-model.trim="condition.mode" placeholder="是否精确查找">
            <el-option label="精准查询" value="accurate" />
            <el-option label="模糊查询" value="inaccurate" />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select v-model.trim="condition.sort" placeholder="图片类型">
            <el-option label="全选" :value="2" />
            <el-option label="横屏" :value="1" />
            <el-option label="竖屏" :value="0" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button @click="render" type="primary">筛选/查找</el-button>
          <el-button @click="clearFilter">清除筛选</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-text tag="p" type="primary" style="margin: 5px auto" v-if="!isAdmin">
        个人收集略有不足，如有错漏还请向我反馈。非常感谢！暂时关闭游客编辑功能。
        <el-text type="danger">本页面暂未适配移动端</el-text>。</el-text>
      <el-table ref="tableRef" :data="tableData" style="width: 100%" :max-height="screenHeight - 260" stripe border
        highlight-current-row table-layout="auto" :default-sort="{ prop: 'imgIndex', order: 'custom' }"
        @sort-change="handleSortChange" fit>
        <el-table-column prop="imgIndex" label="页序" width="100" align="center" sortable>
          <template #default="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" min-width="50" align="center" sortable v-if="isAdmin" />
        <el-table-column prop="version" label="版本" min-width="100" align="center">
          <template #default="scope">
            <div v-if="isEditRow === scope.$index">
              <el-select placeholder="选择版本" v-model="imgInfo.version">
                <el-option v-for="item in versionOption" :key="item.value" :label="item.text" :value="item.value" />
              </el-select>
            </div>
            <template v-else v-for="item in versionOption" :key="item.value">
              <el-text v-if="item.value === scope.row.version">
                {{ item.text }}
              </el-text>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="imgUrl" sum-text :label="isEditRow === -1 ? '图片' : '链接'" width="130" align="center">
          <template #default="scope">
            <div v-if="isEditRow === scope.$index">
              <el-input type="textarea" v-model="imgInfo.imgUrl" placeholder="请输入图片链接" />
            </div>
            <!--preview-teleported解决图片显示不全的问题-->
            <div v-else class="preImg" :id="'imgDiv-' + imgInfo.imgIndex">
              <el-image :src="scope.row.imgUrl" :zoom-rate="1.2" :id="'img-' + scope.row.imgIndex" :max-scale="7"
                :min-scale="0.2" :preview-src-list="previewImgList" :initial-index="scope.row.imgIndex" fit="scale-down"
                lazy :preview-teleported="true">
                <template #error>
                  <div class="image-slot">
                    <el-icon style="width: 50px">
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="roleNames" label="包含角色" min-width="200" align="center">
          <template #default="scope">
            <div v-if="isEditRow === scope.$index">
              <el-tree-select v-model="roleIDList" :data="sourceData" multiple :render-after-expand="false"
                :filter-node-method="filterNodeMethod" @change="updateRoleNames()" filterable />
            </div>
            <el-text v-else type="primary">{{ scope.row.roleNames }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="newName" label="图片名" min-width="150" align="center">
          <template #default="scope">
            <div v-if="isEditRow === scope.$index">
              <el-input type="textarea" v-model="imgInfo.newName" placeholder="请输入图片名称" />
            </div>
            <div v-else>
              {{ scope.row.newName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="oldName" label="官方原名" min-width="150" align="center">
          <template #default="scope">
            <div v-if="isEditRow === scope.$index">
              <el-input type="textarea" v-model="imgInfo.oldName" placeholder="请输入图片名称" />
            </div>
            <div v-else>
              {{ scope.row.oldName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="imgPath" sum-text label="服务器存储路径" width="100" align="center" v-if="isAdmin" />
        <el-table-column prop="time" label="官方上传时间" min-width="120" align="center">
          <template #default="scope">{{ scope.row.time }}</template>
        </el-table-column>
        <el-table-column prop="created_time" label="整理时间" min-width="150" align="center">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100" align="center" v-if="isAdmin">
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
              <el-button link type="primary" size="small" @click.prevent="checkUpdateRow(imgInfo, scope.row)">
                更新
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageMenu">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="condition.pageSize" small
          :page-sizes="[10, 25, 50, 100]" :layout="layout" :total="total" @size-change="render"
          @current-change="render" />
      </div>
    </el-main>

    <!--图片上传框-->
    <el-dialog v-model="dialogVisible" :show-close="false" title="上传图片">
      <el-text>暂不支持</el-text>
    </el-dialog>
  </el-container>
</template>


<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { Picture as IconPicture, Search } from "@element-plus/icons-vue";
import axios from "axios";
//stores
import { useRouter } from 'vue-router';
import { useResponsiveStore } from "@/store/useResponsiveStore";
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useReverse1999Store } from '@/store/reverse1999/useReverse1999Store'
//hooks
import useTimeStamp from "@/hooks/useTimestamp";
import useReverse1999 from '@/hooks/reverse1999/useReverse1999';
//components

//utils
import myFunction from "@/utils/myFunction";
//types
import type { TableInstance } from "element-plus";
import { Sort } from '@/types/global';


const router = useRouter()
const responsiveStore = useResponsiveStore()
const reverse1999Store = useReverse1999Store()
const userInfoStore = useUserInfoStore()

const { screenHeight, isPC } = toRefs(responsiveStore)
const { allRoleInfo, campInfo, versionOption } = toRefs(reverse1999Store)
const { isAdmin } = toRefs(userInfoStore)
const { getTime } = useTimeStamp()
const { getVersion } = useReverse1999()
const { deepEqual, diffObj } = myFunction

//region  树状选择框
const roleIDList = ref<string[]>([])//树状选择框当前的值(是角色ID字符串数组)

//树状选择框的选项
const sourceData = ref<SourceData[]>([])
//角色树状选择框的筛选(搜索输入时触发)
const filterNodeMethod = (roleName: string, sourceDataItem: SourceData) => sourceDataItem.label.includes(roleName)

//角色树状选择框的筛选(修改时)
const updateRoleNames = (isSearch = false) => {
  console.log(imgInfo.tags, roleIDList.value, !isSearch)
  if (!isSearch) {//表格中修改图片数据
    if (roleIDList.value.length === 0) imgInfo.tags = ''
    else imgInfo.tags = roleIDList.value.join(',')//返回角色ID字符串
    imgInfo.roleNames = roleIDList.value.map(roleId => roles.value[roleId]).join(',')//返回角色名字字符串,roleId是对象的键名
  }//isSearch=true代表顶部搜索框的角色筛选
  // console.log(imgInfo)
}
//endregion
const currentPage = ref(1)
const layout = computed(() => {

  if (!isPC.value) {
    return 'total, prev, pager, next'
  } else if (total.value / condition.pageSize! > 10) {
    return 'total, sizes, prev, pager, next,jumper'
  }
  else {
    return 'total, sizes, prev, pager, next'
  }
})
//用户查询的参数
const condition: ImgParams = reactive({
  version: [],
  roles: [],
  sort: 2,
  mode: 'accurate',
  pageSize: 25,
  offset: 0,
  orderBy: 'id',
  order: '',
  isDesc: ''
}
)
//用户上一次查询的参数
const oldCondition: ImgParams = reactive({
  version: [],
  roles: [],
  sort: 2,
  mode: 'accurate',
  pageSize: 1,
  offset: 0,
  orderBy: 'id',
  order: '',
})

//当前修改的图片信息
const imgInfo: ReverseImgInfo = reactive({
  id: 0,
  oldName: '',
  newName: '',
  imgUrl: '',
  tags: '',//角色ID,例如："3,93"
  roleNames: '',
  sort: 2,
  imgPath: '',
  time: 20230325,
  version: 10,
})
const total = ref(25) //总数有多少张图
//筛选

const roles = ref<Record<string, string>>({})  //存角色信息{"1": "维尔汀","2": "十四行诗","3": "APPLe"}

const previewImgList: string[] = reactive([]) //大图展示列表，存的图片链接


//上传图片面板的显示与隐藏
const dialogVisible = ref(false)

const tableRef = ref<TableInstance>()

//清空全部筛选条件
const clearFilter = () => {
  condition.version = []//清空搜索框
  condition.roles = []//清空搜索框
}


//监听排序行为，并修改数组顺序,否则删除会出错
function handleSortChange({ prop, order }: Sort<ReverseImgInfo>) {
  //  {column,prop, order}
  console.log(prop, order)
  if (prop === 'id') {//根据排序整个列表
    condition.orderBy = prop
    order === 'descending' ? condition.order = 'desc' : condition.order = ''
    render()
  } else tableData.value.sort((a, b) => {  // 根据 column 和 order 对 this.tableData 进行排序,只排序本页
    const propA = a[prop as keyof typeof a]!
    const propB = b[prop as keyof typeof b]!
    if (propA < propB) return order === 'ascending' ? -1 : 1;
    else if (propA > propB) {
      console.log('正序')
      return order === 'ascending' ? 1 : -1;
    } else return 0;
  })
}


//获取全部图片
onMounted(async () => {
  await getVersionInfo()
  await render()
})

//获取版本列表并添加到菜单
const getVersionInfo = async () => {
  try {
    await getVersion({ version: true, role: 'all' })

    sourceData.value = campInfo.value.map((item, index) => {
      const children = allRoleInfo.value.map(role => {
        if (role.camp === item) return { label: role.name, value: role.id }
      }).filter(item => item !== undefined)//过滤掉空值
      return { label: item, value: index, children }
    })

    console.log('sourceData', sourceData)
    // 构建id到name的映射
    roles.value = allRoleInfo.value.reduce((map: Record<string, string>, role) => {
      map[role.id] = role.name  //创建对象的值，id作为key，name作为value
      return map
    }, {})
  } catch (error) {
    console.log('发生错误：')
    if (error instanceof Error) {
      console.log(error)
      ElMessage.error('发生错误：' + error.message)
    }
  }
}


//渲染函数(还未解决index排序问题)
const render = async () => {
  console.log(111);

  condition.offset = (currentPage.value - 1) * (condition.pageSize || 25)
  //清空表格显示的数据
  // tableData.splice(0, tableData.length)
  //根据当前页码计算出应显示的数据
  // const newData = totalData.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
  // newData.forEach((item: Url) => {
  //   tableData.push(item)
  // })
  await getImages()

  //将角色id替换成角色名称
  tableData.value.forEach(item => {
    if (!!item.tags) {
      const idList = item.tags.split(',')

      // 将字符串按逗号分割并替换为角色名称
      let outputArray = idList.map((x) => roles.value[x]) //roles[x] 通过  对象["键名"]  的格式取值
      item.roleNames = outputArray.join(',')// 输出: 角色A,角色B,角色C
      // console.log(idList, outputArray)
    }
  })
}

//获取图片
const getImages = async () => {
  try {

    //判断筛选条件是否改变
    if (deepEqual(condition, oldCondition, true)) return ElMessage.info('筛选条件未作改变，已取消查询')
    else {
      // 将 a 的值同步到 b，包括空值
      const keys = Object.keys(oldCondition) as Array<keyof ImgParams>//类型断言keys中是ImgParams的键名
      keys.forEach(key => {
        if (key in condition) {
          oldCondition[key] = condition[key]  //类型断言condition[key]与oldCondition[key]类型相同
        } else {
          delete oldCondition[key]  // 删除 b 中 a 中不存在的属性
        }
      });
    }

    const result = await axios({
      url: isAdmin.value ? '/getAllWallpaper' : '/getWallpaper',
      params: condition
    })
    console.log('getImages', result)
    const { status, data, msg } = result.data
    if (status === 300) return//没有查询结果则不进行以下操作
    const { imgList, totalNum } = data
    total.value = totalNum
    tableData.value = imgList
    previewImgList.splice(0, previewImgList.length)
    //imgIndex用于排序，但不连续,故重写
    tableData.value.forEach((item, index) => {
      item.imgIndex = index
      previewImgList.push(item.imgUrl)
    })
  } catch (error) {
    console.log('发生错误：')
    console.log(error)
  }
}


const tableData = ref<ReverseImgInfo[]>([])//展示列表，存的图片信息对象

const isEditRow = ref<number>(-1)//编辑标记

//编辑图片信息(修改编辑标记)
const handleEdit = (index: number, row: ReverseImgInfo) => {
  isEditRow.value = index //编辑的行
  if (!!row.tags) roleIDList.value = row.tags.split(',')//角色id数组
  else roleIDList.value = []
  Object.assign(imgInfo, row)//点击编辑时，将当前行数据添加到当前编辑的信息imgInfo
}

//还原编辑标记
function handleCancel() {
  isEditRow.value = -1
}


//对上传的数据进行格式检查
function checkUpdateRow(newData: ReverseImgInfo, oldData: ReverseImgInfo) {
  const data = <ReverseImgInfo>diffObj(newData, oldData)
  //判断图片信息是否修改
  if (Object.keys(data).length === 0) {
    isEditRow.value = -1//取消编辑
    return ElMessage.info('图片信息未修改，已取消更新。')
  } else {
    //校验格式

    updateRow(data, oldData)
  }
}

//上传更新的图片信息
function updateRow(data: ReverseImgInfo, oldData: ReverseImgInfo) {
  const { roleNames, ...newData } = data //通过解构赋值去除roleNames
  if (!newData || JSON.stringify(newData) === '{}') return ElMessage.warning('修改不能为空')
  axios({
    url: isAdmin.value ? '/updateAllWallPaper' : '/updateWallPaper',
    method: 'post',
    data: {
      data: newData,
      id: oldData.id//id被洗掉了，手动添加
    }
  }).then(result => {
    // console.log(result)
    const { msg } = result.data
    //判断是否修改文件路径
    // if (newPath !== undefined) data.imgPath = newPath
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
const deleteRow = (index: number, info: ReverseImgInfo) => {
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
const deleteImage = (index: number, data: ReverseImgInfo) => {
  return ElMessage.warning('暂未支持删除操作')
}
</script>


<style scoped>
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

/*下拉菜单的元素居左*/
.el-select-dropdown__item {
  text-align: left;
}
</style>
