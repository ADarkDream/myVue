<template>
  <el-form ref="addEngineFormRef" label-position="left" label-width="auto" :model="addEngineForm" status-icon>
    <!--显示网站图标-->
    <el-image alt="该地址无法获取默认图标" :src="src" style="width: 40px; height: 40px" />
    <!--      网址主要地址-->
    <el-form-item>
      <el-col :span="5">
        <el-form-item prop="protocol">
          <el-select v-model="addEngineForm.protocol" default-first-option placeholder="https://">
            <el-option label="https://" value="https://" />
            <el-option label="http://" value="http://" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="18">
        <el-form-item prop="baseUrl" :rules="[{ required: true, message: '主要地址是必需的' }]">
          <el-input v-model="addEngineForm.baseUrl" placeholder="输入网站域名或主要地址(例:www.baidu.com)" @blur="checkIco" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <!--      网址搜索参数-->
    <el-form-item>
      <el-col :span="5">
        <el-form-item prop="name">
          <el-input v-model="addEngineForm.name" placeholder="命名"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="18">
        <el-form-item prop="searchUrl" :rules="[{ required: true, message: '搜索参数是必需的' }]">
          <el-input v-model="addEngineForm.searchUrl" placeholder="输入网站搜索参数(地址栏可见，例:/s?wd=)" />
        </el-form-item>
      </el-col>
    </el-form-item>

    <div class="btn">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="submit(addEngineFormRef)">添加</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from "vue"
import type { FormInstance } from "element-plus"
import momo from "@/apis"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
//types
import { EngineData, ThisEngine } from "@/types/url"
//files
import ico_custom from "@/assets/home/custom.svg?url"

const userInfoStore = useUserInfoStore()
const { isLogin } = toRefs(userInfoStore)

const addEngineFormRef = ref<FormInstance>()
const addEngineForm = reactive({
  name: "",
  protocol: "https://",
  baseUrl: "",
  searchUrl: "",
})

//region 添加搜索引擎
const { closeDialog, getEngineList } = defineProps(["closeDialog", "getEngineList"])

//新加搜索引擎的图标
const src = ref(ico_custom)
//自定义搜索引擎列表
const userEngines = reactive(JSON.parse(localStorage.getItem("userEngines") || "[]"))

//展示网址图片
function checkIco() {
  console.log(111, src.value)
  if (addEngineForm.baseUrl.trim() !== "") src.value = "https://quaint-tomato-hare.faviconkit.com/" + addEngineForm.baseUrl
  else src.value = ico_custom
}

//验证添加导航网站的表单
const submit = (val: FormInstance | undefined) => {
  if (!val) return //数据为空返回
  val.validate((valid) => {
    //数据验证通过
    if (valid) {
      addEngine()
      reset(addEngineFormRef.value)
    } else {
      ElMessage.error("添加失败")
      return false
    }
  })
}

//添加搜索引擎
function addEngine() {
  const data: ThisEngine = {
    index: userEngines.length,
    name: addEngineForm.name,
    baseUrl: addEngineForm.protocol + addEngineForm.baseUrl,
    searchUrl: addEngineForm.searchUrl,
    src: src.value,
  }
  if (isLogin.value) {
    momo
      .post("/addEngine", data)
      .then((result) => {
        // console.log(result)
        const { msg } = result
        ElMessage.success(msg)
        getEngineList()
        closeDialog()
        // location.reload()
      })
      .catch((error) => {
        console.dir("发生错误：")
        console.dir(error)
        //ElMessage.error('发生错误：' + error.message)
      })
  } else {
    const localEngines = JSON.parse(localStorage.getItem("localEngines") || "[]")
    console.log("localEngines", localEngines)
    data.isShow = true
    data.id = Date.now()
    localEngines.push(data)
    localStorage.setItem("localEngines", JSON.stringify(localEngines))
    // addEngineFlag.value = false
    getEngineList()
    closeDialog()
    ElMessage.success("添加搜索引擎到本地成功")
  }
}

//重置添加导航网站的表单
const reset = (val: FormInstance | undefined) => {
  if (!val) return
  val.resetFields()
}

const close = () => {
  closeDialog()
  reset(addEngineFormRef.value)
}
</script>

<style scoped></style>
