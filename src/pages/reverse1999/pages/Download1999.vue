<template>
  <div class="download1999" ref="download1999">
    <div style="position: relative">
      <el-image class="logo" :src="logo" v-if="isPC" draggable="false" />
      <h1>1999国服官图(以影像之)下载</h1>
      <el-collapse v-model="activeIndex" accordion>
        <el-collapse-item title="资源文档" name="1">
          <div class="links">
            <el-button
              link
              target="_blank"
              v-for="{ id, name, title, label, value, url } in links"
              :key="id"
              @click="copyText(value, name, url)"
              :title="title"
              >{{ label }}
            </el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item title="筛选条件【所有条件不选则默认全选】" name="2">
          <el-form :label-position="isPC ? 'left' : 'top'">
            <el-form-item label="选择版本[默认全选]：" style="flex-direction: column">
              <el-checkbox
                v-model="checkAllVersions"
                :indeterminate="isIndeterminateVersion"
                @change="handleCheckAllVersionChange"
              >
                全选
              </el-checkbox>
              <el-checkbox-group
                v-model="condition.version"
                draggable="false"
                style="text-align: left"
                @change="handleCheckedVersionsChange"
              >
                <el-checkbox
                  v-for="{ version, versionName } in versionInfo"
                  :key="version"
                  :label="versionName"
                  :value="version"
                />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="选择角色[默认全选]：" style="flex-direction: column">
              <div class="roleSort">
                <!--遍历阵营-->
                <el-text>角色所属阵营：</el-text>
                <el-checkbox
                  v-for="({ name, count }, index) in campInfo"
                  :key="index"
                  @click="roleTypeChange(name, '')"
                  @change="handleCheckCampChange"
                >
                  {{ name }}[{{ count }}]
                </el-checkbox>
              </div>
              <div class="roleSort">
                <!--遍历种族-->
                <el-text>角色所属种族：</el-text>
                <el-checkbox
                  v-for="({ name, count }, index) in raceInfo"
                  :key="index"
                  @click="roleTypeChange('', name)"
                  @change="handleCheckCampChange"
                >
                  {{ name }}[{{ count }}]
                </el-checkbox>
              </div>
              <el-checkbox-group
                v-model="condition.roles"
                draggable="false"
                style="text-align: left"
                @change="handleCheckedRolesChange"
              >
                <el-text>角色常用名称：</el-text>
                <el-checkbox v-for="item in roleInfo" :key="item.id" :label="item.name" :value="item.id" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="图片类型：">
              <el-radio-group v-model="condition.sort" size="small">
                <el-radio-button label="全选" :value="2" />
                <el-radio-button label="横屏壁纸" :value="1" />
                <el-radio-button label="竖屏壁纸" :value="0" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="查询类型：">
              <el-radio-group v-model="condition.mode" size="small">
                <el-radio-button label="模糊查询" :value="'inaccurate'" />
                <el-radio-button label="精准查询" :value="'accurate'" />
              </el-radio-group>
              <el-icon style="margin: 0 5px" @click="isShowNotice = !isShowNotice">
                <InfoFilled />
              </el-icon>
              <Transition name="horizontal_slide">
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
            <div style="text-align: center">
              <el-button @click="reset">重置</el-button>
              <el-button type="primary" :icon="Search" @click="getImages">筛选</el-button>
              <el-button type="warning" :icon="Warning" @click="showDownloadNotice()" v-show="isShow"> 下载须知 </el-button>
              <br v-if="!isPC" />
              <el-button :type="chooseType[isChoose].type" :icon="chooseType[isChoose].icon" @click="selectBtn()" v-show="isShow">
                <span>{{ chooseType[isChoose].text }}</span>
              </el-button>
              <el-button v-if="imgList.length && isPC" type="success" @click="checkPort()">检查本地代理</el-button>
              <el-button type="success" :icon="Download" @click="downloadImages" v-show="isShow">开始下载 </el-button>
              <br />
              <div class="statement">
                <el-text type="danger" v-show="isShow && !isPC">
                  注意：移动端浏览器可能无法批量下载，如尝试下载等待之后没有反应，请切换浏览器或长按图片保存。<br />
                </el-text>
                <el-text type="success" @click="showNotice({ show_num: 3, active_num: 1 })"
                  >本站仅供技术学习和交流分享，如果涉及侵权请
                  <el-text type="primary">联系默默</el-text>
                  删除。
                </el-text>
              </div>
            </div>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="待完善功能" name="3">
          <el-text tag="p" v-for="item in unCompleted.slice().reverse()" :key="item.id">
            <el-icon> <Edit /> </el-icon>{{ item.content }}
          </el-text>
        </el-collapse-item>
        <el-collapse-item title="已实现功能" name="4">
          <el-text tag="p" v-for="(item, index) in completed.slice().reverse()" :key="index">
            <el-icon :color="index === 0 ? 'var(--el-color-success' : ''">
              <Check />
            </el-icon>
            <el-text :type="index === 0 ? 'success' : ''" style="margin: 0 5px">{{ item.content }}</el-text>
            <el-text type="danger" v-if="index === 0">[new]</el-text>
          </el-text>
        </el-collapse-item>
        <el-collapse-item title="群聊和赞赏" style="text-align: center" name="5">
          欢迎通过
          <el-text @click="showNotice({ show_num: 3, active_num: 2 })" type="success" title="点击反馈">反馈 </el-text>
          向默默提出功能建议或BUG。 也欢迎来咱们九群玩（默默不是群主）<br />
          <el-button
            link
            type="primary"
            target="_blank"
            @click="copyText('904688184', 'QQ群号', 'https://qm.qq.com/q/Oq8R7YS6sM')"
            title="点击前往QQ"
          >
            点击加入群聊【金兔子特供部门🐰】
          </el-button>
          <el-divider />
          如果您觉得本站有用或有趣，欢迎成为元老级赞助人！！！
          <br />
          <el-text type="warning">所有收入仅用于维持网站运营。</el-text>
          <br />
          赞赏者名单：
          <el-text>(设计中)</el-text>&ensp; 当前收到赞赏： <el-text type="success">{{ fee }}</el-text
          >&ensp;元(手动录入会有延迟)
          <br />
          <el-button v-if="!showPayCode" @click="showPayCode = true" type="success">点击展示微信赞赏码</el-button>
          <el-image v-else style="width: 200px" :src="pay_code_src" />
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-affix position="top" target=".download1999" :offset="isPC ? 50 : 85">
      <div class="floatBar" v-show="isShow">
        <el-button @click="scrollToTop" :icon="Top" type="default">返回顶部</el-button>
        <el-button-group class="btnGroup" type="info">
          <el-button @click="autoCol" :type="autoFlag ? 'primary' : 'default'">
            <SVG_auto class="el-icon" /> <span>自动</span>
          </el-button>
          <el-button @click="autoCol(3)" :type="autoFlag === false && colNum === 3 ? 'primary' : 'default'">
            <SVG_grid_four class="el-icon" />
            <span>3列</span>
          </el-button>
          <el-button @click="autoCol(5)" :type="autoFlag === false && colNum === 5 ? 'primary' : 'default'">
            <SVG_grid_nine class="el-icon" />
            <span>5列</span>
          </el-button>
        </el-button-group>
      </div>
    </el-affix>

    <!--    第三方库，瀑布流标签 不能包裹在el-container中,懒加载会失效-->
    <wc-flow-layout :gap="10" :cols="colNum">
      <div
        v-for="(item, index) in imgList"
        :key="item.id"
        @click="checkImage(item, index, $event)"
        class="preImg"
        :id="'imgDiv-' + item.id"
        ref="imgDivRefs"
      >
        <el-image
          :src="item.imgUrl"
          :zoom-rate="1.2"
          :id="'img-' + item.id"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="previewImgList"
          :initial-index="index"
          fit="scale-down"
          lazy
        >
          <template #error>
            <div class="image-slot">
              <el-icon style="width: 50px">
                <icon-picture />
              </el-icon>
            </div>
          </template>
        </el-image>
      </div>
    </wc-flow-layout>

    <!--  下载须知公告界面-->
    <el-dialog
      v-model="isShowDownloadNotice"
      :width="isPC ? '60%' : '90%'"
      :show-close="!isPC"
      style="z-index: 100"
      destroy-on-close
    >
      <template #header><span style="font-size: 24px">下载须知</span></template>
      <DownloadNotice :showFlag="showFlag" :showPayCodePanel="showPayCodePanel" :downloadLimitNum="downloadLimitNum" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, toRefs } from "vue"
import {
  Check,
  CloseBold,
  Download,
  Edit,
  InfoFilled,
  Picture as IconPicture,
  Search,
  Warning,
  Top,
} from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import axios from "axios"
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"
import { useNoticeStore } from "@/store/useNoticeStore"
import { useReverse1999Store } from "@/store/reverse1999/useReverse1999Store"
//hooks
import useTitleDiv from "@/hooks/useTitleDiv"
import useNotice from "@/hooks/useNotice"
import useReverse1999 from "@/hooks/reverse1999/useReverse1999"
//components
import DownloadNotice from "@/pages/reverse1999/components/DownloadNotice.vue"
//utils
import titleDiv from "@/utils/titleDiv"
import myFunction from "@/utils/myFunction"
import userInfo from "@/utils/userInfo"
//types
import { NoticeActiveNum } from "@/types/global"
//files
import logo from "@/assets/logo-small.png"
import SVG_auto from "@/assets/reverse1999/auto.svg?component"
import SVG_grid_four from "@/assets/reverse1999/grid_four.svg?component"
import SVG_grid_nine from "@/assets/reverse1999/grid_nine.svg?component"
import { api_getImage } from "@/apis/reverse1999"
import { UserInfo } from "@/types/user"

const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const noticeStore = useNoticeStore()
const reverse1999Store = useReverse1999Store()
const { isLogin, useUserBGUrl, localBgUrl } = toRefs(userInfoStore)
const { isPC, screenWidth, screenHeight } = toRefs(responsiveStore)
const { completed, unCompleted, others } = toRefs(noticeStore)
const { diffVersionInfo: versionInfo, diffRoleInfo: roleInfo, campInfo, raceInfo } = toRefs(reverse1999Store)
const { updateLocalUserInfo } = userInfoStore
const { toggleBG } = useTitleDiv()
const { getNotices } = useNotice()
const { getVersion } = useReverse1999()
const { copyText, deepEqual } = myFunction
const { updateImgUrl } = userInfo
//呼出公告面板
const { showNotice } = titleDiv

const download1999 = ref<HTMLDivElement | null>(null)

//用户查询的参数
const condition = reactive<ImgParams>({
  version: [],
  roles: [],
  sort: 2,
  mode: "inaccurate",
})
//用户上一次查询的参数
const oldCondition = ref<ImgParams>({
  version: ["all"],
  roles: [],
  sort: 2,
  mode: "inaccurate",
})

//筛选
const activeIndex = ref<string | undefined>("2") //激活的折叠面板序号

const checkAllVersions = ref(false) //全选版本
const isIndeterminateVersion = ref(false) //全选版本按钮状态
const checkAllRoles = ref(false) //全选角色
const checkNoRole = ref(false) //全选无角色
const isIndeterminateRole = ref(false) //全选角色按钮状态
const campName = ref<string>("") //阵营名称
const raceName = ref<string>("") //种族名称

const isShowDownloadNotice = ref(false) //控制下载须知界面的显示
const isShowNotice = ref(false) //控制模糊和精准搜索的说明是否显示
const imgList = ref<ReverseImg[]>([]) //展示列表，存的图片信息对象
const previewImgList = ref<string[]>([]) //大图展示列表，存的图片链接
const downloadList = ref<ReverseImg[]>([]) //下载图片的列表

const isShow = ref(false) //显示布局按钮组
const colNum = ref<number>(isPC.value ? 5 : 1) //修改显示列数

const autoFlag = ref(true) //是否开启自动布局
const isChoose = ref("none") //是否是批量选择状态
const chooseType = {
  all: {
    text: "取消全选",
    type: "warning",
    icon: CloseBold,
  },
  part: {
    text: "退出选择",
    type: "danger",
    icon: CloseBold,
  },
  none: {
    text: "批量选择",
    type: "success",
    icon: Check,
  },
} as Record<string, { text: string; type: string; icon: any }>
//批量选择图片的ref列表
const imgDivRefs = ref<HTMLDivElement[]>([])
//是否显示收款码
const showPayCode = ref(false)
//已赞助费用
const fee = ref(Number(others.value[0]?.content) || 0)
//单次最大下载数量
const downloadLimitNum = ref(25)

const pay_code_src = ref(import.meta.env.VITE_QINIUTHUMBNAIL_URL + "/files/payCode.png")

//网址链接
const links = [
  {
    id: 1,
    title: "点击前往Gitee",
    label: "Gitee",
    name: "Gitee",
    value: "https://gitee.com/MuXi-Dream/download-reverse1999",
    url: "https://gitee.com/MuXi-Dream/download-reverse1999",
    imgUrl: "",
  },
  {
    id: 2,
    title: "点击前往GitHub",
    label: "GitHub",
    name: "GitHub",
    value: "https://github.com/ADarkDream/Download-Reverse1999",
    url: "https://github.com/ADarkDream/Download-Reverse1999",
    imgUrl: "",
  },
  {
    id: 3,
    title: "点击前往重返未来1999官网",
    label: "重返未来1999官网",
    name: "重返未来1999官网",
    value: "https://re.bluepoch.com/home/detail.html#wallpaper",
    url: "https://re.bluepoch.com/home/detail.html#wallpaper",
    imgUrl: "",
  },
  {
    id: 4,
    title: "点击前往百度网盘",
    label: "百度网盘下载地址",
    name: "百度网盘下载地址",
    value: "https://pan.baidu.com/s/1A4o9VM4kPa_vzWZEtHiZSA?pwd=1999",
    url: "https://pan.baidu.com/s/1A4o9VM4kPa_vzWZEtHiZSA?pwd=1999",
    imgUrl: "",
  },
  {
    id: 5,
    title: "请联系默默",
    label: "API文档(无偿但不公开)",
    name: "默默的QQ号码",
    value: "QQ:1224021291",
    url: "https://apifox.com/apidoc/shared-70082832-e502-49ac-a386-35af15bfd747/api-186774719",
    imgUrl: "",
  },
]

const scrollToTop = () => {
  if (download1999.value) {
    download1999.value.scrollTo({ top: 0, behavior: "smooth" }) // 平滑滚动到顶部
  }
}

onMounted(async () => {
  await Promise.all([getVersion({ version: "diff", role: "diff" }), getNotices(["completed", "unCompleted", "others"])])

  ElMessage.warning("如果页面出错请刷新两下，刷新后还没有可能是网站在升级，请稍后访问")
})

//全选版本：单选按钮的状态改变
const handleCheckAllVersionChange = (val: boolean) => {
  if (val) versionInfo.value.forEach((item) => condition.version.push(item.version))
  else condition.version = []
  isIndeterminateVersion.value = false //取消全选按钮符号 -
}
//单选版本：全选按钮的状态改变
const handleCheckedVersionsChange = () => {
  const checkedCount = condition.version.length
  checkAllVersions.value = checkedCount === versionInfo.value.length //全选时变更按钮为√
  isIndeterminateVersion.value = checkedCount > 0 && checkedCount < versionInfo.value.length //未全选时变更按钮为 -
}

//全选角色：单选按钮的状态改变
const handleCheckAllRoleChange = (checkAll: boolean) => {
  console.log("checkAll", checkAll)
  if (checkAll)
    roleInfo.value.forEach((item) => {
      if (!item.id) console.log(item.id, item)

      condition.roles.push(item.id)
    })
  else condition.roles = []
  isIndeterminateRole.value = false //取消全选按钮符号 -
  // console.log("触发全选事件", condition.roles)
}
//单选角色：全选按钮的状态改变
const handleCheckedRolesChange = () => {
  // console.log(condition.roles.length, roleInfo.value.length);

  const checkedCount = condition.roles.length
  checkAllRoles.value = checkedCount === roleInfo.value.length //全选时变更按钮为√
  isIndeterminateRole.value = checkedCount > 0 && checkedCount < roleInfo.value.length //未全选时变更按钮为 -
  // console.log("触发单选事件", condition.roles)
}

const typeFlag = ref(1)

//修改当前角色多选的条件(阵营或种族)
function roleTypeChange(camp: string, race: string) {
  if (camp) {
    campName.value = camp
    typeFlag.value = 1
  } else if (race) {
    raceName.value = race
    typeFlag.value = 2
  }
}

//全选或取消：阵营分类多选按钮，根据campInfo[]可以获取阵营名字
const handleCheckCampChange = (val: boolean) => {
  const newList: Set<number> = new Set(condition.roles) //Set()不会保存重复值
  console.log(newList)
  //遍历角色列表
  roleInfo.value.forEach((item) => {
    //val=true代表全选按钮被勾选，再添加和删除Set()函数newList中的值
    //Set()的has()判断是否存在该元素，add()添加不重复的元素，delete()直接删除该元素而不是数组下标
    if (typeFlag.value === 1) {
      //筛选阵营
      if (item.camp === campName.value) val ? newList.add(item.id) : newList.delete(item.id)
    } else if (typeFlag.value === 2) {
      //筛选种族
      if (item.race === raceName.value) val ? newList.add(item.id) : newList.delete(item.id)
    }
  })
  //将新的角色id添加到勾选列表condition.roles
  condition.roles.splice(0, condition.roles.length, ...newList)
  handleCheckedRolesChange()
  console.log(condition.roles)
}

//重置筛选条件
function reset() {
  //重置版本
  condition.version = []
  isIndeterminateVersion.value = false //取消全选按钮符号 -
  //重置角色
  checkAllRoles.value = false
  checkNoRole.value = false
  isIndeterminateRole.value = false
  condition.roles = []

  //因为没绑定阵营多选框的值，通过DOM修改多选框的选中状态
  const btns = document.querySelectorAll(".roleSort .is-checked")
  btns.forEach((item) => {
    item.classList.remove("is-checked")
    campName.value = item.textContent!
    handleCheckCampChange(false)
  })

  //重置图片类型
  condition.sort = 2
  //重置查询类型
  condition.mode = "inaccurate"
}

//筛选图片
const getImages = async () => {
  if (isChoose.value !== "none") selectBtn("part") //如果是选择状态，则退出
  //如果全选版本，则直接全部清除
  if (condition.version.length === versionInfo.value.length) condition.version.splice(0, condition.version.length)
  //如果全选角色和无角色，则直接清除全部角色选择
  if (condition.roles.length === roleInfo.value.length + 1) {
    condition.roles.splice(0, condition.roles.length)
    checkAllRoles.value = false
    checkNoRole.value = false
  }
  console.log("筛选条件:", condition, oldCondition.value)

  //判断筛选条件是否改变
  if (deepEqual(condition, oldCondition.value, true)) return ElMessage.info("筛选条件未作改变，已取消查询")
  // else {
  // 将 a 的值同步到 b，包括空值
  // Object.keys(oldCondition.value).forEach(key => {

  //   if (condition.hasOwnProperty(key)) {
  //     oldCondition.value[key] = oldCondition.value[key]
  //   } else delete oldCondition.value[key];  // 删除 b 中 a 中不存在的属性

  // })
  // }
  try {
    const data = await api_getImage(condition)
    if (!data) return
    isShow.value = true //显示布局按钮

    imgList.value = data.imgList as ReverseImg[]
    previewImgList.value = imgList.value.map((item) => item.imgUrl)
    // console.log("筛选结果:", previewImgList.value);
    // console.log("筛选结果:", imgList.value)
    // 将 a 的值同步到 b，包括空值
    // Object.keys(oldCondition.value).forEach(key => {

    //   if (condition.hasOwnProperty(key)) {
    //     oldCondition.value[key] = oldCondition.value[key]
    //   } else delete oldCondition.value[key];  // 删除 b 中 a 中不存在的属性

    // })
    oldCondition.value = JSON.parse(JSON.stringify(condition))
    autoCol() //再次触发自动布局
    // activeIndex.value = undefined
  } catch (error) {
    console.log("发生错误：")
    console.log(error)
  }
}
const downloadListIndexArr = new Set<number>([])

//region 点击图片事件
function checkImage(imgInfo: ReverseImg, index: number, e: Event) {
  //这个事件要绑定el-image父级盒子上
  const { imgUrl, newName } = imgInfo
  const target = e.target as HTMLInputElement
  console.log("点击图片", imgUrl, newName, target)

  if (isChoose.value === "none") {
    //没有进入多选状态，此时点击是全屏浏览图片，添加底部菜单
    if (target.tagName !== "IMG" || target.classList.contains("el-image-viewer__img")) return //如果点击的不是图片元素则终止函数,以防重复添加
    const menu = document.querySelector(".el-image-viewer__actions__inner") //菜单组
    // const downloadClass = document.querySelector('.el-icon-download')  //下载按钮
    // if (!!downloadClass || isClose.value) return
    const downloadBtn = document.createElement("i")
    downloadBtn.innerHTML = `<i class="el-icon-download" id="downloadBtn" ><svg class="el-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" ><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64z"></path></svg></i>`
    const setBG = document.createElement("i")
    setBG.innerHTML = `<i class="el-icon-download" id="downloadBtn" ><svg t="1718365540691" class="el-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4274" width="200" height="200"><path d="M137.216 894.016a38.656 38.656 0 0 1-29.248-63.68l177.024-267.008a38.592 38.592 0 0 1 52.288-5.76l156.224 116.096L773.76 355.456c13.184-16.64 83.52-94.976 124.8-6.208 0-0.256 0.128 117.568 0.128 237.696v307.072c-0.576-0.384-761.088 0-761.472 0m192.256-713.6a125.312 125.312 0 1 1 0.128 250.56 125.312 125.312 0 0 1-0.128-250.624M81.728 0C36.672 0 0 37.952 0 89.152v841.856C0 982.208 36.864 1024 81.728 1024h864c44.8 0 78.272-41.856 78.272-92.992V89.152C1024 37.952 983.744 0 938.88 0H81.728z" p-id="4275"></path></svg></i>`
    //下载图片监听
    downloadBtn.addEventListener("click", () => {
      //  if (isLogin.value) downloadImg(url, name)
      // else window.open(url)
      copyText(imgUrl, "图片链接", imgUrl)
      // window.open(url)
    })
    //设置壁纸监听
    setBG.addEventListener("click", () => {
      setBackground(imgUrl, newName)
    })
    menu!.appendChild(downloadBtn)
    menu!.appendChild(setBG)
  } else {
    //进入多选状态,根据id里面的数字获取是第几张图
    console.log("当前是多选状态")
    if (downloadListIndexArr.has(index)) {
      downloadListIndexArr.delete(index)
      imgDivRefs.value[index].classList.remove("checked")
    } else {
      downloadListIndexArr.add(index)
      imgDivRefs.value[index].classList.add("checked")
    }

    //判断下载列表是否为空,修改多选状态
    if (downloadListIndexArr.size === 0) isChoose.value = "part"
    else isChoose.value = "all"
    // console.log("下载列表：", downloadList.value)
    console.log("图片列表：", imgList.value)
    console.log("下载列表序号IndexArr：", downloadListIndexArr)
  }
}

//设置背景图
const setBackground = async (url: string, name: string) => {
  if (!isLogin.value) {
    //如果是游客
    localBgUrl.value = url
    ElMessage.success("设置本地背景图成功")
    return
  }
  try {
    //如果是登录用户则设置到账户信息中
    const imageInfo = await updateImgUrl({
      imgUrl: url,
      imgName: name,
      sort: "bg",
    })
    if (!imageInfo) throw Error

    updateLocalUserInfo({ bgId: imageInfo.id } as UserInfo)
    toggleBG({ newBgUrl: url })
    useUserBGUrl.value = true
    ElMessage.success("设置背景图成功,已保存到云端")
  } catch (error) {
    console.log("发生错误：")
    console.log(error)
    localBgUrl.value = url
    return ElMessage.error("设置自定义背景图出错，修改为本地背景图")
  }
}

//全选
const selectAll = (checkAll = true) => {
  if (checkAll) {
    //添加下载序号
    imgList.value.forEach((item, index) => downloadListIndexArr.add(index))
    //将所有呈现的图片添加选中状态(因为懒加载，可能部分未渲染)
    imgDivRefs.value.forEach((item) => {
      item.classList.add("checked")
    })
  } else {
    //清空下载序号
    downloadListIndexArr.clear()
    //给所有呈现的图片移除选中状态
    imgDivRefs.value.forEach((item) => item.classList.remove("checked"))
  }
}
/**
 * 进入和退出多选状态
 * @param type -控制图片选择状态,默认进入多选
 * - `"none"` 进入多选状态
 * - `"all"` 清空选择
 * - `"part"` 退出多选状态
 * */
function selectBtn(type?: "none" | "all" | "part") {
  console.log("selectBtn选择前的type值：", isChoose.value)
  //手动修改选择类型
  if (type) isChoose.value = type

  switch (isChoose.value) {
    case "none": //进入多选状态
      selectAll()
      isChoose.value = "all"
      break
    case "all": //清空选择
      selectAll(false)
      isChoose.value = "part"
      break
    case "part": //退出多选状态
      selectAll(false)
      isChoose.value = "none"
      break
    default:
      ElMessage.error("未知的选择状态")
      return
  }
  //清空下载列表
  if (!downloadList.value.length) downloadList.value = []
}

//本地代理服务器是否开启的标志
const isOpenProxy = ref(false)

//检查本地代理服务器是否打开
const checkPort = async () => {
  try {
    const result = await axios("http://127.0.0.1:3000")
    console.log("result", result)

    if (result?.data?.code === 200) {
      ElMessage.success(result?.data?.msg)
      isOpenProxy.value = true
      // return true
    } else {
      isOpenProxy.value = false
      ElMessage.error("本地代理服务器未正确运行，请检查错误原因")
      // return false
    }
  } catch (error) {
    console.error("发生错误：", error)
    ElMessage.error("本地代理服务器检查发生错误")
    isOpenProxy.value = false
  }
}

//批量下载壁纸
const downloadImages = async () => {
  const indexArr = Array.from(downloadListIndexArr) //.sort((a, b) => a - b)//不需要排序

  downloadList.value = indexArr.map((index) => imgList.value[index])
  const length = downloadList.value.length
  if (length === 0) return ElMessage.warning("请先勾选需要下载的图片！")
  ElMessage.info("如有任何问题，请先查看下载须知")

  if (length <= downloadLimitNum.value) {
    //下载数量不大于限定数量
    let flag = true
    if (!isPC.value)
      await ElMessageBox.confirm("移动端浏览器可能无法批量下载，是否继续？", {
        confirmButtonText: "继续下载",
        cancelButtonText: "取消下载",
      })
        .then(() => ElMessage.info("如等待之后没有下载，请更换浏览器或长按图片保存"))
        .catch(() => (flag = false))
    if (!flag) return
    console.log("下载列表：", downloadList)
    downloadList.value.forEach((item) => downloadImg(item.imgUrl, item.newName, item.imgPath!))
    selectBtn("part")
  } else {
    //下载数量大于5
    await checkPort()
    if (isOpenProxy.value) {
      ElMessage.success("正在通过代理端口进行下载，感谢您的耐心合作ღ( ´･ᴗ･` )")
      console.log(downloadList)
      downloadList.value.forEach((item) => downloadImg(item.imgUrl, item.newName, item.imgPath!))
      selectBtn("part") //退出多选
    } else return ElMessage.error("当前下载数量大于10且未开启代理，请先查看下载须知→下载大量")
  }
}

//下载图片测试
// downloadImg('https://gamecms-res.sl916.com/official_website_resource/50001/4/PICTURE/20240612/253%201440x2560_4f4a8ecb95334367ab4a83842926e1c6.jpg','123.jpg')
/**下载单张图片*/
const downloadImg = async (url: string, imgName: string, imgPath: string) => {
  let imageUrl = url
  //将下载链接替换为可使用地址
  if (isOpenProxy.value)
    //如果有端口代理
    imageUrl = url.replace("https://gamecms-res.sl916.com", "http://localhost:3000/download1999")
  else if (imgPath) {
    //没有端口代理
    // if (imgPath.startsWith('.'))
    //   imageUrl = import.meta.env.VITE_QINIU_URL + imgPath.replace(/^\./, '')//七牛云备份,去掉路径中第一个点
    // else
    imageUrl = import.meta.env.VITE_QINIU_URL + "/" + imgPath //七牛云备份,路径添加/
  } else {
    //没有端口代理且服务器没有备份
    imageUrl = url.replace(axios.defaults.baseURL + "/download1999", "http://localhost:3000/download1999")
  }
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const linkA = document.createElement("a")
    linkA.href = url
    linkA.download = imgName // 在这里指定下载的文件名
    document.body.appendChild(linkA)
    linkA.click()
    linkA.remove()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("下载图片出错:")
    console.error(error)
  }
}

/**检测屏幕变化，计算自动布局*/
watch(screenWidth, (newVal, oldVal) => {
  if (newVal === oldVal) return
  if (autoFlag.value) autoCol()
})

/**自动布局，计算图片列数*/
function autoCol(num?: number) {
  if (num) {
    autoFlag.value = false
    colNum.value = 3
    return
  }
  autoFlag.value = true
  if (Number((screenWidth.value / 250).toFixed(0)) === colNum.value) return

  if (previewImgList.value.length <= 15 && isPC.value) {
    colNum.value = Number((previewImgList.value.length / 2).toFixed(0)) //PC端如果图片不大于15张，则有x张就分x/3列(去除小数)
    console.log(previewImgList.value.length + "张,少于15张,计算的图片列数:" + colNum.value)
  } else {
    const currentNum = Math.floor(screenWidth.value / 250)
    colNum.value = Number(currentNum)
    console.log("计算的图片列数：", currentNum)
  }
  console.log("视口宽度：", screenWidth.value + "px")
}

//endregion

//下载须知面板序号
const showFlag = reactive<NoticeActiveNum>({
  show_num: 1,
  active_num: 1,
})
//呼出下载须知面板
const showDownloadNotice = (item?: NoticeActiveNum) => {
  isShowDownloadNotice.value = true
  Object.assign(showFlag, item)
}

//呼出赞赏界面
const showPayCodePanel = () => {
  isShowDownloadNotice.value = false
  activeIndex.value = "5"
}

/** 页面滚动距离 */
const scrollPosition = ref(0)

// 在离开页面时保存滚动位置
onDeactivated(() => {
  if (download1999.value) scrollPosition.value = download1999.value.scrollTop
})

// 在页面激活时恢复滚动位置
onActivated(() => {
  if (download1999.value) download1999.value.scrollTo(0, scrollPosition.value)
})
</script>
<style scoped>
.download1999 {
  overflow: scroll;
  height: 100%;
}

.el-header {
  height: auto;
  padding: 0;
  opacity: 0.85;
  margin-bottom: 10px;
}

.roleSort {
  width: 100%;
  text-align: left;
  border-bottom: 1px currentColor dotted;
}

.links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.text {
  margin-left: 30px;
}

.image-slot {
  width: 50px;
  height: 50px;
  background-color: gray;
}

.floatBar {
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
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
  position: absolute;
  top: 0;
  left: 10px;
  height: 40px;
  border-radius: 5px;
}

.logo:hover {
  box-shadow: none;
  background: white;
}

@media (max-width: 780px) {
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .el-checkbox {
    /*缩短选项框右边距*/
    margin-right: 15px;
  }

  .floatBar {
    margin: 0 10px;
  }
}

/* 折叠面板的设置 */
.el-collapse {
  --el-collapse-header-bg-color: transparent;
  /* --el-collapse-header-border-color: var(--el-border-color);
  --el-collapse-header-text-color: var(--el-text-color-primary); */
  --el-collapse-content-bg-color: transparent;
  /* --el-collapse-content-text-color: var(--el-text-color-primary); */

  /* 下划线 */
  .el-collapse-item {
    text-align: left;
    border-bottom: 1px dotted rgb(103, 102, 102);
    color: currentColor;

    /* 多选框字体颜色和方框背景透明 */
    .el-checkbox {
      opacity: 0.8;
      --el-checkbox-text-color: currentColor;
      --el-checkbox-bg-color: transparent;
    }
  }
}

/*筛选条件的标题*/
.download1999 :deep(.el-form-item__label) {
  font-size: 17px;
  color: currentColor;
}

/*region下面是Transition组件的CSS动画*/
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
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

/*endregion*/
</style>
