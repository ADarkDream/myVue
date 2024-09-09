<template>


  <el-container>
    <el-header>
      <div>
        <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="选择账单开始日期"
            end-placeholder="选择账单结束日期"
            :size="elSize"
            unlink-panels
            @change="getBillList"
            :disabled-date="disabledDate"
            value-format="YYYY-MM-DD"
        />
        <div :style="isPC?'margin-left:20px;display: inline-block;':''">
          <el-button :size="elSize" v-if="!isNull" @click="showBillPanel" type="primary">添加账单</el-button>
          <span style="margin-left:10px "> 已销账单：
          <el-switch v-model="isShowDelLine" active-text="显示" inactive-text="隐藏" inline-prompt/>
        </span>
        </div>
      </div>

      <div style="display: flex;justify-content: space-between">
        <el-button-group size="small" type="primary">
          <el-button @click="changeDateType('day')">日</el-button>
          <el-button @click="changeDateType('week')">周</el-button>
          <el-button @click="changeDateType('month')">月</el-button>
        </el-button-group>
        <el-text>

        </el-text>
        <el-button-group size="small">
          <el-button @click="getNewDateRange('minus')"><span v-if="dateStr==='日'">前一{{ dateStr }}</span><span v-else>上一{{
              dateStr
            }}</span>
          </el-button>
          <el-button @click="getNewDateRange('now')"><span v-if="dateStr==='日'">今日</span><span
              v-else>本{{ dateStr }}</span></el-button>
          <el-button @click="getNewDateRange('plus')"><span v-if="dateStr==='日'">后一{{ dateStr }}</span><span v-else>下一{{
              dateStr
            }}</span>
          </el-button>
        </el-button-group>
      </div>
    </el-header>
    <el-empty v-if="isNull" description="暂无账单">
      <el-button @click="showBillPanel" type="primary">添加账单</el-button>
      <!--        <el-button v-if="uid===bookInfo.uid" type="primary" @click="copyText(`【默默的小站】注册登陆之后可前往https://muxidream.cn/user/books加入协作账本【${bookInfo.name}】，账本ID：${bookInfo.bid}，协作码：${bookInfo.key},协作码仅一次有效。`,'账本ID和协作码')-->
      <!--">邀请协作-->
      <!--        </el-button>-->
    </el-empty>
    <el-main v-else>
      <el-table ref="tableRef" :data="billList" :max-height="screenHeight-250" stripe border
                show-overflow-tooltip
                highlight-current-row row-key="id"
                table-layout="auto"
                :span-method="objectSpanMethod"
                :row-class-name="showDelLine"
                :row-style="hide"
                @row-click="showBillPanel">
        <!--                        show-summary-->
        <!--                  :summary-method="getSummaries">-->
        <el-table-column prop="gid" label="组序" min-width="50" align="center" sortable/>
        <el-table-column prop="name" label="名目" min-width="80" align="center"/>
        <el-table-column prop="type" label="类型" min-width="70" align="center"/>
        <el-table-column prop="price" label="支出" min-width="70" align="center"/>
        <el-table-column prop="username" label="昵称" min-width="70" align="center">
          <template #default="scope">
            <el-text type="primary">{{ scope.row.username }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="备注" min-width="100" align="center"/>
        <el-table-column prop="bill_date" label="账单日期" min-width="120" align="center">
          <template #default="scope">{{ scope.row.bill_date.substring(0, 10) }}</template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" min-width="70" v-if="false" align="center">
          <template #default="scope">{{ getTime(scope.row.created_time) }}</template>
        </el-table-column>
        <el-table-column prop="updated_time" label="更新时间" min-width="70" v-if="false" align="center">
          <template #default="scope">{{ getDiffTime(scope.row.updated_time) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100" align="center">
          <template #default="scope">
            <!--              <el-button link type="primary" size="small" @click.stop="handleEdit(scope.$index, scope.row)">编辑-->
            <!--              </el-button>-->
            <el-button v-if="scope.row.status===0" link type="primary" size="small"
                       @click.stop="deleteRow(scope.$index,{gid:scope.row.gid},1)">
              销账
            </el-button>
            <el-button v-if="scope.row.status===1" link type="info" size="small"
                       @click.stop="deleteRow(scope.$index,{gid:scope.row.gid},0)">
              取消销账
            </el-button>
            <el-button link type="danger" size="small" @click.stop="deleteRow(scope.$index,{id:scope.row.id},2)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-collapse v-model="activeNames" style="width: 80%;text-align: left" accordion v-if="isPC">
        <el-collapse-item title="备忘" name="1">
          <div style="padding-left:10px;">
            <p>添加账单之后,判断添加的数据是否在当前时间范围内,需要把dateRange改成全局共享</p>
            <p>组账单第一个销账会导致下面的子帐单UI错位，暂定为将子账单一并销账</p>
            <p>el-table左右容器溢出，有问题</p>
            <p>日历界面总计计算不准确，有问题,在后端</p>
            <p>移动端隐藏右侧日期选择器面板有bug，显示有空白</p>
          </div>
        </el-collapse-item>
        <el-collapse-item title="已解决BUG" name="2">
          <div style="padding-left:10px;">
            <p class="delLine">首次加载时日历界面无法获得帐单列表；</p>
            <p class="delLine">不要星期日开始；</p>
            <p class="delLine">修改组内子账单时，禁用日期修改；；</p>
            <p class="delLine">首次加载时日历界面无法获得帐单列表；</p>
            <p class="delLine">添加账单之后,需要重排表格</p>
            <p class="delLine">AddBill需要修改,修改组别后没传递参数gid</p>
            <p class="delLine">cancelAddBill下的日期需要修改</p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-main>

  </el-container>


</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {Bill, DateParam, DateValue} from '@/types/books'
import {SpanMethodProps} from "@/types/global";
import {ElMessage, TableInstance} from "element-plus";
import useTimestamp from "@/hooks/useTimestamp";
import useResponsive from "@/hooks/useResponsive";
// import useComputed from "@/hooks/useComputed";

//折叠面板序号
const activeNames = ref('0')

const {
  showBillPanel,
  isNull,
  deleteRow,
} = defineProps(['showBillPanel', 'isNull', 'deleteRow'])

const {getTime, getDiffTime, formatDate} = useTimestamp()
const {isPC, elSize, screenHeight} = useResponsive()
import {getWeekDateRange, getMonthDateRange, getDayDateRange} from "@/hooks/useComputed";
import emitter from "@/utils/emitter";
import {useBookStore} from "@/store/useBookStore";

const bookData = useBookStore()
const billList = computed(() => bookData.billList)

const tableRef = ref<TableInstance>()
//是否显示已销账单
const isShowDelLine = ref(false)

//region日期选择器
//'day', 'week','month'分别代表日，周，月账单列表
const dateFlag = ref('week')
const dateStr = ref('周')


//用于计算的时间原点，默认为今天
const dateString = ref(formatDate())
//日期选择器的默认日期周期
const dateRange = ref<[string, string]>(['', ''])

//flag为'now', 'minus','plus',代表现在,加,减
const getNewDateRange = (flag: string) => {
  if (dateFlag.value === 'day') {
    //修改右上角字符
    dateStr.value = '日'
    const {isFuture, DateRange, DateString} = getDayDateRange({dateString: dateString.value}, flag)
    if (isFuture) return
    //修改日期区间
    dateRange.value = DateRange as [string, string]
    //修改日期计算原点
    dateString.value = DateString
  } else if (dateFlag.value === 'week') {
    dateStr.value = '周'
    const {isFuture, DateRange, DateString} = getWeekDateRange({dateString: dateString.value}, flag)
    if (isFuture) return
    dateRange.value = DateRange
    dateString.value = DateString
  } else if (dateFlag.value === 'month') {
    dateStr.value = '月'
    const {isFuture, DateRange, DateString} = getMonthDateRange({dateString: dateString.value}, flag)
    if (isFuture) return
    dateRange.value = DateRange
    dateString.value = DateString
  }
  getBillList()
  console.log('时间计算原点dateString：', dateString.value)
  console.log('时间周期dateRange：', dateRange.value)
}

//获取新的账单
const getBillList = () => {
  console.log(dateRange.value)
  emitter.emit('get-bill-list', {start_date: dateRange.value[0], end_date: dateRange.value[1]})
}

//修改日/周/月
const changeDateType = (dateType: string) => {
  dateFlag.value = dateType
  if (dateType === 'day') dateStr.value = '日'
  else if (dateType === 'week') dateStr.value = '周'
  else if (dateType === 'month') dateStr.value = '月'
  getNewDateRange('now')
}

//禁用未来时间
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

//endregion

//销账的账单的删除线
function showDelLine({row, column, rowIndex, columnIndex}: SpanMethodProps<Bill>) {
  if (row.status === 1) return 'delLine'
}

//显示和隐藏销账的账单
function hide({row, column, rowIndex, columnIndex}: SpanMethodProps<Bill>) {
  if (row.status === 1) return isShowDelLine.value ? '' : 'display:none'
}


//合并列
const objectSpanMethod = ({row, rowIndex, columnIndex}: SpanMethodProps<Bill>) => {
  if (columnIndex === 0) {
    // if (row.status===1&&!isShowDelLine.value) return
    const currentGroupID = row.gid;
    // 如果当前行是新组的第一行，计算跨行数
    if (rowIndex === 0 || billList.value[rowIndex - 1].gid !== currentGroupID) {
      let rowspan = 1;

      // 从当前行向下检查相同 groupID 的行，计算 rowspan
      for (let i = rowIndex + 1; i < billList.value.length; i++) {
        if (billList.value[i].gid === currentGroupID) {
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
      // 非组内首行，隐藏 groupID 列
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


onMounted(async () => {
  getNewDateRange('now')
})

</script>
<style scoped>
.el-container {
  width: 100%;
  overflow-x: hidden;
}



</style>


<style>
/*销账的账单的删除线*/
.delLine {
  text-decoration: line-through;
  opacity: 0.5;
}

@media (max-width: 980px) {
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
.el-picker-panel__body{
 display: flex;
  padding:0;
/*  justify-content: center;*/
}

  /* 左边日期面板宽度 */
  .el-picker-panel__content {
    width: 57%;
  }
}
</style>

