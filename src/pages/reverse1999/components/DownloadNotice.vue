<template>
  <div class="downloadNotice">
    <!--    导航栏-->
    <el-tabs v-model="showNum" @tab-click="tabClick">
      <!--少量下载说明-->
      <el-tab-pane label="少量下载" :name="1">
        <el-card>
          <p class="title">默认情况下，你可以一次性批量下载最多{{ downloadLimitNum }}张图片。</p>
          <p>
            1.如果你下载的数量不多，
            <el-text type="primary">长按或右键保存</el-text>
            更快且不消耗本站流量。
          </p>
          <p>
            2.如果你要一次性下载更多图片，请查看
            <el-link type="primary" @click="changePage(2)">下载大量(仅限PC)</el-link>
            。
          </p>
          <p>
            3.如果你想了解更多信息，请查看
            <el-link type="primary" @click="changePage(3, 1)">其它说明</el-link>
            。
          </p>
        </el-card>
      </el-tab-pane>
      <!--大量下载说明-->
      <el-tab-pane label="下载大量(仅限PC)" :name="2">
        <el-card>
          <p class="title">
            如果你要一次性下载大于{{ downloadLimitNum }}张或更多图片，这里有两种方式
            <span class="primary">(仅限Windows电脑端)</span>：
          </p>
          <p>
            1.点击下载
            <el-link href="https://wwqb.lanzout.com/iN0An2iuvrrg" target="_blank" type="success"> EXE格式(14.7MB) </el-link>
            ，双击运行，允许联网即可。
          </p>
          <p>
            2.点击下载
            <el-link href="https://wwqb.lanzout.com/inNks2iuwojg" target="_blank" type="success">JS脚本压缩包(2.4MB) </el-link>
            。使用方式：电脑配有
            <el-link
              title="点击前往Node.Js中文官网"
              type="primary"
              @click="copyText('https://nodejs.org/zh-cn', 'Node.Js中文官网地址', 'https://nodejs.org/zh-cn')"
              >Node.js环境
            </el-link>
            ，在脚本所在目录的CMD窗口输入命令
            <el-text type="primary">node i</el-text>
            安装依赖，然后输入
            <el-text type="primary">npm run server</el-text>
            即可运行。
          </p>
          <p>
            3.另有下载器
            <el-link href="https://wwqb.lanzout.com/iNPEp2iuvrih" target="_blank" type="success"> EXE格式(14.9MB) </el-link
            >，使用方式请查看
            <el-link
              title="点击前往download-reverse1999"
              type="primary"
              @click="
                copyText(
                  'https://gitee.com/MuXi-Dream/download-reverse1999',
                  '默默的Gitee链接',
                  'https://gitee.com/MuXi-Dream/download-reverse1999'
                )
              "
              >Gitee
            </el-link>
          </p>
          <p>
            <b>
              满足以上任一条件，再次点击
              <span class="primary">开始下载</span>
              即可进行正常下载。</b
            >
          </p>
        </el-card>
      </el-tab-pane>
      <!--其它说明-->
      <el-tab-pane label="其它说明" :name="3">
        <el-collapse v-model="activeNum" accordion>
          <el-collapse-item :name="1" title="Q：为什么要作出限制？">
            <p class="title">A：</p>
            <p>
              网站图片提供
              <span class="warning">下载需要流量费</span>
              ，工资微薄，为防止恶意刷流量，所以限制每次只能下载{{ downloadLimitNum }}张图，如需批量下载更多请通过
              <el-link type="primary" @click="changePage(2)">下载大量(仅限PC)</el-link>
              的方式进行下载。
            </p>
          </el-collapse-item>
          <el-collapse-item :name="2" title="Q：两种下载方式有什么区别？">
            <p class="title">A：</p>
            <p>
              1.
              <el-link type="primary" @click="changePage(1)">少量下载</el-link>
              ：本站已从深蓝官网下载并分类备份了全部以影像之图片，少量下载将
              <span class="primary">从本站服务器</span>
              下载图片到你的电脑，尚在默默的承受范围内；
            </p>
            <p>
              2.
              <el-link type="primary" @click="changePage(2)">大量下载</el-link>
              ：通过默默提供的脚本，在你的本地运行一个网站代理，再从本地直接从
              <el-link
                title="点击前往重返未来1999官网"
                type="primary"
                @click="
                  copyText(
                    'https://re.bluepoch.com/home/detail.html#wallpaper',
                    '重返未来1999官网',
                    'https://re.bluepoch.com/home/detail.html#wallpaper'
                  )
                "
                >重返未来1999官网
              </el-link>
              下载图片(简单来说就是，你直接从重返未来1999官网下载，不通过默默的中转，不会额外消耗默默的带宽和流量)
            </p>
          </el-collapse-item>
          <el-collapse-item :name="3" title="Q：还有什么要狡辩的吗？">
            <p class="title">A：</p>
            <p>1.本着为爱发颠为大家提供这个便利功能(虽然平时用不上)，希望大家多多支持(遇到bug热心反馈一下)！</p>
            <p>
              2.关于下载的脚本，可前往
              <el-link title="Github 和 Gitee" type="primary" @click="showUrl = !showUrl"> 本项目开源地址 </el-link>
              <Transition name="transition1">
                <el-link
                  v-if="showUrl"
                  href="https://gitee.com/MuXi-Dream/download-reverse1999"
                  style="margin-left: 6px"
                  target="_blank"
                  type="primary"
                >
                  Gitee
                </el-link> </Transition
              >&ensp;
              <Transition name="transition1">
                <el-link v-if="showUrl" href="https://github.com/ADarkDream/Download-Reverse1999" target="_blank" type="primary">
                  GitHub
                </el-link>
              </Transition>
              查看详细的说明
            </p>
            <p>
              3.关于做这个的初衷：最开始是因为热爱(个人喜欢收集壁纸)，人力一张一张搜罗，然后上传网盘；后来是践行所学(为了偷懒)，写了脚本开始批量下载；至于现在嘛，都做了这么多了，何不一步做完呢？边学边做，边做边学，学以致用嘛。
            </p>
            <p>
              4.如果你想使用默默的壁纸列表接口或角色信息列表
              <el-button link type="primary" target="_blank" title="点击前往API文档(无偿但不公开)" @click="contact_momo()">
                API文档，无偿提供，但为了防止被滥用，请联系默默
              </el-button>
              。
            </p>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
    <br />
    <div>
      <el-link class="statement" title="点击查看赞助界面" type="warning" @click="showPayCodePanel()"
        >若有意可在本页底部
        <span class="primary">群聊和赞助</span>
        处为默默提供援助，拜谢(≧*∀*≦)。
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { TabsPaneContext } from "element-plus"
//utils
import titleDiv from "@/utils/titleDiv"
import myFunction from "@/utils/myFunction"

const { showFlag, showPayCodePanel, downloadLimitNum } = defineProps(["showFlag", "showPayCodePanel", "downloadLimitNum"]) //切换页面的参数
const { copyText } = myFunction

const showNum = ref<number>(1) //控制下载须知的显示第几个页面
const activeNum = ref<number>(1) //展开第几条,因为设置了accordion，所以必须是字符串格式
const showUrl = ref(false) //控制开源地址的显示

onMounted(() => {
  if (showFlag) changePage(showFlag.showNum, showFlag.activeNum) //更换页面
})

/*点击tabs标签时触发*/
const tabClick = (pane: TabsPaneContext, ev: Event) => {
  if (pane.paneName === 3) changePage(3, 1)
}

//切换公告页面
const changePage = (show_num: number, active_num = 1) => {
  showNum.value = show_num
  setTimeout(() => (activeNum.value = active_num), 500)
}

const contact_momo = () => {
  copyText(
    "1224021291",
    "默默的联系方式(QQ)",
    "https://apifox.com/apidoc/shared-70082832-e502-49ac-a386-35af15bfd747/api-186774719"
  )
  titleDiv.showNotice({ show_num: 3, active_num: 3 })
}
</script>

<style scoped>
.downloadNotice p {
  line-height: 20px;
  text-indent: 1em;
  text-align: left;
  font-size: 15px;
}

.downloadNotice .title {
  text-indent: 0;
  font-weight: bold;
  font-size: 16px;
}

.downloadNotice .el-link {
  text-indent: 0;
}

/*移动端*/
@media (max-width: 780px) {
  .downloadNotice p {
    font-size: 13px;
  }

  .downloadNotice .title {
    text-indent: 0;
    font-weight: bold;
    font-size: 14px;
  }
}
</style>
