<template>
  <!-- <div class="loginForm">
    <h2>Admin Login</h2>
    <div class="user-box">
      <input v-model.lazy.trim="ruleForm.email" name="email" required type="text" />
      <label>Email</label>
    </div>
    <div class="user-box">
      <input name="password" required type="password" />
      <label>Password</label>
    </div>
    <div>
      <el-button :loading="loading" @click="resetForm(ruleFormRef)">Reset</el-button>
      <el-button :loading="loading" @click="submitForm(ruleFormRef)">Login</el-button>
    </div>
  </div> -->
  <el-form
    v-show="true"
    ref="ruleFormRef"
    class="loginForm"
    label-position="left"
    label-width="auto"
    :model="ruleForm"
    :rules="Rules"
    status-icon
  >
    <h2>Admin Login</h2>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model.lazy.trim="ruleForm.email" clearable />
    </el-form-item>
    <el-form-item label="密码" prop="password" class="password">
      <el-input v-model.lazy.trim="ruleForm.password" type="password" clearable @keyup.enter="submitForm(ruleFormRef)" />
    </el-form-item>
    <div class="btn">
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)">登录</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from "vue"
import { useRouter } from "vue-router"
import type { FormInstance, FormRules } from "element-plus"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import verifyRules from "@/utils/verifyRules"
import { api_login_admin } from "@/apis/admin/login"

const router = useRouter()
const userInfoStore = useUserInfoStore()

const { isAdmin } = toRefs(userInfoStore)

//管理员登录判断
if (isAdmin.value) router.replace({ name: "adminUsersManagement" })

//表单数据
const ruleForm = reactive({
  email: "",
  password: "",
})

//region表单验证逻辑
const ruleFormRef = ref<FormInstance>()

//用哪些表单验证规则
const Rules = ref<FormRules<typeof ruleForm>>({
  email: [{ validator: verifyRules.email, required: true, trigger: "blur" }],
  password: [{ validator: verifyRules.password, required: true, trigger: "blur" }],
})
//endregion

//region 提交表单,登录或注册
//再次通过formEL的值判断表单验证是否通过
const loading = ref(false)
const submitForm = async (formEL: FormInstance | undefined) => {
  //设置按钮两秒禁用
  loading.value = true
  const isOk = await formEL?.validate()
  if (isOk) await login()
  loading.value = false
}

//endregion

//region重置表单
const resetForm = (formEL: FormInstance | undefined) => {
  if (!formEL) return
  formEL.resetFields()
}
//endregion

//region登录账号
const login = async () => {
  try {
    const userInfo = await api_login_admin(ruleForm)
    loading.value = false
    if (!userInfo) return
    ElMessage.success(`管理员 ${userInfo.username} 登录成功`)
    userInfoStore.updateLocalUserInfo(userInfo, true)
    router.replace({ name: "adminUsersManagement" })
  } catch (error) {
    console.log("发生错误：")
    console.log(error)
  }
}

//endregion
</script>

<style scoped>
.loginForm {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}

.loginForm h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.loginForm .user-box {
  position: relative;
}

.loginForm .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.loginForm .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.loginForm .user-box input:focus ~ label,
.loginForm .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

.loginForm form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
}

.el-button {
  background-color: transparent;
  color: whitesmoke;
  border: none;
  font-size: 16px;
}

.el-button:hover {
  background-color: transparent;
  color: var(--el-color-primary);
  scale: 1.2;
}
@media (max-width: 780px) {
  .loginForm {
    height: 100%;
    width: 100%;
    padding-top: 50%;
  }
}

/* 输入框内部透明(自动填充时) */
.el-input :deep(.el-input__inner:-webkit-autofill) {
  background-color: transparent !important;
  transition: all 5000s ease-in-out 0s; /*通过延时渲染背景色变相去除背景颜色*/
}
/* 输入框透明 */
.el-input :deep(.el-input__wrapper),
.el-input :deep(.el-input__inner) {
  background-color: transparent;
  color: #fff; /* 这里改成你想要的颜色 */
}
</style>
