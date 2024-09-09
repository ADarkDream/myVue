<template>
  <el-table :data="totalCostList" :min-height="200" stripe border
            highlight-current-row row-key="uid"
            table-layout="auto" :default-sort="{ prop: 'uid', order: 'custom' }"
            :row-style="showDelLine"
  >
    <el-table-column prop="username" label="昵称" min-width="80" align="center"/>
    <el-table-column prop="totalExpense" label="(加上已销账单)总支出" min-width="80" align="center">
      <template #default="scope">
        <el-text type="info">{{ scope.row.totalExpense }}</el-text>
      </template>
    </el-table-column>
    <el-table-column prop="expense" label="当前支出" min-width="80" align="center">
      <template #default="scope">
        <el-text type="warning">{{ scope.row.expense }}</el-text>
      </template>
    </el-table-column>
    <el-table-column prop="income" label="应收取" min-width="80" align="center">
      <template #default="scope">
        <el-text :type="scope.row.income>0&&(scope.$index-length+1<0) ?'success':'danger'">{{scope.row.income}}</el-text>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {SpanMethodProps} from "@/types/global";

const {totalCostList} = defineProps(['totalCostList'])

type totalCostListItem = {
  uid: number,
  username: string,
  expense: number,
  income: number,
  totalExpense: number
}

const length = totalCostList.length

//账单总计的样式
function showDelLine({row, column, rowIndex, columnIndex}: SpanMethodProps<totalCostListItem>) {
  // if (rowIndex === length-2) return  'border:1px black solid '
  // if (rowIndex === length-1) return  'opacity:0.5;'
}
</script>

<style scoped>

</style>
