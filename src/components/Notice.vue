<template>
  <!-- <el-scrollbar class="notice"> -->
  <el-tabs v-model="showFlag.show_num" @tab-click="tabClick">
    <!--       网站介绍区-->
    <el-tab-pane :name="1" label="网站介绍">
      <el-collapse-transition class="noticeContent">
        <el-collapse v-model="showFlag.active_num" accordion>
          <el-collapse-item title="网站介绍" :name="1">
            <el-card class="introduction">
              <el-text tag="p">
                1.本站为社交化导航网站，提供
                <el-button link title="首页导航" type="primary" @click="router.push({ name: 'home' })">站点导航
                </el-button>
                、
                <el-button link title="论坛文章" type="primary" target="_blank" @click="router.push({ name: 'forum' })">
                  论坛交流
                </el-button>
                、
                <el-button link title="重返未来相关界面" type="primary" @click="router.push({ name: 'reverse1999' })">
                  重返未来官图筛选和下载
                </el-button>
                、
                <el-button link title="在线音乐播放" type="primary" @click="router.push({ name: 'music' })">
                  在线音乐播放
                </el-button>
                等功能。
              </el-text>
              <el-text tag="p">
                2.工具资源群：
                <el-button link target="_blank" type="primary"
                  @click="copyText('1005993749', 'QQ群号', 'https://qm.qq.com/cgi-bin/qm/qr?k=64Jtp9gH81G0ndqR_TGeUZLrP_MKE9eU&jump_from=webapi&authKey=BkihB0yK7m3dhvou57J/OPWP+7BsDBirgRKjud/BIWnXa9pM40wSwo0ORdMHlE5V')"
                  title="点击前往QQ">Resource sharing群
                </el-button>
                、重返未来群：
                <el-button link target="_blank" type="primary"
                  @click="copyText('904688184', 'QQ群号', 'https://qm.qq.com/q/Oq8R7YS6sM')" title="点击前往QQ">
                  金兔子特供部门🐰
                </el-button>。
              </el-text>
              <el-text tag="p">
                3.若首页导航网站无法访问，请使用Chrome、Edge、Firefox等浏览器或尝试VPN，也可能是因为该网站维护中【也可能是网站已关闭，太久没校验了】。
              </el-text>
              <el-text tag="p">4.你可以
                <el-text tag="a" type="success"
                  href="https://mp-00526be3-cd12-41bd-84f7-bfbce63bb7d0.cdn.bspapp.com/test1/BookMarks_2023_8_15_2.zip"
                  title="下载书签">下载
                </el-text>
                并解压出HTML文件，导入到自己的浏览器收藏夹。导入步骤可参考相关教程视频：
                <el-text tag="a" target="_blank" type="primary" href="https://www.bilibili.com/video/BV1rr4y1S79J/"
                  title="B站教程视频">点击此处
                </el-text>
                。
              </el-text>
              <el-text tag="p">
                5.本站正在持续更新和适配移动端，如UI错位或功能出错请 <el-button link title="前往反馈" type="primary"
                  @click="changePage(3, 2)">留言反馈</el-button>
                。
              </el-text>
              <el-text tag="p" type="danger">6.
                本站所提供的所有资源均来自网络,侵权请联系删除</el-text>
            </el-card>
          </el-collapse-item>
          <el-collapse-item title="友情链接" :name="2">
            <template class="friendLinks">
              <el-link target="_blank" href="https://letsgofishing5.github.io/lsgfish-resource-sharing/"
                title="资源收藏与分享">
                <el-button><img src="../assets/home/custom.png" alt="" style="width: 25px">&ensp;
                  lsgfish-resource-sharing
                </el-button>
              </el-link>
              <el-link target="_blank" href="https://answer.lilemy.cn/" title="小新问答">
                <el-button><img src="@/assets/logo.xiaoxin.png" alt="" style="width: 25px">&ensp;
                  小新问答
                </el-button>
              </el-link>
            </template>
          </el-collapse-item>
          <el-collapse-item title="隐私政策" :name="3">
            <el-card class="privacyStatement">
              <p>
                本站与 Microsoft Clarity 合作，通过行为指标、热图和会话回放来捕捉您使用本站的轨迹，以改进本站的产品和服务。网站使用数据是通过第一方和第三方
                Cookie 以及其他跟踪技术捕获的，以确定产品和服务的受欢迎程度和在线活动。此外，本站将这些信息用于网站优化。有关
                Microsoft 如何收集和使用您的数据的更多信息，请访问
                <el-button link type="primary" :href="'https://privacy.microsoft.com/zh-CN/privacystatement'">Microsoft
                  隐私声明
                </el-button>。
              </p>
              <p>
                若您同意，则本站和 Microsoft 可以收集和使用此数据。您也可以点击此处<el-button link type="primary"
                  @click="clear_Clarity_cookie()">重置Clarity的cookie同意
                </el-button>。
              </p>
              <p><b>
                  PS:根据国家法律法规，本站仅收集访问者IP等身份信息。此外，本站使用Clarity收集访问者在本站的浏览轨迹以确定bug位置进行优化，相关的账号、密码等隐私信息均不会被采集。
                </b>
              </p>
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-transition>
    </el-tab-pane>
    <!--    更新相关-->
    <el-tab-pane :name="2" label="更新相关">
      <el-collapse-transition class="noticeContent">
        <el-collapse v-model="showFlag.active_num" accordion style="border: none;text-align: left">
          <!--    待更新的功能-->
          <el-collapse-item title="待更新的功能" :name="1">
            <template v-for="item in noUpdated" :key="item.id">
              <p><el-icon>
                  <Edit />
                </el-icon> {{ item.content }}</p>
            </template>
            <p><el-icon>
                <Edit />
              </el-icon>
              其他：<el-text type="info" size="small" tag="p">
                1. 导航网站的介绍页<br>
                2. 文章的封面设置<br>
                3. 新闻页面优化<br>
                4. 音乐——歌词<br>
                5. 文章和评论、公告都没有限制查询条数，每次都查询所有文章以及对应的所有评论<br>
                6. 给登录和注册加一张竖屏背景图或磨砂效果<br>
                7. 重构1999下载界面，重构角色图片关系表，添加其他9图，更换瀑布流实现插件<br>
                8. SSG或SSR优化<br>
                9. 按需引入elementplus组件和样式并减小打包体积：<br>
                10. 聊天界面时间不能实时更新，可以设置监听器，切换分钟时页面的getDiffTime重新加载一下<br>
                11. GenAI Script
              </el-text>
            </p>
          </el-collapse-item>
          <el-collapse-item title="已更新的公告" :name="2">
            <el-timeline style="padding-left: 0"><br>
              <el-timeline-item v-for="item in updateNotes.slice().reverse()" :key="item.id" style="text-align: left"
                :timestamp="item.time" placement="top">
                <el-card>
                  <el-text tag="p"> {{ item.title }}</el-text>
                  <el-text tag="p" type="info"> &ensp;{{ item.content }}</el-text>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-transition>
    </el-tab-pane>
    <!--联系和反馈-->
    <el-tab-pane :name="3" label="联系与反馈">
      <el-collapse-transition class="noticeContent">
        <el-collapse v-model="showFlag.active_num" v-show="showFlag.show_num === 3" accordion style="border: none">
          <!--联系方式-->
          <el-collapse-item title="联系方式" :name="1">
            <template style="display: flex;justify-content: space-around">
              <el-button link tag="a" type="primary"
                @click="copyText('50011502001039', 'QQ号', 'tencent://message/?uin=1224021291')">QQ
              </el-button>
              <el-button link tag="a" type="primary"
                @click="copyText('50011502001039', '微博主页链接', 'https://weibo.com/u/6869134755')">微博
              </el-button>
            </template>

          </el-collapse-item>
          <!--    留言反馈-->
          <el-collapse-item title="留言反馈" :name="2">
            <el-form style="margin: 0 5%">
              <el-form-item>
                <el-input type="text" v-model.trim="contact" maxlength="30" placeholder="[选填]可在此填写联系方式"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input type="textarea" v-model.trim="content" minlength="5" maxlength="200" show-word-limit
                  placeholder="[必填]可在此提交建议、bug反馈或其他内容" />
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-transition>
    </el-tab-pane>
  </el-tabs>
  <!--备案号-->
  <Approve />
  <!--    <el-divider>已加载全部内容</el-divider>-->
  <!-- </el-scrollbar> -->
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { Edit } from "@element-plus/icons-vue";
import { ElCollapseTransition, ElMessage, TabsPaneContext } from 'element-plus'
//hooks
import useTimeStamp from "@/hooks/useTimestamp";
//components
import Approve from "@/components/Approve.vue";
//utils
import myFunction from "@/utils/myFunction";
//types
import { Notice } from "@/types/global";


const { copyText } = myFunction
const { getDiffTime } = useTimeStamp()
const router = useRouter()

const { showFlag, changePage } = defineProps(['showFlag', 'changePage'])//切换页面的参数

const updateNotes = reactive<Notice[]>([])//已更新的公告
const noUpdated = reactive<Notice[]>([])//未更新的公告
const contact = ref('')//反馈联系方式
const content = ref('')//反馈内容


onMounted(() => {
  getNotices()//获取公告
})

/*点击tabs标签时触发*/
const tabClick = (pane: TabsPaneContext, ev: Event) => {
  if (pane.paneName === 1) changePage(1, 1)
  else changePage(pane.paneName, 2)
}

//获取已发布公告
const getNotices = async () => {
  try {
    const result = await axios({
      url: '/getNotices',
      params: { sort: ['updateNotes', 'noUpdated'] }
    })
    // console.log(result)
    const { noticeList } = result.data
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


//清除全部cookie
const delAllCookie = () => {
  const cookies = document.cookie.split(";")

  cookies.forEach(cookie => {
    const [name] = cookie.split("=");
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  })

  if (cookies.length > 0) {
    const domain = `.${location.host.split('.').slice(-2).join('.')}` // 顶级域名
    cookies.forEach(cookie => {
      const [name] = cookie.split("=")
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`
    })
  }
  console.log('已删除全部本地cookie');
}
const clear_Clarity_cookie = () => {
  // window.clarity('consent', false)
  delAllCookie()
  ElMessage.success('已重置同意，刷新后可选择拒绝cookie')
  setTimeout(() => { location.reload() }, 1500)
}
</script>

<style scoped>
.noticeContent {
  height: 300px;
  overflow-y: scroll;
}

.friendLinks {
  display: flex;
  justify-content: flex-start;
}

.friendLinks .el-link {
  margin: 0 10px;
}

p {
  text-align: left;
  text-indent: 1em;
  word-spacing: 1px;

  .el-button {
    margin: 0;
    word-spacing: 0;
  }
}
</style>
