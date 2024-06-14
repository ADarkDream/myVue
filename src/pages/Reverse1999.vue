<template>
  <el-scrollbar height="700px">
    <el-container>
      <el-header>
        <el-card>
          <h1>1999国服官图(以影像之)下载</h1>
          <div class="links">
            <el-link type="primary" href="https://gitee.com/MuXi-Dream/download-reverse1999" target="_blank">本项目开源地址
            </el-link>
            <el-link type="primary" href="https://re.bluepoch.com/home/detail.html#wallpaper" target="_blank">官网下载地址
            </el-link>
            <el-link type="primary" href="https://pan.baidu.com/s/1A4o9VM4kPa_vzWZEtHiZSA?pwd=1999" target="_blank">
              百度网盘下载地址
            </el-link>
          </div>
          <br>
          <el-form label-position="left" :size="elSize">
            <el-form-item label="选择下载版本：">
              <el-select multiple filterable placeholder="不选则默认全选，可多选" v-model="condition.version">
                <el-option v-for="item in versionInfo" :key="item.version" :label="item.versionName"
                           :value="item.version"/>
              </el-select>
            </el-form-item>
            <el-form-item label="选择壁纸类型：">
              <el-select placeholder="不选则默认全选" v-model="condition.sort">
                <el-option label="横屏壁纸" :value="1"/>
                <el-option label="竖屏壁纸" :value="0"/>
                <el-option label="全选" :value="2"/>
              </el-select>
            </el-form-item>
            <el-button type="primary" :size="elSize" :icon="Search" @click="getImages">查看</el-button>
            <!--            <el-button type="info" :size="elSize" :icon="Download" v-model="showDownload" v-show="isShow">显示下载按钮</el-button>-->
            <el-button type="success" :size="elSize" :icon="Download" @click="downloadImages" v-show="isShow">批量下载
            </el-button>
            <br>
            <el-text type="danger">请注意流量消耗，所加载均为官网原图，根据每个版本的壁纸质量消耗有所不同。</el-text>
          </el-form>

          <el-collapse>
            <el-collapse-item title="待完善功能('公告→其它→反馈'向我提建议)" style="text-align: left">
              <el-text>
                1、 设置背景图，如果是登录用户则询问是否保存到账户信息中
              </el-text>
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
        <div v-for="item in imgList" @click="checkImage(item.imgUrl,item.imgName,$event)">
          <el-image :src="item.imgUrl" :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="previewImgList"
                    :initial-index="item.imgIndex"
                    fit="scale-down"
                    lazy>
            <template #viewer>123</template>

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
import {Download, Picture as IconPicture, Search} from "@element-plus/icons-vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import useResponsive from "@/hooks/useResponsive";
import useUserInfo from "@/hooks/useUserInfo";

const {isPC, elSize, screenWidth} = useResponsive()
const {bgUrl, isLogin} = useUserInfo()

//用户选择项目
const condition = reactive({
      version: null,
      sort: null
    }
)

//多选框版本信息
const versionInfo = reactive([])
const imgList = reactive([])  //展示列表，存的图片信息对象
const previewImgList = reactive([]) //大图展示列表，存的图片链接
const downloadList = reactive([])   //下载图片的列表
//显示布局按钮组
const isShow = ref(false)
//修改显示列数
const colNum = ref(isPC.value ? 5 : 1)
const autoFlag = ref(true)
const isClose = ref(false)


getVersion()

//获取版本列表并添加到菜单
function getVersion() {
  axios({
    url: '/getVersion',
  }).then(result => {
    const {data} = result.data
    //更新版本列表
    versionInfo.splice(0, versionInfo.length, ...data)
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
    ElMessage.error('发生错误：' + error.message)
  })
}

//获取图片
function getImages() {
  axios({
    url: '/getWallpaper',
    params: condition,
  }).then(result => {
    console.log(result)
    const {status, msg, data} = result.data
    isShow.value = true //显示布局按钮
    imgList.splice(0, imgList.length, ...data)
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
  }).catch(error => {
    console.log('发生错误：')
    console.log(error)
  })
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
  imgList.forEach(item => {
    downloadImg(item.imgUrl, item.imgName)
  })
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
}


//region 全屏浏览图片，添加底部菜单
function checkImage(url, name, e) {//这个事件要绑定el-image父级盒子上
  if (e.target.tagName !== 'IMG') return  //如果点击的不是图片元素则终止函数,以防重复添加
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
    setBackground(url)
  })
  menu.appendChild(downloadBtn)
  menu.appendChild(setBG)
}


//设置背景图
function setBackground(url: string) {
  localStorage.setItem('bgUrl', url)
  // bgUrl.value = url
  const body = (document.querySelector('body') as HTMLElement)
  body.style.backgroundImage = `url(${url})`
  ElMessage.success('设置本地背景图成功')
  //如果是登录用户则询问是否设置到账户信息中
  // axios({
  //   url: '',
  //   method: 'post',
  //   data: {url}
  // }).then(result => {
  //   console.log(result)
  //   const {status, msg} = result.data
  //   if (status === 200) {
  //     ElMessage.success(msg)
  //
  //   }
  // }).catch(error => {
  //   console.log('发生错误：')
  //   console.log(error)
  // })
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
</style>
