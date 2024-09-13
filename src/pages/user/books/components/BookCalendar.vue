<template>
  <el-calendar ref="calendar">
    <template #header="{ date }">
      <span v-if="isPC">账本月历(此处支出总计包含已销账单)</span>
      <span>{{ date }}</span>
      <el-button-group size="small">
        <el-button @click="selectDate('prev-month')">
          上月
        </el-button>
        <el-button @click="selectDate('today')">今天</el-button>
        <el-button @click="selectDate('next-month')">
          下月
        </el-button>
      </el-button-group>
    </template>
    <template #date-cell="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''" style="text-align: center;height: 100%"
         @click="changeTab(1,data.day)">
                        <span style="display: block">
                   {{ data.day.split('-')[2] }}
                  <template v-if="data.day in bookDesc">
                    <el-badge v-if="bookDesc[data.day].hasPaidNum!==0" :value="bookDesc[data.day].hasPaidNum"
                              color="lightgray"></el-badge>
                    <el-badge v-if="bookDesc[data.day].noPayNum!==0" :value="bookDesc[data.day].noPayNum"
                              color="lightgreen"></el-badge>
                      <span style="display: block;font-size: 12px" v-if="isPC">总计<el-text
                          type="primary">{{ bookDesc[data.day].noPay + bookDesc[data.day].hasPaid }}</el-text> 元</span>
                  </template>
                        </span>
        <!-- {{ data.isSelected ? '✔️' : '' }}-->
        <!--                  <el-button v-if="data.isSelected" size="small" type="primary" @click="changeTab(1,data.day)">-->
        <!--                    <el-icon v-if="!isPC">-->
        <!--                      <MoreFilled/>-->
        <!--                    </el-icon>-->
        <!--                    <span v-else>查看详情</span></el-button>-->
      </p>
    </template>
  </el-calendar>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import type {CalendarDateType, CalendarInstance} from 'element-plus'
// import {MoreFilled} from "@element-plus/icons-vue";
// import useResponsive from "@/hooks/useResponsive";
import {getAllMonthDateRange} from "@/hooks/useComputed";
import useTimestamp from '@/hooks/useTimestamp'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import useResponsive from "@/hooks/useResponsive";
dayjs.locale('zh-cn');//每周从周一开始


const {isPC, elSize} = useResponsive()
const {formatDate}=useTimestamp()

// const {isPC} = useResponsive()
const {getTheBillDesc, bookDesc, changeTab} = defineProps(['getTheBillDesc', 'bookDesc', 'changeTab'])

//日历
const calendar = ref<CalendarInstance>()
//用于计算的时间原点，默认为今天
const dateString = ref(formatDate())

const selectDate = async (val: CalendarDateType) => {
  if (!calendar.value) return

  //获取日期周期
  let flag = 'now'
  if (val === 'prev-month') flag = 'minus'
  else if (val === 'next-month') flag = 'plus'
  const {isFuture, DateRange, DateString} = getAllMonthDateRange({dateString: dateString.value}, flag)
  if (isFuture) return //是未来的时间，不管
  dateString.value = DateString
  //获取新一页日历的简略信息
  console.log('日历信息日期范围',DateRange)
 await getTheBillDesc(DateRange[0], DateRange[1])

  //日历翻页
  calendar.value.selectDate(val)
}


onMounted(async ()=>{
  // await selectDate('today')
})
</script>

<style scoped>

</style>
<style>
.el-calendar__body{
  padding: 5px;
}
</style>
