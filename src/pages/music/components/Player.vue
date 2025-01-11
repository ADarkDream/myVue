<template>
  <!--播放器-->
  <div class="player" :class="{ hidePlayer: !isShowPlayer, showPlayer: isShowPlayer }" @click="togglePlayerVisible()">
    <audio ref="audioEl" crossOrigin='anonymous' :src='thisMusic.src' type="audio/mpeg"></audio>
    <div class="play-panel" :class="{ active: infoBarActive }">
      <span ref="musicName" class="name" :class="{ scroll: isScrollName }" :style="transformX">{{
        isLoading ? '加载中' : thisMusic.name || '未命名'
        }}——<span class="artist">
          {{
            isLoading ? '加载中' : thisMusic.artists.map(artist => artist.name).join('&') || '未知艺术家'
          }}
        </span> </span>
      <div class="progress-bar">
        <el-slider v-model="currentTime" @change="changeCurrentTime" :min="0" :max="duration" :show-tooltip="false" />
        <div class="time"><span>{{
          formatMusicTime(currentTime)
            }}</span><span>{{ formatMusicTime(duration) }}</span></div>
      </div>
    </div>
    <div class="control-panel" :class="{ active: controlPanelActive }">
      <div class="album-art" :style="'--bgImage:' + `url(${thisMusic.album.pic_url || defaultAlbumArt})`"
        @click="play({})"></div>
      <div class="controls">
        <div class="prev" @click="toggleMusic({ isNext: false, isAuto: false })">
          <SVG_pre />
        </div>
        <div class="play" @click="play({})">
          <SVG_play v-if="isPlaying" class="play_icon" />
          <SVG_pause v-else class="pause_icon" />
        </div>
        <div class="next" @click="toggleMusic({ isNext: true, isAuto: false })">
          <SVG_pre />
        </div>
        <!--右侧面板-->
        <div class="options">
          <!--锁-->
          <div @click="lockThePlayer">
            <SVG_lock v-if="isLock" class="control_icon small_icon" />
            <SVG_unlock v-else class="control_icon small_icon" />
          </div>
          <!--播放模式-->
          <div @click="toggleMode()">
            <!--列表循环-->
            <SVG_list_loop v-if="modeIndex === 0" class="control_icon" /> <!--顺序播放-->
            <!-- 顺序播放 -->
            <SVG_sequential_play v-else-if="modeIndex === 1" class="control_icon" style="width: 26px;padding: 2px" />
            <!--随机播放-->
            <SVG_random_play v-else-if="modeIndex === 2" class="control_icon" />
            <!--单曲循环-->
            <SVG_single_loop v-else-if="modeIndex === 3" class="control_icon" />
          </div>
          <!--音量控制-->
          <div @click="toggleVolumePanelVisible">
            <!--静音-->
            <SVG_volume__mute v-if="volume === 0" class="control_icon small_icon" />
            <!--音量-->
            <SVG_volume_voice v-else class="control_icon small_icon" />
          </div>
          <!--播放列表-->
          <div @click="isShowPlayList = !isShowPlayList">
            <SVG_music_list class="control_icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--播放列表-->
  <el-drawer v-model="isShowPlayList" :with-header="false" :size="drawerSize + 'px'" direction="btt" show-close>
    <h3 style="margin: 0;">播放列表</h3>
    <play-list :songsList="playList" />
  </el-drawer>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watch, toRefs } from 'vue';


//stores
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { usePlayConfigStore } from '@/store/music/usePlayConfigStore'
import { useMusicPlayStore } from "@/store/music/useMusicPlayStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
//hooks
import useTimestamp from "@/hooks/useTimestamp";
import usePlayConfig from '@/hooks/music/usePlayConfig'
import useMusicPlay from "@/hooks/music/useMusicPlay";
//components
import PlayList from "@/pages/music/components/PlayList.vue";
//files
import defaultAlbumArt from '@/assets/music/music.svg'
import SVG_music_list from '@/assets/music/music_list.svg?component'
import SVG_pre from '@/assets/music/pre.svg?component'
import SVG_play from '@/assets/music/play.svg?component'
import SVG_pause from '@/assets/music/pause.svg?component'
import SVG_lock from '@/assets/music/lock.svg?component'
import SVG_unlock from '@/assets/music/unlock.svg?component'
import SVG_volume__mute from '@/assets/music/volume_mute.svg?component'
import SVG_volume_voice from '@/assets/music/volume_voice.svg?component'
import SVG_list_loop from '@/assets/music/list_loop.svg?component'
import SVG_sequential_play from '@/assets/music/sequential_play.svg?component'
import SVG_random_play from '@/assets/music/random_play.svg?component'
import SVG_single_loop from '@/assets/music/single_loop.svg?component'

const responsiveStore = useResponsiveStore()
const { drawerSize } = toRefs(responsiveStore)
const musicListStore = useMusicListStore()
const playConfigStore = usePlayConfigStore()
const musicPlayStore = useMusicPlayStore()


const { formatMusicTime } = useTimestamp()

const isShowPlayList = ref(false)


//播放列表、状态
const { isPlaying, isLoading, playingIndex, thisMusic } = toRefs(musicListStore)
const playList = computed(() => musicListStore.playList)


//播放设置
const { modeIndex } = toRefs(playConfigStore)
// const { toggleMode } = playConfigStore
const { toggleMode } = usePlayConfig()

//播放器
const {
  audioContext, audioElement, gainNode,
  infoBarActive,
  controlPanelActive,
  volume,
  isScrollName,
  isLock,
  isShowPlayer,
  transformX, currentTime, duration
} = toRefs(musicPlayStore)
const {
  lockThePlayer,
  togglePlayerVisible,
  toggleVolumePanelVisible
} = musicPlayStore

const { play, toggleMusic, setMediaInfo, changeCurrentTime } = useMusicPlay()

togglePlayerVisible()


//音频DOM元素
const audioEl = ref<HTMLAudioElement>()
//歌名和歌手名DOM元素
const musicName = ref<HTMLDivElement>()

//音量控制
gainNode.value = audioContext.value.createGain()

let track = null

onMounted(async () => {
  if (musicName.value) {
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
      track.connect(gainNode.value).connect(audioContext.value.destination)
    } else {
      console.error('audioElement 不是一个 HTMLAudioElement 实例')
    }
  } else {
    console.warn("audioElement 未初始化");
  }
})






//如果浏览器支持
if ("mediaSession" in navigator) {
  //设置首次加载的音乐的信息
  setMediaInfo()

  navigator.mediaSession.setActionHandler("play", () => {
    play({})
    navigator.mediaSession.playbackState = "playing";
  })
  navigator.mediaSession.setActionHandler("pause", () => {
    play({})
    navigator.mediaSession.playbackState = "paused";
  })
  navigator.mediaSession.setActionHandler("stop", () => {
    play({ pause: true })
  })
  //跳转到指定播放点
  // navigator.mediaSession.setActionHandler("seekto", () => {
  //     toggleMusic({isNext:false,isAuto:false})
  // });
  //上一首
  navigator.mediaSession.setActionHandler("previoustrack", () => {
    toggleMusic({ isNext: false, isAuto: false })
  })
  //下一首
  navigator.mediaSession.setActionHandler("nexttrack", () => {
    toggleMusic({ isNext: true, isAuto: false })
  })


  //监听歌曲切换
  //   watch(audioElement, (newVal, oldVal) => {
  //     if (newVal !== oldVal) {
  //       //修改当前播放歌曲的信息
  //       console.log('修改当前播放歌曲的信息')

  //       setMediaInfo()
  //     }
  //   })
}
</script>

<style scoped lang="scss">
/*播放器的样式*/
.player {
  padding: 0;
  width: 400px;
  position: relative;
  margin: 0 auto;
  --bgImage: url('@/assets/music/music.svg');
  --infoColor: rgb(171, 208, 246);
  --btnColor: #eee;
  /* --scrollNamePosition: -30%; */
  --scrollTime: 5s;
  --customAnimation: scroll var(--scrollTime) linear infinite;
  /*播放音乐的信息*/

  .play-panel {
    position: absolute;
    height: 50px;
    top: 0;
    opacity: 0;
    left: 10px;
    right: 10px;
    background-color: var(--infoColor);
    padding: 5px 15px 5px 5px;
    border-radius: 15px;
    transition: all .5s ease;
    box-shadow: 2px 1px 2px 1px rgba(0, 0, 0, 0.2);
    overflow: hidden;

    .name {
      color: #222;
      display: block;
      white-space: nowrap;
      /*文字不换行*/
      font-size: 14px;
      margin-bottom: 5px;
      animation: var(--customAnimation);
    }

    /*播放时音乐名称太长，开始滚动*/

    .scroll {
      animation: scroll var(--scrollTime) linear infinite;
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

    &.paused .album-art::before {
      animation: rotation 3s infinite linear;
      -webkit-animation: rotation 3s infinite linear;
      animation-fill-mode: forwards;
    }


    .controls {
      height: 80px;
      padding: 0 0 0 30%;
      background-color: var(--el-bg-color);
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 2fr;
      border-radius: 5px;

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
    text-align: right;

    div {
      display: inline-block;
    }
  }
}

/*播放控制面板SVG图标*/
.control_icon {
  width: 30px;
  margin: 0 5px;
  fill: rgba(194, 198, 207, 255);
}

/*太大的SVG，缩小一圈*/
.small_icon {
  transform: scale(0.8);
}


/*长文本滚动：歌名过长自动滚动*/
@keyframes scroll {
  from {
    transform: translateX(10%);
  }

  to {
    transform: translateX(-30%);
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
  .player {
    width: 100%;
  }
}

/*夜间模式*/
.dark .player {
  --btnColor: gray;
  --infoColor: rgb(194, 198, 207);
  /* rgba(196, 182, 193, 0.85);   */
}
</style>
<style>
/*播放进度条的样式*/
.progress-bar .el-slider {
  height: 6px;
}

/*全程进度条*/
.progress-bar .el-slider__runway {
  height: 3px;
  width: 100%;
}

/*.progress-bar .el-slider__runway:hover .el-slider__button {
    display: block;
}*/

/*当前进度条*/
.progress-bar .el-slider__bar {
  height: 3px;
  transition: width 1s ease;
}

/*进度条上的拖动圆点*/
.progress-bar .el-slider__button-wrapper {
  width: 10px;
  height: 10px;
}

.progress-bar .el-slider__button:hover {
  transform: none;
}

.progress-bar .el-slider__button-wrapper:hover {
  transform: none;
}

.progress-bar .el-slider__button {
  display: none;
  /*  width: 10px;
    height: 10px;*/
}
</style>
