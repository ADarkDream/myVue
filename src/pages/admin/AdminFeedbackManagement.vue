<template>
  <el-header class="header1"> 反馈管理 </el-header>
  <div class="header2">
    <span></span>
    <el-button @click="clearFilter">清空全部筛选</el-button>
  </div>
  <el-main style="padding-bottom: 0; padding-top: 0">
    <el-table
      ref="tableRef"
      border
      :data="tableData"
      :default-sort="{ prop: 'id', order: 'custom' }"
      highlight-current-row
      max-height="500"
      stripe
      style="width: 100%"
      table-layout="auto"
      type="type"
    >
      <el-table-column fixed label="ID" prop="id" sortable width="70" />
      <el-table-column label="联系方式" prop="contact" width="200" />
      <el-table-column label="反馈内容" prop="content" width="400" />
      <el-table-column
        :filter-method="filterHandler"
        :filters="[
          { text: '已标记', value: 1 },
          { text: '未标记', value: 0 },
        ]"
        label="状态"
        prop="status"
        width="100"
      >
        <template #default="scope">
          <el-button v-if="scope.row.status === 1" text type="primary"
            >已标记</el-button
          >
          <el-button v-else-if="scope.row.status === 0" text type="info"
            >未标记</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_time" width="150">
        <template #default="scope">{{
          getTime(scope.row.created_time)
        }}</template>
      </el-table-column>
      <el-table-column label="标记时间" prop="updated_time" width="150">
        <template #default="scope">{{
          getTime(scope.row.updated_time)
        }}</template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            link
            size="small"
            type="primary"
            @click="updateFeedback(scope.$index, scope.row)"
            ><span v-if="scope.row.status === 0">标记</span
            ><span v-else>取消标记</span></el-button
          >
          <el-button
            link
            size="small"
            type="danger"
            @click="deleteRow(scope.$index, scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import momo from "@/apis";
import { ElMessage, ElMessageBox } from "element-plus";
import type { TableColumnCtx, TableInstance } from "element-plus";
//hooks
import useTimeStamp from "@/hooks/useTimestamp";

const { getTime } = useTimeStamp();

const tableRef = ref<TableInstance>();
const tableData: Feedback[] = reactive([]);

//清空全部筛选条件
const clearFilter = () => {
  tableRef.value!.clearFilter();
};

//筛选器
const filterHandler = (
  value: string,
  row: Feedback,
  column: TableColumnCtx<Feedback>
) => {
  const property = column["property"] as keyof Feedback;
  return row[property] === value;
};

//监听排序行为，并修改数组顺序,否则删除会出错
// function handleSortChange({prop, order}: Sort<Feedback>) {
//   // 根据 column 和 order 对 this.tableData 进行排序
//   tableData.sort((a, b) => {
//     if (a[prop] < b[prop]) return order === 'ascending' ? -1 : 1;
//     if (a[prop] > b[prop]) return order === 'ascending' ? 1 : -1;
//     return 0;
//   })
// }

interface Feedback {
  [key: string]: any;
  id: number;
  contact?: string;
  content: string;
  status: number;
  created_time: string;
  updated_time: string;
}

//获取全部公告
getFeedback();

function getFeedback() {
  momo
    .get("/getFeedback")
    .then((result) => {
      // console.log(result)
      const { msg, data } = result;
      ElMessage.success(msg);
      tableData.splice(0, tableData.length);
      data.forEach((item: Feedback) => {
        tableData.push(item);
      });
    })
    .catch((error) => {
      console.log("发生错误：");
      console.dir(error);
    });
}

//上传更新的反馈信息(标记)
function updateFeedback(index: number, oldData: Feedback) {
  let status = oldData.status;
  if (status === 1) status = 0;
  else status = 1;
  momo
    .post("/updateFeedback", {
      status,
      id: oldData.id,
    })
    .then((result) => {
      // console.log(result)
      const { msg } = result;
      //更新修订时间为当前时间
      const updated_time = new Date().toISOString();
      //将修改后的信息显示出来
      Object.assign(oldData, { status, updated_time });
      ElMessage.success(msg);
    })
    .catch((error) => {
      console.log("发生错误：");
      console.log(error);
      ElMessage.error(error.message);
    });
}

//确认删除操作
const deleteRow = (index: number, id: number) => {
  ElMessageBox.confirm("确认删除该反馈吗?", "Warning", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消删除",
    type: "warning",
    showClose: false,
  })
    .then(() => {
      deleteFeedback(index, id);
      console.log(index, id);
    })
    .catch(() => ElMessage.info("删除操作已取消"));
};

//删除公告
const deleteFeedback = (index: number, id: number) => {
  momo
    .delete("/deleteFeedback", { id })
    .then((result) => {
      // console.log(result)
      ElMessage.success(result.msg);
      tableData.splice(index, 1);
      console.log(tableData);
    })
    .catch((error) => {
      console.dir("发生错误：" + error);
    });
};
</script>

<style scoped></style>
