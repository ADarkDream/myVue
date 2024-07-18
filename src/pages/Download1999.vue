<template>
  <el-scrollbar :height="(isPC? screenHeight-80 : screenHeight-40)+'px'  ">
    <el-container>
      <el-header style="opacity: 0.85;">
        <el-card>
          <!--          <el-watermark-->
          <!--              :width="66"-->
          <!--              :height="26"-->
          <!--              :gap="[40,0]"-->
          <!--              :image="watermark"-->
          <!--          >-->
          <el-image class="logo" :src="logo" v-if="isPC"/>
          <h1>1999国服官图(以影像之)下载</h1>
          <!--          </el-watermark>-->
          <el-collapse v-model="activeIndex" accordion>
            <el-collapse-item title="资源文档" name="0">
              <template class="links">
                <el-link type="primary" title="Github 和 Gitee" @click="showUrl=!showUrl">
                  本项目开源地址
                </el-link>
                <Transition name="transition1">
                  <el-link v-if="showUrl" type="primary" href="https://gitee.com/MuXi-Dream/download-reverse1999"
                           target="_blank">
                    Gitee
                  </el-link>
                </Transition>
                <Transition name="transition1">
                  <el-link v-if="showUrl" type="primary" href="https://github.com/ADarkDream/Download-Reverse1999"
                           target="_blank">
                    Github
                  </el-link>
                </Transition>
                <el-link type="primary" href="https://re.bluepoch.com/home/detail.html#wallpaper" target="_blank"
                         title="点击前往重返未来1999官网">
                  官网下载地址
                </el-link>
                <el-link type="primary" href="https://pan.baidu.com/s/1A4o9VM4kPa_vzWZEtHiZSA?pwd=1999"
                         target="_blank" title="点击前往百度网盘">
                  百度网盘下载地址
                </el-link>
                <el-button link type="primary" target="_blank"
                           @click="copyText('1224021291','我的联系方式(QQ)','https://apifox.com/apidoc/shared-70082832-e502-49ac-a386-35af15bfd747/api-186774719')"
                           title="点击前往API文档(无偿但不公开)">
                  API接口文档(需要密码请联系我)
                </el-button>
              </template>
            </el-collapse-item>
            <el-collapse-item title="筛选条件【所有条件不选则默认全选】" name="1">
              <el-form :label-position="isPC? 'left' : 'top' " :size="elSize">
                <el-form-item label="选择版本：">
                  <el-checkbox
                      v-model="checkAllVersions"
                      :indeterminate="isIndeterminateVersion"
                      @change="handleCheckAllVersionChange"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group v-model="condition.version" style="text-align: left"
                                     @change="handleCheckedVersionsChange">
                    <el-checkbox v-for="item in versionInfo" :key="item.version" :label="item.versionName"
                                 :value="item.version"/>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="选择角色：">
                  <el-button-group size="small" type="primary" :style="isPC? 'margin:5px':'margin:5px auto' ">
                    <el-button @click="reset">清空所有选择
                    </el-button>
                    <el-button @click="router.push({name:'roles'})">查看角色表</el-button>
                  </el-button-group>
                  <div class="roleSort">
                    <el-text type="primary">是否包含角色：</el-text>
                    <el-checkbox
                        v-model="checkAllRoles"
                        :indeterminate="isIndeterminateRole"
                        @change="handleCheckAllRoleChange"
                    >全选角色(仅包含角色)
                    </el-checkbox>
                    <el-checkbox
                        v-model="checkNoRole"
                        :indeterminate="isIndeterminateNoRole"
                        @change="handleCheckNoRoleChange"
                    >全选无角色(或未命名角色)
                    </el-checkbox>
                  </div>
                  <div class="roleSort">
                    <!--遍历阵营-->
                    <el-text type="primary">角色所属阵营：</el-text>
                    <el-checkbox v-for="(item,index) in campInfo" :key="index"
                                 @click="roleTypeChange(item,null)"
                                 @change="handleCheckCampChange">
                      {{ item }}
                    </el-checkbox>
                  </div>
                  <div class="roleSort">
                    <!--遍历种族-->
                    <el-text type="primary">角色所属种族：</el-text>
                    <el-checkbox v-for="(item,index) in raceInfo" :key="index"
                                 @click="roleTypeChange(null,item)"
                                 @change="handleCheckCampChange">
                      {{ item }}
                    </el-checkbox>
                  </div>
                  <el-checkbox-group v-model="condition.roles" style="text-align: left"
                                     @change="handleCheckedRolesChange">
                    <el-checkbox v-for="item in roleInfo" :key="item.id" :label="item.name"
                                 :value="item.id"/>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="图片类型：">
                  <el-radio-group v-model="condition.sort">
                    <el-radio-button label="全选" :value="2"/>
                    <el-radio-button label="横屏壁纸" :value="1"/>
                    <el-radio-button label="竖屏壁纸" :value="0"/>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="查询类型：">
                  <el-radio-group v-model="condition.accurate">
                    <el-radio-button label="模糊查询" :value="0"/>
                    <el-radio-button label="精准查询" :value="1"/>
                  </el-radio-group>
                  <el-icon style="margin:0 5px" @click="isShowNotice=!isShowNotice">
                    <InfoFilled/>
                  </el-icon>
                  <Transition name="transition1">
                    <el-text v-show="isShowNotice">
                      <el-text type="primary">模糊查询会优先满足版本要求</el-text>
                      ，然后查询包含勾选的角色的图；
                      <el-text type="warning">精准查询</el-text>
                      只查询
                      <el-text type="warning">同时满足所有条件</el-text>
                      的结果
                    </el-text>
                  </Transition>
                </el-form-item>
                <el-button type="primary" :size="elSize" :icon="Search" @click="getImages">筛选</el-button>
                <el-button type="warning" :size="elSize" :icon="Warning" @click="showNotice = true" v-show="isShow">
                  下载须知
                </el-button>
                <br v-if="!isPC">
                <el-button :type="isChoose!==0? 'danger':'success' " :size="elSize"
                           :icon="isChoose!==0? CloseBold : Select"
                           @click="selectBtn()" v-show="isShow">
                    <span
                        v-if="isChoose===0">勾选
                    </span>
                  <span v-else-if="isChoose===1">取消全选</span>
                  <span v-else>退出勾选</span>
                </el-button>
                <el-button type="success" :size="elSize" :icon="Download" @click="downloadImages" v-show="isShow">开始下载
                </el-button>
                <br>
                <div class="statement">

                  <el-text type="danger" v-show="isShow&&!isPC">
                    注意：移动端浏览器可能无法批量下载，如尝试下载等待之后没有反应，请切换浏览器或长按图片保存。<br>
                  </el-text>
                  <el-text type="success">本站仅供技术学习和交流分享，如果涉及侵权请联系我删除。</el-text>
                </div>
              </el-form>
            </el-collapse-item>
            <el-collapse-item title="待完善功能" style="text-align: left" name="2">
              <template v-for="(item,index) in  unCompleted.slice().reverse()" :key="index">
                <el-icon>
                  <Edit/>
                </el-icon>
                <el-text>&ensp;{{ item.content }}</el-text>
                <br></template>
            </el-collapse-item>
            <el-collapse-item title="已实现功能" style="text-align: left" name="3">
              <template v-for="(item,index) in completed.slice().reverse()" :key="index">
                <el-icon>
                  <Check/>
                </el-icon>
                <el-text>&ensp;{{ item.content }}</el-text>
                <br></template>
            </el-collapse-item>

            <el-collapse-item title="其它" name="4">
              <el-text>欢迎通过
                <el-text type="success">公告→其它→反馈</el-text>
                向我提出功能建议或BUG。
                也欢迎来咱们九群玩
                <el-button link type="primary" target="_blank"
                           @click="copyText('904688184','QQ群号','https://qm.qq.com/q/Oq8R7YS6sM')"
                           title="点击前往QQ">
                  点击加入群聊【金兔子特供部门🐰】
                </el-button>
              </el-text>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-header>
      <el-button-group class="btnGroup" type="info" :size="elSize" v-show="isShow">
        <el-button @click="autoCol" :type="autoFlag ?'primary':'info' ">
          <svg t="1718341380597" class="el-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="5304" width="200" height="200">
            <path
                d="M832 896H730.56l-72.576-210.24H361.856L293.44 896H192l270.848-768h98.24L832 896zM629.504 598.976L522.112 279.68c-3.392-10.176-7.04-28.096-11.008-53.504H508.8c-3.392 23.168-7.232 40.96-11.456 53.504l-106.56 319.296h238.72z"
                p-id="5305"></path>
          </svg>
          <span>自动</span></el-button>
        <el-button @click="colNum=3;autoFlag=false " :type="autoFlag===false&&colNum===3 ?'primary':'info' ">
          <svg t="1718333094288" class="el-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="2024" width="200" height="200">
            <path
                d="M469.333333 138.666667v277.333333a53.393333 53.393333 0 0 1-53.333333 53.333333H138.666667a53.393333 53.393333 0 0 1-53.333334-53.333333V138.666667a53.393333 53.393333 0 0 1 53.333334-53.333334h277.333333a53.393333 53.393333 0 0 1 53.333333 53.333334z m416-53.333334H608a53.393333 53.393333 0 0 0-53.333333 53.333334v277.333333a53.393333 53.393333 0 0 0 53.333333 53.333333h277.333333a53.393333 53.393333 0 0 0 53.333334-53.333333V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334zM416 554.666667H138.666667a53.393333 53.393333 0 0 0-53.333334 53.333333v277.333333a53.393333 53.393333 0 0 0 53.333334 53.333334h277.333333a53.393333 53.393333 0 0 0 53.333333-53.333334V608a53.393333 53.393333 0 0 0-53.333333-53.333333z m469.333333 0H608a53.393333 53.393333 0 0 0-53.333333 53.333333v277.333333a53.393333 53.393333 0 0 0 53.333333 53.333334h277.333333a53.393333 53.393333 0 0 0 53.333334-53.333334V608a53.393333 53.393333 0 0 0-53.333334-53.333333z"
                fill="currentColor" p-id="2025"></path>
          </svg>
          <span>3列</span>
        </el-button>
        <el-button @click="colNum=5;autoFlag=false " :type="autoFlag===false&&colNum===5 ?'primary':'info' ">
          <svg t="1718332863471" class="el-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="1704" width="200" height="200">
            <path
                d="M768 768 1024 768 1024 1024 768 1024 768 768ZM384 768 640 768 640 1024 384 1024 384 768ZM0 768 256 768 256 1024 0 1024 0 768ZM768 384 1024 384 1024 640 768 640 768 384ZM384 384 640 384 640 640 384 640 384 384ZM0 384 256 384 256 640 0 640 0 384ZM768 0 1024 0 1024 256 768 256 768 0ZM384 0 640 0 640 256 384 256 384 0ZM0 0 256 0 256 256 0 256 0 0Z"
                fill="currentColor" p-id="1705"></path>
          </svg>
          <span>5列</span>
        </el-button>
      </el-button-group>


      <!--    第三方库，瀑布流标签-->

      <wc-flow-layout :gap="10" :cols="colNum">
        <div v-for="item in imgList" :key="item.imgIndex" @click="checkImage(item.imgUrl,item.imgName,$event)"
             class="preImg"
             :id="'imgDiv-'+item.imgIndex">
          <el-image :src="item.imgUrl" :zoom-rate="1.2" :id="'img-'+item.imgIndex"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="isChoose!==0? [] : previewImgList"
                    :initial-index="item.imgIndex"
                    fit="scale-down"
                    lazy>
            <template #error>
              <div class="image-slot">
                <el-icon style="width: 50px">
                  <icon-picture/>
                </el-icon>
              </div>
            </template>
          </el-image>
        </div>
      </wc-flow-layout>
    </el-container>

  </el-scrollbar>

  <!--  下载公告界面-->
  <el-dialog v-model="showNotice" :width="isPC? '60%':'90%' " :show-close="!isPC"
             style="z-index: 500"
             destroy-on-close>
    <template #header><span style="font-size: 24px">下载须知</span></template>
    <!--    导航栏-->
    <el-menu mode="horizontal" default-active="1">
      <el-menu-item index="1" @click="isShowNum=1">
        少量下载
      </el-menu-item>
      <el-menu-item index="2" @click="isShowNum=2">
        下载大量(仅限PC)
      </el-menu-item>
      <el-menu-item index="3" @click="isShowNum=3">
        详细说明
      </el-menu-item>
    </el-menu>

    <!--少量下载说明-->
    <el-collapse-transition v-show="isShowNum===1" style="text-align: left;">
      <el-card>默认情况下，你可以一次性批量下载最多5张图片。
        <el-text type="warning">本站巅峰下载速度才2MB/S</el-text>
        <br>
        <el-text class="text">1.如果你下载的数量不多，
          <el-text type="primary">长按或右键</el-text>
          保存更快。
        </el-text>
        <br>
        <el-text class="text">
          2.如果你要一次性下载更多图片，请查看
          <el-text type="primary">下载大量(仅限PC)</el-text>
          。
        </el-text>
        <br>
        <el-text class="text">3.如果你想了解更多信息，请查看
          <el-text type="primary">详细说明</el-text>
          。
        </el-text>
      </el-card>
    </el-collapse-transition>

    <!--大量下载说明-->
    <el-collapse-transition v-show="isShowNum===2" style="text-align: left;">
      <el-card>如果你要一次性下载大于五张或更多图片，这里有两种方式(
        <el-text type="primary">仅限Windows电脑端</el-text>
        )：
        <el-text type="warning">下载速度完全取决于你的网速</el-text>
        <br>
        <el-text class="text">
          1.点击下载
          <el-link href="https://wwo.lanzout.com/ifh7w228mjod" target="_blank" type="success">
            EXE格式(38.5MB)[密码:1999]
          </el-link>
          ，双击运行，允许联网即可。
        </el-text>
        <br>
        <el-text class="text">
          2.点击下载
          <el-link href="https://wwo.lanzout.com/i7vSy2298l5i" target="_blank"
                   type="success">JS脚本压缩包(11KB)
          </el-link>
          。使用方式：电脑配有
          <el-text type="primary">Node.js环境</el-text>
          ，在脚本所在目录的CMD窗口输入命令
          <el-text type="primary"> node i</el-text>
          安装依赖，然后输入
          <el-text type="primary">node 1999server.js</el-text>
          即可运行。
        </el-text>
        <br>
        满足以上任一条件，再次点击
        <el-text type="primary">开始下载</el-text>
        即可进行正常下载。
      </el-card>
    </el-collapse-transition>
    <!--详细说明-->
    <el-collapse-transition v-show="isShowNum===3">
      <el-collapse style="text-align: left;" accordion>
        <el-collapse-item name="1" title="Q：为什么要作出限制？">
          <el-text class="text">
            A：网站图片提供
            <el-text type="primary">下载需要带宽</el-text>
            ，而我的服务器
            <el-text type="primary">带宽有限</el-text>
            且
            <el-text type="primary">网速较慢</el-text>
            ，如果
            <el-text type="danger">带宽耗尽</el-text>
            我只能暂时
            <el-text type="danger">关闭网站</el-text>
            了。
          </el-text>
        </el-collapse-item>
        <el-collapse-item name="2" title="Q：两种下载方式有什么区别？">
          <el-text class="text">
            A：1.
            <el-text type="primary">少量下载</el-text>
            ：通过本站从深蓝官网的服务器下载图片，然后我将图片发送到你的电脑，会消耗我双倍带宽(上传+下载)【因为网站跨域配置了代理】，但少量下载还在我的承受范围内；
          </el-text>
          <br>
          <el-text class="text">
            2.
            <el-text type="primary">大量下载</el-text>
            ：通过我提供的脚本，在你的本地可以运行一个网站代理，再从本地直接从深蓝官网下载图片(简单来说就是，你直接从深蓝官网下载，不通过我的中转，不会额外消耗我的带宽)
          </el-text>
        </el-collapse-item>
        <el-collapse-item name="3" title="Q：还有什么要狡辩的吗？">
          <el-text class="text">
            A：1.技术有限，只能做到防君子不防小人(你可以每次刷新选五张下载然后再刷新)。本着为爱发颠为大家提供这个便利功能(虽然平时用不上)，如果带宽耗尽后续可能就不会提供
            <el-text type="primary">少量下载</el-text>
            服务了，仅提供
            <el-text type="primary">分类查询</el-text>
            和
            <el-text type="primary">大量下载</el-text>
            (自己动手丰衣足食)。
          </el-text>
          <br>
          <el-text class="text">
            2.关于下载的脚本，可前往
            <el-link style="margin: 0 3px" type="success" href="https://gitee.com/MuXi-Dream/download-reverse1999"
                     target="_blank">开源地址
            </el-link>
            查看详细的说明(不过我最近没更新,里面还是批量下载功能的旧代码，没有代理服务器的部分)
          </el-text>
          <br>
          <el-text class="text">
            3.关于做这个的初衷：最开始是因为热爱(个人喜欢收集壁纸)，人力一张一张搜罗，然后上传网盘；后来是践行所学(为了偷懒)，写了脚本开始批量下载；至于现在嘛，都做了这么多了，何不一步做完呢？边学边做，边做边学，学以致用嘛。
          </el-text>
          <br>
          <el-text class="text">
            4.如果你想使用我的壁纸列表接口或角色信息列表接口，无偿，但为了防止被滥用，请联系我。
          </el-text>
        </el-collapse-item>
      </el-collapse>
    </el-collapse-transition>
    <br>
    <div class="statement">
      <el-text type="success">本站仅供技术学习和交流分享，如果涉及侵权请联系我删除。</el-text>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from 'vue'
import {
  Check, CloseBold,
  Download,
  Edit, InfoFilled,
  Picture as IconPicture,
  Search,
  Select, Warning,
} from "@element-plus/icons-vue";
import axios from "axios";
import {ElCollapseTransition, ElMessage, ElMessageBox} from "element-plus";
import useResponsive from "@/hooks/useResponsive";
import useUserInfo from "@/hooks/useUserInfo";
import {useRouter} from "vue-router";
import useFunction from "@/hooks/useFunction";
import watermark from '@/assets/logo_1999.png'
import logo from '@/assets/logo-small.png'

const {copyText, deepEqual} = useFunction()
const router = useRouter()
const {isPC, elSize, screenWidth, screenHeight} = useResponsive()
const {isLogin, updateLocalUserInfo} = useUserInfo()

//用户查询的参数
const condition = reactive<ImgParams>({
      version: [],
      roles: [],
      sort: 2,
      accurate: 0
    }
)
//用户上一次查询的参数
const oldCondition = reactive<ImgParams>({
  version: ['all'],
  roles: [],
  sort: 2,
  accurate: 0
})

//筛选
const activeIndex = ref('1')  //激活的折叠面板序号
const versionInfo = reactive<VersionInfo[]>([])    //存版本信息
const roleInfo = reactive<Role[]>([]) //存角色信息
const campInfo = reactive<string[]>([]) //存阵营信息
const raceInfo = reactive<string[]>([]) //存种族信息

const checkAllVersions = ref(false)   //全选版本
const isIndeterminateVersion = ref(false)  //全选版本按钮状态
const checkAllRoles = ref(false)   //全选角色
const checkNoRole = ref(false)   //全选无角色
const isIndeterminateRole = ref(false)  //全选角色按钮状态
const isIndeterminateNoRole = ref(false)  //全选无角色按钮状态
const campName = ref<string>('')      //阵营名称
const raceName = ref<string>('')      //种族名称

const completed = reactive<Notice[]>([])      //筛选下方的公告列表：完成和未完成的功能
const unCompleted = reactive<Notice[]>([])

const showUrl = ref(false)     //控制开源地址的显示
const showNotice = ref(false)     //控制下载须知界面的显示
const isShowNum = ref<number>(1)      //控制下载公告须知的显示第几个页面
const isShowNotice = ref(false)//控制模糊和精准搜索的说明是否显示
const imgList = reactive<ReverseImg[]>([])  //展示列表，存的图片信息对象
const previewImgList = reactive<string[]>([]) //大图展示列表，存的图片链接
const downloadList = reactive<ReverseImg[]>([])   //下载图片的列表

const isShow = ref(false)//显示布局按钮组
const colNum = ref<number>(isPC.value ? 5 : 1)    //修改显示列数

const autoFlag = ref(true)    //是否开启自动布局
const isChoose = ref(0)   //是否是批量选择状态

onMounted(() => {
  getVersion()
  getNotices()
  ElMessage.warning('如果页面出错请刷新两下，刷新后还没有可能是网站在升级，请稍后访问')
})


//全选版本：单选按钮的状态改变
const handleCheckAllVersionChange = (val: boolean) => {
  if (val) versionInfo.forEach(item => condition.version.push(item.version.toString()))
  else condition.version = []
  isIndeterminateVersion.value = false  //取消全选按钮符号 -
}
//单选版本：全选按钮的状态改变
const handleCheckedVersionsChange = () => {
  const checkedCount = condition.version.length
  checkAllVersions.value = checkedCount === versionInfo.length //全选时变更按钮为√
  isIndeterminateVersion.value = checkedCount > 0 && checkedCount < versionInfo.length//未全选时变更按钮为 -
}

//全选角色：单选按钮的状态改变
const handleCheckAllRoleChange = (val: boolean) => {
  if (val) roleInfo.forEach(item => condition.roles.push(item.id))
  else condition.roles = []
  isIndeterminateRole.value = false  //取消全选按钮符号 -
  console.log(condition.roles)
}
//单选角色：全选按钮的状态改变
const handleCheckedRolesChange = () => {
  const checkedCount = condition.roles.length
  checkAllRoles.value = checkedCount === roleInfo.length //全选时变更按钮为√
  isIndeterminateRole.value = checkedCount > 0 && checkedCount < roleInfo.length//未全选时变更按钮为 -
  console.log(condition.roles)
}

const typeFlag = ref(1)

//修改当前角色多选的条件(阵营或种族)
function roleTypeChange(camp: string, race: string) {
  if (!!camp) {
    campName.value = camp
    typeFlag.value = 1
  } else if (!!race) {
    raceName.value = race
    typeFlag.value = 2
  }
}

//全选或取消：阵营分类多选按钮，根据campInfo[]可以获取阵营名字
const handleCheckCampChange = (val: boolean) => {
  const newList: Set<number> = new Set(condition.roles)  //Set()不会保存重复值
  console.log(newList)
  //遍历角色列表
  roleInfo.forEach(item => {
    //val=true代表全选按钮被勾选，再添加和删除Set()函数newList中的值
    //Set()的has()判断是否存在该元素，add()添加不重复的元素，delete()直接删除该元素而不是数组下标
    if (typeFlag.value === 1) {//筛选阵营
      if (item.camp === campName.value) !!val ? newList.add(item.id) : newList.delete(item.id)
    } else if (typeFlag.value === 2) {//筛选种族
      if (item.race === raceName.value) !!val ? newList.add(item.id) : newList.delete(item.id)
    }
  })
  //将新的角色id添加到勾选列表condition.roles
  condition.roles.splice(0, condition.roles.length, ...newList)
  handleCheckedRolesChange()
  console.log(condition.roles)
}

//全选无角色时：全选按钮的状态改变
const handleCheckNoRoleChange = (val: boolean) => {
  const newList = new Set(condition.roles)  //Set()不会保存重复值
  if (val) newList.add(1999) //没有角色的图存的角色id为1999
  else newList.delete(1999)
  condition.roles.splice(0, condition.roles.length, ...newList)
}

//重置角色选择
function reset() {
  checkAllRoles.value = false
  checkNoRole.value = false
  isIndeterminateRole.value = false
  condition.roles = []
  //因为没绑定阵营多选框的值，通过DOM修改多选框的选中状态
  const btns = document.querySelectorAll('.roleSort .is-checked')
  btns.forEach(item => {
    item.classList.remove('is-checked')
    campName.value = item.textContent
    handleCheckCampChange(false)
  })
}


//获取版本列表并添加到菜单
function getVersion() {
  axios({
    url: '/getVersion',
    params: {role: 'diff'}
  }).then(result => {
    console.log(result)
    const {versionList, roleList} = result.data.data
    //更新版本列表
    versionInfo.splice(0, versionInfo.length, ...versionList)
    console.log('versionInfo', versionInfo)
    //更新角色列表
    roleInfo.splice(0, roleInfo.length, ...roleList)
    //获取阵营列表
    const campList = new Set([])
    const raceList = new Set([])
    roleInfo.forEach(item => {
      campList.add(item.camp)
      raceList.add(item.race)
    })
    campList.delete('')   //删除空值
    campInfo.splice(0, campInfo.length, ...campList)
    raceInfo.splice(0, campInfo.length, ...raceList)
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    ElMessage.error('发生错误：' + error.message)
  })
}

//获取已发布公告
function getNotices() {
  axios({
    url: '/getNotices',
    params: {sort: ['completed', 'unCompleted']}
  }).then(result => {
    console.log(result)
    const {noticeList} = result.data
    // ElMessage.success( result.data.msg)
    completed.splice(0, completed.length)
    unCompleted.splice(0, unCompleted.length)
    noticeList.forEach((item: Notice) => {
      if (item.sort === 'completed') completed.push(item)
      if (item.sort === 'unCompleted') unCompleted.push(item)
    })
  }).catch(error => {
    console.log('发生错误：')
    console.dir(error)
  })
}


//筛选图片
async function getImages() {
  try {
    if (!!isChoose.value) selectBtn(2) //如果是选择状态，则退出
    //如果全选版本，则直接全部清除
    if (condition.version.length === versionInfo.length) condition.version.splice(0, condition.version.length)
    //如果全选角色和无角色，则直接清除全部角色选择
    if (condition.roles.length === roleInfo.length + 1) {
      condition.roles.splice(0, condition.roles.length)
      checkAllRoles.value = false
      checkNoRole.value = false
    }

//判断筛选条件是否改变
//判断筛选条件是否改变
    if (deepEqual(condition, oldCondition, true)) return ElMessage.info('筛选条件未作改变，已取消查询')
    else {
// 将 a 的值同步到 b，包括空值
      Object.keys(oldCondition).forEach(key => {
        if (condition.hasOwnProperty(key)) {
          oldCondition[key] = condition[key];
        } else {
          delete oldCondition[key];  // 删除 b 中 a 中不存在的属性
        }
      });
    }

    const result = await axios({
      url: '/getWallpaper',
      params: condition,
    })
    console.log(result)
    const {status} = result.data
    if (status === 300) return//没有查询结果则不进行以下操作
    isShow.value = true //显示布局按钮
    imgList.splice(0, imgList.length, ...result.data.data)
    previewImgList.splice(0, previewImgList.length)

    imgList.forEach((item, index) => {
      item.imgIndex = index  //imgIndex用于排序，但不连续,所以要重排
      previewImgList.push(item.imgUrl)
    })
    console.log(imgList)

    autoCol()   //再次触发自动布局
  } catch (error) {
    console.log('发生错误：')
    console.log(error)
  }
}


//region 点击图片事件
function checkImage(url: string, name: string, e: Event) {//这个事件要绑定el-image父级盒子上
  const target = e.target as HTMLInputElement
  if (!isChoose.value) {//没有进入多选状态，此时点击是全屏浏览图片，添加底部菜单
    if (target.tagName !== 'IMG' || target.classList.contains('el-image-viewer__img')) return  //如果点击的不是图片元素则终止函数,以防重复添加
    const menu = document.querySelector('.el-image-viewer__actions__inner') //菜单组
    // const downloadClass = document.querySelector('.el-icon-download')  //下载按钮
    // if (!!downloadClass || isClose.value) return
    const downloadBtn = document.createElement('i')
    downloadBtn.innerHTML = `<i class="el-icon-download" id="downloadBtn" ><svg class="el-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" ><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64z"></path></svg></i>`
    const setBG = document.createElement('i')
    setBG.innerHTML = `<i class="el-icon-download" id="downloadBtn" ><svg t="1718365540691" class="el-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4274" width="200" height="200"><path d="M137.216 894.016a38.656 38.656 0 0 1-29.248-63.68l177.024-267.008a38.592 38.592 0 0 1 52.288-5.76l156.224 116.096L773.76 355.456c13.184-16.64 83.52-94.976 124.8-6.208 0-0.256 0.128 117.568 0.128 237.696v307.072c-0.576-0.384-761.088 0-761.472 0m192.256-713.6a125.312 125.312 0 1 1 0.128 250.56 125.312 125.312 0 0 1-0.128-250.624M81.728 0C36.672 0 0 37.952 0 89.152v841.856C0 982.208 36.864 1024 81.728 1024h864c44.8 0 78.272-41.856 78.272-92.992V89.152C1024 37.952 983.744 0 938.88 0H81.728z" p-id="4275"></path></svg></i>`
//下载图片监听
    downloadBtn.addEventListener('click', () => {
      //  if (isLogin.value) downloadImg(url, name)
      // else window.open(url)
      copyText(url, '图片链接', url)
      // window.open(url)
    })
    //设置壁纸监听
    setBG.addEventListener('click', () => {
      setBackground(url, name)
    })
    menu.appendChild(downloadBtn)
    menu.appendChild(setBG)
  } else {//进入多选状态,根据id里面的数字获取是第几张图
    const imgNum = target.id.match(/\d+/g)[0]
    const imgDiv = document.querySelector(`#imgDiv-${imgNum}`)
    const isChecked = imgDiv.classList.contains('checked')
    if (isChecked) {
      //取消选中样式
      imgDiv.classList.remove('checked')
      //遍历下载列表，删除取消选中的图片链接
      for (let i = downloadList.length - 1; i >= 0; i--) {
        if (downloadList[i].imgName === name) downloadList.splice(i, 1)
      }
    } else {
      //添加选中样式及下载链接
      imgDiv.classList.add('checked')
      downloadList.push(imgList[imgNum])
    }
    //console.log(downloadList)
    console.log('isChecked', !isChecked)
  }
}

//设置背景图
function setBackground(url: string, name: string) {
  localStorage.setItem('bgUrl', url)
  // bgUrl.value = url
  const body = (document.querySelector('body') as HTMLElement)
  body.style.backgroundImage = `url(${url})`
  ElMessage.success('设置本地背景图成功')
  //如果是登录用户则设置到账户信息中
  if (isLogin.value) axios({
    url: '/updateImgUrl',
    method: 'post',
    data: {
      isUrl: true,
      imgUrl: url,
      imgName: name,
      sort: 'bg',
      md5: ''
    }
  }).then(result => {
    console.log(result)
    const {status, msg} = result.data
    if (status === 200) {
      ElMessage.success(msg)
      updateLocalUserInfo({bgUrl: url})
      const body = (document.querySelector('body') as HTMLElement)
      body.style.backgroundImage = `url(${url})`
      localStorage.setItem('useUserBGUrl', '1')
    }
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
}


//进入和退出多选状态(num=0进入多选,1取消全选,2退出多选)
function selectBtn(num?: number) {
  const preList = document.querySelectorAll('.preImg')
  console.log(num)
  if (!!num) isChoose.value = num
  if (isChoose.value === 0) { //进入多选状态
    isChoose.value = 1
    //将所有呈现的图片添加选中状态
    preList.forEach(item => {
      item.classList.add('checked')
    })
    //将所有呈现的图片加入下载列表
    downloadList.splice(0, downloadList.length, ...imgList)
  } else if (isChoose.value === 1) {//取消全选
    isChoose.value = 2
    //给所有呈现的图片移除选中状态
    preList.forEach(item => {
      item.classList.remove('checked')
    })
    //清空下载列表
    downloadList.splice(0, downloadList.length)
  } else if (isChoose.value === 2) {  //退出多选状态
    isChoose.value = 0
    //给所有呈现的图片移除选中状态
    preList.forEach(item => {
      item.classList.remove('checked')
    })
    //清空下载列表
    downloadList.splice(0, downloadList.length)
  }

}

//端口代理是否开启的标志
const isOpenProxy = ref(false)

//检查代理端口是否打开
async function checkPort() {
  await axios({
    url: 'http://127.0.0.1:3000/',
  }).then(result => {
    console.log(result)
    const {status, msg} = result.data
    if (status === 200) {
      ElMessage.success(msg)
      isOpenProxy.value = true
      // return true
    } else {
      isOpenProxy.value = false
      ElMessage.error('代理端口未正确运行，请检查错误原因')
      // return false
    }
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    ElMessage.error('代理端口检查发生错误')
    isOpenProxy.value = false
  })
}


//批量下载壁纸
async function downloadImages() {
  ElMessage.info('如有任何问题，请先查看下载须知')
  if (downloadList.length === 0) return ElMessage.error('请先勾选需要下载的图片！')
  else if (downloadList.length <= 5) {//下载数量不大于5
    // ElMessage.success('当前下载数量不大于5，可以直接下载')
    let flag = true
    if (!isPC.value) await ElMessageBox.confirm('移动端浏览器可能无法批量下载，是否继续？', {
      confirmButtonText: '继续下载',
      cancelButtonText: '取消下载'
    }).then(() => ElMessage.info('如等待之后没有下载，请更换浏览器或长按图片保存'))
        .catch(() => flag = false)
    if (!flag) return
    console.log(downloadList)
    downloadList.forEach(item => downloadImg(item.imgUrl, item.imgName))
    selectBtn(2)
  } else {//下载数量大于5
    await checkPort()
    if (!!isOpenProxy.value) {
      ElMessage.success('正在通过代理端口进行下载，感谢您的耐心合作ღ( ´･ᴗ･` )')
      console.log(downloadList)
      downloadList.forEach(item => downloadImg(item.imgUrl, item.imgName))
      selectBtn(2) //取消多选
    } else return ElMessage.error('当前下载数量大于5且未开启代理，请先查看下载须知→下载大量')
  }
}

//下载图片测试
// downloadImg('https://gamecms-res.sl916.com/official_website_resource/50001/4/PICTURE/20240612/253%201440x2560_4f4a8ecb95334367ab4a83842926e1c6.jpg','123.jpg')
//下载单张图片
function downloadImg(url: string, imgName: string) {
  //将下载链接替换为本地代理地址
  const replacePort = isOpenProxy.value ? 'http://localhost:3000/download1999' : axios.defaults.baseURL + '/download1999'
  const imageUrl = url.replace('https://gamecms-res.sl916.com', replacePort)
  // const option={url,}
  fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = imgName // 在这里指定下载的文件名
        document.body.appendChild(a)
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error:', error));
}


//检测屏幕变化，计算自动布局
watch(screenWidth, (newVal, oldVal) => {
  if (newVal === oldVal) return
  if (autoFlag.value) autoCol()
})

//自动布局，计算图片列数
function autoCol() {
  autoFlag.value = true
  if (Number((screenWidth.value / 250).toFixed(0)) === colNum.value) return
  console.log('视口宽度', screenWidth.value)
  console.log('计算的图片列数', Math.floor(screenWidth.value / 250))
  colNum.value = Number(Math.floor(screenWidth.value / 250))
  if (previewImgList.length <= 10 && isPC.value) colNum.value = Number((previewImgList.length / 2).toFixed(0)) //PC端如果图片不大于10张，则有x张就分x/2列(去除小数)
}


//endregion


</script>
<style scoped>
/*
body {
  overflow: visible;
}
*/

.el-header {
  height: auto;
  padding-left: 0;
  padding-right: 0;
}

/*折叠面板标题栏样式*/
:deep(.el-collapse-item__header:hover) {
  color: var(--el-color-primary);
}

.roleSort {
  width: 100%;
  text-align: left;
  border-bottom: 1px deepskyblue dotted;
}

.links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.links .el-link {
  margin: 0 10px;
}

.text {
  margin-left: 30px
}

.image-slot {
  width: 50px;
  height: 50px;
  background-color: gray;
}

.btnGroup {
  display: flex;
  justify-content: right;
  margin: 10px 0;
}


.el-image:hover {
  box-shadow: var(--el-box-shadow-dark);
}

.el-checkbox-button {
  border: 0;
  padding: 0;
}

/*解决因为边框选中之后乱跳的bug*/
.preImg {
  border: 3px transparent dotted;
}

.checked {
  border: 3px #6bfac3 dotted;
}

.logo {
  float: left;
  /*  position: absolute;
    top: 10px;
    left: 10px;*/
  height: 40px;
  border-radius: 5px;
}

.logo:hover {
  box-shadow: none;
  background: white;
}

@media (max-width: 980px) {
  .el-checkbox { /*缩短选项框右边距*/
    margin-right: 15px;
  }
}


/*下面是Transition组件的CSS动画*/
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}


.transition1-enter-active {
  transition: all 0.3s ease-out;
}

.transition1-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.transition1-enter-from,
.transition1-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.statement:hover {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

.statement:hover .el-text {
  color: var(--el-color-danger);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
