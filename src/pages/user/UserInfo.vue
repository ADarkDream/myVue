<template>
  <el-container>
    <el-header v-if="isPC" class="header1"> 用户信息 </el-header>
    <div class="user" :style="isPC ? 'right: 0;' : ''">
      <!--头像框-->
      <el-avatar :size="isPC ? 150 : 75" :src="headImgUrl" title="更换头像" @click="changeAvatar()" @error="errorImage" />
      <div>
        <div :style="isPC ? '' : 'text-align:left'">
          <el-button v-show="isDisabled" :icon="Edit" text title="修改昵称" @click="isDisabled = false">
            {{ username }}
          </el-button>
          <el-text v-if="isDisabled" style="border: 1px solid #b5b7ba; padding: 0 2px" type="info">未实名 </el-text>
          <div v-if="isDisabled" class="connectDiv">
            <el-button @click="to_qq_oauth({ is_oauth: true, isPC: isPC, type: 'connect' })"> 绑定QQ</el-button>
          </div>
          <el-input
            v-show="!isDisabled"
            v-model.trim="newName"
            maxlength="10"
            minlength="2"
            :placeholder="username"
            show-word-limit
            @blur="isUpdateName"
            @keyup.enter="checkNewName(newName)"
          />
        </div>
        <el-button-group class="account">
          <el-button @click="showEditForm('修改邮箱')">修改邮箱</el-button>
          <el-button @click="showEditForm('修改密码')">修改密码</el-button>
          <br v-if="isPC" />
          <el-button type="primary" @click="updateUserInfo()">刷新信息</el-button>
          <el-button shadow="hover" type="danger" @click="showEditForm('注销账户')"> 注销账号 </el-button>
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
        <el-input
          v-model="newSignature"
          class="textarea"
          maxlength="50"
          placeholder="这千千万万个故事里，许会有一颗与你我一般无二的心。"
          show-word-limit
          type="textarea"
          @blur="isUpdateSignature"
          @keyup.enter="editSignature"
        />
      </el-card>
      <div style="margin: 5px auto">
        试用性功能[无需登录]：
        <el-button type="info" @click="router.push({ name: 'chat' })">聊天室</el-button>
      </div>
    </el-main>
  </el-container>

  <!-- 用户昵称修改框-->
  <el-dialog v-model="editNameFormVisible" class="change" title="修改昵称" width="500">
    <el-form label-position="left" label-width="auto" status-icon style="max-width: 600px">
      <el-form-item>
        <el-input v-model="newName" placeholder="输入新的昵称" @keyup.enter="checkNewName(newName)" />
      </el-form-item>

      <div class="btn">
        <el-button plain @click="editNameFormVisible = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="checkNewName(newName)">修改</el-button>
      </div>
    </el-form>
  </el-dialog>

  <!-- 用户修改框-->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="handleClose"
    class="change"
    :fullscreen="!isPC"
    :title="titleStr"
    width="500"
  >
    <el-form
      ref="ruleFormRef"
      label-position="left"
      label-width="auto"
      :model="ruleForm"
      :rules="Rules"
      status-icon
      style="max-width: 600px"
    >
      <el-text v-if="deleteUserFlag" type="warning">
        请注意，注销账户仅会删除你的账号邮箱、密码等信息，而不会删除您在本站发布和保存的其他内容。
      </el-text>
      <el-form-item label="输入邮箱：" prop="email">
        <el-input v-model.lazy.trim="ruleForm.email" placeholder="输入邮箱" />
      </el-form-item>
      <el-form-item label="输入密码：" prop="password">
        <el-input v-model.lazy.trim="ruleForm.password" autocomplete="off" placeholder="输入密码" type="password" />
      </el-form-item>
      <!--      修改邮箱-->
      <el-form-item
        v-if="editEmailBtnFlag"
        label="输入新邮箱："
        prop="newEmail"
        :rules="[{ validator: checkNewEmail, trigger: 'blur' }]"
      >
        <el-input v-model.lazy.trim="ruleForm.newEmail" placeholder="输入新邮箱" />
      </el-form-item>
      <!--      修改密码-->
      <el-form-item
        v-if="editPasswordBtnFlag"
        label="输入新密码："
        prop="newPassword"
        :rules="[{ validator: checkNewPassword, trigger: 'blur' }]"
      >
        <el-input v-model.lazy.trim="ruleForm.newPassword" autocomplete="off" placeholder="输入新密码" type="password" />
      </el-form-item>
      <!--      注销账户-->
      <el-form-item
        v-if="deleteUserFlag"
        label="确认密码："
        prop="checkPassword"
        :rules="[{ validator: validatePassword2, trigger: 'blur' }]"
      >
        <el-input v-model.lazy.trim="ruleForm.checkPassword" autocomplete="off" placeholder="确认密码" type="password" />
      </el-form-item>
      <div class="btn">
        <el-button plain @click="hideForm">取消</el-button>
        <el-button v-if="editEmailBtnFlag" :loading="loading" type="primary" @click="submitForm(ruleFormRef, 0)">
          修改邮箱
        </el-button>
        <el-button v-if="editPasswordBtnFlag" :loading="loading" type="primary" @click="submitForm(ruleFormRef, 1)">
          修改密码
        </el-button>
        <el-button v-if="deleteUserFlag" :loading="loading" type="danger" @click="submitForm(ruleFormRef, 2)"> 注销 </el-button>
      </div>
    </el-form>
  </el-dialog>
  <!--图片上传框-->
  <el-dialog v-model="dialogVisible" :show-close="false" title="上传图片" :width="isPC ? '' : 'wide:50%'">
    <UploadImage />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRefs, watch } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { Edit } from "@element-plus/icons-vue"
import momo from "@/apis"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useUploadFileStore } from "@/store/upload/uploadFileStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
//hooks
import useUser from "@/hooks/user/useUser"
//components
import UploadImage from "@/components/UploadImage.vue"
//utils
import { emitter } from "@/utils/emitter"
import useOAuth from "@/hooks/user/useOAuth"

const router = useRouter()
const userInfoStore = useUserInfoStore()
const uploadFileStore = useUploadFileStore()
const responsiveStore = useResponsiveStore()
//获取本地存储的用户信息
const { errorImage, signature, email, username, headImgUrl } = toRefs(userInfoStore)
const { options, isLoading, fileInfo } = toRefs(uploadFileStore)
const { resetUpload } = uploadFileStore

const { isPC } = toRefs(responsiveStore)
const { updateUserInfo } = useUser()
const { to_qq_oauth } = useOAuth()

const changeAvatar = () => {
  options.value = {
    sort: "headImg",
    url: "",
    status: 0,
    maxSize: 2,
    type: "image",
  }
  dialogVisible.value = true

  watch(isLoading, (newVal, oldVal) => {
    if (newVal === oldVal) return
    if (newVal === false && fileInfo.value) {
      headImgUrl.value = fileInfo.value.imgUrl
      resetUpload()
      dialogVisible.value = false
    }
  })
}

function goArticleManagement() {
  emitter.emit("pageRender", 2)
  router.push({ name: "userManagement" })
}

onMounted(async () => {
  await Promise.all([getArticleList(), getDraftList(), getUserComments()])
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
    const result = await momo.get("/getTheComments")
    console.log(result)
    const { code, data, msg } = result
    commentNum.value = data.length
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//获取用户文章列表
const getArticleList = async () => {
  try {
    const result = await momo.get("/getUserArticleList", {
      isSubmit: true,
    })
    console.log(result)
    const list = result.list
    const articleList = reactive([])
    const noSubmitArticleList = reactive([])
    //添加新数据
    list.forEach((item) => {
      if (Number(item.status) === 1)
        articleList.push(item) //审核通过的
      else noSubmitArticleList.push(item) //待审核的
    })
    articleNum.value = articleList.length
    noSubmitArticleNum.value = noSubmitArticleList.length
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//获取用户草稿列表
const getDraftList = async () => {
  try {
    const result = await momo.get("/getDraftList")
    console.log(result)
    if (result.list !== undefined) draftNum.value = result.list.length
    else draftNum.value = 0
  } catch (error) {
    console.log("发生错误：")
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
    const result = await momo.post("/updateSignature", {
      signature: newSignature.value?.trim(),
    })
    console.log(result)
    const { data } = result
    signature.value = data
    newSignature.value = data
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//确认是否修改个性签名
const isUpdateSignature = () => {
  if (newSignature.value === signature.value) return
  ElMessageBox.alert("是否上传修改之后的个性签名？", "请确认", {
    cancelButtonText: "取消修改",
    confirmButtonText: "上传更新",
    type: "info",
    showCancelButton: true,
    showClose: false,
  })
    .then(() => {
      editSignature()
    })
    .catch(() => {
      newSignature.value = signature.value
      ElMessage.info("个性签名已还原")
    })
}

//确认是否修改昵称
const isUpdateName = () => {
  if (newName.value === username.value) return (isDisabled.value = true)
  ElMessageBox.alert("是否上传修改之后的昵称？", "请确认", {
    cancelButtonText: "取消修改",
    confirmButtonText: "上传更新",
    type: "info",
    showCancelButton: true,
    showClose: false,
  })
    .then(() => {
      checkNewName(newName.value)
    })
    .catch(() => {
      isDisabled.value = true
      newName.value = username.value
      ElMessage.info("昵称已还原")
    })
}
//region修改用户账号信息
const newName = ref(username.value)

const titleStr = ref("")

interface AccountChange {
  email: string
  newEmail: string
  password: string
  checkPassword: string
  newPassword: string
  edit: string
}

//表单数据
const ruleForm: AccountChange = reactive({
  email: "",
  newEmail: "",
  password: "",
  checkPassword: "",
  newPassword: "",
  edit: "",
})

//region表单验证逻辑
const ruleFormRef = ref<FormInstance>()
//验证邮箱
const checkEmail = (rule: any, value: any, callback: any) => {
  const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i
  if (!value) return callback(new Error("邮箱不能为空！请输入邮箱地址！"))
  else if (value !== email.value) return callback(new Error("输入的邮箱与本账号邮箱不匹配！"))
  else if (!reg.test(value)) return callback(new Error("请输入正确的邮箱地址！"))
  else return callback()
}
//验证密码
const validatePassword = (rule: any, value: any, callback: any) => {
  const reg = /^([A-Za-z\d\-&.,()\s]+)+$/i
  if (!value) return callback(new Error("密码不能为空！请输入密码！"))
  else if (!reg.test(value) || value.length < 6 || value.length > 18)
    return callback(new Error("请输入6-18位不含特殊字符的密码！"))
  else return callback()
}

//修改：新昵称
const checkNewName = (value: string) => {
  const reg = /[^\u4E00-\u9FA5a-zA-Z0-9]/i
  if (!value) return ElMessage.error("昵称不能为空，请输入2-10位中文、字母、或数字！")
  else if (value === username.value) return ElMessage.error("新昵称不能与旧昵称相同")
  else if (reg.test(value) || value.length > 10 || value.length < 2) return ElMessage.error("请输入2-10位中文、字母、或数字！")
  else return updateUser({ username: newName.value }, "/updateUserName")
}
//修改：新邮箱
const checkNewEmail = (rule: any, value: any, callback: any) => {
  const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i
  if (!value) return callback(new Error("邮箱不能为空！请输入邮箱地址！"))
  else if (value === ruleForm.email) return callback(new Error("新邮箱不能与旧邮箱相同！"))
  else if (!reg.test(value)) return callback(new Error("请输入正确的邮箱地址！"))
  else return callback()
}
//修改：新密码
const checkNewPassword = (rule: any, value: any, callback: any) => {
  const reg = /^([A-Za-z\d\-&.,()\s]+)+$/i
  if (!value) return callback(new Error("新密码不能为空！请输入密码！"))
  else if (value === ruleForm.password) return callback(new Error("新密码不能与旧密码相同！"))
  else if (!reg.test(value) || value.length < 6 || value.length > 18)
    return callback(new Error("请输入6-18位不含特殊字符的密码！"))
  else return callback()
}
//注销：确认密码
const validatePassword2 = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error("请确认密码！"))
  else if (value !== ruleForm.password) return callback(new Error("两次输入的密码不匹配！"))
  else return callback()
}

//表单验证规则
const Rules = reactive<FormRules<typeof ruleForm>>({
  email: [{ validator: checkEmail, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
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
      //此处调用momo上传
      console.log(ruleForm)
      if (flag === 0) {
        ruleForm.edit = "email"
        updateUser(ruleForm, "/updateUserAcc")
      } else if (flag === 1) {
        ruleForm.edit = "password"
        updateUser(ruleForm, "/updateUserAcc")
      } else if (flag === 2) deleteUser()
    } else {
      ElMessage.error("规则验证失败")
      return false
    }
  })
}

//修改账号信息
const updateUser = async (changeData: AccountChange, url: string) => {
  try {
    const result = await momo.post(url, changeData)
    console.log(result)
    const { msg, flag, data } = result
    ElMessage.success(msg)
    //修改昵称，刷新页面
    if (flag === 0) {
      username.value = data
      location.reload()
    } else if (flag === 1) {
      //修改邮箱或密码，重新登录
      email.value = data
      setTimeout(() => {
        sessionStorage.setItem("isLogin", "0")
        localStorage.removeItem("token")
        location.href = "/"
      }, 1000)
    }
  } catch (error) {
    console.log("发生错误：")
    console.dir(error)
  }
}

//注销账号
const deleteUser = async () => {
  const { email, password } = ruleForm
  try {
    const result = await momo.delete("/deleteUser", {
      email: email.toLowerCase(),
      password,
    })
    console.log(result)
    ElMessage.success(result.msg)
    localStorage.clear()
    sessionStorage.clear()
    setTimeout(() => {
      location.href = "/"
    }, 2000)
  } catch (error) {
    console.log("发生错误：")
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
  ElMessageBox.confirm("你要取消操作吗?")
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
  if (title === "修改邮箱") editEmailBtnFlag.value = true
  else if (title === "修改密码") editPasswordBtnFlag.value = true
  else if (title === "注销账户") deleteUserFlag.value = true
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

@media (max-width: 780px) {
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

  .connectDiv {
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
<style>
.el-dialog .el-dialog__header {
  padding-bottom: 20px;
}
</style>
