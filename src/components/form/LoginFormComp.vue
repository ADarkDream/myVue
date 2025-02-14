<template>
  <el-form
    ref="ruleFormRef"
    class="loginForm"
    label-position="top"
    label-width="auto"
    :model="ruleForm"
    :rules="Rules"
    status-icon
  >
    <el-form-item prop="email">
      <el-input v-model.lazy.trim="ruleForm.email" autocomplete="off" placeholder="输入邮箱" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model.lazy.trim="ruleForm.password" autocomplete="off" placeholder="输入密码" type="password" />
    </el-form-item>
    <el-form-item autocomplete="off" prop="policy">
      <input v-model="ruleForm.policy" type="checkbox" /><el-text> &ensp;我已阅读并同意</el-text>
      <el-button link type="primary" @click="showPolicy">隐私政策</el-button>
      <el-button link style="position: absolute; right: 0" @click="resetForm()">重置表单</el-button>
    </el-form-item>
    <p class="other_login_div">
      <el-text>其他登录方式：</el-text>
      <img
        alt="QQ登录_小窗口"
        class="login_icon"
        src="@/assets/titleDiv/qq_login.png"
        title="小窗口"
        @click="login_by_qq(true)"
      />
      <!-- <img class="login_icon" src="@/assets/titleDiv/qq_login.png" @click='login_by_qq()' alt="QQ登录_新窗口" title="新窗口" /> -->
    </p>
    <el-button class="submitBtn" :loading="isLoading" @click="submitForm()">登录</el-button>
    <br />
    <el-link @click="toLogin(false)">前往注册</el-link>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import type { FormInstance, FormRules } from "element-plus"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
//hooks
import useOAuth from "@/hooks/user/useOAuth"
//apis
import { api_login } from "@/apis/user/login"
//utils
import verifyRules from "@/utils/verifyRules"
import titleDiv from "@/utils/titleDiv"
//types
import type { loginForm } from "@/types/form"

const { showNotice } = titleDiv
const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const { updateLocalUserInfo } = userInfoStore
const { isPC } = toRefs(responsiveStore)
const { to_qq_oauth } = useOAuth()

const ruleFormRef = ref<FormInstance>()

/**
 * 跳转到QQ登录
 */
const login_by_qq = (is_oauth = false) => {
  ElMessage.info("先注册邮箱，再绑定QQ，然后才能使用QQ登录")
  if (!ruleForm.policy) return ElMessage.error("请先阅读并勾选隐私政策！")
  to_qq_oauth({ is_oauth, isPC: isPC.value })
}

//表单数据
const ruleForm = reactive<loginForm>({
  email: "",
  password: "",
  policy: false,
})

//用哪些表单验证规则
const Rules = ref<FormRules<typeof ruleForm>>({
  email: [{ validator: verifyRules.email, required: true, trigger: "blur" }],
  password: [{ validator: verifyRules.password, required: true, trigger: "blur" }],
  policy: [{ validator: verifyRules.policy, required: true, trigger: "blur" }],
})

//切换loading状态
const { toLogin } = defineProps(["toLogin"])
const isLoading = ref(false)

//显示隐私政策
const showPolicy = () => showNotice({ show_num: 1, active_num: 3 })

//提交表单，再次判断表单验证是否通过
const submitForm = async () => {
  //设置按钮禁用
  isLoading.value = true

  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate(async (res) => {
    if (res) {
      //此处调用momo上传
      await login()
    }
    // else {
    // ElMessage.error('操作失败')
    // }
    isLoading.value = false
  })
}

//region重置表单
const resetForm = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.resetFields()
}

//把重置表单暴露给父组件
defineExpose({ submitForm })
//endregion

//region登录账号
const login = async () => {
  try {
    //解决点击登录后马上切换导致误通过的BUG
    if (!ruleForm.policy) return
    ruleForm.email = ruleForm.email.toLowerCase()
    const userInfo = await api_login(ruleForm)
    if (!userInfo) return
    updateLocalUserInfo(userInfo)
    //成功提示信息
    ElMessage.success(`用户 ${userInfo.username} 登录成功`)
    setTimeout(() => {
      location.reload()
      // router.replace({ name: "home" })
    }, 1000)
  } catch (error) {
    console.error(error)
    // ElMessage.error(error.msg)
  }
}

//endregion
</script>

<style scoped>
.submitBtn {
  margin: 30px auto 10px;
  width: 70%;
  height: 50px;
  font-size: 18px;
}

.other_login_div {
  display: flex;
  align-items: center;
}

.login_icon {
  width: 20px;
  margin: 0 5px;
}
</style>
