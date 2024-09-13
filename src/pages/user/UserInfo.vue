<template>
  <el-container>
    <el-header class="header1" v-if="isPC">
      用户信息
    </el-header>
    <div class="user" :style="isPC? 'right: 0;':''">
      <!--头像框-->
      <el-avatar :size="isPC ? 150:75" title="更换头像" :src="headImgUrl" @error="errorImage"
                 @click="dialogVisible=true"/>
      <div>
        <div :style="isPC ?'':'text-align:left'">
          <el-button  text v-show="isDisabled" @click="isDisabled = false" title="修改昵称" :icon="Edit">
            {{
              username
            }}
          </el-button>
          <el-text :size="elSize" type="info" v-if="isDisabled" style="border: 1px solid #b5b7ba;padding: 0 2px">未实名
          </el-text>
          <el-input v-model.trim="newName" @keyup.enter="checkNewName(newName)" @blur="isUpdateName"
                    v-show="!isDisabled"
                    :placeholder="username" minlength="2" maxlength="10" show-word-limit/>
        </div>
        <el-button-group :size="elSize" class="account">
          <el-button @click="showEditForm( '修改邮箱')">修改邮箱</el-button>
          <el-button @click="showEditForm( '修改密码')">修改密码</el-button>
          <br v-if="isPC">
          <el-button @click="getUserInfo" type="primary">刷新信息</el-button>
          <el-button shadow="hover" type="danger" @click="showEditForm( '注销账户')">
            注销账号
          </el-button>
        </el-button-group>
      </div>
    </div>
    <el-main class="info">
      <el-card class="box">
        <div class="cards">
          <div @click="goArticleManagement">
            <div>发布</div>
            <div>
              {{ articleNum }}
            </div>
          </div>
          <div @click="goArticleManagement">
            <div>未发布</div>
            <div>
              {{ noSubmitArticleNum }}
            </div>
          </div>
          <div @click="goArticleManagement">
            <div>草稿箱</div>
            <div>
              {{ draftNum }}
            </div>
          </div>
          <div @click="goArticleManagement">
            <div>评论</div>
            <div>
              {{ commentNum }}
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="textareaDiv" shadow="hover">
        <template #header>个人简介</template>
        <el-input class="textarea" v-model="newSignature" @blur="isUpdateSignature" @keyup.enter="editSignature"
                  type="textarea" maxlength="50" show-word-limit placeholder="这千千万万个故事里，许会有一颗与你我一般无二的心。"/>
      </el-card>
      <div style="margin: 5px auto">试用性功能[无需登录]：
        <el-button @click="router.push({name:'chat'})" :size="elSize" type="info">聊天室</el-button>
      </div>
    </el-main>

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
  <el-dialog v-model="dialogFormVisible" :title="titleStr" width="500" :fullscreen="!isPC" :before-close="handleClose"
             class="change">
    <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        status-icon
        :rules="(Rules)"
        label-width="auto"
        label-position="left"
    >
      <el-text type="warning" v-if="deleteUserFlag">
        请注意，注销账户仅会删除你的账号邮箱、密码等信息，而不会删除您在本站发布和保存的其他内容。
      </el-text>
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
  <el-dialog v-model="dialogVisible" :width="isPC? '':'wide:100%'" :show-close="false" title="上传图片">
    <UploadImage/>
  </el-dialog>
</template>

<script setup lang="ts">
import axios from "axios";
import emitter from "@/utils/emitter";
import {ElMessage, ElMessageBox, FormInstance, FormRules} from "element-plus";
import {Edit} from "@element-plus/icons-vue";
import {ref, reactive, onMounted} from 'vue';
import {useRouter} from "vue-router";
import useResponsive from "@/hooks/useResponsive";
import useUserInfo from '@/hooks/useUserInfo'
import UploadImage from "@/components/UploadImage.vue";


const {isPC, elSize} = useResponsive()
const router = useRouter()
//获取本地存储的用户信息
const {
  getLocalUserInfo,
  updateLocalUserInfo,
  errorImage,
  signature,
  email,
  username,
  headImgUrl
} = useUserInfo()


function goArticleManagement() {
  emitter.emit('pageRender', 2)
  router.push({name: 'userManagement'})
}

//获取用户信息
const getUserInfo = async () => {
  try {
    const result = await axios({url: '/getUserInfo'})
    console.log(result)
    const {status, userInfo, msg} = result.data
    if (status === 200) ElMessage.success(msg)
    // console.log(userInfo)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    setTimeout(() => {
      location.reload()
    }, 1500)
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}

onMounted(async () => {
  await Promise.all([
    getArticleList(),
    getDraftList(),
    getUserComments()
  ])
})

//用户的评论数量
const commentNum = ref(0)
//用户的发布的文章数量
const articleNum = ref(0)
//用户的未发布的文章数量
const noSubmitArticleNum = ref(0)
//用户的的草稿数量
const draftNum = ref(0)

//获取用户评论信息
const getUserComments = async () => {
  try {
    const result = await axios({url: '/getTheComments'})
    console.log(result)
    const {status, data, msg} = result.data
    commentNum.value = data.length
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}

//获取用户文章列表
const getArticleList = async () => {
  try {
    const result = await axios({
      url: '/getUserArticleList',
      params: {
        isSubmit: true
      }
    })
    console.log(result)
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
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}


//获取用户草稿列表
const getDraftList = async () => {
  try {
    const result = await axios({url: '/getDraftList'})
    console.log(result)
    if (result.data.list !== undefined) draftNum.value = result.data.list.length
    else draftNum.value = 0
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}


//region 修改头像,控制上传框是否显示
const dialogVisible = ref(false)


//新的个性签名
const newSignature = ref(signature.value)


//修改个性签名
const editSignature = async () => {
  try {
    const result = await axios({
      url: '/updateSignature',
      method: 'post',
      data: {signature: newSignature.value.trim()}
    })
    console.log(result)
    const {data} = result.data
    updateLocalUserInfo({signature: data})
    newSignature.value = data
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
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
        newSignature.value = signature.value
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
const newName = ref(username.value)

const titleStr = ref('')

interface AccountChange {
  email: string,
  newEmail: string,
  password: string,
  checkPassword: string,
  newPassword: string,
  edit: string
}

//表单数据
const ruleForm: AccountChange = reactive({
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
  if (!value)
    return callback(new Error('邮箱不能为空！请输入邮箱地址！'))
  else if (value !== email.value)
    return callback(new Error('输入的邮箱与本账号邮箱不匹配！'))
  else if (!reg.test(value))
    return callback(new Error('请输入正确的邮箱地址！'))
  else
    return callback()
}
//验证密码
const validatePassword = (rule: any, value: any, callback: any) => {
  const reg = /^([A-Za-z\d\-&.,()\s]+)+$/i;
  if (!value) return callback(new Error('密码不能为空！请输入密码！'))
  else if (!reg.test(value) || value.length < 6 || value.length > 18)
    return callback(new Error('请输入6-18位不含特殊字符的密码！'))
  else
    return callback()
}

//修改：新昵称
const checkNewName = (value: string) => {
  const reg = /[^\u4E00-\u9FA5a-zA-Z0-9]/i
  if (!value)
    return ElMessage.error('昵称不能为空，请输入2-10位中文、字母、或数字！')
  else if (value === username.value)
    return ElMessage.error('新昵称不能与旧昵称相同')
  else if (reg.test(value) || value.length > 10 || value.length < 2)
    return ElMessage.error('请输入2-10位中文、字母、或数字！')
  else
    return updateUser({username: newName.value}, '/updateUserName')
}
//修改：新邮箱
const checkNewEmail = (rule: any, value: any, callback: any) => {
  const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i;
  if (!value)
    return callback(new Error('邮箱不能为空！请输入邮箱地址！'))
  else if (value === ruleForm.email)
    return callback(new Error("新邮箱不能与旧邮箱相同！"))
  else if (!reg.test(value))
    return callback(new Error('请输入正确的邮箱地址！'))
  else
    return callback()
}
//修改：新密码
const checkNewPassword = (rule: any, value: any, callback: any) => {
  const reg = /^([A-Za-z\d\-&.,()\s]+)+$/i;
  if (!value)
    return callback(new Error('新密码不能为空！请输入密码！'))
  else if (value === ruleForm.password)
    return callback(new Error("新密码不能与旧密码相同！"))
  else if (!reg.test(value) || value.length < 6 || value.length > 18)
    return callback(new Error('请输入6-18位不含特殊字符的密码！'))
  else
    return callback()
}
//注销：确认密码
const validatePassword2 = (rule: any, value: any, callback: any) => {
  if (!value)
    return callback(new Error('请确认密码！'))
  else if (value !== ruleForm.password)
    return callback(new Error("两次输入的密码不匹配！"))
  else
    return callback()
}


//表单验证规则
const Rules = reactive<FormRules<typeof ruleForm>>({
  email: [{validator: checkEmail, trigger: 'blur'}],
  password: [{validator: validatePassword, trigger: 'blur'}],
})


// 提交表单,登录或注册,再次通过data的值判断表单验证是否通过
const loading = ref(false)
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
const updateUser = async (changeData: AccountChange, url: string) => {
  try {
    const result = await axios({
      url,
      method: 'post',
      data: changeData
    })
    console.log(result)
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
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}

//注销账号
const deleteUser = async () => {
  const {email, password} = ruleForm
  try {
    const result = await axios({
      url: '/deleteUser',
      method: 'delete',
      data: {
        email: email.toLowerCase(),
        password
      }
    })
    console.log(result)
    ElMessage.success(result.data.msg)
    localStorage.clear()
    sessionStorage.clear()
    setTimeout(() => {
      location.href = '/'
    }, 2000)
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}


//修改昵称的窗口显示
const isDisabled = ref(true)
const editNameFormVisible = ref(false)
//修改用户信息窗口的显示
const dialogFormVisible = ref(false)

//修改邮箱的输入框显示
const editEmailBtnFlag = ref(false)
//修改密码的输入框显示
const editPasswordBtnFlag = ref(false)
//注销账户的输入框显示
const deleteUserFlag = ref(false)


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

//显示修改窗口并设置为修改邮箱/密码/注销窗口
const showEditForm = (title: string) => {
  titleStr.value = title
  dialogFormVisible.value = true
  if (title === '修改邮箱') editEmailBtnFlag.value = true
  else if (title === '修改密码') editPasswordBtnFlag.value = true
  else if (title === '注销账户') deleteUserFlag.value = true
}

//隐藏修改窗口并去除输入框和规则验证
const hideForm = () => {
  dialogFormVisible.value = false
  editEmailBtnFlag.value = false
  editPasswordBtnFlag.value = false
  deleteUserFlag.value = false
}


//endregion


</script>

<style scoped>
.el-container {
  position: relative;
}

.box {
  width: 100%;
  margin: 10px 1%;
}

.cards {
  display: flex;
  justify-content: space-between;
}

.cards div {
  margin: 10px auto;
  border-radius: 10px;
}

.info {
  width: 80%;
  display: flex;
  justify-content: space-between;
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
  width: 100%;
}

.textarea {
  margin: 0 1%;
  width: 100%;
}

.user {
  width: 23%;
  height: 100%;
  position: absolute;
  padding-top: 30px;
}

.change {
  border-radius: 20px;
}

@media (max-width: 980px) {
  .el-container {
    flex-direction: column;
    /*    flex-wrap: nowrap;*/
  }

  .user {
    height: 20%;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-around;
    padding-top: 5px;
  }

  .info {
    width: 100%;
    font-size: 14px;
    padding: 0;
  }
}
</style>
