<template>
  <!--播放器-->
  <div class="player" :class="{hidePlayer:!isShowPlayer,showPlayer:isShowPlayer}" @click="togglePlayerVisible()">
    <audio ref="audioEl" crossOrigin='anonymous' :src='playList[playingIndex].src' type="audio/mpeg"/>
    <div class="play-panel" :class="{ active: infoBarActive }">
            <span ref="musicName" class="name" :class="{ scroll: nameScroll }" :style="transformX">{{
                isLoading ? '加载中' : playList[playingIndex].name || '未命名'
              }}——<span class="artist">
              {{
                  isLoading ? '加载中' : playList[playingIndex].artists.map(artist => artist.name).join('&') + '1111111111111111111111111' || '未知艺术家'
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
        <div class="prev" @click="toggleMusic({isNext:false,isAuto:false})">
          <svg viewBox="0 0 250.488 250.488">
            <path
                d="M237.484,22.587c-3.266,0-7.591-0.401-11.072,2.005l-92.264,77.91V37.252   c0-2.507,0.057-14.666-13.004-14.666c-3.265,0-7.59-0.401-11.072,2.005L8.107,110.693c-9.669,6.674-7.997,14.551-7.997,14.551   s-1.671,7.878,7.997,14.551l101.965,86.102c3.482,2.405,7.807,2.004,11.072,2.004c13.062,0,13.004-11.7,13.004-14.666v-65.249   l92.264,77.911c3.482,2.405,7.807,2.004,11.072,2.004c13.062,0,13.004-11.7,13.004-14.666V37.252   C250.488,34.746,250.546,22.587,237.484,22.587z"/>
          </svg>
        </div>
        <div class="play" @click="play({})">
          <svg v-if="isPlaying" class="play_icon" viewBox="0 0 232.679 232.679">
            <path
                d="M80.543,0H35.797c-9.885,0-17.898,8.014-17.898,17.898v196.883   c0,9.885,8.013,17.898,17.898,17.898h44.746c9.885,0,17.898-8.013,17.898-17.898V17.898C98.44,8.014,90.427,0,80.543,0z M196.882,0   h-44.746c-9.886,0-17.899,8.014-17.899,17.898v196.883c0,9.885,8.013,17.898,17.899,17.898h44.746   c9.885,0,17.898-8.013,17.898-17.898V17.898C214.781,8.014,206.767,0,196.882,0z"/>
          </svg>
          <svg v-else class="pause_icon" viewBox="0 0 232.153 232.153">
            <path
                d="M203.791,99.628L49.307,2.294c-4.567-2.719-10.238-2.266-14.521-2.266   c-17.132,0-17.056,13.227-17.056,16.578v198.94c0,2.833-0.075,16.579,17.056,16.579c4.283,0,9.955,0.451,14.521-2.267   l154.483-97.333c12.68-7.545,10.489-16.449,10.489-16.449S216.471,107.172,203.791,99.628z"/>
          </svg>
        </div>
        <div class="next" @click="toggleMusic({isNext:true,isAuto:false})">
          <svg viewBox="0 0 250.488 250.488">
            <path
                d="M237.484,22.587c-3.266,0-7.591-0.401-11.072,2.005l-92.264,77.91V37.252   c0-2.507,0.057-14.666-13.004-14.666c-3.265,0-7.59-0.401-11.072,2.005L8.107,110.693c-9.669,6.674-7.997,14.551-7.997,14.551   s-1.671,7.878,7.997,14.551l101.965,86.102c3.482,2.405,7.807,2.004,11.072,2.004c13.062,0,13.004-11.7,13.004-14.666v-65.249   l92.264,77.911c3.482,2.405,7.807,2.004,11.072,2.004c13.062,0,13.004-11.7,13.004-14.666V37.252   C250.488,34.746,250.546,22.587,237.484,22.587z"/>
          </svg>
        </div>
        <!--右侧面板-->
        <div class="options">
          <!--播放模式-->
          <span @click="toggleMode()">
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
          <span @click="lockThePlayer">
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
          <span @click="ElMessage.info('打开播放列表')">
               <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M717.12 394.88v12.592h-0.32v218.656h-48v-48h0.32V397.616a11.248 11.248 0 0 1-0.08-1.28v-36.864h48v34.752l0.08 0.64zM648.528 748.8h-68.256a85.328 85.328 0 1 1 0-170.672h88.848V397.616a11.248 11.248 0 0 1-0.08-1.28V336a48 48 0 0 1 48-48h71.232a48 48 0 0 1 48 48v23.472a48 48 0 0 1-48 48H716.8v273.056a68.272 68.272 0 0 1-68.272 68.272z m-67.2-122.704a37.344 37.344 0 0 0 0 74.688h71.504a16 16 0 0 0 16-16V626.08h-87.488zM716.912 336v23.568h71.36V336h-71.36z m-529.76-48H580.88c6.16 0 11.136 4.976 11.136 11.136v25.728A11.136 11.136 0 0 1 580.88 336H187.136A11.136 11.136 0 0 1 176 324.864v-25.728c0-6.16 4.976-11.136 11.136-11.136zM580.88 464c-15.84 0-29.328 9.984-34.56 24 5.232 14.016 18.72 24 34.56 24H187.136c15.84 0 29.328-9.984 34.56-24a36.88 36.88 0 0 0-34.56-24h393.728z m-393.728 0H580.88c6.16 0 11.136 4.976 11.136 11.136v25.728A11.136 11.136 0 0 1 580.88 512H187.136A11.136 11.136 0 0 1 176 500.864v-25.728c0-6.16 4.976-11.136 11.136-11.136z m0 192H404.88c6.16 0 11.136 4.976 11.136 11.136v25.728A11.136 11.136 0 0 1 404.88 704H187.136A11.136 11.136 0 0 1 176 692.864v-25.728c0-6.16 4.976-11.136 11.136-11.136z"/> </svg>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, computed, watch, toRefs} from 'vue';
import {ElMessage} from 'element-plus'
import useTimestamp from "@/hooks/useTimestamp";
import defaultAlbumArt from '@/assets/music/music.svg'
import {useMusicListStore} from "@/store/music/useMusicListStore";
import {usePlayConfigStore} from '@/store/music/usePlayConfigStore'
import {useMusicPlayStore} from "@/store/music/useMusicPlayStore";

const musicStore = useMusicListStore()
const playConfigStore = usePlayConfigStore()
const musicPlayStore = useMusicPlayStore()

const {formatMusicTime} = useTimestamp()


const {audioContext,audioElement} = toRefs(musicPlayStore)
//音频DOM元素
const audioEl = ref<HTMLAudioElement>()
//歌名和歌手名DOM元素
const musicName = ref<HTMLDivElement>()

//音量控制
let gainNode = audioContext.value.createGain()

let track = null




//滚动距离
const {infoBarActive,controlPanelActive,nameScroll,isLock,isShowPlayer,transformX,isShowVolumePanel} = toRefs(musicPlayStore)


//播放状态
const {isPlaying, isLoading, playingIndex,thisMusic} = toRefs(musicStore)
const playList = computed(() => musicStore.playList)

//播放进度
const {currentTime, duration} = toRefs(musicPlayStore)
const {lockThePlayer,togglePlayerVisible,play, changeCurrentTime, toggleMusic} = musicPlayStore
togglePlayerVisible()

//播放设置
const {volume,modeIndex}=toRefs(playConfigStore)
const {toggleMode} = playConfigStore


onMounted(async () => {
  if (musicName.value) {
  console.log('传递了musicName')
  musicPlayStore.setNameElement(musicName.value)
}
  // 确保 audioElement 已经存在
  if (audioEl.value) {
    musicPlayStore.setAudioElement(audioEl.value); // 将 audioEl 赋值给 store 中的 audioElement
  }

  // 等待 audioElement 的值被正确赋值
  if (audioElement.value) {
    console.log('audioElement is:', audioElement.value); // 调试用，确认 audioElement 是否为 <audio>

    if (audioElement.value instanceof HTMLAudioElement) {
      // 初始化 track 连接音频源
      track = audioContext.value.createMediaElementSource(audioElement.value as HTMLAudioElement);

      // 连接 gainNode 以控制音量
      track.connect(gainNode).connect(audioContext.value.destination);
    } else {
      console.error('audioElement 不是一个 HTMLAudioElement 实例');
    }
  } else {
    console.warn("audioElement 未初始化");
  }
});


//修改系统媒体控制的歌曲信息
const setMediaInfo = ({title, artist, album, pic_url}: Record<string, string>) => {
  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist,
    album,
    artwork: [
      {
        src: pic_url,
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: pic_url,
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: pic_url,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: pic_url,
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: pic_url,
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: pic_url,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  })
}

//监听歌曲切换
watch(playingIndex, (newVal, oldVal) => {
  if (newVal !== oldVal) {
//修改当前播放歌曲的信息
    thisMusic.value = playList.value[playingIndex.value]
    console.log('thisMusic', thisMusic.value)
    setMediaInfo({
      title: thisMusic.value.name,
      artist: thisMusic.value.artists.map(artist => artist.name).join('&') || '未知艺术家',
      album: thisMusic.value.album.name,
      pic_url: thisMusic.value.album.pic_url!
    })
    // isScroll()
  }
})


watch(isPlaying, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    if (newVal) {
      infoBarActive.value = true
      controlPanelActive.value = true
      // isScroll()
    } else {
      infoBarActive.value = false
      controlPanelActive.value = false
    }
  }
})


//如果浏览器支持
if ("mediaSession" in navigator) {
  //设置首次加载的音乐的信息
  setMediaInfo({
    title: thisMusic.value.name,
    artist: thisMusic.value.artists.map(artist => artist.name).join('&') || '未知艺术家',
    album: thisMusic.value.album.name,
    pic_url: thisMusic.value.album.pic_url!
  })

  navigator.mediaSession.setActionHandler("play", () => {
    play({})
    navigator.mediaSession.playbackState = "playing";
  });
  navigator.mediaSession.setActionHandler("pause", () => {
    play({})
    navigator.mediaSession.playbackState = "paused";
  });
  navigator.mediaSession.setActionHandler("stop", () => {
    play({pause: true})
  });
//跳转到指定播放点
  // navigator.mediaSession.setActionHandler("seekto", () => {
  //     toggleMusic({isNext:false,isAuto:false})
  // });
  //上一首
  navigator.mediaSession.setActionHandler("previoustrack", () => {
    toggleMusic({isNext: false, isAuto: false})
  });
  //下一首
  navigator.mediaSession.setActionHandler("nexttrack", () => {
    toggleMusic({isNext: true, isAuto: false})
  });
}
</script>

<style scoped>
/*播放器的样式*/
.player {
  padding: 0;
  width: 400px;
  position: relative;
  margin: 0 auto 40px;
  --bgImage: url('@/assets/music/music.svg');
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

      svg {
        fill: #c2c6cf;
        animation: keyframes-fill .5s;
      }

      .prev,
      .play,
      .next {
        display: flex;
        justify-content: center;
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

      .prev svg,
      .play svg,
      .next svg {
        width: 25px;
      }

      .prev:hover,
      .play:hover,
      .next:hover {
        background-color: var(--btnColor);
        transition: background-color .3s ease;
        -webkit-transition: background-color .3s ease;
      }

      /*下一首按钮*/

      .next {
        transform: rotate(180deg);
      }
    }

  }

  /*专辑图旋转*/

  .control-panel.active .album-art::before {
    animation: rotation 3s infinite linear;
  }

  /*播放器右侧按键布局*/

  .options {
    flex-wrap: wrap;
    text-align: right;
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

/*专辑图旋转动画*/
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

/*SVG切换时的抖动动画*/
@keyframes keyframes-fill {
  0% {
    transform: rotate(-180deg) scale(0);
    opacity: 0;
  }

  50% {
    transform: rotate(-10deg) scale(1.2);
  }

}

/*播放器隐藏动画*/
@keyframes moveDownAndFadeOut {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(90px);
    opacity: 0;
  }
}

/* 向上移动并显示的动画 */
@keyframes moveUpAndShow {
  0% {
    transform: translateY(90px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.hidePlayer {
  animation: moveDownAndFadeOut 2s forwards;
}

.showPlayer {
  animation: moveUpAndShow 2s forwards;
}


/*移动端布局*/
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
  /*  width: 10px;
    height: 10px;*/
}

</style>
