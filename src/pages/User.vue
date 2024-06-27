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
  <el-card>
    <el-form label-width="auto" :inline="true">
      <el-form-item label="m">
        <el-input v-model="m" placeholder="m"></el-input>
      </el-form-item>
      <el-form-item label="n">
        <el-input v-model="n" placeholder="n"></el-input>
      </el-form-item>
      <el-form-item label="答案">
        {{ res }}
      </el-form-item>
      <br>
      <el-button @click="start">测试</el-button>
    </el-form>
    <el-card header="数组的样子">
      <div v-for="item in matrix">{{ item }}</div>
    </el-card>
  </el-card>
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


//我的代码
let m = ref<number>() //横
let n = ref<number>()//竖
let res = reactive([])//答案
const matrix = reactive([])//二维数组
const list = new Set([])//二行走路线

function start() {
  // res.value = Number(m.value) + Number(n.value)

  //创建二维数组
  for (let i = 0; i <= m.value - 1; i++) {
    matrix[i] = []
    for (let j = 0; j <= n.value - 1; j++) matrix[i][j] = `(${i},${j})`
  }
  // console.log(matrix[0][0]==='(0,0)')
  //
  // matrix.forEach(item => {
  //   const flag = item.indexOf('(0,1)')
  //   if (item.indexOf('(0,1)') !== -1) console.log(item[flag])
  //   // if (item.includes('(0,1)')) console.log(item)
  // })

  // console.log(matrix)
  count(m.value - 1, n.value - 1, 0, 0)
  // count(m.value - 1, n.value - 1, oldPoint[0], oldPoint[1])
}


let oldPoint = [0, 0]//上一个点的坐标
//遍历计算
const count = (width: number, height: number, i, j) => {
  list.add('(0,0)')

  for (i = 0; i <= width; i++) {
    for (j = 0; j <= height; j++) {
      console.log(matrix[i][j], `(${i},${j})`)
      // console.log(`(${i},${j + 1})`,addH(i, j),delH(i, j),addW(i, j),delW(i, j))
      //   let newPoint = `(${i},${j + 1})`
      console.log('old', oldPoint)
      if (i === oldPoint[0] && j + 1 <= height && !!addH(i, j)) continue
      else if (j === oldPoint[1] && i + 1 <= width && !!addW(i, j)) continue
      else if (i === oldPoint[0] && j - 1 >= 0 && !!delH(i, j)) continue
      else if (j === oldPoint[1] && i + 1 >= 0 && !!delW(i, j)) continue
      console.log(oldPoint)
    }
  }
  res.splice(0, res.length, ...list)
  console.log(res)
  if (res.length !== m.value * n.value) {
    console.log('无答案')
  }
}

const addH = (w: number, h: number) => {
  const newPoint = matrix[w][h + 1]
  console.log(newPoint)
  if (!list.has(newPoint)) {
    list.add(newPoint)
      console.log('newPoint',newPoint)
    oldPoint[0]=w
    oldPoint[1]=h
    return true
  } else return
}

const delH = (w: number, h: number) => {
  const newPoint = matrix[w][h - 1]
  console.log(newPoint)
  if (!list.has(newPoint)) {
    list.add(newPoint)
      console.log('newPoint',newPoint)
      oldPoint[0]=w
    oldPoint[1]=h
    return true
  } else return
}

const addW = (w: number, h: number) => {
  const newPoint = matrix[w + 1][h]
  console.log(newPoint)
  if (!list.has(newPoint)) {
    list.add(newPoint)
      console.log('newPoint',newPoint)
     oldPoint[0]=w
    oldPoint[1]=h
    return true
  } else return
}

const delW = (w: number, h: number) => {
  const newPoint = matrix[w - 1][h]
  console.log(newPoint)
  if (!list.has(newPoint)) {
    list.add(newPoint)
      console.log('newPoint',newPoint)
      oldPoint[0]=w
    oldPoint[1]=h
    return true
  } else return
}

</script>
