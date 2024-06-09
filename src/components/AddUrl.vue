<template>
  <!--显示网站图标-->
  <el-card>
    <img :src='src' alt="该地址无法获取默认图标" style="width: 40px;height: 40px"></el-card>
  <el-form :model="form" label-width="auto" style="max-width: 600px;margin: 0 auto">
    <el-form-item label="站点名称">
      <el-input v-model="form.name" placeholder="必填"/>
    </el-form-item>
    <el-form-item label="站点地址">
      <el-input v-model="form.url" @blur="checkIco" type="text" placeholder="必填，站点地址"/>
    </el-form-item>
    <el-form-item label="站点分类">
      <el-select v-model="form.sort" placeholder="必选，选择站点类型">
        <el-option v-for="item in sort" :label="item.text" :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="站点标签">
      <el-input v-model="form.tags" type="text" placeholder="选填"/>
    </el-form-item>
    <el-form-item label="站点详情">
      <el-input v-model="form.detail" placeholder="选填，站点的一句话介绍"/>
    </el-form-item>
    <el-form-item label="站点图标">
      <el-input v-model="form.img" placeholder="选填，站点图标链接或base64编码图片"/>
    </el-form-item>
    <div>
      <!--        <el-button @click="dialogVisible=false">取消上传</el-button>-->
      <el-button type="primary" @click="addUrl(form)">上传新的导航</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {ElMessage} from "element-plus";
import axios from "axios";
import ico_custom from "@/assets/custom.png";


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


const src = ref(ico_custom)

//展示网址图片
function checkIco() {
  if (form.url.trim() !== '') src.value = 'https://quaint-tomato-hare.faviconkit.com/' + form.url
  else src.value = ico_custom
}

//上传新的导航网址
function addUrl(data: Url) {
  if (data.name === '' || data.sort === '' || data.url === '') return ElMessage.error('导航站点名、分类、网址均不能为空！')
  if (data.img.trim() === '' || data.img.trim() === undefined) data.img = 'https://quaint-tomato-hare.faviconkit.com/' + form.url
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