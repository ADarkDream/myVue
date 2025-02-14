<template>
  <el-form
    ref="ruleFormRef"
    class="registerForm"
    label-position="top"
    label-width="auto"
    :model="ruleForm"
    :rules="Rules"
    status-icon
  >
    <el-form-item prop="username">
      <el-input v-model.lazy.trim="ruleForm.username" placeholder="输入昵称" />
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model.lazy.trim="ruleForm.email" autocomplete="off" placeholder="输入邮箱" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model.lazy.trim="ruleForm.password" autocomplete="off" placeholder="输入密码" type="password" />
    </el-form-item>
    <el-form-item prop="checkPassword">
      <el-input v-model.lazy.trim="ruleForm.checkPassword" autocomplete="off" placeholder="确认密码" type="password" />
    </el-form-item>
    <el-form-item prop="code">
      <div style="display: flex; justify-content: space-between; width: 100%">
        <el-input v-model.lazy.trim="ruleForm.code" autocomplete="off" placeholder="输入邮箱获取验证码" />
        <el-button :disabled="isDisabled" type="primary" @click="getEmailCode()">
          {{ isDisabled ? t + "秒后获取" : "获取" }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item autocomplete="off" prop="policy">
      <input v-model="ruleForm.policy" type="checkbox" />&ensp;我已阅读并同意
      <el-button link type="primary" @click="showPolicy">隐私政策</el-button>
      <el-button link style="position: absolute; right: 0" @click="resetForm()">重置表单</el-button>
    </el-form-item>
    <el-button class="submitBtn" :loading="isLoading" @click="submitForm()">注册</el-button>
    <br />
    <el-link @click="toLogin(true)">前往登录</el-link>
  </el-form>
</template>

<script lang="ts" setup>
import { onUnmounted, reactive, ref } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import momo from "@/apis"
//utils
import verifyRules from "@/utils/verifyRules"
import titleDiv from "@/utils/titleDiv"
//types
import type { registerForm } from "@/types/form"
import { api_get_email_code, api_register } from "@/apis/user/login"

const ruleFormRef = ref<FormInstance>()

//获取邮件倒计时
const t = ref(61)
const timer1 = ref<ReturnType<typeof setTimeout>>()
const isDisabled = ref(false)

//切换父组件loading状态
const { toLogin } = defineProps(["toLogin"])
const isLoading = ref(false)

//表单数据
const ruleForm = reactive<registerForm>({
  username: "",
  email: "",
  password: "",
  checkPassword: "",
  code: "",
  policy: false,
})

//规则:重复确认密码
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请确认密码！"))
  } else if (value !== ruleForm.password) {
    callback(new Error("两次输入的密码不匹配！"))
  } else {
    callback()
  }
}

//用哪些表单验证规则
const Rules = ref<FormRules<typeof ruleForm>>({
  username: [{ validator: verifyRules.userName, required: true, trigger: "blur" }],
  email: [{ validator: verifyRules.email, required: true, trigger: "blur" }],
  password: [{ validator: verifyRules.password, required: true, trigger: "blur" }],
  checkPassword: [{ validator: validatePassword, required: true, trigger: "blur" }],
  code: [{ validator: verifyRules.emailCode, required: true, trigger: "blur" }],
  policy: [{ validator: verifyRules.policy, required: true, trigger: "blur" }],
})

// 获取邮箱验证码
const getEmailCode = async () => {
  try {
    const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i
    if (!reg.test(ruleForm.email)) return ElMessage.error("邮箱格式不正确，请重新输入！")
    const isOk = await api_get_email_code(ruleForm.email)
    if (!isOk) return
    timer1.value = setInterval(() => {
      t.value--
      isDisabled.value = true
      if (t.value === 0) {
        clearInterval(timer1.value)
        isDisabled.value = false
        console.log("倒计时已清除")
      }
      console.log("定时器", t.value)
    }, 1000)
  } catch (error) {
    console.log("发生错误：")
    console.error(error)
    t.value = 61
    clearInterval(timer1.value)
    console.log("倒计时已清除")
    isDisabled.value = false
  }
}

//显示隐私政策
const showPolicy = () => titleDiv.showNotice({ show_num: 1, active_num: 3 })

//region提交表单，再次判断表单验证是否通过
const submitForm = async () => {
  //设置按钮禁用
  isLoading.value = true

  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate(async (res) => {
    if (res) {
      //此处调用register()上传
      await register()
    }
    // else {
    // ElMessage.error('操作失败')
    // }
    isLoading.value = false
  })
}

//提交注册信息
const register = async () => {
  try {
    //解决点击注册后马上切换导致误通过的BUG
    if (!ruleForm.policy) return
    const isOK = await api_register(ruleForm)
    if (!isOK) return
    resetForm() //清除表单
    //打开登录界面
    toLogin(true)
  } catch (error) {
    console.error(error)
    // ElMessage.error('出现错误', error.message)
  }
}

//endregion

//region重置表单
const resetForm = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.resetFields()
}

//把重置表单暴露给父组件
defineExpose({ submitForm })

//endregion

onUnmounted(() => {
  clearInterval(timer1.value)
  console.log("倒计时已清除")
})
</script>

<style scoped>
.submitBtn {
  margin: 30px auto 10px;
  width: 70%;
  height: 50px;
  font-size: 18px;
}
</style>
