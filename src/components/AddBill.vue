<template>
  <!--  <el-tabs :tab-position="tabPosition">-->
  <!--    <el-tab-pane label="新增账单">-->
  <!--      <el-form-->
  <!--          ref="addBillFormRef"-->
  <!--          :model="addBillForm"-->
  <!--          label-width="auto"-->
  <!--          label-position="left"-->
  <!--      >-->
  <!--        <el-form-item prop="name" label="账单条目">-->
  <!--          <el-input v-model="addBillForm.name" maxlength="10" placeholder="输入账单条目"/>-->
  <!--        </el-form-item>-->
  <!--        <el-form-item prop="price" label="账单花费">-->
  <!--          <el-input v-model.trim="addBillForm.price" placeholder="输入账单花费金额" maxlength="5"/>-->
  <!--        </el-form-item>-->
  <!--        <el-form-item prop="desc" label="账单备注">-->
  <!--          <el-input v-model="addBillForm.desc" placeholder="输入账单备注" maxlength="30"/>-->
  <!--        </el-form-item>-->
  <!--        <el-form-item prop="type" label="账单类型">-->
  <!--          <el-input v-model="addBillForm.type" placeholder="输入账单类型" maxlength="30"/>-->
  <!--        </el-form-item>-->
  <!--        <div class="btn">-->
  <!--          <el-button @click="reset(addBillFormRef)">重置</el-button>-->
  <!--          <el-button type="primary" @click="submit(addBillForm,'/addBill',true)">新增子账单</el-button>-->
  <!--          <el-button type="primary" @click="submit(addBillForm,'/addBill')">新增账单</el-button>-->
  <!--        </div>-->
  <!--      </el-form>-->
  <!--    </el-tab-pane>-->
  <!--    <el-tab-pane label="修改账单">-->
  <!--      <el-form-->
  <!--          ref="joinBookFormRef"-->
  <!--          :model="joinBookForm"-->
  <!--          label-width="auto"-->
  <!--          label-position="left"-->
  <!--      >-->
  <!--        <el-form-item prop="bid" label="账本ID">-->
  <!--          <el-input v-model="joinBookForm.bid" maxlength="5" placeholder="输入账本ID"/>-->
  <!--        </el-form-item>-->
  <!--        <el-form-item prop="key" label="邀请码">-->
  <!--          <el-input v-model="joinBookForm.key" placeholder="输入账本邀请码" maxlength="10"/>-->
  <!--        </el-form-item>-->

  <!--        <div class="btn">-->
  <!--          <el-button @click="reset(joinBookFormRef)">重置</el-button>-->
  <!--          <el-button type="primary" @click="submit(joinBookForm,'/joinBook')">申请</el-button>-->
  <!--        </div>-->
  <!--      </el-form>-->
  <!--    </el-tab-pane>-->
  <!--  </el-tabs>-->
  <el-form
      ref="addBillFormRef"
      :model="addBillForm"
      label-width="auto"
      label-position="left"
  >
    <el-form-item prop="name" label="账单条目">
      <el-input v-model="addBillForm.name" maxlength="10" placeholder="输入账单条目"/>
    </el-form-item>
    <el-form-item prop="price" label="账单花费">
      <el-input v-model.number.trim="addBillForm.price" placeholder="输入账单花费金额" maxlength="5"/>
    </el-form-item>
    <el-form-item prop="desc" label="账单备注">
      <el-input v-model="addBillForm.desc" placeholder="输入账单备注" maxlength="30"/>
    </el-form-item>
    <el-form-item prop="type" label="账单类型">
      <el-input v-model="addBillForm.type" placeholder="输入账单类型" maxlength="30"/>
    </el-form-item>
    <div class="btn">
      <el-button @click="reset(addBillFormRef)">重置</el-button>
      <el-button type="primary" @click="submit(true)" v-if="isAdd">新增子账单</el-button>
      <el-button type="primary" @click="submit()" v-if="isAdd">新增账单</el-button>
      <el-button type="primary" @click="submit()" v-else>修改账单</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {ElMessage, type FormInstance} from "element-plus";
import axios from "axios";
import {Bill, NewBill} from "@/types/books";


const {cancelAddBill, thisBill, url} = defineProps(['cancelAddBill', 'thisBill', 'url'])

const addBillFormRef = ref<FormInstance>()
const addBillForm = reactive<NewBill>({
  bid: thisBill.bid,
  gid: 0,
  name: '',
  price: 0,
  desc: '',
  type: '',
})

const isAdd = ref(url === '/addBill')

//新增账单或加入修改账单
const submit = async (isChild?: boolean) => {
  try {
    if (isChild) addBillForm.gid = (thisBill as Bill).gid


    //对比原数据检查是否有修改，如果没有修改则返回


    const result = await axios({
      url,
      method: 'post',
      data: addBillForm
    })
    console.log(result)
    const {msg} = result.data
    ElMessage.success(msg)
    // if (isAdd.value) return location.reload()
    //
    // cancelAddBill(addBillForm)
      cancelAddBill()
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}


//重置表单
const reset = (val: FormInstance | undefined) => {
  if (!val) return
  val.resetFields()
}


onMounted(() => {
  if (url === '/updateBill') {
    Object.assign(addBillForm, thisBill)
  }
  console.log('addBillForm', addBillForm)
})
</script>

<style scoped>

</style>
