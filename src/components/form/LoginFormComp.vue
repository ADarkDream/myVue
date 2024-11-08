<template>
  <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="Rules" label-width="auto" class="loginForm"
    label-position="top">
    <el-form-item prop="email">
      <el-input v-model.lazy.trim="ruleForm.email" placeholder="输入邮箱" autocomplete="off" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model.lazy.trim="ruleForm.password" type="password" autocomplete="off" placeholder="输入密码" />
    </el-form-item>
    <el-form-item prop="policy" autocomplete="off">
      <input type="checkbox" v-model="ruleForm.policy">&ensp;我已阅读并同意
      <el-button link type="primary" @click="showPolicy">隐私政策</el-button>
      <el-button style="position: absolute;right: 0" link @click="resetForm()">重置表单</el-button>
    </el-form-item>
    <p class="other_login_div">
      <el-text>其他登录方式(申请中)：</el-text>
      <img src="@/assets/titleDiv/qq_login.png" style="width: 20px;" @click='to_qq_login()' />
    </p>
    <el-button class="submitBtn" @click="submitForm()" :loading="isLoading">登录</el-button>
    <br>
    <el-link @click="toLogin(false)">前往注册</el-link>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import axios from "axios";
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
//utils
import verifyRules from "@/utils/verifyRules";
import titleDiv from '@/utils/titleDiv';
//types
import type { loginForm } from "@/types/form";

const { showNotice, to_qq_login } = titleDiv

const userInfoStore = useUserInfoStore()
const { updateLocalUserInfo } = userInfoStore
const ruleFormRef = ref<FormInstance>()

/**
 * 跳转到QQ登录
 */
// const to_qq_login = () => {
//   const oOpts = {
//     appId: "102476068",
//     redirectURI: "https://muxidream.cn/connect_qq/callback"
//   }
//   QC.Login.showPopup(oOpts)
// }

//表单数据
const ruleForm = reactive<loginForm>({
  email: '',
  password: '',
  policy: false
})

//用哪些表单验证规则
const Rules = ref<FormRules<typeof ruleForm>>({
  email: [{ validator: verifyRules.email, required: true, trigger: 'blur' }],
  password: [{ validator: verifyRules.password, required: true, trigger: 'blur' }],
  policy: [{ validator: verifyRules.policy, required: true, trigger: 'blur' }]
})

//切换loading状态
const { toLogin } = defineProps(['toLogin'])
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
      //此处调用axios上传
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
    const { email, password } = ruleForm
    const result = await axios({
      url: '/login',
      method: 'post',
      data: {
        email: email.toLowerCase(),
        password
      }
    })

    console.log(result.data)

    const { userInfo } = result.data
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
</style>
