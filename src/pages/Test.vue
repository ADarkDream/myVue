<template>
  <!--  <el-form ref="formRef" style="max-width: 600px;background-color: white" :model="form" label-width="auto" class="demo-dynamic">-->
  <!--    <el-form-item prop="email" label="Email" :rules="[-->
  <!--        {-->
  <!--          required: true,-->
  <!--          message: 'Please input email address',-->
  <!--          trigger: 'blur',-->
  <!--        },-->
  <!--        {-->
  <!--          type: 'email',-->
  <!--          message: 'Please input correct email address',-->
  <!--          trigger: ['blur', 'change'],-->
  <!--        }, ]">-->
  <!--      <el-input v-model="form.email" />-->
  <!--    </el-form-item>-->
  <!--    <el-form-item-->
  <!--      v-for="(domain, index) in form.domains"-->
  <!--      :key="domain.key"-->
  <!--      :label="'Domain' + index"-->
  <!--      :prop="'domains.' + index + '.value'"-->
  <!--      :rules="{-->
  <!--        required: true,-->
  <!--        message: 'domain can not be null',-->
  <!--        trigger: 'blur',-->
  <!--      }"-->
  <!--    >-->
  <!--      <el-input v-model="domain.value" />-->
  <!--      <el-button class="mt-2" @click.prevent="removeDomain(domain)">-->
  <!--        Delete-->
  <!--      </el-button>-->
  <!--    </el-form-item>-->

  <!--    <el-form-item>-->
  <!--      <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>-->
  <!--      <el-button @click="addDomain">New domain</el-button>-->
  <!--      <el-button @click="resetForm(formRef)">Reset</el-button>-->
  <!--    </el-form-item>-->
  <!--  </el-form>-->
  <el-tree-select
      v-model="value"
      :data="data"
      multiple
      :render-after-expand="false"
      :filter-node-method="filterNodeMethod"
      filterable
      show-checkbox
      style="width: 240px"
  /><el-button @click="getList">打印</el-button>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormInstance} from 'element-plus'

const formRef = ref<FormInstance>()
const form = reactive<{
  domains: DomainItem[]
  email: string
}>({
  domains: [
    {
      key: 1,
      value: '',
    },
  ],
  email: '',
})

interface DomainItem {
  key: number
  value: string
}

const removeDomain = (item: DomainItem) => {
  const index = form.domains.indexOf(item)
  if (index !== -1) {
    form.domains.splice(index, 1)
  }
}

const addDomain = () => {
  form.domains.push({
    key: Date.now(),
    value: '',
  })
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}



//region  树状选择框


const value = ref()


const sourceData = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          },         {
            value: '1-1-2',
            label: 'Level three 1-1-2',
          },         {

            value: '1-1-3',
            label: 'Level three 1-1-3',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]
const data = ref(sourceData)

const filterMethod = (value) => {
  data.value = [...sourceData].filter((item) => item.label.includes(value))
}

const filterNodeMethod = (value, data) => data.label.includes(value)

const getList=()=>{
  console.log( value.value instanceof Array)
  console.log(Object.values(value.value))
}
//endregion
</script>
