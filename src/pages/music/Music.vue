<template>
  <el-container :style="'height:'+(containerHeight)+'px'">
    <el-header>音乐播放器demo</el-header>
    <el-main>
      <audio ref="audioElement" crossOrigin='anonymous' :src='playList[playingIndex].src' type="audio/mpeg"/>
      <!--音量控制面板-->
      <VolumeComp v-if="isShowVolumePanel" :min="0" :max="100" :value="volume*100" :changeVolume="changeVolume"/>

      <el-collapse style="text-align: left" v-model="activeName" accordion>
        <el-collapse-item title="备忘" name="0">
          <div>1、会员歌曲不能跳过,在resetUrl里面改逻辑</div>
          <div>2、七牛云链接后加上?avinfo可以获得音频源数据</div>
          <div>3、用第三方库 lyric-parser 进行处理。实现显示歌词、拖动进度条歌词同步滚动、歌词跟随歌曲进度高亮。</div>
          <div>4、各类设置存本地，用store</div>
        </el-collapse-item>
        <el-collapse-item title="播放列表" name="1">
          <template v-for="(item,index) in playList" :key="index">
            <div>
              <el-text>{{ index + 1 }}、{{ item.name || '未命名' }} -
                {{ item.artists.length !== 0 ? item.artists.map(artist => artist.name).join('&') : '未知艺术家' }}
              </el-text>&ensp;
              <el-text v-if="item.fee===1&&!item.src" type="danger">[VIP]</el-text>
              <el-text v-else @click="toggleMusic({index})" size="small" type="primary">
                点击播放
              </el-text>
            </div>
          </template>
        </el-collapse-item>
        <el-collapse-item title="添加音乐" name="2">
          <el-form v-model="newMusic" label-width="auto" label-position="top"
                   style="width: 100%;" :size="elSize">
            <el-form-item label="输入音乐ID获取音频链接(仅支持网易云免费音乐)">
              <el-row :gutter="24">
                <el-col :span="16">
                  <el-input v-model.trim="cloudMusicID" placeholder="输入网易云音乐ID"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="addCloudMusic(cloudMusicID,true)" type="primary" plain>添加并播放
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="src" label="输入音频链接">
              <el-row :gutter="24">
                <el-col :span="16">
                  <el-input v-model="newMusic.src" placeholder="输入音频链接"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="addMusic" type="success" plain>添加并播放</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="搜索音乐(网易云)" name="3">
          <SearchMusic :addCloudMusic="addCloudMusic" style="width: 100%;margin: 0 auto"/>
        </el-collapse-item>
      </el-collapse>

    </el-main>

    <div class="footer">
      <!--播放器-->
      <div class="player">
        <div class="play-panel" :class="{ active: infoBarActive }">
            <span ref="musicName" class="name" :class="{ scroll: nameScroll }" :style="transformX">{{
                isLoading ? '加载中' : playList[playingIndex].name || '未命名'
              }}——<span class="artist">
              {{
                  isLoading ? '加载中' : playList[playingIndex].artists.map(artist => artist.name).join('&') || '未知艺术家'
                }}
            </span> </span>
          <div class="progress-bar">
            <el-slider v-model="currentTime" @change="changeCurrentTime" :min="0"
                       :max="duration" :show-tooltip="false"/>
            <div class="time"><span>{{
                formatMusicTime(currentTime)
              }}</span><span>{{ formatMusicTime(duration) }}</span></div>
          </div>
        </div>
        <div class="control-panel" :class="{ active: controlPanelActive }">
          <div class="album-art"
               :style="'--bgImage:'+`url(${playList[playingIndex].album.pic_url || defaultAlbumArt})`"
               @click="play({})"></div>
          <div class="controls">
            <div class="prev" @click="toggleMusic({isNext:false,isAuto:false})"></div>
            <div class="play" @click="play({})"></div>
            <div class="next" @click="toggleMusic({isNext:true,isAuto:false})"></div>
            <!--右侧面板-->
            <div class="options">
              <!--播放模式-->
              <span @click="playConfigStore.toggleMode()">
              <!--列表循环-->
              <svg v-if="modeIndex===0" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M411.3152 780.8v71.3728l-108.6208-108.6208 108.6208-108.6208V704H640a166.4 166.4 0 0 0 166.4-166.4v-128a38.4 38.4 0 0 1 76.8 0v128a243.2 243.2 0 0 1-243.2 243.2h-228.6848z m229.5296-512V196.5568l108.5952 108.6208-108.5952 108.5952V345.6H409.6A166.4 166.4 0 0 0 243.2 512v128a38.4 38.4 0 0 1-76.8 0v-128a243.2 243.2 0 0 1 243.2-243.2h231.2448z"/>
              </svg>
                <!--顺序播放-->
              <svg v-else-if="modeIndex===1" class="icon" style="width: 26px;padding: 2px" viewBox="0 0 1024 1024"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M697.4464 381.4656L861.6192 256l-164.1728-125.4656zM697.4464 663.0656L861.6192 537.6l-164.1728-125.4656zM697.4464 919.0656L861.6192 793.6l-164.1728-125.4656z"></path>
                <path
                    d="M153.6 230.4m38.4 0l588.8 0q38.4 0 38.4 38.4l0 0q0 38.4-38.4 38.4l-588.8 0q-38.4 0-38.4-38.4l0 0q0-38.4 38.4-38.4Z"></path>
                <path
                    d="M153.6 486.4m38.4 0l588.8 0q38.4 0 38.4 38.4l0 0q0 38.4-38.4 38.4l-588.8 0q-38.4 0-38.4-38.4l0 0q0-38.4 38.4-38.4Z"></path>
                <path
                    d="M153.6 742.4m38.4 0l512 0q38.4 0 38.4 38.4l0 0q0 38.4-38.4 38.4l-512 0q-38.4 0-38.4-38.4l0 0q0-38.4 38.4-38.4Z"/>
              </svg>
                <!--随机播放-->
              <svg v-else-if="modeIndex===2" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M768 704v-70.2208L876.6208 742.4 768 851.0208V780.8h-17.6128c-108.1344 0-188.0576-37.5296-224.1536-123.2128a38.4 38.4 0 1 1 70.784-29.824c22.016 52.3264 72.96 76.2368 153.344 76.2368H768z m0-435.2V198.5792L876.6208 307.2 768 415.8208V345.6h-17.6128c-80.384 0-131.328 23.9104-153.344 76.2368l-99.2768 235.7504c-36.096 85.6832-116.0192 123.2128-224.1536 123.2128H230.4a38.4 38.4 0 0 1 0-76.8h43.2128c80.384 0 131.328-23.9104 153.344-76.2368l99.2768-235.7504c36.096-85.6832 116.0192-123.2128 224.1536-123.2128H768z m-537.6 0h43.2128c108.1344 0 188.0576 37.5296 224.1536 123.2128a38.4 38.4 0 1 1-70.784 29.824c-22.016-52.3264-72.96-76.2368-153.344-76.2368H230.4a38.4 38.4 0 0 1 0-76.8z"/>
              </svg>
                <!--单曲循环-->
              <svg v-else-if="modeIndex===3" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M411.3152 780.8v71.3728l-108.6208-108.6208 108.6208-108.6208V704H640a166.4 166.4 0 0 0 166.4-166.4v-128a38.4 38.4 0 0 1 76.8 0v128a243.2 243.2 0 0 1-243.2 243.2h-228.6848z m229.5296-512V196.5568l108.5952 108.6208-108.5952 108.5952V345.6H409.6A166.4 166.4 0 0 0 243.2 512v128a38.4 38.4 0 0 1-76.8 0v-128a243.2 243.2 0 0 1 243.2-243.2h231.2448z m-123.2128 128.1024h22.9376V652.8h-29.3888v-220.0576c-16.128 16.4864-36.1984 27.9552-60.2112 35.1232v-29.3888a152.32 152.32 0 0 0 35.84-15.4112 148.4032 148.4032 0 0 0 30.8224-26.1632z"/>
              </svg>
            </span>
              <!--锁-->
              <span @click="isLock=!isLock">
                <svg v-if="isLock" class="icon small_icon" viewBox="0 0 1024 1024"><path
                    d="M894.419759 379.302769l-122.366955 0 0-101.96223c0-65.430198-25.470091-126.941134-71.723531-173.194574-46.25344-46.25344-107.764376-71.723531-173.194574-71.723531s-126.941134 25.470091-173.194574 71.723531-71.723531 107.764376-71.723531 173.194574l0 101.96223-122.366955 0c-11.307533 0-20.466124 9.168824-20.466124 20.466124l0 571.34255c0 11.2973 9.15859 20.466124 20.466124 20.466124l734.570121 0c11.307533 0 20.466124-9.168824 20.466124-20.466124l0-571.34255C914.885883 388.471592 905.727293 379.302769 894.419759 379.302769zM323.148841 277.340539c0-54.501288 21.213137-105.727996 59.740616-144.255475 38.517245-38.517245 89.743954-59.730383 144.245242-59.730383s105.727996 21.213137 144.245242 59.730383c38.527478 38.527478 59.740616 89.754187 59.740616 144.255475l0 101.96223-407.971715 0L323.148841 277.340539 323.148841 277.340539zM873.953635 950.645318l-693.637874 0 0-530.410302 693.637874 0L873.953635 950.645318z"></path><path
                    d="M588.348875 644.6256c0 18.071587-7.971555 34.137495-20.404726 45.332465l0 56.691163c0 22.543436-18.276249 40.819684-40.809451 40.819684-22.533202 0-40.809451-18.276249-40.809451-40.819684l0-56.691163c-12.43317-11.19497-20.404726-27.260877-20.404726-45.332465 0-33.810037 27.40414-61.214177 61.214177-61.214177C560.954969 583.411423 588.348875 610.815563 588.348875 644.6256z"/></svg>
             <svg v-else class="icon small_icon" viewBox="0 0 1024 1024"><path
                 d="M894.419759 408.844595l-576.643276 0c-8.452509-27.363208-26.462698-85.58933-31.691793-102.545514-16.086373-52.065819-10.939143-107.283422 14.490016-155.460678s68.111261-83.573417 120.17708-99.670024c52.065819-16.086373 107.283422-10.949376 155.460678 14.490016 48.187489 25.429159 83.573417 68.111261 99.670024 120.166847 4.400217 14.285355 27.03575 87.533612 27.03575 87.533612l39.110763-12.075013c0 0-22.635533-73.248258-27.03575-87.533612-19.320021-62.513776-61.817927-113.76095-119.67566-144.296407-57.847499-30.535457-124.137275-36.705993-186.651051-17.385972s-113.750717 61.817927-144.286174 119.665427-36.716226 124.137275-17.406438 186.640818c4.553713 14.745842 18.767436 60.743456 27.956725 90.470501l-115.081015 0c-11.307533 0-20.466124 9.15859-20.466124 20.466124l0 571.332317c0 11.307533 9.15859 20.466124 20.466124 20.466124l734.570121 0c11.307533 0 20.466124-9.15859 20.466124-20.466124l0-571.332317C914.885883 418.003186 905.727293 408.844595 894.419759 408.844595zM873.953635 980.176912l-693.637874 0 0-530.400069 693.637874 0L873.953635 980.176912z"></path><path
                 d="M588.348875 674.167426c0 18.061354-7.971555 34.137495-20.404726 45.332465l0 56.691163c0 22.533202-18.276249 40.809451-40.809451 40.809451-22.533202 0-40.809451-18.276249-40.809451-40.809451l0-56.691163c-12.43317-11.19497-20.404726-27.27111-20.404726-45.332465 0-33.82027 27.40414-61.214177 61.214177-61.214177C560.954969 612.95325 588.348875 640.347157 588.348875 674.167426z"/></svg>
              </span>
              <!--音量控制-->
              <span @click="isShowVolumePanel=!isShowVolumePanel">
                <!--静音-->
                <svg v-if="volume===0" class="icon small_icon" viewBox="0 0 1024 1024"><path
                    d="M128 420.576v200.864h149.12l175.456 140.064V284.288l-169.792 136.288H128z m132.256-64l204.288-163.968a32 32 0 0 1 52.032 24.96v610.432a32 32 0 0 1-51.968 24.992l-209.92-167.552H96a32 32 0 0 1-32-32v-264.864a32 32 0 0 1 32-32h164.256zM752 458.656L870.4 300.8a32 32 0 1 1 51.2 38.4L792 512l129.6 172.8a32 32 0 0 1-51.2 38.4l-118.4-157.856-118.4 157.856a32 32 0 0 1-51.2-38.4l129.6-172.8-129.6-172.8a32 32 0 0 1 51.2-38.4l118.4 157.856z"/></svg>
                <!--音量-->
        <svg v-else class="icon small_icon" viewBox="0 0 1024 1024"><path
            d="M128 420.576v200.864h149.12l175.456 140.064V284.288l-169.792 136.288H128z m132.256-64l204.288-163.968a32 32 0 0 1 52.032 24.96v610.432a32 32 0 0 1-51.968 24.992l-209.92-167.552H96a32 32 0 0 1-32-32v-264.864a32 32 0 0 1 32-32h164.256zM670.784 720.128a32 32 0 0 1-44.832-45.664 214.08 214.08 0 0 0 64.32-153.312 213.92 213.92 0 0 0-55.776-144.448 32 32 0 1 1 47.36-43.04 277.92 277.92 0 0 1 72.416 187.488 278.08 278.08 0 0 1-83.488 198.976zM822.912 858.88a32 32 0 1 1-45.888-44.608A419.008 419.008 0 0 0 896 521.152c0-108.704-41.376-210.848-114.432-288.384a32 32 0 0 1 46.592-43.872c84.16 89.28 131.84 207.04 131.84 332.256 0 127.84-49.76 247.904-137.088 337.728z"/></svg>
              </span>
              <!--播放列表-->
              <span @click="changePanel('1')">
               <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M819.2 787.072l-108.6208-82.9952L819.2 621.056v166.016zM192 256h588.8a38.4 38.4 0 0 1 0 76.8h-588.8a38.4 38.4 0 0 1 0-76.8z m0 204.8h588.8a38.4 38.4 0 0 1 0 76.8h-588.8a38.4 38.4 0 0 1 0-76.8z m0 204.8h409.6a38.4 38.4 0 0 1 0 76.8h-409.6a38.4 38.4 0 0 1 0-76.8z"/>
            </svg>
            </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-container>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref, computed} from 'vue';
import useTimestamp from "@/hooks/useTimestamp";
import {ElMessage} from 'element-plus'
import defaultAlbumArt from '@/assets/music.svg'
import axios from "axios";
import useResponsive from "@/hooks/useResponsive";
import {ResultData} from "@/types/global";
import {CloudSongInfo, SongInfo} from "@/types/music";
import SearchMusic from "@/pages/music/components/SearchMusic.vue";
import {useMusicStore} from "@/store/music/useMusicStore";
import {usePlayConfigStore} from '@/store/music/usePlayConfigStore'
import VolumeComp from "@/components/smallComp/VolumeComp.vue";

const musicStore = useMusicStore()
const playConfigStore = usePlayConfigStore()

const {isPC, elSize, containerHeight} = useResponsive()
const {formatMusicTime} = useTimestamp()

//是否显示
const activeName = ref('3')
const changePanel = (name: string) => activeName.value = name


//是否显示控制面板
const infoBarActive = ref(false)
//是否旋转专辑图
const controlPanelActive = ref(false)
//是否滚动歌名
const nameScroll = ref(false)
//滚动距离
const transformX = ref('--scrollNamePosition:-50%')


// const AudioCtx= window.AudioContext

const audioContext = new AudioContext()
// audioContext.crossOrigin = 'anonymous'
//音频DOM元素
const audioElement = ref<HTMLAudioElement>()
//歌名和歌手名DOM元素
const musicName = ref<HTMLDivElement>()
//音量控制
let gainNode = audioContext.createGain()
//显示音量控制面板
const isShowVolumePanel = ref(false)

//锁住播放器面板
const isLock = ref(false)

let track = null

//是否正在播放的标志
const isPlaying = computed({
  get: () => musicStore.isPlaying,
  set: (val: boolean) => musicStore.isPlaying = val
})
const isLoading = computed({
  get: () => musicStore.isLoading,
  set: (val: boolean) => musicStore.isLoading = val
})
//播放进度
const currentTime = ref(audioElement.value?.currentTime)
//音乐总时长
const duration = ref(audioElement.value?.duration)

//音量0~1，1为100%
const volume = computed({
      get: () => playConfigStore.volume,
      set: (val: number) => playConfigStore.volume = val
    }
)

const playList = computed(() => musicStore.playList)


//当前播放的歌的序号
const playingIndex = ref(0)

//当前播放模式的序号
const modeIndex = computed(() => playConfigStore.modeIndex)


const newMusic = ref<SongInfo>({
  name: '',
  artists: [{name: '', pic_url: ''}],
  album: {name: '', pic_url: ''},
  src: ''
})

const cloudMusicID = ref()

//如果音乐有id没地址，则要通过id获取最新的src，然后重新赋值
const resetUrl = async (song: CloudSongInfo) => {
  // if (!song.src) {
  // const {isError, songs} = await addCloudMusicList([song.cloud_music_id])
  // if (isError) return
  // else if (song?.fee === 1) {
  //   return ElMessage.warning('暂不支持VIP音乐')
  // } else if (songs) {
  //   musicStore.addMusicList(songs, {isReplace: true})
  // }
  // }

  if (song.src) return
  //获取播放链接
  const result = await axios<ResultData<{ playInfo: { cloud_music_id: number, src: string } }>>({
    url: '/getPlayInfo',
    params: {cloud_music_id: song.cloud_music_id, fee: song.fee},
  })
  const {data} = result.data
  if (data) {
    //合并歌曲信息和播放地址信息
    const newSong = Object.assign(song, data.playInfo)
    console.log('newSong', [newSong])
    const index = musicStore.addMusicList([newSong], {isReplace: true})
    console.log(`播放第${index}首歌：${playList.value[index].name}`)
    ElMessage.info(`播放第${index}首歌：${playList.value[index].name}`)
    //切换到添加的这首歌
    // await toggleMusic({index})
  } else return ElMessage.warning('暂不支持VIP音乐')

}

onMounted(async () => {
  track = audioContext.createMediaElementSource(audioElement.value as HTMLAudioElement)

  track.connect(gainNode).connect(audioContext.destination)
  // await Promise.all([

  // ])
})


//计算当前播放时长的定时器
const timer1 = ref<NodeJS.Timeout>()

//播放和暂停
//pause=true则必定暂停，pause默认则看isPlaying.value;isReplay=true则从头开始播放
function play({pause = false, isReplay = false}: { pause?: boolean, isReplay?: boolean }) {
  const length = playList.value.length
  if (length === 0) return ElMessage.info('歌曲列表为空')
  else if (playingIndex.value < 0 || playingIndex.value > length) {
    playingIndex.value = 0
    ElMessage.info('歌曲不存在,已跳转到第一首')
  }

  if (audioContext.state === "suspended") {
    audioContext.resume()
  }

  console.log('是否强制暂停：', pause, '是否强制重新播放：', isReplay)
  if (pause || isPlaying.value) {//暂停
    isPlaying.value = false
    audioElement.value?.pause()
    infoBarActive.value = false
    controlPanelActive.value = false
    //关闭播放时间计时器
    clearTimeout(timer1.value)
    console.log('播放暂停')
  } else {//播放
    if (!audioElement.value) return
    isPlaying.value = true
    // 重新加载新歌曲(来自toggleMusic)
    if (isReplay) {
      audioElement.value.load()
      // 绑定新的 `canplay` 事件监听器，确保加载完成后再播放
      audioElement.value.addEventListener('canplay', handleCanPlay);
    } else audioElement.value.play().catch(err => {
      ElMessage.error('播放失败，切换到下一首')
      setTimeout(() => toggleMusic({}), 500)
      console.error("播放失败：", err)
    })

    infoBarActive.value = true
    controlPanelActive.value = true
    isLoading.value = false
    nextTick(() => isScroll())
    duration.value = audioElement.value?.duration
    //开启播放时间计时器,显示当前播放时长
    timer1.value = setInterval(() => playing(), 500)
    console.log('播放开始')
  }
}

//监听播放进度
const playing = () => {
  currentTime.value = audioElement.value?.currentTime
  if (audioElement.value?.currentTime === duration.value) {
//切换下一首
    toggleMusic({isNext: true, isAuto: true})
  }
}

//修改音量
const changeVolume = (value: number) => {
  console.log('音量变化', value)
  gainNode.gain.value = value
  volume.value = value
}

//修改播放进度
const changeCurrentTime = (newCurrentTime: number) => {
  if (audioElement.value) {
    audioElement.value.currentTime = newCurrentTime
    console.log('跳转到', formatMusicTime(newCurrentTime))
  }
}

//判断歌曲和歌手名是否超出长度限制，是否滚动
const isScroll = () => {
  if (musicName.value) {//歌曲名滚动
    const nameSW = musicName.value.scrollWidth
    const nameCW = musicName.value.clientWidth
    nameScroll.value = nameSW > nameCW
    console.log('歌曲名是否超出容器', nameScroll.value, nameSW, nameCW)
    //如果超出了，修改滚动距离
    if (nameScroll.value) {
      transformX.value = `--scrollNamePosition:${nameCW - nameSW - 20}px`
    }
  }
}


//切换音乐
const toggleMusic = async ({isNext = true, isAuto = true, index}: {
  isNext?: boolean,
  isAuto?: boolean,
  index?: number
}) => {
  const length = playList.value.length
  if (!audioElement.value || length === 0) return ElMessage.error('播放列表为空')
  else if (length === 1 && !isAuto) {
    return ElMessage.info('播放列表只有一首歌')
  }
  if (isPlaying.value) { //暂停播放
    audioElement.value.pause()
    isPlaying.value = false
  }
  //重置播放进度
  audioElement.value.currentTime = 0
  //设置加载flag
  isLoading.value = true
  // 移除旧的 `canplay` 事件监听器
  audioElement.value.removeEventListener('canplay', handleCanPlay)
  //切换歌曲逻辑
  //定向切歌
  if (index) {
    playingIndex.value = index
    console.log(`即将播放第${index}首歌：${playList.value[index].name}`)
  }
  //按模式切歌
  else if (modeIndex.value === 0) {
    listLoop(isNext)
  } else if (modeIndex.value === 1) {
    sequentialPlay(isNext)
  } else if (modeIndex.value === 2) {
    randomPlay()
  } else if (modeIndex.value === 3) {
    singleLoop(isNext, isAuto)
  }
  //获取要播放的这一首歌
  const song = playList.value[playingIndex.value]
  console.log('即将播放', song)
  if (song?.fee === 1 && !song.src) {
    musicStore.deleteMusic(song.cloud_music_id)
    return ElMessage.warning('暂不支持VIP音乐')
  }
  await resetUrl(song)


  // 重新加载新歌曲
  // audioElement.value.load()
  //
  // // 绑定新的 `canplay` 事件监听器，确保加载完成后再播放
  // audioElement.value.addEventListener('canplay', handleCanPlay);
  //
  // isScroll()
  //如果当前不是播放状态，则播放
  if (!isPlaying.value) play({isReplay: true})
}


const handleCanPlay = () => {
  if (!audioElement.value) return
  // track.disconnect()
  // track = audioContext.createMediaElementSource(audioElement.value as HTMLAudioElement);
  // gainNode = audioContext.createGain()
  // 连接新的音频源到 gainNode
  // track.connect(gainNode).connect(audioContext.destination);

  // 播放新歌曲
  audioElement.value.play().catch(err => {
    ElMessage.error('播放失败')
    setTimeout(() => toggleMusic({}), 500)
    console.error("播放失败：", err)
  })
  isLoading.value = false
  // 解绑 `canplay` 事件监听器，防止多次触发
  audioElement.value.removeEventListener('canplay', handleCanPlay)

  // 更新歌曲时长
  duration.value = audioElement.value.duration
  // console.log(duration.value, audioElement.value?.duration)
}


//列表循环
const listLoop = (isNext: boolean) => {
  if (isNext) playingIndex.value++
  else playingIndex.value--
  //下一首，此为最后一首
  if (playingIndex.value >= playList.value.length) {
    playingIndex.value = 0
    //上一首，此为第一首
  } else if (playingIndex.value < 0) {
    playingIndex.value = playList.value.length - 1
  }
  console.log('列表循环', playingIndex.value, playList.value[playingIndex.value])
}

//顺序播放
const sequentialPlay = (isNext: boolean) => {
  if (isNext) playingIndex.value++
  else playingIndex.value--
  //下一首，此为最后一首或上一首，此为第一首
  if (playingIndex.value >= playList.value.length) {
    //换成默认的信息，空白信息
    playingIndex.value--
    return ElMessage.info('当前是最后一首')
  } else if (playingIndex.value <= 0) {
    playingIndex.value++
    return ElMessage.info('当前是第一首')
  }

  console.log('顺序播放', playingIndex.value, playList.value[playingIndex.value])
}

//随机播放
const randomPlay = () => {
  const randomNum = Math.floor(Math.random() * (playList.value.length))
  if (playingIndex.value === randomNum && playList.value.length !== 1) return randomPlay
  playingIndex.value = randomNum
  console.log('顺序播放', playingIndex.value, playList.value[playingIndex.value])
}

//单曲循环
const singleLoop = (isNext: boolean, isAuto: boolean) => {
  //自动切换，循环当前音乐
  if (isAuto) {
    // if (audioElement.value) audioElement.value.currentTime = 0
    console.log('单曲循环', playingIndex.value, playList.value[playingIndex.value])
    //手动切换
  } else {
    listLoop(isNext)
  }
}

//添加并播放新音乐
const addMusic = async () => {
  // if (!newMusic.value.src) return ElMessage.error('音乐链接不能为空')
  const reg = /(https?:\/\/)?(([0-9a-z.]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%\/.\-_]*)?(\?[0-9a-z=&%_\-]*)?(#[0-9a-z=&%_\-]*)?/ig
  if (!reg.test(newMusic.value.src)) return ElMessage.error('请输入一个网址链接')
  //去除响应式
  const songInfo = Object.assign({}, newMusic.value) as CloudSongInfo
  console.log('[songInfo]', [songInfo])
  const index = musicStore.addMusicList([songInfo], {})
  //切换到最后一首
  await toggleMusic({index})
}

//根据网易云音乐ID添加到播放列表
const addCloudMusic = async (id: number, isPlay = false) => {
  try {
    if (!id) return
    const {isError, songs} = await addCloudMusicList([id])
    console.log('songs', isError, songs)
    if (isError) return
    //songs为空，addCloudMusicList过滤时
    if (!songs?.length) return // ElMessage.warning('添加的音乐需要VIP，暂不支持')

    //添加到播放列表

    //如果添加一首歌且选择播放
    if (songs.length === 1 && isPlay) {
      const song = songs[0]

      //获取播放链接
      const result = await axios<ResultData<{ playInfo: { cloud_music_id: number, src: string } }>>({
        url: '/getPlayInfo',
        params: {cloud_music_id: song.cloud_music_id},
      })
      const {data} = result.data
      if (data) {
        //合并歌曲信息和播放地址信息
        songs[0] = Object.assign(song, data.playInfo)
        const index = musicStore.addMusicList(songs, {isReplace: true})
        console.log(`播放第${index}首歌`)
        //切换到添加的这首歌
        await toggleMusic({index})
      }
    } else musicStore.addMusicList(songs, {isReplace: true})

  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}


// emitter.on('addCloudMusic',({id, isPlay = false}:{id: number, isPlay:boolean})=>addCloudMusic(id, isPlay))

//获取音乐信息
const addCloudMusicList = async (idList: number[]): Promise<{
  isError: boolean,
  songs?: CloudSongInfo[]
}> => {
  let isError = false
  if (idList.length === 0) {
    ElMessage.error('请求的idList不能为空')
    return {isError}
  }
  idList.forEach(id => {
        // 尝试将id转换为数字
        const num = Number(id)
        // 检查是否成功转换为数字，并且是一个正整数
        if (isNaN(num) || !Number.isInteger(num) || num <= 0)
          isError = true
      }
  )
  if (isError) {
    ElMessage.error('含有不合法的id,id应为纯数字')
    return {isError}
  }
  try {
    const result = await axios<ResultData<{ songsInfo: CloudSongInfo[] }>>({
      url: '/getCloudMusic',
      params: {idList},
    })
    console.log(result)
    const {data} = result.data
    console.log('获取的音乐信息：', data)
    //清洗掉返回数据中没有播放地址的歌曲信息
    // 过滤掉src不存在的song
    if (data) {
      // console.log(!data.songsInfo, data.songsInfo)
      if (!data.songsInfo) return {isError: true}

      const songs = data.songsInfo
      //过滤地址不存在的歌
      // const songs = data.songsInfo.filter(song => song.src !== undefined && song.src !== '')
      return {isError, songs}
    }
    return {isError: true}

  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
    return {isError: true}
  }
}
//
// //根据音乐id获取链接
// async function getUrl(id: number) {
//   try {
//     if (!id) return ElMessage.error('音乐ID不能为空')
//     const result = await axios({
//       url: '/getCloudMusic',
//       params: {id},
//     })
//     console.log(result)
//     const {data} = result.data
//
//     return data.resultUrl
//   } catch (err) {
//     console.error('出错了', err)
//     ElMessage.error('获取播放连接失败')
//   }
// }


//region 播放buffer音频
// 1. 创建 AudioContext
// const audioContext2 = new window.AudioContext();
//
// // 2. 定义音频源变量
// let audioBuffer;
// let source; // 当前播放的音频源
//
// // 3. 加载并播放音频
// async function loadAndPlayAudio(url: string) {
//   // 如果当前有音频在播放，先停止它
//   if (source) {
//     source.stop()
//   }
//
//   // 加载新的音频文件
//   try {
//     // 使用 fetch 进行异步获取音频文件
//     const response = await fetch(url)
//
//     // 将响应转换为 ArrayBuffer
//     const arrayBuffer = await response.arrayBuffer()
//
//     // 使用 AudioContext 解码音频数据, 将解码后的数据保存到 audioBuffer 中
//     audioBuffer = await audioContext2.decodeAudioData(arrayBuffer)
//
//     // 播放音频
//     playAudio();
//   } catch (error) {
//     console.error('音频加载错误:', error)
//   }
// }
//
// // 4. 播放音频
// function playAudio() {
//   // 创建新的 AudioBufferSourceNode
//   source = audioContext2.createBufferSource();
//   source.buffer = audioBuffer;
//
//   // 将音频源连接到 AudioContext 的目的地（扬声器）
//   source.connect(audioContext2.destination);
//
//   // 开始播放音频
//   source.start();
// }

// 5. 切换音频文件
//loadAndPlayAudio(newUrl);

//endregion


// const getMusic = async (id:number) => {
//   try {
//     const result = await axios({
//       url: 'https://music.163.com/api/song/lyric',
//       params: {
//         id,
//         os: 'pc',
//         lv: '-1', kv: '-1',
//         tv: '-1'
//       },
//     })
//     console.log(result)
//     const {status, msg, data} = result.data
//
//   } catch (error) {
//     console.log('发生错误：')
//     console.dir(error)
//   }
// }
//
// getMusic(1430583016)
</script>

<style scoped>
.el-container {
  background-color: var(--el-bg-color);
  display: flex;
  justify-content: center;
}

.el-header {
  height: auto;
  margin-top: 20px;
}

.footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
}

/*播放器的样式*/
.player {
  padding: 0;
  width: 400px;
  position: relative;
  margin: 0 auto 40px;
  --bgImage: url('@/assets/music.svg');
  --infoColor: rgba(107, 179, 250, 0.44);
  --btnColor: #eee;
  --scrollNamePosition: -50%;
  /*播放音乐的信息*/

  .play-panel {
    position: absolute;
    height: 45px;
    top: 0;
    opacity: 0;
    left: 10px;
    right: 10px;
    background-color: var(--infoColor);
    padding: 5px 15px 5px 5px;
    border-radius: 15px;
    transition: all .5s ease;
    box-shadow: 2px 1px 2px 1px rgba(0, 0, 0, 0.2);

    .name {
      color: #222;
      display: block;
      white-space: nowrap; /*文字不换行*/
      font-size: 14px;
      margin-bottom: 5px;
    }

    /*播放时音乐名称太长，开始滚动*/

    .scroll {
      animation: scroll 5s linear infinite;
    }


    .artist {
      color: #494343;
      font-size: 14px;
    }

    /*进度条总长度*/

    .progress-bar {
      background-color: #ddd;
      height: 2px;
      margin-left: 30%;
      width: 70%;
      position: relative;


      /*播放进度时间*/

      .time {
        position: absolute;
        display: flex;
        justify-content: space-between;
        width: 100%;
        left: 0;
        top: 5px;
        font-size: 10px;
      }
    }

    /*播放音乐的信息面板,播放时上滑*/

    &.active {
      top: -47px;
      opacity: 1;
      transition: all .5s ease;
    }
  }

  .control-panel {
    position: relative;
    background-color: #fff;
    border-radius: 15px;
    width: 100%;
    height: 80px;
    z-index: 5;
    box-shadow: 0 20px 20px 5px rgba(132, 132, 132, 0.3);

    .album-art {
      position: absolute;
      left: 20px;
      top: -15px;
      height: 80px;
      width: 80px;
      border-radius: 50%;
      box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0);
      transform: scale(1);
      transition: all .5s ease;

      /*专辑图中间的白色圆点*/
      /*     &::after {
             content: '';
             position: absolute;
             top: 50%;
             left: 50%;
             width: 15px;
             height: 15px;
             background-color: #fff;
             border-radius: 50%;
             z-index: 5;
             transform: translate(-50%, -50%);
           }*/

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 80px;
        background-image: var(--bgImage);
        fill: black;
      }
    }

    &.active .album-art {
      box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.2);
      transform: scale(1.2);
      transition: all .5s ease;
    }

    &.active .album-art::before {
      animation: rotation 3s infinite linear;
      -webkit-animation: rotation 3s infinite linear;
      animation-fill-mode: forwards;
    }


    .controls {
      /*   display: flex;
         justify-content: flex-end;*/
      height: 80px;
      padding: 0 0 0 30%;
      background-color: var(--el-bg-color);
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 2fr;
      width: 70%;


      .prev,
      .play,
      .next {
        width: 55px;
        height: 80px;
        border-radius: 10px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 20px;
        margin: 0;
        background-color: var(--el-bg-color);
        cursor: pointer;
        transition: background-color .3s ease;
        -webkit-transition: background-color .3s ease;
      }

      .prev:hover,
      .play:hover,
      .next:hover {
        background-color: var(--btnColor);
        transition: background-color .3s ease;
        -webkit-transition: background-color .3s ease;
      }

      /*上一首按钮*/

      .prev {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI1MC40ODggMjUwLjQ4OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjQ4OCAyNTAuNDg4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4Ij4KPGcgaWQ9IlByZXZpb3VzX3RyYWNrIj4KCTxwYXRoIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDsiIGQ9Ik0yMzcuNDg0LDIyLjU4N2MtMy4yNjYsMC03LjU5MS0wLjQwMS0xMS4wNzIsMi4wMDVsLTkyLjI2NCw3Ny45MVYzNy4yNTIgICBjMC0yLjUwNywwLjA1Ny0xNC42NjYtMTMuMDA0LTE0LjY2NmMtMy4yNjUsMC03LjU5LTAuNDAxLTExLjA3MiwyLjAwNUw4LjEwNywxMTAuNjkzYy05LjY2OSw2LjY3NC03Ljk5NywxNC41NTEtNy45OTcsMTQuNTUxICAgcy0xLjY3MSw3Ljg3OCw3Ljk5NywxNC41NTFsMTAxLjk2NSw4Ni4xMDJjMy40ODIsMi40MDUsNy44MDcsMi4wMDQsMTEuMDcyLDIuMDA0YzEzLjA2MiwwLDEzLjAwNC0xMS43LDEzLjAwNC0xNC42NjZ2LTY1LjI0OSAgIGw5Mi4yNjQsNzcuOTExYzMuNDgyLDIuNDA1LDcuODA3LDIuMDA0LDExLjA3MiwyLjAwNGMxMy4wNjIsMCwxMy4wMDQtMTEuNywxMy4wMDQtMTQuNjY2VjM3LjI1MiAgIEMyNTAuNDg4LDM0Ljc0NiwyNTAuNTQ2LDIyLjU4NywyMzcuNDg0LDIyLjU4N3oiIGZpbGw9IiNjMmM2Y2YiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
      }

      /*暂停按钮 |> */

      .play {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDIzMi4xNTMgMjMyLjE1MyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjMyLjE1MyAyMzIuMTUzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4Ij4KPGcgaWQ9IlBsYXkiPgoJPHBhdGggc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkOyIgZD0iTTIwMy43OTEsOTkuNjI4TDQ5LjMwNywyLjI5NGMtNC41NjctMi43MTktMTAuMjM4LTIuMjY2LTE0LjUyMS0yLjI2NiAgIGMtMTcuMTMyLDAtMTcuMDU2LDEzLjIyNy0xNy4wNTYsMTYuNTc4djE5OC45NGMwLDIuODMzLTAuMDc1LDE2LjU3OSwxNy4wNTYsMTYuNTc5YzQuMjgzLDAsOS45NTUsMC40NTEsMTQuNTIxLTIuMjY3ICAgbDE1NC40ODMtOTcuMzMzYzEyLjY4LTcuNTQ1LDEwLjQ4OS0xNi40NDksMTAuNDg5LTE2LjQ0OVMyMTYuNDcxLDEwNy4xNzIsMjAzLjc5MSw5OS42Mjh6IiBmaWxsPSIjYzJjNmNmIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==);
      }

      /*下一首按钮*/

      .next {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI1MC40ODggMjUwLjQ4OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjQ4OCAyNTAuNDg4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4Ij4KPGcgaWQ9Ik5leHRfdHJhY2tfMiI+Cgk8cGF0aCBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7IiBkPSJNMjQyLjM4MSwxMTAuNjkzTDE0MC40MTUsMjQuNTkxYy0zLjQ4LTIuNDA2LTcuODA1LTIuMDA1LTExLjA3MS0yLjAwNSAgIGMtMTMuMDYxLDAtMTMuMDAzLDExLjctMTMuMDAzLDE0LjY2NnY2NS4yNDlsLTkyLjI2NS03Ny45MWMtMy40ODItMi40MDYtNy44MDctMi4wMDUtMTEuMDcyLTIuMDA1ICAgQy0wLjA1NywyMi41ODcsMCwzNC4yODcsMCwzNy4yNTJ2MTc1Ljk4M2MwLDIuNTA3LTAuMDU3LDE0LjY2NiwxMy4wMDQsMTQuNjY2YzMuMjY1LDAsNy41OSwwLjQwMSwxMS4wNzItMi4wMDVsOTIuMjY1LTc3LjkxICAgdjY1LjI0OWMwLDIuNTA3LTAuMDU4LDE0LjY2NiwxMy4wMDMsMTQuNjY2YzMuMjY2LDAsNy41OTEsMC40MDEsMTEuMDcxLTIuMDA1bDEwMS45NjYtODYuMTAxICAgYzkuNjY4LTYuNjc1LDcuOTk3LTE0LjU1MSw3Ljk5Ny0xNC41NTFTMjUyLjA0OSwxMTcuMzY3LDI0Mi4zODEsMTEwLjY5M3oiIGZpbGw9IiNjMmM2Y2YiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)
      }
    }

    /*播放按钮 || */

    &.active .controls .play {
      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDIzMi42NzkgMjMyLjY3OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjMyLjY3OSAyMzIuNjc5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4Ij4KPGcgaWQ9IlBhdXNlIj4KCTxwYXRoIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDsiIGQ9Ik04MC41NDMsMEgzNS43OTdjLTkuODg1LDAtMTcuODk4LDguMDE0LTE3Ljg5OCwxNy44OTh2MTk2Ljg4MyAgIGMwLDkuODg1LDguMDEzLDE3Ljg5OCwxNy44OTgsMTcuODk4aDQ0Ljc0NmM5Ljg4NSwwLDE3Ljg5OC04LjAxMywxNy44OTgtMTcuODk4VjE3Ljg5OEM5OC40NCw4LjAxNCw5MC40MjcsMCw4MC41NDMsMHogTTE5Ni44ODIsMCAgIGgtNDQuNzQ2Yy05Ljg4NiwwLTE3Ljg5OSw4LjAxNC0xNy44OTksMTcuODk4djE5Ni44ODNjMCw5Ljg4NSw4LjAxMywxNy44OTgsMTcuODk5LDE3Ljg5OGg0NC43NDYgICBjOS44ODUsMCwxNy44OTgtOC4wMTMsMTcuODk4LTE3Ljg5OFYxNy44OThDMjE0Ljc4MSw4LjAxNCwyMDYuNzY3LDAsMTk2Ljg4MiwweiIgZmlsbD0iI2MyYzZjZiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)
    }
  }

  .control-panel.active .album-art::before {

    animation: rotation 3s infinite linear;
  }

  .options {
    flex-wrap: wrap;
    text-align: right;

    /*音量条的位置*/

    .volume-bar {
      position: absolute;
      bottom: 50px;
      right: 40px;
      border-radius: 15px;
      height: 130px;
      background-color: var(--btnColor);
      opacity: 0.8;
      transition: all 1s ease;
    }
  }
}

/*播放控制面板SVG图标*/
.icon {
  width: 30px;
  margin: 0 5px;
  fill: rgba(194, 198, 207, 255);
}

/*太大的SVG，缩小一圈*/
.small_icon {
  transform: scale(0.8);
}

/*旋转动画*/
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/*长文本滚动：歌名过长自动滚动*/


@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(var(--scrollNamePosition));
  }
}


@media (max-width: 780px) {
  .footer {
    /* width: 100%;
     height: auto;*/

    .player {
      margin: 0;
      width: 100%;

      /*      .control-panel {
                width: 100%;

            }*/

    }
  }
}

/*夜间模式*/
.dark .player {
  --btnColor: gray;
  --infoColor: rgba(194, 192, 192, 0.8); /* rgba(196, 182, 193, 0.85);   */
}
</style>

<style>
.el-slider {
  height: 6px;
}

/*全程进度条*/
.el-slider__runway {
  height: 3px;
  width: 100%;
}

/*.el-slider__runway:hover .el-slider__button {
    display: block;
}*/

/*当前进度条*/
.el-slider__bar {
  height: 3px;
}

/*进度条上的拖动圆点*/
.el-slider__button-wrapper {
  width: 10px;
  height: 10px;
}

.el-slider__button:hover {
  transform: none;
}

.el-slider__button-wrapper:hover {
  transform: none;
}

.el-slider__button {
  display: none;
  width: 10px;
  height: 10px;
}

</style>
