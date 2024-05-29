<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px;margin: 0 auto">
    <el-form-item label="网站图标">
      <el-input v-model="form.img"/>
    </el-form-item>
    <el-form-item label="网站名">
      <el-input v-model="form.name"/>
    </el-form-item>
    <el-form-item label="网站详情">
      <el-input v-model="form.detail"/>
    </el-form-item>
    <el-form-item label="网站分类">
      <el-select v-model="form.sort" placeholder="选择网站类型">
        <el-option v-for="item in sort" :label="item.text" :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="网站标签">
      <el-input v-model="form.tags" type="text"/>
    </el-form-item>
    <el-form-item label="网站地址">
      <el-input v-model="form.url" type="text"/>
    </el-form-item>

    <div>
      <!--        <el-button @click="dialogVisible=false">取消上传</el-button>-->
      <el-button type="primary" @click="addUrl(form)">上传新的导航</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import {ElMessage} from "element-plus";
import axios from "axios";


interface Url {
  id?: number,
  img?: string,
  name?: string,
  detail?: string,
  url?: string,
  sort?: string,
  tags?: string,
  status?: number,
  updated_time?: string,
}

const form = reactive<Url>({
  img: '',
  name: '',
  detail: '',
  url: '',
  sort: '',
  tags: '',
})

interface Sort {
  text: string,
  value: string
}

let sort = reactive<Sort[]>([
  {text: '软件下载', value: 'tool'},
  {text: '在线工具', value: 'onlineTool'},
  {text: '机器人', value: 'robot'},
  {text: 'HTML', value: 'html'},
  {text: '观影', value: 'video'},
  {text: '电子书', value: 'book'},
  {text: '教程', value: 'tutorial'},
  {text: '虚拟机', value: 'vm'},
  {text: '杂项', value: 'other'},
  {text: '娱乐', value: 'webGame'},
])


//上传新的导航网址
function addUrl(data: Url) {
  if (data.name === '' || data.sort === '' || data.url === '') return ElMessage.error('导航网站名、分类、网址均不能为空！')
  axios({
    url: '/addUrl',
    method: 'post',
    data
  }).then(result => {
    // console.log(result)
    const {msg} = result.data
    ElMessage.success(msg)
    setTimeout(() => {
      location.reload()
    }, 2000)
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    //ElMessage.error('发生错误：' + error.message)
  })
}


</script>

<style scoped>

</style>