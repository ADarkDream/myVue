<template>
  <!--显示网站图标-->
  <el-form label-width="auto" :model="form" style="max-width: 600px; margin: 0 auto">
    <el-image alt="该地址无法获取默认图标" :src="src" style="width: 40px; height: 40px" />
    <el-form-item label="站点名称">
      <el-input v-model="form.name" placeholder="必填" />
    </el-form-item>
    <el-form-item label="站点地址">
      <el-input v-model="form.url" placeholder="必填，站点地址" type="text" @blur="checkIco" />
    </el-form-item>
    <el-form-item label="站点分类">
      <el-select v-model="form.sort" placeholder="必选，选择站点类型">
        <el-option v-for="(item, index) in sort" :key="index" :label="item.text" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="站点标签">
      <el-input v-model="form.tags" placeholder="选填" type="text" />
    </el-form-item>
    <el-form-item label="站点详情">
      <el-input v-model="form.detail" placeholder="选填，站点的一句话介绍" />
    </el-form-item>
    <el-form-item label="站点图标">
      <el-input v-model.trim="form.img" placeholder="选填，站点图标链接或base64编码图片" />
    </el-form-item>
    <div>
      <!--        <el-button @click="dialogVisible=false">取消上传</el-button>-->
      <el-button type="primary" @click="addUrl(form)">上传新的导航</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
//types
import type { Navigation } from "@/types/url"
import type { TableFilterItem } from "@/types/global"
//files
import ico_custom from "@/assets/home/custom.png"
import { api_add_url } from "@/apis/home/website"

const form: Navigation = reactive({
  img: "",
  name: "",
  detail: "",
  url: "",
  sort: "",
  tags: "",
})

const sort: TableFilterItem<string>[] = reactive([
  { text: "软件下载", value: "tool" },
  { text: "在线工具", value: "onlineTool" },
  { text: "机器人", value: "robot" },
  { text: "HTML", value: "html" },
  { text: "观影", value: "video" },
  { text: "电子书", value: "book" },
  { text: "教程", value: "tutorial" },
  { text: "虚拟机", value: "vm" },
  { text: "杂项", value: "other" },
  { text: "娱乐", value: "webGame" },
])

const src = ref(ico_custom)

//展示网址图片
const checkIco = () => {
  if (form.url.trim() !== "") src.value = "https://quaint-tomato-hare.faviconkit.com/" + form.url
  else src.value = ico_custom
}

//上传新的导航网址
const addUrl = async (data: Navigation) => {
  if (!data.name || !data.sort || !data.url) return ElMessage.error("导航站点名、分类、网址均不能为空！")
  if (!data.img) data.img = "https://quaint-tomato-hare.faviconkit.com/" + form.url
  try {
    const flag = await api_add_url(data)
    if (flag)
      setTimeout(() => {
        location.reload()
      }, 2000)
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}
</script>

<style scoped></style>
