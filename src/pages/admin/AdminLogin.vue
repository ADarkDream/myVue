<template>
  <div class="loginForm">
    <h2>Admin Login</h2>
    <div class="user-box">
      <input type="text" v-model.lazy.trim="ruleForm.email" name="" required>
      <label>Email</label>
    </div>
    <div class="user-box">
      <input type="password" name="" required>
      <label>Password</label>
    </div>
    <div>
      <el-button @click="submitForm(ruleFormRef)" :loading="loading">Login</el-button>
    </div>
  </div>
  <el-form ref="ruleFormRef" v-show="false" :model="ruleForm" status-icon :rules="Rules" label-width="auto"
    class="loginForm" label-position="top">

    <el-form-item prop="email" class="user-box">
      <el-input v-model.lazy.trim="ruleForm.email" autocomplete="off" />
      <label>输入邮箱</label>
    </el-form-item>
    <el-form-item prop="password" class="user-box">
      <el-input v-model.lazy.trim="ruleForm.password" @keyup.enter="submitForm(ruleFormRef)" type="password"
        autocomplete="off" />
      <label>输入密码</label>
    </el-form-item>
    <!-- <div class="btn">
    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading">登录</el-button>
  </div>-->
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from 'element-plus'
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import verifyRules from "@/utils/verifyRules";
import { api_login_admin } from "@/apis/admin";


const router = useRouter()
const userInfoStore = useUserInfoStore()


const { isAdmin } = toRefs(userInfoStore)


//管理员登录判断
if (isAdmin.value) router.replace({ name: 'adminUsersManagement' })


//表单数据
const ruleForm = reactive({
  email: '',
  password: '',
})


//region表单验证逻辑
const ruleFormRef = ref<FormInstance>()



//用哪些表单验证规则
const Rules = ref<FormRules<typeof ruleForm>>({
  email: [{ validator: verifyRules.email, required: true, trigger: 'blur' }],
  password: [{ validator: verifyRules.password, required: true, trigger: 'blur' }]
})
//endregion


//region 提交表单,登录或注册
//再次通过formEL的值判断表单验证是否通过
const loading = ref(false)
const submitForm = async (formEL: FormInstance | undefined) => {
  //设置按钮两秒禁用
  loading.value = true
  const isOk = await formEL?.validate()
  if (!isOk) {
    loading.value = false
    return
  } else {
    await login()
  }
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
    const { data } = await api_login_admin(ruleForm)
    loading.value = false
    if (!data) return
    const { userInfo } = data
    ElMessage.success(`管理员  ${userInfo.username} 登录成功`)
    userInfoStore.updateLocalUserInfo(userInfo)
    router.replace({ name: 'adminUsersManagement' })
  } catch (error) {
    console.log('发生错误：')
    console.log(error)
  }
}

//endregion


</script>


<style scoped>
.loginForm {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, .5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
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
  transition: .5s;
}

.loginForm .user-box input:focus~label,
.loginForm .user-box input:valid~label {
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
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 4px
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
</style>
