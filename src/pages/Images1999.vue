<template>
  <el-container>
    <el-header class="header1">
      以影像之图片管理
    </el-header>
    <!--    移动端筛选框-->
    <el-collapse style="margin: 0 10px" v-if="!isPC">
      <el-collapse-item title="筛选条件">
        <el-row class="header2">
          <el-col :md="3" v-if="isAdmin">
            <el-button type="primary" @click="dialogVisible=true" :size="elSize">添加新图片</el-button>
          </el-col>
          <el-col :md="3" :sm="4">
            <el-select placeholder="选择版本" v-model="condition.version" multiple :suffix-icon="Search">
              <el-option v-for="item in versionInfo" :key="item.value" :label="item.text" :value="item.value"/>
            </el-select>
          </el-col>
          <el-col :md="3" :sm="4">
            <el-tree-select
                placeholder="包含角色"
                v-model="condition.roles"
                :data="sourceData"
                multiple
                :render-after-expand="false"
                :filter-node-method="filterNodeMethod"
                @change="updateRoleNames(true)"
                filterable
                :suffix-icon="Search"
            />
          </el-col>
          <el-col :md="3" :sm="4">
            <el-select v-model.trim="condition.orderBy" placeholder="排序根据">
              <el-option label="默认排序" value=""/>
              <el-option label="根据id" value="id"/>
              <el-option label="创建时间" value="created_time"/>
            </el-select>
          </el-col>
          <el-col :md="3" :sm="4">
            <el-select :disabled="!condition.orderBy" v-model.trim="condition.isDesc" placeholder="排序方向">
              <el-option label="正序" value=""/>
              <el-option label="倒序" value="desc"/>
            </el-select>
          </el-col>
          <el-select v-model.trim="condition.accurate" placeholder="是否精确查找">
            <el-option label="精准查询" :value="1"/>
            <el-option label="模糊查询" :value="0"/>
          </el-select>
          <el-select v-model.trim="condition.sort" placeholder="图片类型">
            <el-option label="全选" :value="2"/>
            <el-option label="横屏" :value="1"/>
            <el-option label="竖屏" :value="0"/>
          </el-select>
          <el-col :md="6" :sm="7">
            <el-button @click="render" type="primary" :size="elSize">筛选查找</el-button>
            <el-button @click="clearFilter" :size="elSize">清空全部筛选</el-button>
            <el-button :size="elSize" type="primary" @click="router.push({name:'images'})">点击前往图片表</el-button>
          </el-col>

        </el-row>
      </el-collapse-item>
    </el-collapse>
    <el-row v-else class="header2">
      <el-col :span="3">
        <el-button :size="elSize" type="primary" @click="router.push({name:'roles'})">点击前往角色表</el-button>
      </el-col>
      <el-col :span="3">
        <el-select placeholder="选择版本" v-model="condition.version" multiple :suffix-icon="Search">
          <el-option v-for="item in versionInfo" :key="item.value" :label="item.text" :value="item.value"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-tree-select
            placeholder="包含角色"
            v-model="condition.roles"
            :data="sourceData"
            multiple
            :render-after-expand="false"
            :filter-node-method="filterNodeMethod"
            @change="updateRoleNames(true)"
            filterable
            :suffix-icon="Search"
        />
      </el-col>
      <!--    <el-col :span="2">-->
      <!--      <el-select v-model.trim="condition." placeholder="未标记">-->
      <!--        <el-option label="网站状态(全选)" :value="2"/>-->
      <!--        <el-option label="正在使用" :value="1"/>-->
      <!--        <el-option label="待审核" :value="0"/>-->
      <!--      </el-select>-->
      <!--    </el-col>-->
      <el-col :span="2">
        <el-select v-model.trim="condition.orderBy" placeholder="排序根据">
          <el-option label="默认排序" value=""/>
          <el-option label="根据id" value="id"/>
          <el-option label="创建时间" value="created_time"/>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-select :disabled="!condition.orderBy" v-model.trim="condition.isDesc" placeholder="排序方向">
          <el-option label="正序" value=""/>
          <el-option label="倒序" value="desc"/>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-select v-model.trim="condition.accurate" placeholder="是否精确查找">
          <el-option label="精准查询" :value="1"/>
          <el-option label="模糊查询" :value="0"/>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-select v-model.trim="condition.sort" placeholder="图片类型">
          <el-option label="全选" :value="2"/>
          <el-option label="横屏" :value="1"/>
          <el-option label="竖屏" :value="0"/>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button @click="render" type="primary">筛选查找</el-button>
        <el-button @click="clearFilter">清空全部筛选</el-button>
      </el-col>
    </el-row>
    <el-main style="padding-bottom:0;padding-top: 0 ">
      <el-text type="primary" style="margin: 5px auto">
        个人收集略有不足，如有错漏还请向我反馈。非常感谢！如有乐意帮忙的司辰也欢迎点击右侧编辑按钮进行修改(非管理员仅能修改角色)！
      </el-text>
      <br>
      <el-text type="danger">本页面暂未适配移动端</el-text>
      <el-table ref="tableRef" :data="tableData" style="width: 100%" :max-height="screenHeight-260" stripe border
                highlight-current-row
                table-layout="auto" type="type" :default-sort="{ prop: 'imgIndex', order: 'custom' }"
                @sort-change="handleSortChange">
        <el-table-column fixed prop="imgIndex" label="本页序号" width="100" align="center" sortable/>
        <el-table-column prop="id" label="ID" width="50" align="center" sortable/>
        <el-table-column prop="version" label="版本" width="100" align="center">
          <template #default="scope">
            <template v-for="item in versionInfo" :key="item.value">
              <el-text v-if="item.value===scope.row.version">
                {{ item.text }}
              </el-text>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="imgUrl" sum-text :label="isEditRow===-1?'图片':'链接'  " width="200" align="center">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-text type="primary" @click="copyText(scope.row.imgUrl,'图片链接'+scope.row.newName,scope.row.imgUrl)">
                {{ scope.row.imgUrl }}
              </el-text>
            </div>
            <!--preview-teleported解决图片显示不全的问题-->
            <div v-else @click="checkImage(scope.row.imgUrl,scope.row.imgName,$event)"
                 class="preImg"
                 :id="'imgDiv-'+imgInfo.imgIndex">
              <el-image :src="scope.row.imgUrl" :zoom-rate="1.2" :id="'img-'+scope.row.imgIndex"
                        :max-scale="7"
                        :min-scale="0.2"
                        :preview-src-list="isChoose!==0? [] : previewImgList"
                        :initial-index="scope.row.imgIndex"
                        fit="scale-down" lazy
                        :preview-teleported="true"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon style="width: 50px">
                      <icon-picture/>
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="roleNames" label="包含角色" width="100" align="center">
          <template #default="scope">
            <el-text type="primary">{{ scope.row.roleNames }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="newRoleNames" label="包含角色修改为" width="200" align="center">
          <template #default="scope">
            <div v-if="isEditRow===scope.$index">
              <el-tree-select
                  placeholder="选择或搜索"
                  v-model="roleIDList"
                  :data="sourceData"
                  multiple
                  :render-after-expand="false"
                  :filter-node-method="filterNodeMethod"
                  @change="updateRoleNames()"
                  filterable
              />
            </div>
            <el-text v-else type="warning">{{ scope.row.newRoleNames }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="newName" label="图片名" width="150" align="center"/>
        <el-table-column prop="oldName" label="官方原名" width="150" align="center"/>
        <!--      <el-table-column prop="imgPath"  sum-text label="服务器存储路径" width="100" align="center"/>-->
        <el-table-column prop="time" label="官方上传时间" width="120"/>
        <el-table-column prop="created_time" label="整理时间" width="150">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <div v-if="isEditRow!==scope.$index">
              <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button disabled link type="danger" size="small" @click="deleteRow(scope.$index,scope.row)">
                删除
              </el-button>
            </div>
            <div v-else>
              <el-button link type="primary" size="small" @click="handleCancel">取消
              </el-button>
              <el-button link type="primary" size="small" @click.prevent="checkUpdateRow(imgInfo,scope.row)">
                更新
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageMenu">
        <el-pagination
            v-model:current-page="condition.currentPage"
            v-model:page-size="condition.pageSize"
            :page-sizes="[10, 25, 50, 100]"
            :layout="options"
            :total="total"
            :small="!isPC"
            @size-change="render()"
            @current-change="render()"
        />
      </div>
    </el-main>

    <!--图片上传框-->
    <el-dialog v-model="dialogVisible" :show-close="false" title="上传图片">
      <el-text>暂不支持</el-text>
    </el-dialog>
  </el-container>
</template>


<script setup lang="ts">
import {useRouter} from 'vue-router'
import axios from "axios";
import {ElMessage, ElMessageBox, ElTreeSelect} from "element-plus";
import type {TableInstance} from "element-plus";
import {onMounted, reactive, ref} from 'vue'
import UploadImage from "@/components/UploadImage.vue";
import useTimeStamp from "@/hooks/useTimestamp";
import {Picture as IconPicture, Search} from "@element-plus/icons-vue";

const {getTime} = useTimeStamp()

const router = useRouter()

//管理员登录判断
import useUserInfo from "@/hooks/useUserInfo";
import useFunction from "@/hooks/useFunction";
import useResponsive from "@/hooks/useResponsive";

const {copyText, deepEqual} = useFunction()
const {isAdmin} = useUserInfo()
const {screenHeight, elSize, isPC} = useResponsive()


//region  树状选择框
const roleIDList = ref([])//树状选择框当前的值(是角色ID字符串数组)

//树状选择框的选项
let sourceData = reactive([])
//角色树状选择框的筛选(搜索时)
const filterNodeMethod = (roleID, sourceData) => sourceData.label.includes(roleID)
//角色树状选择框的筛选(修改时)
const updateRoleNames = (isSearch = false) => {
  console.log(isSearch)
  if (!isSearch) {//表格中修改图片数据
    imgInfo.newTags = roleIDList.value.join(',')//返回角色ID字符串
    imgInfo.newRoleNames = roleIDList.value.map(roleId => roles.value[roleId]).join(',')//返回角色名字字符串
    console.log(imgInfo)
  }//isSearch=true代表顶部搜索框的角色筛选
}
//endregion


//用户查询的参数
const condition = reactive<ImgParams>({
      version: [],
      roles: [],
      sort: 2,
      accurate: 0,
      pageSize: 25,
      currentPage: 1,
      orderBy: '',
      isDesc: ''
    }
)
//用户上一次查询的参数
const oldCondition = reactive<ImgParams>({
  version: [],
  roles: [],
  sort: 2,
  accurate: 0,
  pageSize: 25,
  currentPage: 0,
  orderBy: '',
  isDesc: ''
})

//当前修改的图片信息
let imgInfo = reactive<ReverseImgInfo>({
  id: 0,
  oldName: '',
  newName: '',
  imgUrl: '',
  tags: '',//角色ID,例如："3,93"
  newTags: '',
  roleNames: '',
  newRoleNames: '',
  sort: 2,
  imgPath: '',
  time: 20230325,
  version: 10,
})
const total = ref(25) //总数有多少张图
//筛选
const activeIndex = ref('1')  //激活的折叠面板序号
const versionInfo = reactive<TableFilterItem<number>[]>([])    //存版本信息
const roleInfo = reactive<Role[]>([]) //存角色信息
const roles = ref({})  //存角色信息{"1": "维尔汀","2": "十四行诗","3": "APPLe"}
const campInfo = reactive<string[]>([]) //存阵营信息
const raceInfo = reactive<string[]>([]) //存种族信息

const checkAllVersions = ref(false)   //全选版本
const isIndeterminateVersion = ref(false)  //全选版本按钮状态
const checkAllRoles = ref(false)   //全选角色
const checkNoRole = ref(false)   //全选无角色
const isIndeterminateRole = ref(false)  //全选角色按钮状态
const isIndeterminateNoRole = ref(false)  //全选无角色按钮状态
const campName = ref<string>('')      //阵营名称
const raceName = ref<string>('')      //种族名称

const completed = reactive<Notice[]>([])      //筛选下方的公告列表：完成和未完成的功能
const unCompleted = reactive<Notice[]>([])

const showUrl = ref(false)     //控制开源地址的显示
const showNotice = ref(false)     //控制下载须知界面的显示
const isShowNum = ref<number>(1)      //控制下载公告须知的显示第几个页面
const isShowNotice = ref(false)//控制模糊和精准搜索的说明是否显示
// const tableData = reactive<ReverseImgInfo[]>([])  //展示列表，存的图片信息对象
const previewImgList = reactive<string[]>([]) //大图展示列表，存的图片链接
const isChoose = ref(0)   //是否是批量选择状态

//上传图片面板的显示与隐藏
let dialogVisible = ref(false)

const tableRef = ref<TableInstance>()
const options = ref('total, prev, pager, next')

function setOptions() {
  if (isPC.value)
    total.value / condition.pageSize > 10 ? options.value = 'total, sizes, prev, pager, next,jumper' : options.value = 'total, sizes, prev, pager, next'
  else options.value = 'total, prev, pager, next'
}

//清空全部筛选条件
const clearFilter = () => {
  condition.version = []//清空搜索框
  condition.roles = []//清空搜索框
}


//监听排序行为，并修改数组顺序,否则删除会出错
function handleSortChange({column, prop, order}) {
  console.log(column, prop, order)
  if (prop === 'id') {//根据排序整个列表
    condition.orderBy = prop
    order === 'descending' ? condition.isDesc = 'desc' : condition.isDesc = ''
    render()
  } else tableData.sort((a, b) => {  // 根据 column 和 order 对 this.tableData 进行排序,只排序本页
    if (a[prop] < b[prop]) return order === 'ascending' ? -1 : 1;//
    else if (a[prop] > b[prop]) {
      console.log('正序')
      return order === 'ascending' ? 1 : -1;
    } else return 0;
  })

}


//获取全部图片
onMounted(async () => {
  await getVersion()
  await render()
})

//获取版本列表并添加到菜单
async function getVersion() {
  try {
    const result = await axios({
      url: '/getVersion',
      params: {role: 'all'}
    })
    console.log('getVersion', result)
    const {versionList, roleList}: { versionList: VersionInfo[], roleList: Role[] } = result.data.data
    //更新版本列表
    versionList.forEach((item) => {
      versionInfo.push({text: item.versionName, value: item.version})
    })

    //更新角色列表
    roleInfo.splice(0, roleInfo.length, ...roleList)
    //获取阵营列表
    const campList = new Set([])
    const raceList = new Set([])
    roleInfo.forEach(item => {
      campList.add(item.camp)
      raceList.add(item.race)
    })
    campList.delete('')   //删除空值
    campInfo.splice(0, campInfo.length, ...campList)
    raceInfo.splice(0, campInfo.length, ...raceList)
    console.log('campList', campList)
    console.log('campInfo', campInfo)
    const newSourceData = campInfo.map((item, index) => {
      const children = roleList.map(role => {
        if (role.camp === item) return {label: role.name, value: role.id.toString()}
      }).filter(item => item !== undefined)//过滤掉空值
      return {label: item, value: index, children}
    })

    sourceData.splice(0, sourceData.length, ...newSourceData)
    console.log('sourceData', sourceData)
    // 构建id到name的映射
    roles.value = roleInfo.reduce((map, role) => {
      map[role.id] = role.name  //创建对象的值，id作为key，name作为value
      return map
    }, {})
  } catch (error) {
    console.log('发生错误：')
    console.log(error)
    ElMessage.error('发生错误：' + error.message)
  }
}


//渲染函数(还未解决index排序问题)
async function render() {
  //清空表格显示的数据
  // tableData.splice(0, tableData.length)
  //根据当前页码计算出应显示的数据
  // const newData = totalData.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
  // newData.forEach((item: Url) => {
  //   tableData.push(item)
  // })
  await getImages()

  //将角色id替换成角色名称
  tableData.forEach(item => {
    if (!!item.tags) {
      const idList = item.tags.split(',')

      // 将字符串按逗号分割并替换为角色名称
      let outputArray = idList.map(x => roles.value[x]) //roles[x] 通过  对象["键名"]  的格式取值
      item.roleNames = outputArray.join(',')// 输出: 角色A,角色B,角色C
      // console.log(idList, outputArray)
    }
    if (!!item.newTags) {
      const idList = item.newTags.split(',')

      // 将字符串按逗号分割并替换为角色名称
      let outputArray = idList.map(x => roles.value[x]) //roles[x] 通过  对象["键名"]  的格式取值
      item.newRoleNames = outputArray.join(',')// 输出: 角色A,角色B,角色C
      // console.log(idList, outputArray)
    }
  })
  setOptions()
}

//获取图片
async function getImages() {
  try {
    if (!!isChoose.value) selectBtn(2) //如果是选择状态，则退出
    //如果全选版本，则直接全部清除
    if (condition.version.length === versionInfo.length) condition.version.splice(0, condition.version.length)
    //如果全选角色和无角色，则直接清除全部角色选择
    if (condition.roles.length === roleInfo.length + 1) {
      condition.roles.splice(0, condition.roles.length)
      checkAllRoles.value = false
      checkNoRole.value = false
    }

//判断筛选条件是否改变
    if (deepEqual(condition, oldCondition, true)) return ElMessage.info('筛选条件未作改变，已取消查询')
    else {
      // 将 a 的值同步到 b，包括空值
      Object.keys(oldCondition).forEach(key => {
        if (condition.hasOwnProperty(key)) {
          oldCondition[key] = condition[key];
        } else {
          delete oldCondition[key];  // 删除 b 中 a 中不存在的属性
        }
      });
    }

    const result = await axios({
      url: '/getWallpaper',
      params: {...condition, isManagement: '1'}
    })
    console.log('getImages', result)
    const {status, totalNum} = result.data
    if (status === 300) return//没有查询结果则不进行以下操作
    total.value = totalNum
    tableData.splice(0, tableData.length, ...result.data.data)
    previewImgList.splice(0, previewImgList.length)
    //imgIndex用于排序，但不连续,故重写
    tableData.forEach((item, index) => {
      item.imgIndex = index
      previewImgList.push(item.imgUrl)
    })
    console.log('tableData', tableData)
  } catch (error) {
    console.log('发生错误：')
    console.log(error)
  }
}


//进入和退出多选状态(num=0进入多选,1取消全选,2退出多选)
function selectBtn(num?: number) {
  const preList = document.querySelectorAll('.preImg')
  console.log(num)
  if (!!num) isChoose.value = num
  if (isChoose.value === 0) { //进入多选状态
    isChoose.value = 1
    //将所有呈现的图片添加选中状态
    preList.forEach(item => {
      item.classList.add('checked')
    })
    //将所有呈现的图片加入下载列表
    // downloadList.splice(0, downloadList.length, ...imgList)
  } else if (isChoose.value === 1) {//取消全选
    isChoose.value = 2
    //给所有呈现的图片移除选中状态
    preList.forEach(item => {
      item.classList.remove('checked')
    })
    //清空下载列表
    // downloadList.splice(0, downloadList.length)
  } else if (isChoose.value === 2) {  //退出多选状态
    isChoose.value = 0
    //给所有呈现的图片移除选中状态
    preList.forEach(item => {
      item.classList.remove('checked')
    })
    //清空下载列表
    // downloadList.splice(0, downloadList.length)
  }

}


const tableData = reactive<ReverseImgInfo[]>([])//展示列表，存的图片信息对象

const isEditRow = ref<number>(-1)//编辑标记

//编辑图片信息(修改编辑标记)
const handleEdit = (index: number, row: ReverseImgInfo) => {
  Object.assign(imgInfo, row)
  isEditRow.value = index //编辑的行
  row.newTags = row.tags//角色id数组添加到当前位置
  roleIDList.value = row.tags.split(',')
}

//还原编辑标记
function handleCancel() {
  isEditRow.value = -1
}

// 点击图片事件
function checkImage(url: string, name: string, e: Event) {//这个事件要绑定el-image父级盒子上
  const target = e.target as HTMLInputElement
  if (!isChoose.value) {//没有进入多选状态，此时点击是全屏浏览图片，添加底部菜单
    if (target.tagName !== 'IMG' || target.classList.contains('el-image-viewer__img')) return  //如果点击的不是图片元素则终止函数,以防重复添加


  } else {//进入多选状态,根据id里面的数字获取是第几张图
    const imgNum = target.id.match(/\d+/g)[0]
    const imgDiv = document.querySelector(`#imgDiv-${imgNum}`)
    const isChecked = imgDiv.classList.contains('checked')
    if (isChecked) {
      //取消选中样式
      imgDiv.classList.remove('checked')
      //遍历下载列表，删除取消选中的图片链接
      // for (let i = downloadList.length - 1; i >= 0; i--) {
      //   if (downloadList[i].imgName === name) downloadList.splice(i, 1)
      // }
    } else {
      //添加选中样式及下载链接
      imgDiv.classList.add('checked')
      // downloadList.push(imgList[imgNum])
    }
    //console.log(downloadList)
    console.log('isChecked', !isChecked)
  }
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
  const {roleNames, newRoleNames, ...newData} = data //通过解构赋值去除roleNames和newRoleNames
  if (!newData || JSON.stringify(newData) === '{}') return ElMessage.warning('修改不能为空')
  axios({
    url: '/updateWallPaper',
    method: 'post',
    data: {
      data: newData,
      id: oldData.id//id被洗掉了，手动添加
    }
  }).then(result => {
    // console.log(result)
    const {msg, status, newPath} = result.data
    if (status === 300) return
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


//清除未修改的数据,如果未修改返回{}
function diffObj(newData: ReverseImgInfo, oldData: ReverseImgInfo) {
  return Object.keys(newData).concat(Object.keys(oldData))
      .filter(key => newData[key] !== oldData[key])
      .reduce((result, key) => {
        result[key] = newData[key]; // 返回newData对象的属性
        return result;
      }, {});
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
  axios({
    // url: '/',
    method: 'delete',
    data
  }).then((result) => {
    // console.log(result)
    ElMessage.success(result.data.msg)
    tableData.splice(index, 1)
  }).catch(error => {
    console.dir('发生错误：' + error)
  })
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
  justify-content: space-between;
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
</style>