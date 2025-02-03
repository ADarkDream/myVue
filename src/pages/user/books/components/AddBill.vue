<template>
  <el-form ref="addBillFormRef" :model="addBillForm" label-width="auto" :style="isPC ? 'margin:0 5%' : ''">
    <el-form-item prop="name" label="账单条目">
      <el-input v-model="addBillForm.name" maxlength="10" placeholder="输入账单条目" />
    </el-form-item>
    <el-row>
      <el-col :span="isPC ? 11 : 11">
        <el-form-item prop="price" label="账单花费">
          <el-input-number
            v-model="addBillForm.price"
            :precision="2"
            :step="0.1"
            :min="0"
            :max="1000"
            controls-position="right"
            placeholder="输入账单花费金额"
          />
        </el-form-item>
      </el-col>
      <el-col :span="1" />
      <el-col :span="isPC ? 8 : 12">
        <el-form-item prop="bill_date" label="账单日期">
          <el-date-picker
            v-model="addBillForm.bill_date"
            type="date"
            placeholder="选择账单日期"
            :default-value="new Date()"
            :disabled-date="disabledDate"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="desc" label="账单备注">
      <el-input v-model="addBillForm.desc" placeholder="输入账单备注" maxlength="30" />
    </el-form-item>
    <el-form-item prop="type" label="账单类型">
      <el-input v-model="addBillForm.type" placeholder="输入账单类型" maxlength="30" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="合并账单">
          <el-switch v-model="isChild" active-text="合并" inactive-text="独立" inline-prompt />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item prop="gid" label="账单组别">
          <el-input-number :disabled="!isChild" v-model="addBillForm.gid" :min="0" controls-position="right" />
        </el-form-item>
      </el-col>
    </el-row>
    <!--       <el-form-item v-if="isChild" prop="status" label-position="right" label="是否销账">-->
    <!--          <el-checkbox v-model="isChecked"/>-->
    <!--        </el-form-item>-->

    <div class="btn">
      <el-button @click="reset(addBillFormRef)">重置</el-button>
      <el-button type="primary" @click="submit('/addBill')">{{ isChild ? "新增合并账单" : "新增账单" }} </el-button>
      <el-button type="primary" v-if="addBillForm.id !== 0" @click="submit('/updateBill')">修改账单</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch } from "vue"
import { ElMessage, type FormInstance } from "element-plus"
import momo from "@/apis"
//stores
import { useBookStore } from "@/store/useBookStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
//hooks

import useTimestamp from "@/hooks/useTimestamp"
//types
import { Bill, NewBill } from "@/types/books"

const bookData = useBookStore()
const responsiveStore = useResponsiveStore()
const { formatDate } = useTimestamp()

const { cancelAddBill, thisBill, url } = defineProps(["cancelAddBill", "thisBill", "url"])
const { isPC } = toRefs(responsiveStore)

const addBillFormRef = ref<FormInstance>()
const addBillForm = reactive<NewBill>({
  id: 0,
  bid: bookData.thisBill.bid,
  gid: 0,
  name: "",
  price: 0,
  bill_date: "",
  desc: "",
  type: "",
})
//是否是合并账单
const isChild = ref(false)

onMounted(() => {
  // console.log('addBill', thisBill)
  Object.assign(addBillForm, thisBill)
  // console.log(addBillForm.id, addBillForm.gid)
  isChild.value = addBillForm.id !== addBillForm.gid
  // console.log(typeof addBillForm.bid, typeof addBillForm.gid)
  // console.log(addBillForm.bid === addBillForm.gid)
})

if (url === "/updateBill") {
  Object.assign(addBillForm, bookData.thisBill)
} else addBillForm.bill_date = formatDate()
console.log("addBillForm", addBillForm)

//更新或添加账单
// const isAdd = ref(url === '/addBill')

watch(isChild, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    addBillForm.gid = newValue ? thisBill.gid : 0
  }
})
// isChild.value = addBillForm.bid !== addBillForm.gid;

//新增账单或加入修改账单
const submit = async (url: string) => {
  try {
    //更新或添加账单
    const isAdd = url === "/addBill"
    const Data = addBillForm //Object.assign({},addBillForm)
    //添加新账单，没有id
    if (isAdd && isChild.value) {
      //都为true，代表新增合并账单,无id有gid
      delete Data.id
    } else if (isAdd && !isChild.value) {
      //仅isAdd为true，代表新增账单且不合并,无id无gid
      delete Data.id
      delete Data.gid
    } else if (!(isAdd || isChild.value)) {
      //都为false，代表修改账单且取消合并账单,gid=id
      Data.gid = Data.id //还原gid
    }
    //去除多余的status，这里不修改status，防止干扰销账功能
    delete Data.status
    Data.bill_date = formatDate(new Date(Data.bill_date))

    console.log("新增账单或加入修改账单", Data)
    //对比原数据检查是否有修改，如果没有修改则返回
    // addBillForm.bill_date=addBillForm.bill_date.getDate()
    //     return console.log('addBillForm', addBillForm)
    const result = await momo.post<{ newBill: Bill[] }>(url, Data)
    console.log(result)
    const { msg, data } = result
    ElMessage.success(msg)
    //返回新增或修改的数据

    cancelAddBill(data!.newBill[0], isAdd)
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

//禁用未来的日期
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
</script>

<style scoped></style>
