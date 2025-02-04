<template>
  <el-tabs class="demo-tabs" :tab-position="tabPosition">
    <el-tab-pane label="新建账本">
      <el-form ref="addBookFormRef" label-position="left" label-width="auto" :model="addBookForm">
        <el-form-item label="账本名" prop="name">
          <el-input v-model="addBookForm.name" maxlength="10" placeholder="输入账本名" />
        </el-form-item>
        <el-form-item label="账本简介" prop="intro">
          <el-input v-model="addBookForm.intro" maxlength="30" placeholder="输入账本简介" />
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
      <el-form ref="joinBookFormRef" label-position="left" label-width="auto" :model="joinBookForm">
        <el-form-item label="账本ID" prop="bid">
          <el-input v-model="joinBookForm.bid" maxlength="5" placeholder="输入账本ID" />
        </el-form-item>
        <el-form-item label="邀请码" prop="key">
          <el-input v-model="joinBookForm.key" maxlength="10" placeholder="输入账本邀请码" />
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
