<template>
  <el-container>
    <el-main>
      <audio ref="audioElement" :src='musicList[playingIndex].src' type="audio/mpeg"></audio>

      <el-collapse>
        <el-collapse-item title="备忘">
          <div>没有点播放,直接点下一首,有BUG</div>
          <div>随机播放有BUG，会随机到自己，需要改一下</div>
          <div>需要判断每种模式，只有一首歌的情况(上一首下一首是否会错)</div>
          <div>toggleMusic里面的isPlay大都为true，可以删减</div>
          <div>toggleMusic里面的监听器可以删减</div>
          <div>歌曲名设置成超出容器才开始滚动</div>
          <div>设置默认专辑图、歌曲名、歌手名</div>
          <div>各类设置存本地，用store</div>
        </el-collapse-item>
      </el-collapse>
        <div>
             <el-button @click="toggleMode" type="primary">切换模式：{{ modeList[modeIndex].name }}</el-button>
        </div>
        <div style="width: 300px;margin:50px 10px 150px 10px">
          <el-text>
            音量：{{ (volume * 100).toFixed(0) }}%
          </el-text>
          <el-slider v-model="volume" @input="changeVolume" class="volumeBar" :min="0" :max="2" :step="0.1"
                     :marks="{0:'静音',1:'100%',2:'200%'}" :show-tooltip="false"/>
        </div>

      <div class="player">
        <div class="info" :class="{ active: infoBarActive }">
          <span class="name">{{ musicList[playingIndex].name }}</span>
          <span class="artist">{{ musicList[playingIndex].artist }}</span>
          <div class="progress-bar">
            <!--            <div class="volumeBar"></div>-->
            <el-slider v-model="currentTime" @change="changeCurrentTime" :min="0"
                       :max="duration" :show-tooltip="false"/>
            <div class="time"><span>{{
                formatMusicTime(currentTime)
              }}</span><span>{{ formatMusicTime(duration) }}</span></div>
          </div>
        </div>
        <div class="control-panel" :class="{ active: controlPanelActive }">
          <div class="album-art" :style="'--bgImage:'+`url('${musicList[playingIndex].albumArt}')`"
               @click="play()"></div>
          <div class="controls">
            <div class="prev" @click="toggleMusic(false,false)"></div>
            <div class="play" @click="play()"></div>
            <div class="next" @click="toggleMusic(true,false)"></div>
          </div>
        </div>
      </div>
    </el-main>

  </el-container>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import useTimestamp from "@/hooks/useTimestamp";
import {useBaseUrlStore} from "@/store/useBaseUrlStore";
import {ElMessage} from 'element-plus'

const {formatMusicTime} = useTimestamp()
const {defaultUrl}=useBaseUrlStore()
//是否显示控制面板
const infoBarActive = ref(false)
//是否旋转专辑图
const controlPanelActive = ref(false)

// const images = ref(`url('${img}')`)


// const AudioCtx= window.AudioContext

const audioContext = new AudioContext()
// audioContext.crossOrigin = 'anonymous'
//音频DOM元素
const audioElement = ref<HTMLAudioElement>()
//音量控制
let gainNode = audioContext.createGain()

let track = null

//是否正在播放的标志
const isPlaying = ref(false)
//播放进度
const currentTime = ref(audioElement.value?.currentTime)
//音乐总时长
const duration = ref(audioElement.value?.duration)

//音量0~2，1为100%
const volume = ref(1)

//播放列表
const musicList = ref([
  {
    id: 1,
    name: '未命名',
    artist: '川川尾巴小心不要被扯掉了',
    albumArt: 'src/assets/专辑图-川川尾巴小心不要被扯掉了.jpg',
    src: 'src/assets/未命名-川川尾巴小心不要被扯掉了.m4a'
  }, {
    id: 2,
    name: '大鱼',
    artist: '周深',
    albumArt: 'http://qiniufree.muxidream.cn/headImg/20230906_202134_1719571185364.jpg',
    src: 'src/assets/大鱼-周深.mp3'
  }, {
    id: 3,
    name: '神姬',
    artist: 'EinWil&Jayx',
    albumArt: '@/assets/hutao.png',
    src: 'src/assets/神姬-EinWil&Jayx.m4a'
  }, {
    id: 4,
    name: 'call of silence（Cover Piano）',
    artist: '向晚丶',
    albumArt: '@/assets/hutao.png',
    src: 'src/assets/call of silence（Cover Piano） - 向晚丶.mp3'
  }])
// const musicList = ref([
//   {
//     id: 1,
//     name: '未命名',
//     artist: '川川尾巴小心不要被扯掉了',
//     albumArt:defaultUrl+ 'music/album-art/专辑图-川川尾巴小心不要被扯掉了.jpg',
//     src:defaultUrl+ '/music/files/%E6%9C%AA%E5%91%BD%E5%90%8D-%E5%B7%9D%E5%B7%9D%E5%B0%BE%E5%B7%B4%E5%B0%8F%E5%BF%83%E4%B8%8D%E8%A6%81%E8%A2%AB%E6%89%AF%E6%8E%89%E4%BA%86.m4a'
//   }, {
//     id: 2,
//     name: '大鱼',
//     artist: '周深',
//     albumArt: 'http://qiniufree.muxidream.cn/headImg/20230906_202134_1719571185364.jpg',
//     src:defaultUrl+ '/music/files/%E5%A4%A7%E9%B1%BC-%E5%91%A8%E6%B7%B1.mp3'
//   }, {
//     id: 3,
//     name: '神姬',
//     artist: 'EinWil&Jayx',
//     albumArt: '@/assets/hutao.png',
//     src: defaultUrl+'/music/files/%E7%A5%9E%E5%A7%AC-EinWil%26Jayx.m4a'
//   }, {
//     id: 4,
//     name: 'call of silence（Cover Piano）',
//     artist: '向晚丶',
//     albumArt: '@/assets/hutao.png',
//     src: defaultUrl+'/music/files/call%20of%20silence%EF%BC%88Cover%20Piano%EF%BC%89%20-%20%E5%90%91%E6%99%9A%E4%B8%B6.mp3'
//   }])
//当前播放的歌的序号
const playingIndex = ref(0)
//播放模式
const modeList = [
  {
    index: 0,
    name: 'listLoop',
    img: '',
  }, {
    index: 1,
    name: 'sequentialPlay',
    img: '',
  }, {
    index: 2,
    name: 'randomPlay',
    img: '',
  }, {
    index: 3,
    name: 'singleLoop',
    img: '',
  }]
//当前播放模式的序号
const modeIndex = ref(0)

onMounted(() => {
  track = audioContext.createMediaElementSource(audioElement.value as HTMLAudioElement)

  track.connect(gainNode).connect(audioContext.destination)
})

const timer1 = ref<NodeJS.Timeout>()

//播放和暂停
function play(pause = false) {
  const length = musicList.value.length
  if (length === 0) return ElMessage.info('歌曲列表为空')
  else if (playingIndex.value < 0 || playingIndex.value > length) {
    playingIndex.value = 0
    ElMessage.info('歌曲不存在,已跳转到第一首')
  }
  if (audioContext.state === "suspended") {
    audioContext.resume()
  }
//pause为true则必定暂停，pause默认则看isPlaying.value
  console.log(pause, isPlaying.value)
  if (pause || isPlaying.value) {
    isPlaying.value = false
    audioElement.value?.pause()
    infoBarActive.value = false
    controlPanelActive.value = false
    //关闭播放时间计时器
    clearTimeout(timer1.value)
    console.log('播放暂停')
  } else {
    isPlaying.value = true
    audioElement.value?.play()
    infoBarActive.value = true
    controlPanelActive.value = true
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
    toggleMusic(true, true)
  }
}

//修改音量
const changeVolume = (value: number) => gainNode.gain.value = value

//修改播放进度
const changeCurrentTime = () => {
  if (audioElement.value) {
    audioElement.value.currentTime = currentTime.value

  }
  // console.log(currentTime.value)
}

//切换模式
const toggleMode = () => {
  modeIndex.value++
  //此为最后一个模式，切换回第一个
  if (modeIndex.value >= modeList.length) {
    modeIndex.value = 0
  }
  console.log('切换播放模式，当前为：', modeIndex.value, modeList[modeIndex.value])
}

//切换音乐
const toggleMusic = (isNext = true, isAuto = true) => {
  if (!audioElement.value || musicList.value.length === 0) return
  //暂停播放
  audioElement.value.pause()
  //重置播放进度
  audioElement.value.currentTime = 0
  // 移除旧的 `canplay` 事件监听器
  audioElement.value.removeEventListener('canplay', handleCanPlay)
  //是否继续播放
  let isPlay = true
  //切换歌曲逻辑
  if (modeIndex.value === 0) {
    isPlay = listLoop(isNext)
  } else if (modeIndex.value === 1) {
    isPlay = sequentialPlay(isNext)
  } else if (modeIndex.value === 2) {
    randomPlay()
  } else if (modeIndex.value === 3) {
    isPlay = singleLoop(isNext, isAuto)
  }

  // 设置新的音频源
  audioElement.value.src = musicList.value[playingIndex.value].src;

  // 重新加载新歌曲
  audioElement.value.load()

  // 绑定新的 `canplay` 事件监听器，确保加载完成后再播放
  audioElement.value.addEventListener('canplay', handleCanPlay);


  // 设置播放状态
  isPlaying.value = true
  if (!isPlay) play()
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
    console.error("播放失败：", err);
  })

  // 解绑 `canplay` 事件监听器，防止多次触发
  audioElement.value.removeEventListener('canplay', handleCanPlay)

  // 更新歌曲时长
  duration.value = audioElement.value?.duration
  console.log(duration.value, audioElement.value?.duration)
}

//列表循环
const listLoop = (isNext: boolean) => {
  if (isNext) playingIndex.value++
  else playingIndex.value--
  //下一首，此为最后一首
  if (playingIndex.value >= musicList.value.length) {
    playingIndex.value = 0
    //上一首，此为第一首
  } else if (playingIndex.value < 0) {
    playingIndex.value = musicList.value.length - 1
  }
  // playingMusic.value = musicList.value[playingIndex.value]
  console.log('列表循环', playingIndex.value, musicList.value[playingIndex.value])
  return true
}

//顺序播放
const sequentialPlay = (isNext: boolean) => {
  if (isNext) playingIndex.value++
  else playingIndex.value--
  //下一首，此为最后一首或上一首，此为第一首
  if (playingIndex.value >= musicList.value.length) {
    //换成默认的信息，空白信息
    playingIndex.value--
    return false
  } else if (playingIndex.value <= 0) {
    playingIndex.value++
    return false
  }

  console.log('顺序播放', playingIndex.value, musicList.value[playingIndex.value])
  return true
}

//随机播放
const randomPlay = () => {
  const randomNum = Math.floor(Math.random() * (musicList.value.length))
  if (playingIndex.value === randomNum && musicList.value.length !== 1) return randomPlay
  playingIndex.value = randomNum
  console.log('顺序播放', playingIndex.value, musicList.value[playingIndex.value])
  return true
}

//单曲循环
const singleLoop = (isNext: boolean, isAuto: boolean) => {
  //自动切换，循环当前音乐
  if (isAuto) {
    // if (audioElement.value) audioElement.value.currentTime = 0
    console.log('单曲循环', playingIndex.value, musicList.value[playingIndex.value])
    //手动切换
  } else {
    listLoop(isNext)
  }
  return true
}
</script>

<style scoped>

.player {
  position: relative;
  width: 300px;
  /*播放音乐的信息*/

  .info {
    position: absolute;
    height: 75px;
    top: 0;
    opacity: 0;
    left: 100px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.3);
    padding: 5px 15px 5px 10px;
    border-radius: 15px;
    transition: all .5s ease;
    box-shadow: 2px 1px 2px 1px rgba(0, 0, 0, 0.2);


    .name, .artist {
      display: block;
    }

    .name {
      color: #222;
      font-size: 16px;
      margin-bottom: 5px;
    }

    .artist {
      color: #999;
      font-size: 12px;
      margin-bottom: 8px;
    }

    /*进度条总长度*/

    .progress-bar {
      background-color: #ddd;
      height: 2px;
      width: 100%;
      position: relative;

      /*进度条播放的长度*/

      .volumeBar {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: red;
        width: 90%;
        transition: all .2s ease;
      }

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

    /*播放音乐的信息,播放时*/

    &.active {
      top: -75px;
      opacity: 1;
      transition: all .5s ease;
    }
  }

  .control-panel {
    position: relative;
    background-color: #fff;
    border-radius: 15px;
    width: 300px;
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

      &::after {
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
      }

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
      display: flex;
      justify-content: flex-end;
      height: 80px;
      padding: 0 15px;

      .prev,
      .play,
      .next {
        width: 55px;
        height: auto;
        border-radius: 10px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 20px;
        margin: 5px 0;
        background-color: #fff;
        cursor: pointer;
        transition: background-color .3s ease;
        -webkit-transition: background-color .3s ease;
      }

      .prev:hover,
      .play:hover,
      .next:hover {
        background-color: #eee;
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

.el-slider__runway:hover .el-slider__button {
  /*  display: block;*/
}

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

/*长文本滚动*/

.info {
  white-space: nowrap;
  overflow: hidden;
}

.info .name {
  display: inline-block;
  animation: scroll 10s linear infinite;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
