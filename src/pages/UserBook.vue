<template>
  <el-container>
    <el-header>我的账单</el-header>
    <el-main>
      <el-empty v-if="billList.length===0" description="暂无账单">
        <el-button @click="showBillPanel({bid:bookInfo.bid})" type="primary">添加账单</el-button>
      </el-empty>
      <template v-else>
        <el-button v-if="uid===bookInfo.uid" @click="copyText(`【默默的小站】注册登陆之后可前往https://muxidream.cn/user/books加入账本【${bookInfo.name}】协作，账本ID：${bookInfo.bid}，协作码：${bookInfo.key},协作码仅一次有效。`,'账本ID和协作码')
">邀请协作
        </el-button>
        <el-table ref="tableRef" :data="billList" :min-height="200" stripe border show-summary
                  highlight-current-row row-key="id"
                  table-layout="auto" :default-sort="{ prop: 'gid', order: 'custom' }"
                  :span-method="objectSpanMethod"
                  @sort-change="handleSortChange" @row-click="showBillPanel"
                  :summary-method="getSummaries">
          <!--               @filter-change="filterChange">-->
          <el-table-column prop="gid" label="组序" min-width="10" align="center" sortable/>
          <el-table-column prop="name" label="名目" min-width="30"/>
          <el-table-column prop="desc" label="备注" min-width="100"/>
          <el-table-column prop="type" label="类型" min-width="50" align="center"/>
          <el-table-column prop="price" label="金额" min-width="30" align="center"/>
          <el-table-column prop="created_time" label="创建时间" min-width="70" v-if="false" align="center">
            <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
          </el-table-column>
          <el-table-column prop="updated_time" label="更新时间" min-width="70" v-if="false" align="center">
            <template #default="scope">{{ getDiffTime(scope.row.updated_time) }}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="50" align="center">
            <template #default="scope">
              <!--              <el-button link type="primary" size="small" @click.stop="handleEdit(scope.$index, scope.row)">编辑-->
              <!--              </el-button>-->
              <el-button link type="danger" size="small" @click.stop="deleteRow(scope.$index,scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-text>总计：{{ totalPrice }}元，均分3份为{{ (totalPrice / 3).toFixed(2) }}元</el-text>
      </template>
    </el-main>
    <!--账单新建框-->
    <el-dialog v-model="dialogVisible" :width="dialogWidth" :fullscreen="!isPC" title="新增账单" destroy-on-close>
      <el-tabs :tab-position="tabPosition">
        <el-tab-pane label="修改账单">
          <AddBill :cancelAddBill="cancelAddBill" :thisBill="thisBill" :url="'/updateBill'"/>
        </el-tab-pane>
        <el-tab-pane label="新增账单">
          <AddBill :cancelAddBill="cancelAddBill" :thisBill="thisBill" :url="'/addBill'"/>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import axios from "axios";
import {ElMessage, ElMessageBox, TableColumnCtx, type TableInstance, type TabsInstance} from "element-plus";
import {h, onMounted, reactive, ref, type VNode} from "vue";
import useResponsive from "@/hooks/useResponsive";
import useTimestamp from "@/hooks/useTimestamp";
import useFunction from "@/hooks/useFunction";
import useUserInfo from "@/hooks/useUserInfo";
import {useRoute} from "vue-router";
import AddBill from "@/components/AddBill.vue";
import {Book, Bill} from '@/types/books'
import router from "@/router";


const {getTime, getDiffTime} = useTimestamp()
const {isPC, elSize, dialogWidth, screenHeight} = useResponsive()
const {copyText} = useFunction()
const {uid} = useUserInfo()

const route = useRoute()
const tabPosition = ref<TabsInstance['tabPosition']>('top')

//账本信息
const bookInfo = ref<Book>({
  bid: 0,
  uid: 0,
  name: "",
  intro: null,
  created_time: "",
  updated_time: ""
})
//账单列表
const billList: Bill[] = reactive([])


//是否显示账单添加框
const dialogVisible = ref(false)


//获取账单列表
const getTheBook = async (bid: number) => {
  try {
    const result = await axios<ResultData<{ book: Book, bills: Bill[] }>>({
      url: '/theBook',
      params: {bid}
    })
    console.log(result)
    const {data} = result.data
    bookInfo.value = data!.book
    billList.splice(0, billList.length, ...data!.bills)
    // ElMessage.success(msg)
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}

//关闭添加面板
const cancelAddBill = (val?: Bill) => {
  if (val) {
    //新增
    // billList.push(val)
    //更新,有bug
    // billList.splice(thisItemIndex.value, 1, val)
  }
  getTheBook(bookInfo.value.bid)
  dialogVisible.value = false
}


//当前点击的账单ID
const thisItemIndex = ref(0)
const thisBill = ref<Bill>()


const showBillPanel = (row: Bill, column?: any, event?: Event) => {
  thisBill.value = row
  if (column) thisItemIndex.value = column.$index
  dialogVisible.value = true
}


const tableRef = ref<TableInstance>()

//清空全部筛选条件
// const clearFilter = () => {
//   // tableRef.value!.clearFilter()
//   // render()
//   // total.value = totalData.length
//
//   flag.value = true
// }


//监听排序行为，并修改数组顺序,否则删除会出错
function handleSortChange({column, prop, order}) {
  // 根据 column 和 order 对 totalData 进行排序
  billList.sort((a, b) => {
    if (a[prop] < b[prop]) return order === 'ascending' ? -1 : 1;
    if (a[prop] > b[prop]) return order === 'ascending' ? 1 : -1;
    return 0;
  })
  // if (flag.value) render()
}


//筛选标记(false表示筛选过了)
// const flag = ref(true)


const deleteRow = (index: number, id: number) => {
  ElMessageBox.confirm(
      '确认删除该条账单信息吗?',
      'Warning',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消删除',
        type: 'warning',
        showClose: false
      }
  )
      .then(() => {
        deleteBill(index, id)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '删除操作已取消',
        })
      })
}

//删除账单
const deleteBill = async (index: number, id: number) => {
  try {
    const result = await axios({
      url: '/updateBill',
      method: 'post',
      data: {id, status: 1}
    })
    console.log(result)
    const {status, msg, data} = result.data

    billList.splice(index, 1)
    // filterChange()
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }

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

interface SpanMethodProps {
  row: Bill
  column: TableColumnCtx<Bill>
  rowIndex: number
  columnIndex: number
}

//合并列
const objectSpanMethod = ({row, column, rowIndex, columnIndex}: SpanMethodProps) => {
  if (columnIndex === 0) {
    const currentGroupID = row.gid;
    // 如果当前行是新组的第一行，计算跨行数
    if (rowIndex === 0 || billList[rowIndex - 1].gid !== currentGroupID) {
      let rowspan = 1;

      // 从当前行向下检查相同 groupID 的行，计算 rowspan
      for (let i = rowIndex + 1; i < billList.length; i++) {
        if (billList[i].gid === currentGroupID) {
          rowspan++;
        } else {
          break;
        }
      }
      return {
        rowspan,
        colspan: 1,
      };
    } else {
      // 非组首行，隐藏 groupID 列
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  } else {
    // 非第一列不做合并
    return {
      rowspan: 1,
      colspan: 1,
    };
  }
}


//合计
const totalPrice = ref(0)

interface SummaryMethodProps<T = Bill> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

const getSummaries = (param: SummaryMethodProps) => {
  const {columns, data} = param
  const sums: (string | VNode)[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h('div', {style: {color: 'var(--el-color-primary)'}}, [
        '总计',
      ])
      return
    }
    if (column.property === 'price') {//只计算price列
      const values = data.map((item) => Number(item[column.property]))
      if (!values.every((value) => Number.isNaN(value))) {
        totalPrice.value = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)

        sums[index] = `${totalPrice.value}元`
      } else {
        sums[index] = 'N/A'
      }
    }

  })

  return sums
}


onMounted(async () => {
  const {bid} = route.query
  await getTheBook(Number(bid))
})
</script>

<style scoped>
.el-main {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

/*账单信息卡片*/
.books {
  position: relative;
  border-radius: 5px;
  background: linear-gradient(45deg, #ffb30066, #ffb300a5);
  margin: 5px auto;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.menu {
  position: absolute;
  top: 5px;
  right: 5px;
  border: none;
}

.el-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 980px) {
  .books {
    width: 150px;
    margin: 5px;
  }


  .el-card :deep(.el-card__body), :deep(.el-card__header), :deep(.el-card__footer) {
    padding: 5px;
  }


  .footer {
    font-size: 11px
  }
}

</style>
