<template>
  <el-container @touchstart="stopTouch" @touchend="stopTouch">
    <el-header>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ name: 'books' }">账本列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ bookInfo.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main>
      <el-tabs v-model="activeName" :tab-position="tabPosition">
        <el-tab-pane :style="tabContentHeight" label="账本月历" :name="0">
          <BookCalendar :getTheBillDesc="getTheBillDesc" :bookDesc="bookDesc" :changeTab="changeTab" />
        </el-tab-pane>
        <el-tab-pane label="账单详情" :name="1">
          <BillDetails :showBillPanel="showBillPanel" :isNull="bookInfo.isNull" :deleteRow="deleteRow" />
        </el-tab-pane>
        <el-tab-pane label="花费统计" :name="2">
          <BillTotalCost :totalCostList="totalCostList" />
        </el-tab-pane>
        <el-tab-pane label="协作成员" :name="3">
          <el-empty v-if="members.length <= 1" description="暂无成员">
            <el-button
              v-if="uid === bookInfo.uid"
              type="primary"
              @click="
                copyText(
                  `【默默的小站】注册登陆之后可前往https://muxidream.cn/user/books加入协作账本【${bookInfo.name}】，账本ID：${bookInfo.bid}，协作码：${bookInfo.key},协作码仅一次有效。`,
                  '账本ID和协作码'
                )
              "
              >邀请协作
            </el-button>
          </el-empty>
          <div v-else>
            <div style="display: flex; justify-content: space-evenly">
              <el-text type="primary" v-for="item in members">{{ item.username }}</el-text>
            </div>
            <el-button
              v-if="uid === bookInfo.uid"
              style="margin: 10px auto"
              type="primary"
              @click="
                copyText(
                  `【默默的小站】注册登陆之后可前往https://muxidream.cn/user/books加入协作账本【${bookInfo.name}】，账本ID：${bookInfo.bid}，协作码：${bookInfo.key},协作码仅一次有效。`,
                  '账本ID和协作码'
                )
              "
              >邀请协作
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :name="4">
          <template #label>
            <el-badge is-dot>使用说明</el-badge>
          </template>
          <BookIntroduction />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <!--账单新建框-->
    <el-dialog
      v-model="dialogVisible"
      :width="dialogWidth"
      :fullscreen="!isPC"
      :draggable="isPC"
      title="修改/新增账单"
      destroy-on-close
    >
      <AddBill :cancelAddBill="cancelAddBill" :thisBill="thisBill" :url="'/addBill'" />
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref, toRefs } from "vue"
import { useRoute } from "vue-router"
import { ElMessage, ElMessageBox, type TabsInstance } from "element-plus"
import { ArrowRight } from "@element-plus/icons-vue"
import momo from "@/apis"
//stores
import { useBookStore } from "@/store/useBookStore"
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
//hooks

import useTimestamp from "@/hooks/useTimestamp"
import { numPlus, numMinus, getAllMonthDateRange } from "@/hooks/useComputed"
//components
import AddBill from "@/pages/user/books/components/AddBill.vue"
import BookCalendar from "@/pages/user/books/components/BookCalendar.vue"
import BillDetails from "@/pages/user/books/components/BillDetails.vue"
import BillTotalCost from "@/pages/user/books/components/BillTotalCost.vue"
import BookIntroduction from "@/pages/user/books/components/BookIntroduction.vue"
//utils
import { emitter } from "@/utils/emitter"
import myFunction from "@/utils/myFunction"
//types
import { Book, Bill, TotalCost, BillDesc, NewBill } from "@/types/books"
import { SpanMethodProps, TableFilterItem } from "@/types/global"

const route = useRoute()
const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()

const { formatDate } = useTimestamp()
const { isPC, dialogWidth, screenHeight } = toRefs(responsiveStore)
const { copyText } = myFunction
// import {numPlus} = useComputed()
const { uid } = userInfoStore
const bookData = useBookStore()

//el-tabs的标签方向
const tabPosition = ref<TabsInstance["tabPosition"]>("top")
//el-tabs的默认激活标签
const activeName = ref(0)
//el-tabs的内容区高度
const tabContentHeight = ref(isPC ? "" : "height:" + (screenHeight.value - 145) + "px;overflow:scroll")

//切换el-tabs
const changeTab = async (index: number, dateString?: string) => {
  if (dateString) {
    const now = formatDate()
    if (now < dateString) return //点击到了未来的时间,不跳转

    await getTheBook(dateString, dateString)
  }
  activeName.value = index
}

//账本信息
const bookInfo = ref<Book>({
  bid: Number(route.query.bid),
  uid: 0,
  name: "",
  intro: null,
  isNull: false,
  created_time: "",
  updated_time: "",
})

const bookDesc = ref<Record<string, BillDesc>>({})
//账单列表
const billList = computed(() => bookData.billList) // reactive([])
//成员列表
type Member = { uid: number; username: string }
const members = reactive<Member[]>([])
const memberList = reactive<TableFilterItem<number>[]>([])
let memberInfo = {} as Record<number, any>

//是否显示账单添加框
const dialogVisible = ref(false)

//合计(当前的)
const presentPrice = ref(0)
//合计(加上已销账单)
const totalPrice = ref(0)

//账单列表
const totalCostList = ref<TotalCost[]>([])
//当前点击的账单ID
const thisItemIndex = ref(0)
const thisBill = ref<NewBill>()

//获取账本信息
const getTheBookDesc = async () => {
  try {
    const result = await momo.get<{ book: Book; members: Member[] }>("/theBookDesc", {
      bid: bookInfo.value.bid,
    })
    const { data } = result
    console.log(data)
    bookInfo.value = data!.book
    console.log("bookInfo", bookInfo.value)
    Object.assign(members, data!.members)
    members.forEach(userInfo => {
      const { uid, username } = userInfo
      //数组形式，添加成员信息
      memberList.push({ value: uid, text: username })
    })
    // billList.splice(0, billList.length, ...data!.bills)
    // computation()
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//获取账单简略信息(日历)
const getTheBillDesc = async (start_date: string, end_date: string) => {
  try {
    const result = await momo.get<{ billsDesc: Record<string, BillDesc> }>("/theBillDesc", {
      bid: bookInfo.value.bid,
      start_date,
      end_date,
    })
    const { data } = result
    console.log(data)
    bookDesc.value = data!.billsDesc
    console.log("bookDesc.value", bookDesc.value)
    // billList.splice(0, billList.length, ...data!.bills)
    // computation()
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//获取账单列表
const getTheBook = async (start_date: string, end_date: string) => {
  try {
    const result = await momo.get<{ bills: Bill[] }>("/theBook", {
      bid: Number(route.query.bid),
      start_date,
      end_date,
    })
    const { data } = result
    console.log(result)
    bookData.updateBillList(data!.bills)

    if (data!.bills.length === 0) return ElMessage.info("当前时间范围内不存在账单")
    else computation()
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//计算总价
const computation = () => {
  presentPrice.value = 0
  totalPrice.value = 0
  //当前账本协作成员人数
  let userNum = memberList.length
  //清空计算完成的账单数据
  totalCostList.value = []
  console.log("遍历前 memberInfo", memberInfo)
  console.log("遍历前 members", members)
  console.log("遍历members.forEach有BUG，刷新可能不会遍历")
  members.forEach(userInfo => {
    const { uid, username } = userInfo
    // 对象形式，使用uid作为键,计算每个用户的花费，total是加上了已销账单的数据
    memberInfo[uid] = {
      uid,
      username,
      expense: 0,
      income: 0,
      totalExpense: 0,
      totalIncome: 0,
    }
    console.log("遍历中 memberInfo", memberInfo)
  })

  console.log("遍历后 memberInfo", memberInfo)
  console.log("遍历后 memberList", memberList)
  bookData.billList.forEach(bill => {
    const { uid, username, price, status } = bill
    //如果用户不在协作列表中(已退出协作的成员)
    if (!memberInfo[uid]) {
      memberInfo[uid] = {
        uid,
        username,
        expense: 0,
        income: 0,
        totalExpense: 0,
        totalIncome: 0,
      }
      //计算完成的账单列表中添加成员
      memberList.push({ value: uid, text: username })
      //添加成员数
      userNum++
    }
    //计算未销账单
    if (status === 0) {
      //计算每个用户的当前总花费
      memberInfo[uid].expense = numPlus(memberInfo[uid].expense, price)
      //计算所有人的当前总花费
      presentPrice.value = numPlus(presentPrice.value, price)
    }
    //计算全部账单
    if (status === 0 || status === 1) {
      //计算每个用户的总花费
      memberInfo[uid].totalExpense = numPlus(memberInfo[uid].totalExpense, price)
      //计算所有人的总花费
      totalPrice.value = numPlus(totalPrice.value, price)
    }
  })

  //计算平均花费
  const presentAveragePay = Number((presentPrice.value / userNum).toFixed(2))
  const totalAveragePay = Number((totalPrice.value / userNum).toFixed(2))
  //最终的花费表
  totalCostList.value = memberList.map(item => {
    const data = memberInfo[item.value]
    data.income = numMinus(data.expense, presentAveragePay) //计算需要收取的金额
    return data
  })

  //添加总计栏
  totalCostList.value.push({
    uid: 0,
    username: "当前总计",
    expense: presentPrice.value, //当前总支出
    income: presentAveragePay, //当前平均支出
    totalExpense: totalPrice.value, //总支出(加已销账单)
    totalIncome: totalAveragePay, //总平均支出(加已销账单)
  })
  // totalCostList.value.push({uid: 0, username: '(加上已销账单)总计', expense: totalPrice.value, income: totalAveragePay})
  // console.log('averagePay', averagePay)
  // console.log('totalPrice', totalPrice.value)
  // console.log('memberInfo', memberInfo)
  // console.log('memberList', memberList)
  console.log("totalCostList", totalCostList.value)
}

//关闭添加面板
const cancelAddBill = async (newBill: Bill, isAdd: boolean) => {
  console.log("序号", thisItemIndex.value)
  if (isAdd) {
    //新增
    bookData.addBill(newBill)
  } else {
    //修改，有bug？？？  要判断是否在当前日期区间内
    bookData.updateBill({ newBill, index: thisItemIndex.value })
    // bookData.billList[thisItemIndex.value]=newBill
  }
  // ElMessage.warning('cancelAddBill下的日期需要修改,修改后需要重排样式')
  // await getTheBook('2024-09-01', '2024-09-30')
  //重新计算账单
  computation()

  dialogVisible.value = false
}

const showBillPanel = (row: Bill, column?: any, event?: Event) => {
  //修改账单
  if (row.id) thisBill.value = row
  //添加新账单
  else
    thisBill.value = {
      id: 0,
      bid: bookInfo.value.bid,
      gid: 0,
      desc: "",
      name: "",
      price: 0,
      status: 0,
      type: "",
      bill_date: formatDate(),
    }

  console.log("thisBill,row", row)

  // bookData.thisBill = row
  //记录当前点击的序号
  if (column)
    billList.value.forEach((bill, index) => {
      if (bill.id === row.id) thisItemIndex.value = index
    })
  console.log("thisItemIndex", thisItemIndex.value)
  //显示添加或修改面板
  dialogVisible.value = true
}
//
//
// const tableRef = ref<TableInstance>()

//清空全部筛选条件
// const clearFilter = () => {
//   // tableRef.value!.clearFilter()
//   // render()
//   // total.value = totalData.length
//
//   flag.value = true
// }

//监听排序行为，并修改数组顺序,否则删除会出错
// function handleSortChange({column, prop, order}) {
//   // 根据 column 和 order 对 totalData 进行排序
//   billList.sort((a, b) => {
//     if (a[prop] < b[prop]) return order === 'ascending' ? -1 : 1;
//     if (a[prop] > b[prop]) return order === 'ascending' ? 1 : -1;
//     return 0;
//   })
//   // if (flag.value) render()
// }

//筛选标记(false表示筛选过了)
// const flag = ref(true)

//flag=true为删除，false为结算
const deleteRow = (index: number, { id, gid }: { id?: number; gid?: number }, status: number) => {
  let str = "还原"
  if (status === 1) str = "结算"
  else if (status === 2) str = "删除"
  ElMessageBox.confirm(`确认${str}该条账单吗?`, "Warning", {
    confirmButtonText: "确认" + str,
    cancelButtonText: "取消" + str,
    type: "warning",
    showClose: false,
  })
    .then(() => {
      deleteBill(index, { id, gid }, status)
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: str + "操作已取消",
      })
    })
}

//结算或删除账单
const deleteBill = async (index: number, { id, gid }: { id?: number; gid?: number }, status: number) => {
  try {
    //修改结算状态传递的是组序号gid,删除传递的id
    const result = await momo.post("/deleteBill", { id, gid, status })
    console.log(result)
    const { msg } = result
    ElMessage.success(msg)
    if (status === 1 || status == 0) bookData.deleteBill({ gid, status })
    else bookData.deleteBill({ index, status })
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//合并列
const objectSpanMethod = ({ row, rowIndex, columnIndex }: SpanMethodProps<Bill>) => {
  if (columnIndex === 0) {
    const currentGroupID = row.gid
    // 如果当前行是新组的第一行，计算跨行数
    if (rowIndex === 0 || billList.value[rowIndex - 1].gid !== currentGroupID) {
      let rowspan = 1

      // 从当前行向下检查相同 groupID 的行，计算 rowspan
      for (let i = rowIndex + 1; i < billList.value.length; i++) {
        if (billList.value[i].gid === currentGroupID) {
          rowspan++
        } else {
          break
        }
      }
      return {
        rowspan,
        colspan: 1,
      }
    } else {
      // 非组首行，隐藏 groupID 列
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  } else {
    // 非第一列不做合并
    return {
      rowspan: 1,
      colspan: 1,
    }
  }
}

//表格统计接口

//计算总花费
// const getSummaries = (param: SummaryMethodProps) => {
//   const {columns, data} = param
//   const sums: (string | VNode)[] = []
//   columns.forEach((column, index) => {
//     if (index === 0) {
//       sums[index] = h('div', {style: {color: 'var(--el-color-primary)'}}, [
//         '总计',
//       ])
//       return
//     }
//     if (column.property === 'price') {//只计算price列
//       const values = data.map((item) => Number(item[column.property]))
//       if (!values.every((value) => Number.isNaN(value))) {
//         totalPrice.value = values.reduce((prev, curr) => {
//           const value = Number(curr)
//           if (!Number.isNaN(value)) {
//             return prev + curr
//           } else {
//             return prev
//           }
//         }, 0)
//
//         sums[index] = `${totalPrice.value}元`
//       } else {
//         sums[index] = 'N/A'
//       }
//     }
//
//   })
//
//   return sums
// }
interface TheDateRange {
  start_date: string
  end_date: string
}

const emitterGitBillList = async ({ start_date, end_date }: TheDateRange) => {
  console.log(`emitter触发：getTheBook(${start_date + "," + end_date})`)
  await getTheBook(start_date, end_date)
}

onBeforeMount(async () => {
  const { DateRange } = getAllMonthDateRange({ theDate: new Date() }, "now")
  await Promise.all([getTheBookDesc(), getTheBillDesc(DateRange[0], DateRange[1])])

  // console.log(getAllMonthDateRange({theDate: new Date()}, 'now'))
})

console.log("开启了gitBillList的emitter监听")
emitter.on("get-bill-list", emitterGitBillList)

//阻止左右滑动触发翻页
const stopTouch = (e: TouchEvent) => {
  e.stopPropagation()
}

onBeforeUnmount(() => {
  emitter.off("get-bill-list", emitterGitBillList)
  console.log("注销了gitBillList的emitter监听")
})
</script>

<style scoped>
.el-header {
  padding: 10px;
  height: auto;
}

.el-main {
  padding: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.el-tabs {
  width: 90%;
  margin: 0 auto;
}

/*日历被选中*/
.is-selected {
  color: #1989fa;
}

.el-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 780px) {
  .el-tabs {
    width: 100%;
  }

  .el-tabs__header {
    padding: 0 20px;
  }

  .el-card :deep(.el-card__body),
  :deep(.el-card__header),
  :deep(.el-card__footer) {
    padding: 5px;
  }

  .footer {
    font-size: 11px;
  }
}
</style>
<style>
/*全局样式*/

/*去除小圆点的影响*/
.el-badge {
  text-indent: 0;
}
</style>
