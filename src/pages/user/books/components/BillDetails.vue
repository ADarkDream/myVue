<template>
  <el-container>
    <el-header>
      <div style="display: flex; justify-content: space-between; padding-bottom: 5px">
        <el-button-group type="primary">
          <el-button @click="changeDateType('day')">日</el-button>
          <el-button @click="changeDateType('week')">周</el-button>
          <el-button @click="changeDateType('month')">月</el-button>
        </el-button-group>
        <el-date-picker
          v-if="isPC"
          v-model="dateRange"
          :disabled-date="disabledDate"
          end-placeholder="选择账单结束日期"
          range-separator="To"
          start-placeholder="选择账单开始日期"
          style="max-width: 250px"
          type="daterange"
          unlink-panels
          value-format="YYYY-MM-DD"
          @change="getBillList"
        />
        <el-button-group>
          <el-button @click="getNewDateRange('minus')"
            ><span v-if="dateStr === '日'">前一{{ dateStr }}</span
            ><span v-else>上一{{ dateStr }}</span>
          </el-button>
          <el-button @click="getNewDateRange('now')"
            ><span v-if="dateStr === '日'">今日</span><span v-else>本{{ dateStr }}</span></el-button
          >
          <el-button @click="getNewDateRange('plus')"
            ><span v-if="dateStr === '日'">后一{{ dateStr }}</span
            ><span v-else>下一{{ dateStr }}</span>
          </el-button>
        </el-button-group>
      </div>
      <el-date-picker
        v-if="!isPC"
        v-model="dateRange"
        :disabled-date="disabledDate"
        end-placeholder="选择账单结束日期"
        range-separator="To"
        start-placeholder="选择账单开始日期"
        style="max-width: 250px"
        type="daterange"
        unlink-panels
        value-format="YYYY-MM-DD"
        @change="getBillList"
      />
    </el-header>
    <el-empty v-if="isNull" description="暂无账单">
      <el-button type="primary" @click="showBillPanel">添加账单</el-button>
      <!--        <el-button v-if="uid===bookInfo.uid" type="primary" @click="copyText(`【默默的小站】注册登陆之后可前往https://muxidream.cn/user/books加入协作账本【${bookInfo.name}】，账本ID：${bookInfo.bid}，协作码：${bookInfo.key},协作码仅一次有效。`,'账本ID和协作码')-->
      <!--">邀请协作-->
      <!--        </el-button>-->
    </el-empty>
    <el-main v-else style="padding-top: 0">
      <el-table
        ref="tableRef"
        border
        :data="billList"
        :height="screenHeight - 290"
        highlight-current-row
        :row-class-name="showDelLine"
        row-key="id"
        :row-style="hide"
        show-overflow-tooltip
        :span-method="objectSpanMethod"
        stripe
        table-layout="auto"
        @row-click="showBillPanel"
      >
        <!--                        show-summary-->
        <!--                  :summary-method="getSummaries">-->
        <template #empty>
          <el-empty />
        </template>
        <el-table-column align="center" label="组序" min-width="50" prop="gid" sortable />
        <el-table-column align="center" label="名目" min-width="80" prop="name" />
        <el-table-column align="center" label="类型" min-width="70" prop="type" />
        <el-table-column align="center" label="支出" min-width="70" prop="price" />
        <el-table-column align="center" label="昵称" min-width="70" prop="username">
          <template #default="scope">
            <el-text type="primary">{{ scope.row.username }}</el-text>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="100" prop="desc" />
        <el-table-column align="center" label="账单日期" min-width="120" prop="bill_date">
          <template #default="scope">{{ scope.row.bill_date.substring(0, 10) }}</template>
        </el-table-column>
        <el-table-column v-if="false" align="center" label="创建时间" min-width="70" prop="created_time">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column v-if="false" align="center" label="更新时间" min-width="70" prop="updated_time">
          <template #default="scope">{{ getDiffTime(scope.row.updated_time) }}</template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="100">
          <template #default="scope">
            <!--              <el-button link type="primary" size="small" @click.stop="handleEdit(scope.$index, scope.row)">编辑-->
            <!--              </el-button>-->
            <el-button
              v-if="scope.row.status === 0"
              link
              size="small"
              type="primary"
              @click.stop="deleteRow(scope.$index, { gid: scope.row.gid }, 1)"
            >
              销账
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              link
              size="small"
              type="info"
              @click.stop="deleteRow(scope.$index, { gid: scope.row.gid }, 0)"
            >
              还原
            </el-button>
            <el-button link size="small" type="danger" @click.stop="deleteRow(scope.$index, { id: scope.row.id }, 2)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <div v-if="!isNull" class="footer">
        <el-text>
          已销账单：
          <el-switch v-model="isShowDelLine" active-text="显示" inactive-text="隐藏" inline-prompt />
        </el-text>
        <el-button :style="isPC ? '' : 'margin: 4px 5px'" type="primary" @click="showBillPanel">添加账单 </el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from "vue"
import { TableInstance } from "element-plus"
//stores
import { useBookStore } from "@/store/useBookStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
//hooks
import useTimestamp from "@/hooks/useTimestamp"

import { getWeekDateRange, getMonthDateRange, getDayDateRange } from "@/hooks/useComputed"
//utils
import { emitter } from "@/utils/emitter"
//types
import { Bill } from "@/types/books"
import { SpanMethodProps } from "@/types/global"

const { showBillPanel, isNull, deleteRow } = defineProps(["showBillPanel", "isNull", "deleteRow"])

const responsiveStore = useResponsiveStore()
const { getTime, getDiffTime, formatDate } = useTimestamp()
const { isPC, screenHeight } = toRefs(responsiveStore)

const bookData = useBookStore()
const billList = computed(() => bookData.billList)

const tableRef = ref<TableInstance>()
//是否显示已销账单
const isShowDelLine = ref(false)

//region日期选择器
//'day', 'week','month'分别代表日，周，月账单列表
const dateFlag = ref("week")
const dateStr = ref("周")

//用于计算的时间原点，默认为今天
const dateString = ref(formatDate())
//日期选择器的默认日期周期
const dateRange = ref<[string, string]>(["", ""])

//flag为'now', 'minus','plus',代表现在,加,减
const getNewDateRange = (flag: string) => {
  if (dateFlag.value === "day") {
    //修改右上角字符
    dateStr.value = "日"
    const { isFuture, DateRange, DateString } = getDayDateRange({ dateString: dateString.value }, flag)
    if (isFuture) return
    //修改日期区间
    dateRange.value = DateRange as [string, string]
    //修改日期计算原点
    dateString.value = DateString
  } else if (dateFlag.value === "week") {
    dateStr.value = "周"
    const { isFuture, DateRange, DateString } = getWeekDateRange({ dateString: dateString.value }, flag)
    if (isFuture) return
    dateRange.value = DateRange
    dateString.value = DateString
  } else if (dateFlag.value === "month") {
    dateStr.value = "月"
    const { isFuture, DateRange, DateString } = getMonthDateRange({ dateString: dateString.value }, flag)
    if (isFuture) return
    dateRange.value = DateRange
    dateString.value = DateString
  }
  getBillList()
  console.log("时间计算原点dateString：", dateString.value)
  console.log("时间周期dateRange：", dateRange.value)
}

//获取新的账单
const getBillList = () => {
  console.log(dateRange.value)
  emitter.emit("get-bill-list", {
    start_date: dateRange.value[0],
    end_date: dateRange.value[1],
  })
}

//修改日/周/月
const changeDateType = (dateType: string) => {
  dateFlag.value = dateType
  if (dateType === "day") dateStr.value = "日"
  else if (dateType === "week") dateStr.value = "周"
  else if (dateType === "month") dateStr.value = "月"
  getNewDateRange("now")
}

//禁用未来时间
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

//endregion

//销账的账单的删除线
function showDelLine({ row, column, rowIndex, columnIndex }: SpanMethodProps<Bill>) {
  if (row.status === 1) return "delLine"
}

//显示和隐藏销账的账单
function hide({ row, column, rowIndex, columnIndex }: SpanMethodProps<Bill>) {
  if (row.status === 1) return isShowDelLine.value ? "" : "display:none"
}

//合并列
const objectSpanMethod = ({ row, rowIndex, columnIndex }: SpanMethodProps<Bill>) => {
  if (columnIndex === 0) {
    // if (row.status===1&&!isShowDelLine.value) return
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
      // 非组内首行，隐藏 groupID 列
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

onMounted(() => {
  getNewDateRange("now")
})
</script>
<style scoped>
.el-container {
  width: 100%;
  overflow-x: hidden;
}

.el-header,
.el-main,
.el-footer {
  height: auto;
  padding: 5px 20px;
}

/*底部添加账单按钮*/
.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

@media (max-width: 780px) {
  .el-header,
  .el-main,
  .el-footer {
    padding: 5px;
  }

  .footer {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
}
</style>

<style>
/*销账的账单的删除线*/
.delLine {
  text-decoration: line-through;
  opacity: 0.5;
}

@media (max-width: 780px) {
  /* 隐藏右边日期面板 */
  .el-picker-panel__content.el-date-range-picker__content.is-right {
    display: none;

    overflow: hidden;
  }

  /* 设置整体日期面板的宽度 */
  .el-picker-panel.el-date-range-picker.el-popper {
    /*    width: 322px;*/
  }

  /* 隐藏中间线段 */
  .el-date-range-picker__content.is-left {
    border-right: none;
  }

  .el-picker-panel__body {
    display: flex;
    padding: 0;
    /*  justify-content: center;*/
  }

  /* 左边日期面板宽度 */
  .el-picker-panel__content {
    width: 57%;
  }
}
</style>
