<template>
  <el-tabs :tab-position="tabPosition" class="demo-tabs">
    <el-tab-pane label="新建账本">
      <el-form ref="addBookFormRef" :model="addBookForm" label-width="auto" label-position="left">
        <el-form-item prop="name" label="账本名">
          <el-input v-model="addBookForm.name" maxlength="10" placeholder="输入账本名" />
        </el-form-item>
        <el-form-item prop="intro" label="账本简介">
          <el-input v-model="addBookForm.intro" placeholder="输入账本简介" maxlength="30" />
        </el-form-item>
        <div class="btn">
          <el-button
            @click="
              reset(addBookFormRef)
              cancelAddBook()
            "
            >取消</el-button
          >
          <el-button type="primary" @click="submit(addBookForm, '/addBook')">新建</el-button>
        </div>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="与他人协作">
      <el-form ref="joinBookFormRef" :model="joinBookForm" label-width="auto" label-position="left">
        <el-form-item prop="bid" label="账本ID">
          <el-input v-model="joinBookForm.bid" maxlength="5" placeholder="输入账本ID" />
        </el-form-item>
        <el-form-item prop="key" label="邀请码">
          <el-input v-model="joinBookForm.key" placeholder="输入账本邀请码" maxlength="10" />
        </el-form-item>

        <div class="btn">
          <el-button
            @click="
              reset(joinBookFormRef)
              cancelAddBook()
            "
            >取消</el-button
          >
          <el-button type="primary" @click="submit(joinBookForm, '/joinBook')">申请</el-button>
        </div>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage, type FormInstance } from "element-plus"
import type { TabsInstance } from "element-plus"
import momo from "@/apis"

const tabPosition = ref<TabsInstance["tabPosition"]>("top")
const addBookFormRef = ref<FormInstance>()
const addBookForm = reactive({
  name: "",
  intro: "",
})
const joinBookFormRef = ref<FormInstance>()
const joinBookForm = reactive<{ bid: number | null; key: string }>({
  bid: null,
  key: "",
})

const { cancelAddBook } = defineProps(["cancelAddBook"])

//新建账本或加入账本协作
const submit = async (formData, url: string) => {
  try {
    const result = await momo.post(url, formData)
    console.log(result)
    const { msg, data } = result
    ElMessage.success(msg)
    cancelAddBook(data)
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//重置表单
const reset = (val: FormInstance | undefined) => {
  if (!val) return
  val.resetFields()
}
</script>

<style scoped></style>
