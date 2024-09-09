<template>
  <!--    导航栏-->
  <el-menu mode="horizontal" :default-active="isShow">
    <el-menu-item index="1" @click="changePage('1')">
      网站介绍
    </el-menu-item>
    <el-menu-item index="2" @click="changePage('2','2')">
      更新相关
    </el-menu-item>
    <el-menu-item index="3" @click="changePage('3')">
      联系和反馈
    </el-menu-item>
  </el-menu>

  <el-scrollbar height="350px">
    <!--       网站介绍区-->
    <el-collapse-transition accordion v-show="isShow==='1'">
      <el-collapse v-model="activeName">
        <el-collapse-item title="网站介绍" name="1">
          <el-card class="notice">
            <el-text>
              1.本站为社交化导航网站，提供
              <el-button-group type="primary">
                <el-button link title="首页导航" @click="router.push({name:'home'})">站点导航、</el-button>
                <el-button link title="论坛文章" target="_blank" @click="router.push({name:'forum'})">论坛交流、
                </el-button>
                <el-button link title="重返未来相关界面" @click="router.push({name:'reverse1999'})">
                  重返未来官图筛选和下载
                </el-button>
              </el-button-group>
              等功能。<br>
              2.
              <el-button-group target="_blank" type="primary">
                <el-button link
                           @click="copyText('1005993749','QQ群号','https://qm.qq.com/cgi-bin/qm/qr?k=64Jtp9gH81G0ndqR_TGeUZLrP_MKE9eU&jump_from=webapi&authKey=BkihB0yK7m3dhvou57J/OPWP+7BsDBirgRKjud/BIWnXa9pM40wSwo0ORdMHlE5V')"
                           title="点击前往QQ">工具资源群：Resource sharing群、
                </el-button>
                <el-button link
                           @click="copyText('904688184','QQ群号','https://qm.qq.com/q/Oq8R7YS6sM')"
                           title="点击前往QQ">
                  重返未来群：金兔子特供部门🐰
                </el-button>
              </el-button-group>
              ,
              <el-text style="color: orangered">资源来自网络,侵权请联系删除</el-text>
              。
            </el-text>
            <br>
            <el-text>
              3.若首页导航网站无法访问，请使用Chrome、Edge、Firefox等浏览器或尝试VPN，也可能是因为该网站维护中。
            </el-text>
            <br>
            <el-text>4.你可以
              <el-link target="_blank" type="success"
                       href="https://mp-00526be3-cd12-41bd-84f7-bfbce63bb7d0.cdn.bspapp.com/test1/BookMarks_2023_8_15_2.zip"
                       title="下载书签">下载
              </el-link>
              并解压出HTML文件，导入到自己的浏览器收藏夹。导入步骤可参考相关教程视频：
              <el-link target="_blank" type="primary"
                       href="https://www.bilibili.com/video/BV1rr4y1S79J/"
                       title="B站教程视频">点击此处
              </el-link>
              。
            </el-text>
            <br>
            <el-text>
              5.本站正在持续更新和适配移动端，如<el-text type="warning">UI错位</el-text>或<el-text type="danger">功能出错</el-text>请
              <el-button link title="前往反馈" type="primary" @click="changePage('3','2')">留言反馈</el-button>
              。
            </el-text>
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
        <el-collapse-item title="隐私政策" name="3">
          <el-card class="privacyStatement">
            <el-text>
              本站与 Microsoft Clarity 合作，通过行为指标、热图和会话回放来捕捉您如何使用本站的网站并与之互动，以改进本站的产品和服务。网站使用数据是通过第一方和第三方
              Cookie 以及其他跟踪技术捕获的，以确定产品和服务的受欢迎程度和在线活动。此外，本站将这些信息用于网站优化。有关
              Microsoft 如何收集和使用您的数据的更多信息，请访问
              <el-link type="primary" href="https://privacy.microsoft.com/zh-CN/privacystatement">Microsoft 隐私声明
              </el-link>
              。使用本站，即表示您同意本站和 Microsoft 可以收集和使用此数据。
            </el-text>
            <br>
            <el-text><b>
              PS:根据国家法律法规，本站仅收集访问者IP等身份信息，使用Clarity收集访问者在本站的浏览轨迹以确定bug位置进行优化，相关的账号、密码等隐私信息均不会被采集。
            </b>
            </el-text>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-collapse-transition>

    <!--    更新相关-->
    <el-collapse-transition v-show="isShow==='2'">
      <el-collapse v-model="activeName" accordion style="border: none;text-align: left">
        <!--    待更新的功能-->
        <el-collapse-item title="待更新的功能" name="1">
          <template v-for="item in noUpdated" :key="item.id">
            <el-button text :icon="Edit">{{ item.content }}</el-button>
            <br>
          </template>
        </el-collapse-item>
        <el-collapse-item title="已更新的公告" name="2">
          <el-timeline style="padding-left: 0"><br>
            <el-timeline-item v-for="item in  updateNotes.slice().reverse()" :key="item.id" style="text-align: left"
                              :timestamp="item.time" placement="top">
              <el-card>
                <b>{{ item.title }}</b><br>
                <el-text> &ensp;{{ item.content }}</el-text>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-collapse-item>
      </el-collapse>
    </el-collapse-transition>

    <!--联系和反馈-->
    <el-collapse-transition v-show="isShow==='3'">
      <el-collapse v-model="activeName" accordion style="border: none">
        <!--联系方式-->
        <el-collapse-item title="联系方式" name="1">
          <template style="display: flex;justify-content: space-around">
            <el-button link tag="a" type="primary"
                       @click="copyText('50011502001039','QQ号','tencent://message/?uin=1224021291')">QQ
            </el-button>
            <el-button link tag="a" type="primary"
                       @click="copyText('50011502001039','微博主页链接','https://weibo.com/u/6869134755')">微博
            </el-button>
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
    <!--备案号-->
    <Approve/>
    <!--    <el-divider>已加载全部内容</el-divider>-->
  </el-scrollbar>
</template>

<script setup lang="ts">
import axios from "axios";
import {onMounted, reactive, ref} from "vue";
import {Edit} from "@element-plus/icons-vue";
import {ElCollapseTransition, ElMessage} from 'element-plus'
import useTimeStamp from "@/hooks/useTimestamp";
import useFunction from "@/hooks/useFunction";
import {useRouter} from "vue-router";
import Approve from "@/components/Approve.vue";


const {copyText} = useFunction()
const {getDiffTime} = useTimeStamp()
const router = useRouter()

const {showFlag} = defineProps(['showFlag'])//切换页面的参数

const updateNotes = reactive<Notice[]>([])//已更新的公告
const noUpdated = reactive<Notice[]>([])//未更新的公告
const isShow = ref<string>('1') //显示第几个公告区
const activeName = ref<string[]>(['1'])//展开第几条,因为设置了accordion，所以必须是字符串格式
const contact = ref('')//反馈联系方式
const content = ref('')//反馈内容


onMounted(() => {
  getNotices()//获取公告
  if (!!showFlag) changePage(showFlag.showNum, showFlag.activeNum)//更换页面
})


//切换公告页面
const changePage = (showNum: string, activeNum = '1') => {
  isShow.value = showNum
  setTimeout(() => activeName.value = activeNum.split(','), 300)
}


//获取已发布公告
const getNotices = async () => {
  try {
    const result = await axios({
      url: '/getNotices',
      params: {sort: ['updateNotes', 'noUpdated']}
    })
    // console.log(result)
    const {noticeList} = result.data
    updateNotes.splice(0, updateNotes.length)
    noUpdated.splice(0, noUpdated.length)
    noticeList.forEach((item: Notice) => {
      if (item.created_time === item.updated_time) item.time = '发布时间：' + getDiffTime(item.created_time)
      else item.time = '发布时间：' + getDiffTime(item.created_time) + '  上次修订于：' + getDiffTime(item.updated_time)
      if (item.sort === 'updateNotes') updateNotes.push(item)
      if (item.sort === 'noUpdated') noUpdated.push(item)
    })
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}


//上传反馈内容
const submitFeedback = async () => {
  console.log(content.value.length)
  if (content.value === '') return ElMessage.error('反馈内容不能为空')
  if (contact.value.length > 30) return ElMessage.error('联系方式超出长度限制')
  if (content.value.length < 5 || content.value.length > 200) return ElMessage.error('反馈内容应为5-200个字符')
  try {
    const result = await axios({
      url: '/submitFeedback',
      method: 'post',
      data: {
        contact: contact.value,
        content: content.value
      }
    })
    console.log('result', result)
    contact.value = ''
    content.value = ''
    ElMessage.success(result.data.msg)
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
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

.friendLinks .el-link {
  margin: 0 10px;
}

.privacyStatement {
  display: flex;
  justify-content: left;
  text-align: left;

}

/*
@media (max-width: 980px) {

}*/
</style>
