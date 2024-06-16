<template>
  <el-container>
    <el-header class="header1">
      用户信息
    </el-header>
    <el-main class="info">
      <el-card class="cards" shadow="hover" @click="goArticleManagement">
        <template #header>发布</template>
        {{ articleNum }}
      </el-card>
      <el-card class="cards" shadow="hover" @click="goArticleManagement">
        <template #header>未发布</template>
        {{ noSubmitArticleNum }}
      </el-card>
      <el-card class="cards" shadow="hover" @click="goArticleManagement">
        <template #header>草稿箱</template>
        {{draftNum}}
      </el-card>
      <el-card class="cards" shadow="hover">
        <template #header>评论</template>
        {{ commentNum }}
      </el-card>
      <el-card class="textareaDiv" shadow="hover">
        <el-divider>个人简介</el-divider>
        <el-input class="textarea" v-model="newSignature" @blur="isUpdateSignature" @keyup.enter="editSignature"
                  type="textarea" maxlength="50" show-word-limit placeholder="请留下你的足迹……"/>
      </el-card>
    </el-main>

    <el-aside class="user" shadow="hover">
      <!--头像框-->
      <el-avatar :size="150" title="更换头像" :src="headImgUrl" @error="errorImage" @click="dialogVisible=true"/>
      <br>
      <el-button text v-show="isDisabled" @click="isDisabled = false" title="修改昵称" :icon="Edit">{{
          username
        }}
      </el-button>
      <el-input v-model.trim="newName" @keyup.enter="checkNewName(newName)" @blur="isUpdateName" v-show="!isDisabled"
                :placeholder="username" minlength="2" maxlength="10" show-word-limit/>
      <div class="account">
        <el-space spacer="|">
          <el-button @click="editEmailForm">修改邮箱</el-button>
          <el-button @click="editPasswordForm">修改密码</el-button>
        </el-space>
      </div>
      <el-divider/>
      <el-button @click="getUserInfo" type="primary">刷新信息</el-button>
      <el-button shadow="hover" type="danger" @click="deleteUserForm">
        注销账号
      </el-button>

    </el-aside>
  </el-container>

  <!-- 用户昵称修改框-->
  <el-dialog v-model="editNameFormVisible" title="修改昵称" width="500" class="change">
    <el-form
        style="max-width: 600px"
        status-icon
        label-width="auto"
        label-position="left"
    >
      <el-form-item>
        <el-input v-model="newName" @keyup.enter="checkNewName(newName)" placeholder="输入新的昵称"/>
      </el-form-item>

      <div class="btn">
        <el-button plain @click="editNameFormVisible = false">取消</el-button>
        <el-button type="primary" @click="checkNewName(newName)" :loading="loading">修改</el-button>
      </div>
    </el-form>
  </el-dialog>

  <!-- 用户修改框-->
  <el-dialog v-model="dialogFormVisible" :title="titleStr" width="500" :before-close="handleClose" class="change">
    <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        status-icon
        :rules="(Rules)"
        label-width="auto"
        label-position="left"
    >
      <el-form-item prop="email" label="输入邮箱：">
        <el-input v-model.lazy.trim="ruleForm.email" placeholder="输入邮箱"/>
      </el-form-item>
      <el-form-item prop="password" label="输入密码：">
        <el-input v-model.lazy.trim="ruleForm.password" type="password" autocomplete="off" placeholder="输入密码"/>
      </el-form-item>
      <!--      修改邮箱-->
      <el-form-item prop="newEmail" label="输入新邮箱：" :rules="[{validator: checkNewEmail, trigger: 'blur'}]"
                    v-if="editEmailBtnFlag">
        <el-input v-model.lazy.trim="ruleForm.newEmail" placeholder="输入新邮箱"/>
      </el-form-item>
      <!--      修改密码-->
      <el-form-item prop="newPassword" label="输入新密码：" :rules="[{validator: checkNewPassword, trigger: 'blur'}]"
                    v-if="editPasswordBtnFlag">
        <el-input v-model.lazy.trim="ruleForm.newPassword" type="password" autocomplete="off" placeholder="输入新密码"/>
      </el-form-item>
      <!--      注销账户-->
      <el-form-item prop="checkPassword" label="确认密码：" :rules="[{validator: validatePassword2, trigger: 'blur'}]"
                    v-if="deleteUserFlag">
        <el-input v-model.lazy.trim="ruleForm.checkPassword" type="password" autocomplete="off" placeholder="确认密码"/>
      </el-form-item>
      <div class="btn">
        <el-button plain @click="hideForm">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef,0)" :loading="loading" v-if="editEmailBtnFlag">
          修改邮箱
        </el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef,1)" :loading="loading" v-if="editPasswordBtnFlag">
          修改密码
        </el-button>
        <el-button type="danger" @click="submitForm(ruleFormRef,2)" :loading="loading" v-if="deleteUserFlag">
          注销
        </el-button>
      </div>
    </el-form>
  </el-dialog>
  <!--图片上传框-->
  <el-dialog v-model="dialogVisible" :show-close="false" title="上传图片">
    <UploadImage/>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue';
import axios from "axios";
import {ElMessage, ElMessageBox, FormInstance, FormRules} from "element-plus";
import {Edit} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";

import useUserInfo from '@/hooks/useUserInfo'
import UploadImage from "@/components/UploadImage.vue";
import emitter from "@/utils/emitter";


const router = useRouter()
function goArticleManagement(){
  emitter.emit('pageRender',2);
     router.push({name:'userManagement'})
}

//获取本地存储的用户信息
const {
  getLocalUserInfo,
  updateLocalUserInfo,
  errorImage,
  signature,
  userInfo,
  email,
  username,
  headImgUrl
} = useUserInfo()


//获取用户信息
function getUserInfo() {
  axios({
    url: '/getUserInfo',
  }).then(result => {
    console.log(result)
    const {status, userInfo, msg} = result.data
    if (status === 200) ElMessage.success(msg)
    // console.log(userInfo)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    setTimeout(() => {
      location.reload()
    }, 1500)
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}

getArticleList()
getDraftList()
getUserComments()
//用户的评论数量
const commentNum = ref()
//用户的发布的文章数量
const articleNum = ref()
//用户的未发布的文章数量
const noSubmitArticleNum = ref()
//用户的的草稿数量
const draftNum = ref()

//获取用户评论信息
function getUserComments() {
  axios({
    url: '/getTheComments',
  }).then(result => {
    console.log(result)
    const {status, data, msg} = result.data
    commentNum.value = data.length
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}

//获取用户文章列表
function getArticleList() {
  axios({
    url: '/getUserArticleList',
    params: {
      isSubmit: true
    }
  }).then(result => {
    // console.log(result)
    const list = result.data.list
    const articleList = reactive([])
    const noSubmitArticleList = reactive([])
    //添加新数据
    list.forEach(item => {
      if (Number(item.status) === 1) articleList.push(item)//审核通过的
      else noSubmitArticleList.push(item)//待审核的
    })
    articleNum.value = articleList.length
    noSubmitArticleNum.value = noSubmitArticleList.length

  }).catch(error => {
    console.dir('发生错误：' + error)
  })
}

//获取用户草稿列表
function getDraftList() {
  axios({
    url: '/getDraftList',
  }).then(result => {
    if (result.data.list!==undefined) draftNum.value = result.data.list.length
    else draftNum.value = 0
  }).catch(error => {
    console.log('发生错误：' )
    console.log(error)
  })
}


//region 修改头像,控制上传框是否显示
let dialogVisible = ref(false)


//新的个性签名
let newSignature = ref(signature.value)


//修改个性签名
function editSignature() {
  axios({
    url: '/updateSignature',
    method: 'post',
    data: {signature: newSignature.value.trim()}
  }).then(result => {
    console.log(result)
    const {data} = result.data
    updateLocalUserInfo({signature: data})
    newSignature.value = data
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}

//确认是否修改个性签名
const isUpdateSignature = () => {
  if (newSignature.value === getLocalUserInfo('signature')) return
  ElMessageBox.alert(
      '是否上传修改之后的个性签名？',
      '请确认',
      {
        cancelButtonText: '取消修改',
        confirmButtonText: '上传更新',
        type: 'info',
        showCancelButton: true,
        showClose: false
      }
  )
      .then(() => {
        editSignature()
      })
      .catch(() => {
        newSignature.value = getLocalUserInfo('signature')
        ElMessage.info('个性签名已还原')
      })
}

//确认是否修改昵称
const isUpdateName = () => {
  if (newName.value === getLocalUserInfo('username')) return isDisabled.value = true
  ElMessageBox.alert(
      '是否上传修改之后的昵称？',
      '请确认',
      {
        cancelButtonText: '取消修改',
        confirmButtonText: '上传更新',
        type: 'info',
        showCancelButton: true,
        showClose: false
      }
  )
      .then(() => {
        checkNewName(newName.value)
      })
      .catch(() => {
        isDisabled.value = true
        newName.value = getLocalUserInfo('username')
        ElMessage.info('昵称已还原')
      })
}
//region修改用户账号信息
let newName = ref(username.value)

let titleStr = ref('')
//表单数据
const ruleForm = reactive({
  email: '',
  newEmail: '',
  password: '',
  checkPassword: '',
  newPassword: '',
  edit: ''
})


//region表单验证逻辑
const ruleFormRef = ref<FormInstance>()
//验证邮箱
const checkEmail = (rule: any, value: any, callback: any) => {
  const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i;
  if (!value) {
    return callback(new Error('邮箱不能为空！请输入邮箱地址！'))
  } else if (value !== email.value) {
    return callback(new Error('输入的邮箱与本账号邮箱不匹配！'))
  } else if (!reg.test(value)) {
    callback(new Error('请输入正确的邮箱地址！'))
  } else {
    callback()
  }

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

//修改：新昵称
const checkNewName = (value: string) => {
  const reg = /[^\u4E00-\u9FA5a-zA-Z0-9]/i;
  if (!value) return ElMessage.error('昵称不能为空，请输入2-10位中文、字母、或数字！')
  else if (value === username.value) return ElMessage.error('新昵称不能与旧昵称相同')
  else if (reg.test(value) || value.length > 10 || value.length < 2) ElMessage.error('请输入2-10位中文、字母、或数字！')
  else updateUser({username: newName.value}, '/updateUserName')
}
//修改：新邮箱
const checkNewEmail = (rule: any, value: any, callback: any) => {
  const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i;
  if (!value) return callback(new Error('邮箱不能为空！请输入邮箱地址！'))
  else if (value === ruleForm.email) callback(new Error("新邮箱不能与旧邮箱相同！"))
  else if (!reg.test(value)) callback(new Error('请输入正确的邮箱地址！'))
  else callback()
}
//修改：新密码
const checkNewPassword = (rule: any, value: any, callback: any) => {
  const reg = /^([A-Za-z\d\-&.,()\s]+)+$/i;
  if (!value) callback(new Error('新密码不能为空！请输入密码！'))
  else if (value === ruleForm.password) callback(new Error("新密码不能与旧密码相同！"))
  else if (!reg.test(value) || value.length < 6 || value.length > 18) callback(new Error('请输入6-18位不含特殊字符的密码！'))
  else callback()
}
//注销：确认密码
const validatePassword2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码！'))
  } else if (value !== ruleForm.password) {
    callback(new Error("两次输入的密码不匹配！"))
  } else {
    callback()
  }
}


//表单验证规则
let Rules = reactive<FormRules<typeof ruleForm>>({
  email: [{validator: checkEmail, trigger: 'blur'}],
  password: [{validator: validatePassword, trigger: 'blur'}],
})


// 提交表单,登录或注册,再次通过data的值判断表单验证是否通过
let loading = ref(false)
const submitForm = (data: FormInstance | undefined, flag: number) => {
  //设置按钮两秒禁用
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
  if (!data) return
  data.validate((res) => {
    if (res) {
      //此处调用axios上传
      console.log(ruleForm)
      if (flag === 0) {
        ruleForm.edit = 'email'
        updateUser(ruleForm, '/updateUserAcc')
      } else if (flag === 1) {
        ruleForm.edit = 'password'
        updateUser(ruleForm, '/updateUserAcc')
      } else if (flag === 2) deleteUser()
    } else {
      ElMessage.error('规则验证失败')
      return false
    }
  })
}


//修改账号信息
function updateUser(data, url: string) {
  // console.log(data)
  axios({
    url,
    method: 'post',
    data
  }).then((result) => {
    const {msg, flag, data} = result.data
    ElMessage.success(msg)
    //修改昵称，刷新页面
    if (flag === 0) {
      updateLocalUserInfo({username: data})
      location.reload()
    }
    //修改邮箱或密码，重新登录
    else if (flag === 1) {
      updateLocalUserInfo({email: data})
      setTimeout(() => {
        sessionStorage.setItem('isLogin', '0')
        localStorage.removeItem('token')
        location.href = '/'
      }, 1000)
    }
  }).catch(error => {
    if (error.status === 400) ElMessage.error(error.msg)
    console.log(error)
  })
}

//注销账号
function deleteUser() {
  const {email, password} = ruleForm
  axios({
    url: '/deleteUser',
    method: 'delete',
    data: {
      email: email.toLowerCase(),
      password
    }
  }).then((result) => {
    console.log(result)
    ElMessage.success(result.data.msg)
    localStorage.clear()
    sessionStorage.clear()
    setTimeout(() => {
      location.href = '/'
    }, 2000)
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}


//修改昵称的窗口显示
let isDisabled = ref(true)
let editNameFormVisible = ref(false)
//修改用户信息窗口的显示
let dialogFormVisible = ref(false)

//修改邮箱的输入框显示
let editEmailBtnFlag = ref(false)
//修改密码的输入框显示
let editPasswordBtnFlag = ref(false)
//注销账户的输入框显示
let deleteUserFlag = ref(false)


//关闭修改窗口时调用
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('你要取消操作吗?')
      .then(() => {
        done()
        hideForm()
      })
      .catch(() => {
        // catch error
      })
}

//显示修改窗口并设置为修改邮箱窗口
function editEmailForm() {
  titleStr.value = '修改邮箱'
  // Object.assign(Rules, {newEmail: [{validator: checkNewEmail, trigger: 'blur'}]})
  dialogFormVisible.value = true
  editEmailBtnFlag.value = true
}


//显示修改窗口并设置为修改密码窗口
function editPasswordForm() {
  titleStr.value = '修改密码'
  dialogFormVisible.value = true
  editPasswordBtnFlag.value = true
}

//显示修改窗口并设置为注销窗口
function deleteUserForm() {
  titleStr.value = '注销账户'
  dialogFormVisible.value = true
  deleteUserFlag.value = true
}

//隐藏修改窗口并去除输入框和规则验证
function hideForm() {
  dialogFormVisible.value = false
  editEmailBtnFlag.value = false
  editPasswordBtnFlag.value = false
  deleteUserFlag.value = false
}


//endregion


</script>

<style scoped>


.cards {
  margin: 10px 1%;
  width: 18%;
  height: 30%;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
}

.info {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.headImg::after {
  background-color: black;
  width: 10px;
  opacity: 0.8;
}

.edit {
  width: 8px;
}

.account {
  margin-top: 10px;
}

.textareaDiv {
  margin: 0 1%;
  width: 78%;
}

.textarea {
  margin: 0 1%;
  width: 100%;
}

.user {
  width: 20%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 5%;
}

.change {
  border-radius: 20px;
}
</style>