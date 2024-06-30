<template>
  <!--    导航栏-->
  <el-menu mode="horizontal" default-active="1">
    <el-menu-item index="1" @click="isShow=1">
      网站介绍
    </el-menu-item>
    <el-menu-item index="2" @click="isShow=2">
      更新说明
    </el-menu-item>
    <el-menu-item index="3" @click="isShow=3">
      其它
    </el-menu-item>
  </el-menu>

  <el-scrollbar height="350px">
    <!--       网站介绍区-->
    <el-collapse-transition v-show="isShow===1">
      <el-collapse v-model="activeName">
        <!--    待更新的功能-->
        <el-collapse-item title="网站介绍" name="1">
          <el-card class="notice">
            <el-text>
              1.本页面为
              <el-button link target="_blank" type="primary"
                         @click="copyText('1005993749','QQ群号','https://qm.qq.com/cgi-bin/qm/qr?k=64Jtp9gH81G0ndqR_TGeUZLrP_MKE9eU&jump_from=webapi&authKey=BkihB0yK7m3dhvou57J/OPWP+7BsDBirgRKjud/BIWnXa9pM40wSwo0ORdMHlE5V')"
                         title="点击前往QQ">Resource sharing群
              </el-button>
              群友
              <el-button link target="_blank" type="primary" style="margin-left: 0"
                         @click="copyText('1224021291','QQ号','tencent://message/?uin=1224021291')" title="点击前往QQ">
                默默
              </el-button>
              的个人网站,
              <el-text style="color: orangered">资源来自网络,侵权请联系删除</el-text>
              。
            </el-text>
            <br>
            <el-text>
              2.当前界面勉强适配移动端，持续优化中。
            </el-text>
            <br>
            <el-text>
              3.若首页部分网站无法访问，请使用Chrome、Edge、Firefox等浏览器或尝试VPN，也可能是因为该网站维护中。
            </el-text>
            <br>
            <el-text>4.你也可以
              <el-link target="_blank" type="primary"
                       href="https://mp-00526be3-cd12-41bd-84f7-bfbce63bb7d0.cdn.bspapp.com/test1/BookMarks_2023_8_15_2.zip"
                       title="下载书签">点击此处
              </el-link>
              下载，解压出HTML文件，导入到自己的浏览器收藏夹。导入步骤可参考相关教程视频：
              <el-link target="_blank" type="primary"
                       href="https://www.bilibili.com/video/BV1rr4y1S79J/"
                       title="B站教程视频">点击此处
              </el-link>
              。
            </el-text>
            <br>
          </el-card>
        </el-collapse-item>
        <el-collapse-item title="友情链接" name="2">
          <template class="friendLinks">
            <el-link target="_blank"
                     href="https://letsgofishing5.github.io/lsgfish-resource-sharing/"
                     title="资源收藏与分享">
              <el-button><img src="@/assets/custom.png" alt="" style="width: 25px">&ensp;
                lsgfish-resource-sharing
              </el-button>
            </el-link>
            <el-link target="_blank" v-if="false"
                     href="https://answer.lilemy.cn/"
                     title="小新问答">
              <el-button><img src="@/assets/logo.xiaoxin.png" alt="" style="width: 25px">&ensp;
                小新问答
              </el-button>
            </el-link>
          </template>
        </el-collapse-item>
      </el-collapse>
    </el-collapse-transition>

    <!--    更新说明-->
    <el-collapse-transition v-show="isShow===2">
      <el-timeline style="padding-left: 0"><br>
        <el-timeline-item v-for="item in  updateNotes.slice().reverse()" :key="item.id" style="text-align: left"
                          :timestamp="item.time" placement="top">
          <el-card>
            <b>{{ item.title }}</b><br>
            <el-text> &ensp;{{ item.content }}</el-text>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-collapse-transition>

    <!--其它-->
    <el-collapse-transition v-show="isShow===3">
      <el-collapse v-model="activeName" accordion style="border: none">
        <!--    待更新的功能-->
        <el-collapse-item title="待更新的功能" name="1">
          <template v-for="item in noUpdated" :key="item.id">
            <el-button text :icon="Edit">{{ item.content }}</el-button>
            <br>
          </template>
        </el-collapse-item>
        <!--    留言反馈-->
        <el-collapse-item title="留言反馈" name="2">
          <el-form style="margin: 0 5%">
            <el-form-item label="联系方式：">
              <el-input type="text" v-model.trim="contact" maxlength="30"
                        placeholder="[选填]可在此填写联系方式"></el-input>
            </el-form-item>
            <el-form-item label="反馈内容：">
              <el-input type="textarea" v-model.trim="content" minlength="5" maxlength="200" :autosize="true"
                        show-word-limit
                        placeholder="[必填]可在此提交建议、bug反馈或其他内容"/>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
        </el-collapse-item>
      </el-collapse>
    </el-collapse-transition>

        <div style="margin-top: 10px" >
          <el-button link tag="a" type="info"
                     @click="copyText('50011502001039','备案号','https://beian.mps.gov.cn/#/query/webSearch?code=50011502001039')">
            <el-image src="https://beian.mps.gov.cn/favicon.ico" style="width: 20px" alt="图片加载失败"/>
            &ensp;渝公网安备50011502001039
          </el-button>
          <span v-if="isPC" style="margin: 0 10px">|</span>
          <el-button link tag="a" type="info"
                     @click="copyText('渝ICP备2024030473号','备案号','http://beian.miit.gov.cn/')">
            渝ICP备2024030473号
          </el-button>
        </div>
<!--    <el-divider>已加载全部内容</el-divider>-->
  </el-scrollbar>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {Edit} from "@element-plus/icons-vue";
import {ElCollapseTransition, ElMessage} from 'element-plus'
import axios from "axios";
import useTimeStamp from "@/hooks/useTimestamp";
import useResponsive from "@/hooks/useResponsive";
import useFunction from "@/hooks/useFunction";

const {copyText} = useFunction()

const {getDiffTime} = useTimeStamp()
const {isPC} = useResponsive()


let isShow = ref(1)

//公告标题
// let t = 6
// let notice = ref('点击查看公告')
// const noticeTime = setInterval(() => {
//   t--
//   notice.value = `点击查看公告(${t}秒后自动隐藏)`
//   if (t === 0) {
//     isShow.value = false
//     clearInterval(noticeTime)
//   }
// }, 1000)
//
//
// function showNotice() {
//   clearInterval(noticeTime)
//   notice.value = '点击查看公告'
// }

//region公告设置
//endregion

//region更新说明
const updateNotes = reactive([])
const noUpdated = reactive([])

interface Notice {
  id: number,
  title: string,
  sort: string,
  content: string,
  created_time: string,
  updated_time: string,
  status: number,
  time?: string
}

//获取已发布公告
getNotices()

function getNotices() {
  axios({
    url: '/getNotices',
    params: {sort: ['updateNotes', 'noUpdated']}
  }).then(result => {
    // console.log(result)
    const {noticeList} = result.data
    // ElMessage.success( result.data.msg)
    updateNotes.splice(0, updateNotes.length)
    noUpdated.splice(0, noUpdated.length)
    noticeList.forEach((item: Notice) => {
      if (item.created_time === item.updated_time) item.time = '发布时间：' + getDiffTime(item.created_time)
      else item.time = '发布时间：' + getDiffTime(item.created_time) + '  上次修订于：' + getDiffTime(item.updated_time)
      if (item.sort === 'updateNotes') updateNotes.push(item)
      if (item.sort === 'noUpdated') noUpdated.push(item)
    })
  }).catch(error => {
    console.log('发生错误：')
    console.dir(error)
  })
}


//endregion

//region待更新功能
//默认展开第几条,因为设置了accordion，所以必须是字符串格式
const activeName = ref(['1'])

//endregion


//反馈
let contact = ref('')
let content = ref('')

function submitFeedback() {
  console.log(content.value.length)
  if (content.value === '') return ElMessage.error('反馈内容不能为空')
  if (contact.value.length > 30) return ElMessage.error('联系方式超出长度限制')
  if (content.value.length < 5 || content.value.length > 200) return ElMessage.error('反馈内容应为5-200个字符')
  axios({
    url: '/submitFeedback',
    method: 'post',
    data: {
      contact: contact.value,
      content: content.value
    }
  }).then(result => {
    // console.log(result)
    contact.value = ''
    content.value = ''
    ElMessage.success(result.data.msg)
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}


</script>

<style scoped>
.notice {
  text-align: left;
}

/*折叠面板标题栏样式*/
:deep(.el-collapse-item__header:hover) {
  color: var(--el-color-primary);
}

.friendLinks {
  display: flex;
  justify-content: left
}

.friendLinks .el-link{
  margin: 0 10px;
}

@media (max-width: 980px) {

}
</style>