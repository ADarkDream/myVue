<template>
  <el-table
    border
    :data="totalCostList"
    :default-sort="{ prop: 'uid', order: 'custom' }"
    highlight-current-row
    :min-height="200"
    row-key="uid"
    :row-style="showDelLine"
    stripe
    table-layout="auto"
  >
    <template #empty>
      <el-empty />
    </template>
    <el-table-column align="center" label="昵称" min-width="80" prop="username" />
    <el-table-column align="center" label="总支出" min-width="80" prop="totalExpense">
      <template #default="scope">
        <el-text type="info">{{ scope.row.totalExpense }}</el-text>
      </template>
    </el-table-column>
    <el-table-column align="center" label="当前支出" min-width="80" prop="expense">
      <template #default="scope">
        <el-text type="warning">{{ scope.row.expense }}</el-text>
      </template>
    </el-table-column>
    <el-table-column align="center" label="应收取" min-width="80" prop="income">
      <template #default="scope">
        <span v-if="scope.$index + 1 === totalCostList.length"
          >平均 <el-text type="primary">{{ scope.row.income }}</el-text></span
        >
        <span v-else-if="scope.row.income > 0"
          >收取 <el-text type="success">{{ scope.row.income }}</el-text></span
        >
        <span v-else
          >支付 <el-text type="danger">{{ 0 - scope.row.income }}</el-text></span
        >
        元
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
//types
import { SpanMethodProps } from "@/types/global"

const { totalCostList } = defineProps(["totalCostList"])

type totalCostListItem = {
  uid: number
  username: string
  expense: number
  income: number
  totalExpense: number
}

const length = totalCostList.length

//账单总计的样式
function showDelLine({ row, column, rowIndex, columnIndex }: SpanMethodProps<totalCostListItem>) {
  // if (rowIndex === length-2) return  'border:1px black solid '
  // if (rowIndex === length-1) return  'opacity:0.5;'
}
</script>

<style scoped></style>
