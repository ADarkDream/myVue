<template>
  <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="(Rules)"
      label-width="auto"
      class="demo-ruleForm"
      label-position="top"
  >
    <el-form-item prop="username" v-if="!loginFlag">
      <el-input v-model.lazy.trim="ruleForm.username" placeholder="输入昵称"/>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model.lazy.trim="ruleForm.email" placeholder="输入邮箱" autocomplete="off"/>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model.lazy.trim="ruleForm.password" type="password" autocomplete="off" placeholder="输入密码"/>
    </el-form-item>
    <el-form-item prop="checkPassword" v-if="!loginFlag">
      <el-input v-model.lazy.trim="ruleForm.checkPassword" type="password" autocomplete="off" placeholder="确认密码"/>
    </el-form-item>
    <el-form-item prop="emailCode" v-if="!loginFlag">
      <el-input v-model.lazy.trim="ruleForm.emailCode" style="width:75%;" autocomplete="off"
                placeholder="输入邮箱验证码，注意大小写"/>
      <el-button type="primary" :disabled="isDisabled" @click="getEmailCode()" style="width: 25%;">{{ getStr }}
      </el-button>
    </el-form-item>
    <div class="btn">
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading" v-if="loginFlag">登录</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading" v-else>注册</el-button>
      <el-button type="primary" @click="toRegister()" v-if="loginFlag&&noAccount">前往注册</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import {ElMessage, type FormInstance, type FormRules} from 'element-plus'
import axios from "axios";


//表单数据
const ruleForm = reactive({
  username: '',
  email: '',
  password: '',
  checkPassword: '',
  emailCode: ''
})


//region表单验证逻辑
const ruleFormRef = ref<FormInstance>()

//验证昵称
const checkUserName = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('昵称不能为空，请输入2-10位中文、字母、或数字！'))
  }
  setTimeout(() => {
    let reg = /[^\u4E00-\u9FA5a-zA-Z0-9]/i;
    if (reg.test(value) || value.length > 10 || value.length < 2) {
      callback(new Error('请输入2-10位中文、字母、或数字！'))
    } else {
      callback()
    }
  }, 1000)
}
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
//确认密码
const validatePassword2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码！'))
  } else if (value !== ruleForm.password) {
    callback(new Error("两次输入的密码不匹配！"))
  } else {
    callback()
  }
}
//验证邮箱验证码
const checkEmailCode = (rule: any, value: any, callback: any) => {
  if (value === '') {
    return callback(new Error('请输入邮箱验证码，大小写敏感！'))
  } else if (value.length !== 6) {
    return callback(new Error("邮箱验证码位数错误！"))
  } else {
    callback()
  }
}
//用哪些表单验证规则
let Rules = reactive<FormRules<typeof ruleForm>>({})

//endregion


//region接收信号(flag)，选择注册(false)或登录(true)
const {flag, setTitle} = defineProps(['flag', 'setTitle'])
const loginFlag = ref<boolean>(flag || false) //当前是否是登录页
const noAccount = ref(false)
const toRegister = () => {
  resetForm(ruleFormRef.value)//清除表单
  loginFlag.value = false
  checkFlag()
  noAccount.value=false
}


const checkFlag = () => {
  if (loginFlag.value) {
    setTitle('登录')
    //自动填入email地址
    ruleForm.email = sessionStorage.getItem('email') || ''
    //更改表单验证规则
    Rules = {
      email: [{validator: checkEmail, trigger: 'blur'}],
      password: [{validator: validatePassword, trigger: 'blur'}],
    }
  } else {
    setTitle('注册')
    Rules = {
      username: [{validator: checkUserName, trigger: 'blur'}],
      email: [{validator: checkEmail, trigger: 'blur'}],
      password: [{validator: validatePassword, trigger: 'blur'}],
      checkPassword: [{validator: validatePassword2, trigger: 'blur'}],
      emailCode: [{validator: checkEmailCode, trigger: 'blur'}],
    }
  }
}


//endregion
// 获取邮箱验证码
const isDisabled = ref(false)
const getStr = ref('获取')
const t = ref(61)
const timer1 = ref(null)
const timer2 = ref(null)

const getEmailCode = async () => {
  try {
    const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i;
    if (!reg.test(ruleForm.email)) return ElMessage.error('邮箱格式不正确，请重新输入！')

    timer1.value = setInterval(() => {
      t.value--
      isDisabled.value = true
      getStr.value = `${t.value}秒后获取`
      console.log('定时器', t.value)
    }, 1000)

    timer2.value = setTimeout(() => {
      t.value = 61
      isDisabled.value = false
      clearInterval(timer1.value)
      getStr.value = '获取'
    }, 61000)

    const result = await axios({
      url: '/getEmailCode',
      method: 'POST',
      data: {email: ruleForm.email}
    })
    ElMessage.success(result.data.msg)
  } catch (error) {
    console.log('发生错误：')
    console.error(error)
    // ElMessage.error('发生错误')
  }
}


//region 提交表单,登录或注册
//再次通过formEL的值判断表单验证是否通过
const loading = ref(false)
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
      loginFlag.value ? login() : register()
    } else {
      // ElMessage.error('操作失败')
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


//region提交注册信息
const register = async () => {
  try {
    const {username, email, password} = ruleForm
    const result = await axios({
      url: '/register',
      method: 'post',
      data: {
        username,
        email: email.toLowerCase(),
        password,
        code: ruleForm.emailCode
      }
    })
    console.log(result)
    const {msg} = result.data
    //成功提示信息
    ElMessage.success(msg)
    sessionStorage.setItem('email', email)
    // setTimeout(() => {
    //   location.reload()
    // }, 2000)
    resetForm(ruleFormRef.value)//清除表单
    loginFlag.value = true
    checkFlag()
  } catch (error) {
    console.error(error)
    // ElMessage.error('出现错误', error.message)
  }
}

//endregion

//region登录账号
const login = async () => {
  try {
    const {email, password} = ruleForm
    const result = await axios({
      url: '/login',
      method: 'post',
      data: {
        email: email.toLowerCase(),
        password
      }
    })
    console.log(result)
    const {userInfo} = result.data
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    //成功提示信息
    ElMessage.success(`用户 ${userInfo.username} 登录成功`)
    sessionStorage.setItem('isLogin', '1')
    setTimeout(() => {
      location.reload()
      // router.replace({name:"home"})
    }, 1000)
  } catch (error) {
    console.error(error)
    noAccount.value = true
    // ElMessage.error(error.msg)
  }
}

//endregion

onMounted(() => {
  checkFlag()
})

onUnmounted(() => {
  clearInterval(timer1.value)
  clearTimeout(timer2.value)
  console.log('计时器和倒计时已清除')
})

</script>


<style scoped>


.btn {
  display: flex;
  justify-content: center;
}

</style>
