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
                <div v-for="(item, index) in siteLink" :key="item.id" style="display: inline">
                  <el-button link :title="item.title" :type="item.type" @click="router.push({ name: item.pathName })"
                    >{{ item.name }}
                  </el-button>
                  <span v-if="index !== siteLink.length - 1">、</span>
                </div>
                等功能。
              </el-text>
              <el-text tag="p">
                2.工具资源群：
                <el-button
                  link
                  target="_blank"
                  type="primary"
                  @click="copyText(contactGroup[0].value, contactGroup[0].name, contactGroup[0].url)"
                  :title="contactGroup[0].title"
                  >{{ contactGroup[0].name }}
                </el-button>
                ;重返未来群：
                <el-button
                  link
                  target="_blank"
                  type="primary"
                  @click="copyText(contactGroup[1].value, contactGroup[1].name, contactGroup[1].url)"
                  :title="contactGroup[1].title"
                  >{{ contactGroup[1].name }} </el-button
                >。
              </el-text>
              <el-text tag="p">
                3.若首页导航网站无法访问，请使用Chrome、Edge、Firefox等浏览器或尝试VPN，也可能是因为该网站维护中或已关闭【太久没校验了】。
              </el-text>
              <el-text tag="p"
                >4.你可以
                <el-text
                  tag="a"
                  type="success"
                  href="https://mp-00526be3-cd12-41bd-84f7-bfbce63bb7d0.cdn.bspapp.com/test1/BookMarks_2023_8_15_2.zip"
                  title="下载书签"
                  >下载
                </el-text>
                并解压出HTML文件，导入到自己的浏览器收藏夹。导入步骤可参考教程视频：
                <el-text
                  tag="a"
                  target="_blank"
                  type="primary"
                  href="https://www.bilibili.com/video/BV1rr4y1S79J/"
                  title="B站教程视频"
                  >点击此处
                </el-text>
                。
              </el-text>
              <el-text tag="p">
                5.本站正在持续更新和适配移动端，如UI错位或功能出错请
                <el-button link title="前往反馈" type="primary" @click="changePage(3, 2)">留言反馈</el-button>
                。
              </el-text>
              <el-text tag="p" type="danger">6.本站所提供的所有资源均来自网络,侵权请联系删除。</el-text>
              <el-text tag="p"
                >7.快速记忆本站域名：<el-text type="success">muxi</el-text><el-text type="primary">dream</el-text>.<el-text
                  type="info"
                  >cn</el-text
                >，分别指<el-text type="success">木夕</el-text><el-text type="primary">梦</el-text>，而<el-text type="success"
                  >木夕</el-text
                >是<el-text type="primary">梦</el-text>这个字的拆解；<el-text type="info">cn</el-text
                >是中国国家顶级域名，代指中国。</el-text
              >
            </el-card>
          </el-collapse-item>
          <el-collapse-item title="友情链接" :name="2">
            <div class="friendLinks">
              <el-link v-for="(item, index) in friendlyLink" :key="index" target="_blank" :href="item.url" :title="item.title"
                ><el-image class="link_ico" :src="item.imgUrl || customIco" :alt="item.name">
                  <template #error> <img class="link_ico" :src="customIco" :alt="item.name" /> </template></el-image
                >{{ item.name }}
              </el-link>
            </div>
          </el-collapse-item>
          <el-collapse-item title="隐私政策" :name="3">
            <el-card class="privacyStatement">
              <p>
                本站与 Microsoft Clarity
                合作，通过行为指标、热图和会话回放来捕捉您使用本站的轨迹，以改进本站的产品和服务。网站使用数据是通过第一方和第三方
                Cookie 以及其他跟踪技术捕获的，以确定产品和服务的受欢迎程度和在线活动。此外，本站将这些信息用于网站优化。有关
                Microsoft 如何收集和使用您的数据的更多信息，请访问
                <el-button link type="primary" :href="'https://privacy.microsoft.com/zh-CN/privacystatement'"
                  >Microsoft 隐私声明 </el-button
                >。
              </p>
              <p>
                若您同意，则本站和 Microsoft 可以收集和使用此数据。您也可以点击此处<el-button
                  link
                  type="primary"
                  @click="clear_Clarity_cookie()"
                  >重置Clarity的cookie同意 </el-button
                >。
              </p>
              <p>
                <b>
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
        <el-collapse v-model="showFlag.active_num" accordion style="border: none; text-align: left">
          <!--    待更新的功能-->
          <el-collapse-item title="待更新的功能" :name="1">
            <template v-for="item in noUpdated" :key="item.id">
              <p>
                <el-icon>
                  <Edit />
                </el-icon>
                {{ item.content }}
              </p>
            </template>
            <p>
              <el-icon>
                <Edit />
              </el-icon>
              其他：<el-text
                v-for="(item, index) in otherNoUpdated"
                type="info"
                size="small"
                tag="p"
                :style="{ 'text-decoration': item.isCompleted ? 'line-through' : 'none' }"
              >
                {{ index + 1 }}.{{ item.text }}
              </el-text>
            </p>
          </el-collapse-item>
          <el-collapse-item title="已更新的公告" :name="2">
            <el-timeline style="padding-left: 0"
              ><br />
              <el-timeline-item
                v-for="item in updateNotes.slice().reverse()"
                :key="item.id"
                style="text-align: left"
                :timestamp="item.time"
                placement="top"
              >
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
            <template style="display: flex; justify-content: space-around">
              <el-button
                v-for="item in contact"
                :key="item.id"
                link
                tag="a"
                type="primary"
                @click="copyText(item.value, item.title, item.url)"
                >{{ item.name }}
              </el-button>
            </template>
          </el-collapse-item>
          <!--    留言反馈-->
          <el-collapse-item title="留言反馈" :name="2">
            <el-form style="margin: 0 5%">
              <el-form-item>
                <el-input
                  type="text"
                  v-model.trim="feedback.contact"
                  maxlength="30"
                  placeholder="[选填]可在此填写联系方式"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  type="textarea"
                  v-model.trim="feedback.content"
                  minlength="5"
                  maxlength="200"
                  show-word-limit
                  placeholder="[必填]可在此提交建议、bug反馈或其他内容"
                />
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
import { useRouter } from "vue-router"
import { Edit } from "@element-plus/icons-vue"
import { TabsPaneContext } from "element-plus"
//stores
import { useNoticeStore } from "@/store/useNoticeStore"
//hooks
// import useTimeStamp from "@/hooks/useTimestamp";
import useNotice from "@/hooks/useNotice"
//components
import Approve from "@/components/Approve.vue"
//utils
import myFunction from "@/utils/myFunction"
import titleDiv from "@/utils/titleDiv"
//files
import customIco from "@/assets/home/custom.png"

const noticeStore = useNoticeStore()
const { updateNotes, noUpdated, feedback } = toRefs(noticeStore)
const { copyText } = myFunction
// const { getDiffTime } = useTimeStamp()
const { getNotices, submitFeedback } = useNotice()
const router = useRouter()

const { showFlag, changePage } = defineProps(["showFlag", "changePage"]) //切换页面的参数

//站点链接
const siteLink = [
  { id: 1, type: "primary", title: "首页导航", name: "站点导航", pathName: "home", url: "" },
  { id: 2, type: "primary", title: "论坛文章", name: "论坛文章", pathName: "forum", url: "" },
  { id: 3, type: "primary", title: "重返未来相关界面", name: "重返未来官图筛选和下载", pathName: "reverse1999", url: "" },
  { id: 4, type: "primary", title: "在线音乐播放", name: "在线音乐播放", pathName: "music", url: "" },
]

//联系方式
const contactGroup = [
  {
    id: 1,
    title: "点击前往QQ",
    name: "Resource sharing群",
    value: "1005993749",
    url: "https://qm.qq.com/cgi-bin/qm/qr?k=64Jtp9gH81G0ndqR_TGeUZLrP_MKE9eU&jump_from=webapi&authKey=BkihB0yK7m3dhvou57J/OPWP+7BsDBirgRKjud/BIWnXa9pM40wSwo0ORdMHlE5V",
    imgUrl: "",
  },
  { id: 2, title: "点击前往QQ", name: "金兔子特供部门🐰", value: "904688184", url: "https://qm.qq.com/q/Oq8R7YS6sM", imgUrl: "" },
]

//联系方式
const contact = [
  { id: 1, title: "QQ号", name: "QQ", value: "1224021291", url: "tencent://message/?uin=1224021291", imgUrl: "" },
  {
    id: 2,
    title: "微博首页地址",
    name: "微博",
    value: "https://weibo.com/u/6869134755",
    url: "https://weibo.com/u/6869134755",
    imgUrl: "",
  },
  {
    id: 3,
    title: "Gitee首页地址",
    name: "Gitee",
    value: "https://gitee.com/MuXi-Dream",
    url: "https://gitee.com/MuXi-Dream",
    imgUrl: "",
  },
  {
    id: 4,
    title: "GitHub首页地址",
    name: "GitHub",
    value: "https://github.com/ADarkDream",
    url: "https://github.com/ADarkDream",
    imgUrl: "",
  },
]

//友情链接
const friendlyLink = [
  { id: 1, title: "资源收藏与分享", name: "lsgfish-resource-sharing", url: "" },
  { id: 2, title: "小新书", name: "小新书", url: "https://lilemy.cn/", imgUrl: "https://lilemy.cn/favicon.ico" },
]

//其他待做
const otherNoUpdated = [
  { id: 1, text: "导航网站的介绍页", isCompleted: false },
  { id: 2, text: "文章的封面设置", isCompleted: false },
  { id: 3, text: "新闻页面优化", isCompleted: true },
  { id: 4, text: "音乐——歌词", isCompleted: false },
  { id: 5, text: "文章和评论、公告都没有限制查询条数，每次都查询所有文章以及对应的所有评论", isCompleted: false },
  { id: 6, text: "给登录和注册加一张竖屏背景图或磨砂效果", isCompleted: false },
  { id: 7, text: "重构1999下载界面，重构角色图片关系表，添加其他9图，更换瀑布流实现插件", isCompleted: false },
  { id: 8, text: "SSG或SSR优化", isCompleted: false },
  { id: 9, text: "按需引入elementplus组件和样式并减小打包体积：", isCompleted: true },
  { id: 10, text: "聊天界面时间不能实时更新，可以设置监听器，切换分钟时页面的getDiffTime重新加载一下", isCompleted: false },
  { id: 11, text: "GenAI Script", isCompleted: false },
]

onMounted(() => {
  if (showFlag.show_num === 2 && updateNotes.value.length === 0) getNotices(["updateNotes", "noUpdated"]) //获取公告
})

/*点击tabs标签时触发*/
const tabClick = (pane: TabsPaneContext, ev: Event) => {
  if (pane.paneName === 2 && updateNotes.value.length === 0) getNotices(["updateNotes", "noUpdated"]) //获取公告
  if (pane.paneName === 1) changePage(1, 1)
  else changePage(pane.paneName, 2)
}

/**
 * 清除Clarity的cookie(本地全部ookie)
 */
const clear_Clarity_cookie = () => {
  // window.clarity('consent', false)
  titleDiv.delAllCookie()
  ElMessage.success("已重置同意，刷新后可选择拒绝cookie")
  setTimeout(() => {
    location.reload()
  }, 1500)
}
</script>

<style scoped>
.noticeContent {
  height: 300px;
  overflow-y: scroll;
}

/* 友情链接 */
.friendLinks {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .el-link {
    margin: 2px 5px;
    font-weight: bold;

    .link_ico {
      width: 25px;
      height: 25px;
      padding-right: 5px;
    }
  }
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
