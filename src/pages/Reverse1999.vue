<template>
  <el-scrollbar height="700px">
    <el-container>
      <el-header>
        <el-card>
          <h1>1999国服官图(以影像之)下载</h1>
          <template class="links">
            <el-link type="primary" href="https://gitee.com/MuXi-Dream/download-reverse1999" target="_blank">本项目开源地址
            </el-link>
            <el-link type="primary" href="https://re.bluepoch.com/home/detail.html#wallpaper" target="_blank">官网下载地址
            </el-link>
            <el-link type="primary" href="https://pan.baidu.com/s/1A4o9VM4kPa_vzWZEtHiZSA?pwd=1999" target="_blank">
              百度网盘下载地址
            </el-link>
          </template>
          <el-collapse v-model="activeIndex" accordion>
            <el-collapse-item title="筛选条件【所有条件不选则默认全选】" name="1">
              <el-form label-position="left" :size="elSize">
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
                  <!--              <el-select multiple filterable placeholder="不选则默认全选，可多选" v-model="condition.version">-->
                  <!--                <el-option v-for="item in versionInfo" :key="item.version" :label="item.versionName"-->
                  <!--                           :value="item.version"/>-->
                  <!--              </el-select>-->
                </el-form-item>
                <el-form-item label="选择角色：">
                  <el-button size="small" type="primary" @click="reset">重置</el-button>&ensp;
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
                  >全选无角色
                  </el-checkbox>
                  &ensp; &ensp;
                  <el-button @click="addRoles('圣洛夫基金会');btnA=true" :disabled="btnA">
                    添加圣洛夫基金会
                  </el-button>
                  <el-button @click="addRoles('重塑之手');btnB=true" :disabled="btnB">
                    添加重塑之手
                  </el-button>
                  <el-button @click="addRoles('阿派朗学派');btnC=true" :disabled="btnC">
                    添加阿派朗学派
                  </el-button>
                  <el-button @click="addRoles('');btnD=true" :disabled="btnD">
                    添加其他角色
                  </el-button>
                  <!--                  &ensp; <el-link type="primary" href="https://weibo.com/5569768274/5040217780129813" target="_blank">部分角色关系参考</el-link>-->
                  <el-checkbox-group v-model="condition.roles" style="text-align: left"
                                     @change="handleCheckedRolesChange">
                    <el-checkbox v-for="item in roleInfo" :key="item.id" :label="item.name"
                                 :value="item.id"/>
                  </el-checkbox-group>
                  <!--              <el-select multiple filterable placeholder="不选则默认全选，可多选" v-model="condition.version">-->
                  <!--                <el-option v-for="item in versionInfo" :key="item.version" :label="item.versionName"-->
                  <!--                           :value="item.version"/>-->
                  <!--              </el-select>-->
                </el-form-item>
                <el-form-item label="选择类型：">
                  <el-radio-group v-model="condition.sort">
                    <el-radio-button label="全选" :value="2"/>
                     <el-radio-button label="横屏壁纸" :value="1"/>
                    <el-radio-button label="竖屏壁纸" :value="0"/>
                  </el-radio-group>
                </el-form-item>
                <el-button type="primary" :size="elSize" :icon="Search" @click="getImages">筛选</el-button>
                <!--            <el-button type="info" :size="elSize" :icon="Download" v-model="showDownload" v-show="isShow">显示下载按钮</el-button>-->
                <el-button :type="isChoose? 'danger':'warning' " :size="elSize" :icon="isChoose? CloseBold : Select"
                           @click="selectBtn" v-show="isShow">
                  <el-text
                      v-if="isChoose">取消选择
                  </el-text>
                  <el-text v-else>选择下载项</el-text>
                </el-button>
                <el-button type="success" :size="elSize" :icon="Download" @click="downloadImages" v-show="isShow"
                           :disabled="!isChoose">开始下载
                </el-button>
                <br>
                <el-text type="danger">请注意流量消耗，所加载均为官网原图，根据每个版本的壁纸质量消耗有所不同。</el-text>
                <br>
                <el-text type="success">本站仅供技术学习和交流分享，如何任何侵权行为请联系我删除。</el-text>
              </el-form>
            </el-collapse-item>
            <el-collapse-item title="待完善功能" style="text-align: left" name="2">
              <template v-for="item in  unCompleted.slice().reverse()">
                <el-icon>
                  <Edit/>
                </el-icon>
                <el-text>&ensp;{{ item.content }}</el-text>
                <br></template>

            </el-collapse-item>
            <el-collapse-item title="已实现功能" style="text-align: left" name="3">
              <template v-for="item in completed.slice().reverse()">
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
              </el-text>
              <el-link type="primary" target="_blank" href="https://qm.qq.com/q/Oq8R7YS6sM">
                点击链接加入群聊【金兔子特供部门🐰】
              </el-link>
              <br>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-header>
      <el-button-group class="btnGroup" type="info" :size="elSize" v-show="isShow">
        <el-button @click="autoCol" type="primary">
          <svg t="1718341380597" class="el-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="5304" width="200" height="200">
            <path
                d="M832 896H730.56l-72.576-210.24H361.856L293.44 896H192l270.848-768h98.24L832 896zM629.504 598.976L522.112 279.68c-3.392-10.176-7.04-28.096-11.008-53.504H508.8c-3.392 23.168-7.232 40.96-11.456 53.504l-106.56 319.296h238.72z"
                p-id="5305"></path>
          </svg>
          <span>自动</span></el-button>
        <el-button @click="colNum=3 ">
          <svg t="1718333094288" class="el-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="2024" width="200" height="200">
            <path
                d="M469.333333 138.666667v277.333333a53.393333 53.393333 0 0 1-53.333333 53.333333H138.666667a53.393333 53.393333 0 0 1-53.333334-53.333333V138.666667a53.393333 53.393333 0 0 1 53.333334-53.333334h277.333333a53.393333 53.393333 0 0 1 53.333333 53.333334z m416-53.333334H608a53.393333 53.393333 0 0 0-53.333333 53.333334v277.333333a53.393333 53.393333 0 0 0 53.333333 53.333333h277.333333a53.393333 53.393333 0 0 0 53.333334-53.333333V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334zM416 554.666667H138.666667a53.393333 53.393333 0 0 0-53.333334 53.333333v277.333333a53.393333 53.393333 0 0 0 53.333334 53.333334h277.333333a53.393333 53.393333 0 0 0 53.333333-53.333334V608a53.393333 53.393333 0 0 0-53.333333-53.333333z m469.333333 0H608a53.393333 53.393333 0 0 0-53.333333 53.333333v277.333333a53.393333 53.393333 0 0 0 53.333333 53.333334h277.333333a53.393333 53.393333 0 0 0 53.333334-53.333334V608a53.393333 53.393333 0 0 0-53.333334-53.333333z"
                fill="currentColor" p-id="2025"></path>
          </svg>
          <span>3列</span>
        </el-button>
        <el-button @click="colNum=5 ">
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
        <div v-for="item in imgList" @click="checkImage(item.imgUrl,item.imgName,$event)" class="preImg"
             :id="'imgDiv-'+item.imgIndex">
          <el-image :src="item.imgUrl" :zoom-rate="1.2" :id="'img-'+item.imgIndex"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="isChoose? [] : previewImgList"
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
      <!--      <div-->
      <!--          @click="checkImage('https://gamecms-res.sl916.com/official_website_resource/50001/4/PICTURE/20240612/253%201440x2560_4f4a8ecb95334367ab4a83842926e1c6.jpg','',$event)">-->
      <!--        <el-image style="width: 200px"-->
      <!--                  :zoom-rate="1.2"-->
      <!--                  :max-scale="7"-->
      <!--                  :min-scale="0.2"-->
      <!--                  :preview-src-list="['https://gamecms-res.sl916.com/official_website_resource/50001/4/PICTURE/20240612/253%201440x2560_4f4a8ecb95334367ab4a83842926e1c6.jpg']"-->
      <!--                  fit="scale-down"-->
      <!--                  src="https://gamecms-res.sl916.com/official_website_resource/50001/4/PICTURE/20240612/253%201440x2560_4f4a8ecb95334367ab4a83842926e1c6.jpg"></el-image>-->
      <!--      </div>-->
    </el-container>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue'
import {
  Check, CloseBold,
  Download,
  Edit,
  Minus,
  Picture as IconPicture,
  Plus,
  Search,
  Select,
  Switch
} from "@element-plus/icons-vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import useResponsive from "@/hooks/useResponsive";
import useUserInfo from "@/hooks/useUserInfo";
import Main from "@/components/Main.vue";


const {isPC, elSize, screenWidth} = useResponsive()
const {isLogin, updateLocalUserInfo} = useUserInfo()

//用户选择项目
const condition = reactive({
      version: [],
      roles: [],
      sort: 2,
    }
)

//筛选
const activeIndex = ref(['1'])  //激活的面板
const checkAllVersions = ref(false)   //全选版本
const isIndeterminateVersion = ref(false)  //全选版本按钮状态
const versionInfo = reactive([])
const checkAllRoles = ref(false)   //全选角色
const checkNoRole = ref(false)   //全选无角色
const isIndeterminateRole = ref(false)  //全选角色按钮状态
const isIndeterminateNoRole = ref(false)  //全选无角色按钮状态
const roleInfo = reactive([]) //存角色信息


//公告列表：完成和未完成的功能
const completed = reactive([])
const unCompleted = reactive([])

const imgList = reactive([])  //展示列表，存的图片信息对象
const previewImgList = reactive([]) //大图展示列表，存的图片链接
const downloadList = reactive([])   //下载图片的列表
//显示布局按钮组
const isShow = ref(false)
//修改显示列数
const colNum = ref(isPC.value ? 5 : 1)
const autoFlag = ref(true)
const isChoose = ref(false)   //是否是批量选择状态

interface Notice {
  id: number,
  title: string,
  sort: string,
  content: string,
  created_time: string,
  updated_time: string,
  status: number,
}


//全选版本时：单选按钮的状态改变
const handleCheckAllVersionChange = (val: boolean) => {
  if (val) versionInfo.forEach(item => condition.version.push(item.version))
  else condition.version = []
  isIndeterminateVersion.value = false  //取消全选按钮符号 -
}
//单选版本时：全选按钮的状态改变
const handleCheckedVersionsChange = (value: string[]) => {
  const checkedCount = condition.version.length
  checkAllVersions.value = checkedCount === versionInfo.length //全选时变更按钮为√
  isIndeterminateVersion.value = checkedCount > 0 && checkedCount < versionInfo.length//未全选时变更按钮为 -
}

//全选角色时：单选按钮的状态改变
const handleCheckAllRoleChange = (val: boolean) => {
  if (val) roleInfo.forEach(item => condition.roles.push(item.id))
  else condition.roles = []
  isIndeterminateRole.value = false  //取消全选按钮符号 -
}
//单选角色时：全选按钮的状态改变
const handleCheckedRolesChange = (value: string[]) => {
  const checkedCount = condition.roles.length
  checkAllRoles.value = checkedCount === roleInfo.length //全选时变更按钮为√
  isIndeterminateRole.value = checkedCount > 0 && checkedCount < roleInfo.length//未全选时变更按钮为 -
}

const btnA = ref(false)
const btnB = ref(false)
const btnC = ref(false)
const btnD = ref(false)

//一键勾选分类角色
function addRoles(val: string) {
  roleInfo.forEach(item => {
    if (item.camp === val) condition.roles.push(item.id)
  })
  console.log(condition.roles)
}

//全选无角色时：全选按钮的状态改变
const handleCheckNoRoleChange = (val: boolean) => {
  if (val) condition.roles = [9999]
  else condition.roles = []
}

function reset() {
  checkAllRoles.value = false
  isIndeterminateRole.value = false
  condition.roles = []
  btnA.value = false
  btnB.value = false
  btnC.value = false
  btnD.value = false
}

getVersion()

//获取版本列表并添加到菜单
function getVersion() {
  axios({
    url: '/getVersion',
  }).then(result => {
    console.log(result)
    const {versionList, roleList} = result.data.data
    //更新版本列表
    versionInfo.splice(0, versionInfo.length, ...versionList)
    //更新角色列表
    roleInfo.splice(0, roleInfo.length, ...roleList)
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    ElMessage.error('发生错误：' + error.message)
  })
}

//获取已发布公告
getNotices()

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


//获取图片
function getImages() {
  axios({
    url: '/getWallpaper',
    params: condition,
  }).then(result => {
    console.log(result)
    isShow.value = true //显示布局按钮
    imgList.splice(0, imgList.length, ...result.data.data)
    //imgIndex用于排序，但不连续
    let index = 0
    imgList.forEach(item => {
      item.imgIndex = index
      index++
    })
    console.log(imgList)
    previewImgList.splice(0, previewImgList.length)
    imgList.forEach(item => {
      previewImgList.push(item.imgUrl)
    })
    autoCol()   //再次触发自动布局
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
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
      downloadImg(url, name)
    })
    //设置壁纸监听
    setBG.addEventListener('click', () => {
      setBackground(url, name)
    })
    menu.appendChild(downloadBtn)
    menu.appendChild(setBG)
  } else {//进入多选状态
    //根据id里面的数字获取是第几张图
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


//进入多选状态
function selectBtn() {
  const preList = document.querySelectorAll('.preImg')
  if (!isChoose.value) {
    isChoose.value = true     //进入多选状态
    //给所有呈现的图片添加选中状态
    preList.forEach(item => {
      item.classList.add('checked')
    })
    //将所有呈现的图片加入下载列表
    downloadList.splice(0, downloadList.length, ...imgList)
  } else {
    isChoose.value = false     //退出多选状态
    //给所有呈现的图片移除选中状态
    preList.forEach(item => {
      item.classList.remove('checked')
    })
    //将所有呈现的图片加入下载列表
    downloadList.splice(0, downloadList.length)
  }

}


//下载测试
// downloadImg('https://gamecms-res.sl916.com/official_website_resource/50001/4/PICTURE/20240612/253%201440x2560_4f4a8ecb95334367ab4a83842926e1c6.jpg','123.jpg')
//下载单张图片
function downloadImg(url: string, imgName: string) {
  //将下载链接替换为本地代理地址
  const imageUrl = url.replace('https://gamecms-res.sl916.com', '/download1999/')
  fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = imgName // 在这里指定下载的文件名
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error:', error));
}

//批量下载壁纸
function downloadImages() {
  console.log(downloadList)
  if (downloadList.length === 0) return ElMessage.error('请先选中需要下载的图片！')
  downloadList.forEach(item => downloadImg(item.imgUrl, item.imgName))
}

//检测屏幕变化，计算自动布局
watch(screenWidth, (newVal, oldVal) => {
  if (newVal === oldVal) return
  if (autoFlag.value) autoCol()
})

//自动布局，计算图片列数
function autoCol() {
  if (Number((screenWidth.value / 250).toFixed(0)) === colNum.value) return
  console.log(screenWidth.value)
  console.log(Math.floor(screenWidth.value / 250))
  colNum.value = Number(Math.floor(screenWidth.value / 250))
  if (previewImgList.length < 5 && isPC.value) colNum.value = previewImgList.length //PC版如果图片小于五张，则有几张就分几列
}


//endregion


</script>
<style scoped>
body {
  overflow: visible;
}

.el-header {
  height: auto;
  padding-left: 0;
  padding-right: 0;
}

.links {
  display: flex;
  justify-content: center;
  height: 30px;
}

.links .el-link {
  margin: 20px;
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


.checked {
  padding: 0;
  border: 3px #6bfac3 dotted;
}
</style>
