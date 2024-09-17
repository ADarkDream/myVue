<template>
  <el-dialog
      v-model="centerDialogVisible"
      title="管理员登录界面"
      align-center
      width="500"
      style="opacity: 0.8;"
      :show-close="false"
  >
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="(Rules)"
          label-width="auto"
          label-position="top"
      >

        <el-form-item prop="email">
          <el-input v-model.lazy.trim="ruleForm.email" placeholder="输入邮箱"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model.lazy.trim="ruleForm.password" @keyup.enter="submitForm(ruleFormRef)" type="password"
                    autocomplete="off" placeholder="输入密码"/>
        </el-form-item>


        <div class="btn">
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading">登录</el-button>
        </div>
      </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import axios from "axios";
import {reactive, ref} from 'vue'
import {ElMessage, type FormInstance, type FormRules} from 'element-plus'

import {useRouter} from "vue-router";
import useResponsive from "@/hooks/useResponsive";
import useUserInfo from "@/hooks/useUserInfo";
const {isPC} =useResponsive()
const {isAdmin} = useUserInfo()
const router = useRouter()

const centerDialogVisible = ref(true)
//管理员登录判断
if (isAdmin.value) router.replace({name: 'adminUsersManagement'})


//表单数据
const ruleForm = reactive({
  email: '',
  password: '',
})


//region表单验证逻辑
const ruleFormRef = ref<FormInstance>()


//验证邮箱
const checkEmail = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('邮箱不能为空！请输入邮箱地址！'))
  }
  setTimeout(() => {
    let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i;
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱地址！'))
    } else {
      callback()
    }
  }, 1000)
}
//验证密码
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('密码不能为空！请输入密码！'))
  }
  setTimeout(() => {
        let reg = /^([A-Za-z\d\-&.,()\s]+)+$/i;
        if (!reg.test(value) || value.length < 6 || value.length > 18) {
          callback(new Error('请输入6-18位不含特殊字符的密码！'))
        } else {
          callback()
        }
      }, 1000
  )
}


//用哪些表单验证规则
const Rules = reactive<FormRules<typeof ruleForm>>({
  email: [{validator: checkEmail, trigger: 'blur'}],
  password: [{validator: validatePassword, trigger: 'blur'}],

})
//endregion


//region 提交表单,登录或注册
//再次通过formEL的值判断表单验证是否通过
let loading = ref(false)
const submitForm = (formEL: FormInstance | undefined) => {
  //设置按钮两秒禁用
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
  if (!formEL) return
  formEL.validate((res) => {
    if (res) {

      //此处调用axios上传
      login()
    } else {
      ElMessage.error('操作失败')
      return false
    }
  })
}


//endregion

//region重置表单
const resetForm = (formEL: FormInstance | undefined) => {
  if (!formEL) return
  formEL.resetFields()
}
//把重置表单暴露给父组件
defineExpose({resetForm})
//endregion


//region登录账号
function login() {
  // console.log('login')
  const {email, password} = ruleForm
  axios({
    url: '/login',
    method: 'post',
    data: {
      isAdmin: true,
      email: email.toLowerCase(),
      password
    }
  }).then((result) => {
    console.log(result)
    const {userInfo} = result.data
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    //成功提示信息
    ElMessage.success(`管理员  ${userInfo.username} 登录成功`)
    sessionStorage.setItem('isLogin', '1')
    sessionStorage.setItem('isAdmin', '1')
    //刷新当前页面，解决TitleDiv不更新的问题
    location.reload()
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}

//endregion


</script>


<style scoped>
.el-form {
  width: 50%;
  margin: 5% 25%;
}

.btn {
  display: flex;
  justify-content: center;
}

@media (max-width: 980px) {
  .el-form {
    width: 80%;
    margin: 3% auto;
  }

  .el-input {
    width: 100%;
  }
}
</style>
