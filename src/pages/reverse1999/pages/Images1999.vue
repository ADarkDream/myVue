<template>
  <!-- <el-container>-->
  <div class="images1999">
    <div>
      <!--PC筛选框  -->
      <el-row v-if="isPC" class="header2">
        <el-col :sm="3">
          <el-select
            placeholder="选择版本"
            v-model="condition.version"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :suffix-icon="Search"
          >
            <el-option v-for="item in diffVersionInfo" :key="item?.version" :label="item?.versionName" :value="item?.version" />
          </el-select>
        </el-col>
        <el-col :sm="4">
          <el-tree-select
            placeholder="包含角色"
            v-model="condition.roles"
            :data="roleTree"
            :render-after-expand="false"
            multiple
            show-checkbox
            collapse-tags
            collapse-tags-tooltip
            filterable
            :suffix-icon="Search"
          />
        </el-col>
        <el-col :sm="2">
          <el-select v-model.trim="condition.orderBy" placeholder="排序根据">
            <el-option label="默认排序" value="" />
            <el-option label="根据id" value="id" />
            <el-option label="创建时间" value="created_time" />
          </el-select>
        </el-col>
        <el-col :sm="2">
          <el-select :disabled="!condition.orderBy" v-model.trim="condition.order" placeholder="排序方向">
            <el-option label="正序" value="" />
            <el-option label="倒序" value="desc" />
          </el-select>
        </el-col>
        <el-col :sm="2">
          <el-select v-model.trim="condition.mode" placeholder="是否精确查找">
            <el-option label="精准查询" value="accurate" />
            <el-option label="模糊查询" value="inaccurate" />
          </el-select>
        </el-col>
        <el-col :sm="2">
          <el-select v-model.trim="condition.sort" placeholder="图片类型">
            <el-option label="全选" :value="2" />
            <el-option label="横屏" :value="1" />
            <el-option label="竖屏" :value="0" />
          </el-select>
        </el-col>
        <el-col :sm="8">
          <el-button @click="render(true)" type="primary">筛选/查找</el-button>
          <el-button @click="clearFilter">清除筛选</el-button>
          <el-button type="success" plain @click="checkReverseUpdate()">检查更新</el-button>
          <el-button type="success" plain @click="export_excel()">导出Excel</el-button>
          <!-- <el-button type="primary" @click="dialogVisible = true" disabled>导出Excel</el-button> -->
        </el-col>
      </el-row>
      <!--移动端筛选框-->
      <div class="header" v-else>
        <el-button @click="dialogVisible = true" type="primary">筛选/查找</el-button>
        <el-button type="success" plain @click="checkReverseUpdate()">检查更新</el-button>
        <el-button type="success" plain @click="render(true)" :icon="Refresh" title="刷新图片信息">刷新</el-button>
        <el-button type="success" plain @click="export_excel()">导出Excel</el-button>
      </div>
    </div>
    <el-table
      ref="tableRef"
      :data="tableData"
      class="myCustomElTable"
      :max-height="mainPanelContentHeight - (isPC ? 100 : 70)"
      stripe
      border
      highlight-current-row
      table-layout="auto"
      :default-sort="{ prop: 'imgIndex', order: 'custom' }"
      @sort-change="handleSortChange"
      fit
    >
      <el-table-column prop="imgIndex" label="页序" width="80" align="center" sortable>
        <template #default="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" min-width="60" align="center" sortable v-if="isAdmin" />
      <el-table-column prop="version" label="版本" min-width="100" align="center">
        <template #default="scope">
          <el-select placeholder="选择版本" v-model="imgInfo.version" v-if="showEdit(scope.$index)">
            <el-option v-for="item in diffVersionInfo" :key="item?.version" :label="item?.versionName" :value="item?.version" />
          </el-select>
          <el-text v-else>
            {{ versionNameDictionary[scope.row.version] }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="imgUrl" sum-text :label="isEditRow === -1 ? '图片' : '链接'" width="200" align="center">
        <template #default="scope">
          <el-input
            type="textarea"
            v-model="imgInfo.imgUrl"
            :disabled="!isAdmin"
            placeholder="请输入图片链接"
            v-if="isEditRow === scope.$index"
          />
          <!--preview-teleported解决图片显示不全的问题-->
          <div v-show="isEditRow !== scope.$index" class="preImg" :id="'imgDiv-' + imgInfo.imgIndex">
            <el-image
              :src="scope.row.imgUrl"
              :zoom-rate="1.2"
              :id="'img-' + scope.row.imgIndex"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="previewImgList"
              :initial-index="scope.row.imgIndex"
              fit="scale-down"
              lazy
              :preview-teleported="true"
            >
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
      <el-table-column prop="roleNames" label="包含角色" min-width="150" align="center">
        <template #default="scope">
          <el-tree-select
            v-model="roleIDList"
            :data="roleTree"
            @change="updateRoleNames()"
            multiple
            :render-after-expand="false"
            show-checkbox
            filterable
            v-if="isEditRow === scope.$index"
          >
          </el-tree-select>
          <el-text type="primary" v-else>{{ scope.row.roleNames }}</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="newName" label="图片名" min-width="150" align="center">
        <template #default="scope">
          <el-input type="textarea" v-model="imgInfo.newName" placeholder="请输入图片名称" v-if="showEdit(scope.$index)" />
          <span v-else>
            {{ scope.row.newName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="oldName" label="官方原名" min-width="150" align="center">
        <template #default="scope">
          <div v-if="showEdit(scope.$index)">
            <el-input type="textarea" v-model="imgInfo.oldName" placeholder="请输入图片名称" />
          </div>
          <div v-else>
            {{ scope.row.oldName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="别称" min-width="100" align="center">
        <template #default="scope">
          <div v-if="showEdit(scope.$index)">
            <el-input type="textarea" v-model="imgInfo.nickName" placeholder="请输入图片名称" />
          </div>
          <div v-else>
            {{ scope.row.nickName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="imgPath" sum-text label="服务器存储路径" width="110" align="center" v-if="isAdmin" />
      <el-table-column prop="time" label="官方上传时间" min-width="110" align="center" />
      <!-- <el-table-column prop="created_time" label="整理时间" min-width="150" align="center">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column> -->
      <el-table-column prop="updated_time" label="上次修改时间" min-width="150" align="center">
        <template #default="scope">{{ getTime(scope.row.updated_time) }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100" align="center">
        <template #header v-if="isPC">
          <div style="display: flex; justify-content: space-around">
            <span>操作</span
            ><el-button type="success" size="small" plain @click="render(true)" :icon="Refresh" title="刷新图片信息"></el-button>
          </div>
        </template>
        <template #default="scope">
          <div v-if="isEditRow !== scope.$index">
            <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" :disabled="!isAdmin" @click="deleteRow(scope.$index, scope.row)">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button link type="info" size="small" @click="handleCancel">取消 </el-button>
            <el-button link type="primary" size="small" @click.prevent="checkReverseUpdateRow(imgInfo, scope.row)">
              更新
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageMenu">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="condition.pageSize"
        size="small"
        :page-sizes="[10, 25, 50, 100]"
        :layout="layout"
        :total="total"
        @size-change="render()"
        @current-change="render()"
      />
    </div>

    <!--移动端筛选框2-->
    <el-drawer v-model="dialogVisible" title="筛选图片" :show-close="false" direction="btt" :append-to-body="true" size="50%">
      <el-row>
        <el-col :sm="3">
          <el-select
            placeholder="选择版本"
            v-model="condition.version"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :suffix-icon="Search"
          >
            <el-option v-for="item in diffVersionInfo" :key="item?.version" :label="item?.versionName" :value="item?.version" />
          </el-select>
        </el-col>
        <el-col :sm="4">
          <el-tree-select
            placeholder="包含角色"
            v-model="condition.roles"
            :data="roleTree"
            :render-after-expand="false"
            multiple
            show-checkbox
            collapse-tags
            collapse-tags-tooltip
            filterable
            :suffix-icon="Search"
          />
        </el-col>
        <el-col :sm="2">
          <el-select v-model.trim="condition.orderBy" placeholder="排序根据">
            <el-option label="默认排序" value="" />
            <el-option label="根据id" value="id" />
            <el-option label="创建时间" value="created_time" />
          </el-select>
        </el-col>
        <el-col :sm="2">
          <el-select :disabled="!condition.orderBy" v-model.trim="condition.order" placeholder="排序方向">
            <el-option label="正序" value="" />
            <el-option label="倒序" value="desc" />
          </el-select>
        </el-col>
        <el-col :sm="2">
          <el-select v-model.trim="condition.mode" placeholder="是否精确查找">
            <el-option label="精准查询" value="accurate" />
            <el-option label="模糊查询" value="inaccurate" />
          </el-select>
        </el-col>
        <el-col :sm="2">
          <el-select v-model.trim="condition.sort" placeholder="图片类型">
            <el-option label="全选" :value="2" />
            <el-option label="横屏" :value="1" />
            <el-option label="竖屏" :value="0" />
          </el-select>
        </el-col>
        <el-col :sm="8">
          <el-button @click="render(true)" type="primary">筛选/查找</el-button>
          <el-button @click="clearFilter">清除筛选</el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
  <!-- </el-container> -->
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue"
import { Picture as IconPicture, Search, Refresh } from "@element-plus/icons-vue"
//stores
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useReverse1999Store } from "@/store/reverse1999/useReverse1999Store"
//hooks
import useTimeStamp from "@/hooks/useTimestamp"
import useReverse1999 from "@/hooks/reverse1999/useReverse1999"
//components

//utils
import myFunction from "@/utils/myFunction"
import fileProcess from "@/utils/fileProcess"
//types
import type { TableInstance } from "element-plus"
import { Sort } from "@/types/global"
import { api_checkReverseUpdate, api_getImage, api_updateImage } from "@/apis/reverse1999"

const responsiveStore = useResponsiveStore()
const reverse1999Store = useReverse1999Store()
const userInfoStore = useUserInfoStore()

const { mainPanelContentHeight, screenHeight, isPC } = toRefs(responsiveStore)
const { allRoleInfo, diffVersionInfo } = toRefs(reverse1999Store)
const versionNameDictionary = computed(() => reverse1999Store.versionNameDictionary)
const roleNameDictionary = computed(() => reverse1999Store.roleNameDictionary)
const roleTree = computed(() => reverse1999Store.roleTree)
const { isAdmin, isLogin } = toRefs(userInfoStore)
const { getTime } = useTimeStamp()
const { getVersion } = useReverse1999()
const { deepEqual, diffObj } = myFunction

//region  树状选择框
const roleIDList = ref<number[]>([]) //树状选择框当前的值(是角色ID字符串数组)

//角色树状选择框(修改图片信息时)更新角色字段
const updateRoleNames = () => {
  //表格中修改图片数据
  if (!roleIDList.value.length) imgInfo.roleIds = []
  else imgInfo.roleIds = roleIDList.value //返回角色ID字符串
  imgInfo.roleNames = reNameRoleByIds(imgInfo.roleIds)
}
//endregion

const currentPage = ref(1)
const total = ref(25) //总数有多少张图
const layout = computed(() => {
  if (!isPC.value) {
    return "total, prev, pager, next"
  } else if (total.value / condition.pageSize! > 10) {
    return "total, sizes, prev, pager, next,jumper"
  } else {
    return "total, sizes, prev, pager, next"
  }
})
//用户查询的参数
const condition: ImgParams = reactive({
  version: [],
  roles: [],
  sort: 2,
  mode: "accurate",
  pageSize: 25,
  offset: 0,
  orderBy: "id",
  order: "asc",
})
//用户上一次查询的参数
const oldCondition: ImgParams = reactive({
  version: [],
  roles: [],
  sort: 2,
  mode: "accurate",
  pageSize: 25,
  offset: 0,
  orderBy: "id",
  order: "",
})

//当前修改的图片信息
const imgInfo: ReverseImgInfo = reactive({
  id: 0,
  oldName: "",
  newName: "",
  imgUrl: "",
  roleIds: [], //角色ID,例如："3,93"
  // tags: '',
  roleNames: "",
  sort: 2,
  imgPath: "",
  time: 20230325,
  version: 10,
})

//筛选

const roles = ref<Record<string, string>>({}) //存角色信息{"1": "维尔汀","2": "十四行诗","3": "APPLe"}

const previewImgList = ref<string[]>([]) //大图展示列表，存的图片链接

//上传图片面板的显示与隐藏
const dialogVisible = ref(false)

const tableRef = ref<TableInstance>()

//清空全部筛选条件
const clearFilter = () => {
  condition.version = [] //清空搜索框
  condition.roles = [] //清空搜索框
}

//监听排序行为，并修改数组顺序,否则删除会出错
function handleSortChange({ prop, order }: Sort<ReverseImgInfo>) {
  //  {column,prop, order}
  console.log(prop, order)
  if (prop === "id") {
    //根据排序整个列表
    condition.orderBy = prop
    order === "descending" ? (condition.order = "desc") : (condition.order = "")
    render()
  } else
    tableData.value.sort((a, b) => {
      // 根据 column 和 order 对 this.tableData 进行排序,只排序本页
      const propA = a[prop as keyof typeof a]!
      const propB = b[prop as keyof typeof b]!
      if (propA < propB) return order === "ascending" ? -1 : 1
      else if (propA > propB) {
        console.log("正序")
        return order === "ascending" ? 1 : -1
      } else return 0
    })
}

//获取全部图片
onMounted(async () => {
  //获取版本列表并添加到菜单
  await getVersion({ version: "diff", role: "all" })
  await render()
})

/**将角色id数组替换为角色名称*/
const reNameRoleByIds = (roleIds: number[] = []) => {
  if (!roleIds) return ""
  const nameList = roleIds.map((x) => roleNameDictionary.value[x]) //roles[x] 通过  对象["键名"]  的格式取值
  return nameList.join(",") // 输出: 角色A,角色B,角色C
}

/**渲染函数(还未解决index排序问题)*/
const render = async (isRefresh = false) => {
  if (isRefresh) {
    condition.offset = 0
    currentPage.value = 1
  } else oldCondition.offset = (currentPage.value - 1) * (oldCondition.pageSize || 25)
  //清空表格显示的数据
  // tableData.splice(0, tableData.length)
  //根据当前页码计算出应显示的数据
  // const newData = totalData.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
  // newData.forEach((item: Url) => {
  //   tableData.push(item)
  // })
  // console.log(currentPage.value, condition.offset);

  await getImages(isRefresh)

  //将角色id替换成角色名称
  tableData.value.forEach((item) => {
    if (item.roleIds?.length) {
      item.roleNames = reNameRoleByIds(item.roleIds)
      // console.log(idList, outputArray)
    }
  })
}

/**判断并修改新旧筛选条件*/
const changeCondition = (isRefresh = false) => {
  if (isRefresh) {
    //如果是根据新的条件筛选，则将旧条件替换为当前条件
    // 将 a 的值同步到 b，包括空值
    const keys = Object.keys(oldCondition) as Array<keyof ImgParams> //类型断言keys中是ImgParams的键名
    keys.forEach((key) => {
      if (key in condition) {
        oldCondition[key] = condition[key] //类型断言condition[key]与oldCondition[key]类型相同
      } else {
        delete oldCondition[key] // 删除 b 中 a 中不存在的属性
      }
    })
  } else {
    //如果是在旧条件下翻页，则将新条件替换为当前条件【旧条件(修改页码后)】
    // 将 b 的值同步到 a，包括空值
    const keys = Object.keys(condition) as Array<keyof ImgParams> //类型断言keys中是ImgParams的键名
    keys.forEach((key) => {
      if (key in oldCondition) {
        condition[key] = oldCondition[key] //类型断言condition[key]与oldCondition[key]类型相同
      } else {
        delete condition[key] // 删除 b 中 a 中不存在的属性
      }
    })
  }
}

//获取图片
const getImages = async (isRefresh = false) => {
  try {
    //判断筛选条件是否改变
    if (!isRefresh && deepEqual(condition, oldCondition, true)) return ElMessage.info("筛选条件未作改变，已取消查询")

    changeCondition(isRefresh)

    const data = await api_getImage(
      {
        ...condition,
        isManagement: "1",
      },
      isAdmin.value
    )
    if (!data) return
    const { imgList, totalNum } = data
    total.value = totalNum
    tableData.value = imgList as ReverseImgInfo[]
    previewImgList.value = []
    //imgIndex用于排序，但不连续,故重写
    tableData.value.forEach((item, index) => {
      item.imgIndex = index
      previewImgList.value.push(item.imgUrl)
    })
    if (isRefresh) ElMessage.success("刷新成功")
  } catch (error) {
    console.log("发生错误：")
    console.log(error)
  }
}

const tableData = ref<ReverseImgInfo[]>([]) //展示列表，存的图片信息对象

const isEditRow = ref<number>(-1) //编辑标记
//还原编辑标记
const handleCancel = () => (isEditRow.value = -1)

const showEdit = (index: number) => isAdmin.value && isEditRow.value === index //是否显示编辑框

//编辑图片信息(修改编辑标记)
const handleEdit = (index: number, row: ReverseImgInfo) => {
  if (!isLogin.value) return ElMessage.warning("注册并登录后可编辑")
  isEditRow.value = index //编辑的行
  if (row.roleIds?.length)
    roleIDList.value = row.roleIds //角色id数组
  else roleIDList.value = []
  Object.assign(imgInfo, row) //点击编辑时，将当前行数据添加到当前编辑的信息imgInfo
}

//对上传的数据进行格式检查
function checkReverseUpdateRow(newData: ReverseImgInfo, oldData: ReverseImgInfo) {
  const data = diffObj(newData, oldData) as ReverseImgInfo
  //判断图片信息是否修改
  if (!Object.keys(data).length) {
    handleCancel() //取消编辑
    return ElMessage.info("图片信息未修改，已取消更新。")
  } else {
    //校验格式
    updateRow(data, oldData)
  }
}

//上传更新的图片信息
const updateRow = async (data: ReverseImgInfo, oldData: ReverseImgInfo) => {
  try {
    const { roleNames, ...newData } = data //通过解构赋值去除roleNames
    if (!newData || !Object.keys(newData).length) return ElMessage.warning("修改不能为空")
    newData.id = oldData.id //id被洗掉了，手动添加
    const flag = await api_updateImage(newData, isAdmin.value)
    if (flag) {
      //判断是否修改文件路径
      // if (newPath !== undefined) data.imgPath = newPath
      //将修改后的信息显示出来
      Object.assign(oldData, data)
      //去除编辑标记
      handleCancel()
    }
  } catch (error) {
    console.log("发生错误：")
    console.log(error)
    //ElMessage.error('发生错误：' + error.message)
  }
}

//图片删除确认
const deleteRow = (index: number, info: ReverseImgInfo) => {
  ElMessageBox.confirm("确认删除该图片吗?", "Warning", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消删除",
    type: "warning",
    showClose: false,
  })
    .then(() => deleteImage(index, info))
    .catch(() => ElMessage.info("删除操作已取消"))
}

//删除图片
const deleteImage = (index: number, data: ReverseImgInfo) => {
  return ElMessage.warning("暂未支持删除操作")
}

//! 检查1999官方以影像之是否有更新
/**检查1999官方以影像之是否有更新 */
const checkReverseUpdate = async () => {
  const flag = await api_checkReverseUpdate()
  //有更新则刷新
  if (flag) {
    await getVersion({ version: "all" }, true)
    await render(true)
  }
}

/**将八位数字分割为年月日*/
function convertToDate(num: number) {
  // 将八位数字转为字符串
  if (!num) return ""
  const numStr = num.toString()

  // 提取年份、月份和日期
  const year = parseInt(numStr.slice(0, 4))
  const month = parseInt(numStr.slice(4, 6))
  const day = parseInt(numStr.slice(6, 8))

  // 拼接为日期格式
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
}

/**
 * 处理excel表头和数据，并导出
 * */
const export_excel = async () => {
  const tempCondition = Object.assign({}, condition, {
    pageSize: total.value,
    isManagement: "1",
  })
  const results = await api_getImage(tempCondition, isAdmin.value)
  if (!results) return
  const { imgList } = results
  console.log(imgList)

  //提取表头和表数据
  const headers = ["ID", "版本名称", "包含角色", "壁纸类型", "本站命名", "原名", "别名", "壁纸链接", "官方更新时间"]
  const propsIndex = ["id", "version", "roleIds", "sort", "newName", "oldName", "nickName", "imgUrl", "time"] //收集序号

  // 数据
  const data = imgList.map((row: ReverseImgInfo) => {
    return propsIndex
      .map((prop) => {
        // 修改具体值
        if (prop === "version") return versionNameDictionary.value[row[prop]] || ""
        else if (prop === "roleIds") return reNameRoleByIds(row[prop])
        else if (prop === "sort") return row[prop] ? "竖屏" : "横屏"
        else if (prop === "time") return convertToDate(row[prop])
        return row[prop as keyof ReverseImgInfo] || ""
      })
      .filter((item) => item !== undefined)
  })
  // 组合数据，第一行是表头
  const sheetData = [headers, ...data]

  //生成Excel文件并保存
  fileProcess.save_as_excel(sheetData, "以影像之", "重返未来1999以影像之表")
}
</script>

<style scoped>
/*下拉菜单的元素居左*/
/* .el-select-dropdown__item {
  text-align: left;
} */
@media (max-width: 780px) {
  .el-col {
    margin: 5px 0;
  }
}
</style>
