//音乐播放相关的方法
import { computed, toRefs } from "vue"
import { ElMessage } from "element-plus"
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore"
import { usePlayConfigStore } from "@/store/music/usePlayConfigStore"
//hooks
import useMusicPlay from "@/hooks/music/useMusicPlay"

export default function () {
  const musicListStore = useMusicListStore()
  const playConfigStore = usePlayConfigStore()

  const playList = computed(() => musicListStore.playList)

  //当前播放的歌的序号
  const { playingIndex } = toRefs(musicListStore)
  //播放

  //当前播放模式的序号
  const { modeIndex } = toRefs(playConfigStore)
  //播放模式
  const modeList = [
    {
      index: 0,
      name: "listLoop",
      c_name: "列表循环",
      img: "",
    },
    {
      index: 1,
      name: "sequentialPlay",
      c_name: "顺序播放",
      img: "",
    },
    {
      index: 2,
      name: "randomPlay",
      c_name: "随机播放",
      img: "",
    },
    {
      index: 3,
      name: "singleLoop",
      c_name: "单曲循环",
      img: "",
    },
  ]

  //获取本地的播放模式设置
  // const setModeIndex = () => {
  //     const index = Number(localStorage.getItem('music_mode_index'))
  //     //判断是否是整数且在模式列表范围内
  //     if (index && Number.isInteger(index) && (index >= 0 || index <= modeList.length)) {
  //         modeIndex.value = index
  //     }
  // }
  // setModeIndex()

  //切换模式
  function toggleMode() {
    //此为最后一个模式，切换回第一个
    if (modeIndex.value >= modeList.length - 1) {
      modeIndex.value = 0
    } else modeIndex.value = modeIndex.value + 1
    // localStorage.setItem('music_mode_index', modeIndex.value.toString())
    ElMessage.info(`当前是${modeList[modeIndex.value].c_name}模式`)
  }

  //按模式切歌
  function togglePlayingIndex(isNext: boolean, isAuto: boolean) {
    let index = playingIndex.value
    if (modeIndex.value === 0) {
      index = listLoop(index, isNext)
    } else if (modeIndex.value === 1) {
      index = sequentialPlay(index, isNext)
    } else if (modeIndex.value === 2) {
      index = randomPlay(index)
    } else if (modeIndex.value === 3) {
      index = singleLoop(index, isNext, isAuto)
    }
    return index
  }

  //列表循环
  function listLoop(index: number, isNext: boolean) {
    if (isNext) index++
    else index--
    if (index >= playList.value.length) {
      //下一首，此为最后一首
      index = 0
      ElMessage.info("当前已是第一首")
    } else if (index < 0) {
      //上一首，此为第一首
      index = playList.value.length - 1
    }
    console.log("列表循环", index, playList.value[index])
    return index
  }

  //顺序播放
  function sequentialPlay(index: number, isNext: boolean) {
    if (isNext) index++
    else index--
    //下一首，此为最后一首或上一首，此为第一首
    if (index >= playList.value.length) {
      //换成默认的信息，空白信息
      index = playList.value.length - 1
      // await useMusicPlay().play({ isStop: true })
      ElMessage.info("当前已是最后一首")
    } else if (index <= 0) {
      index = 0
      ElMessage.info("当前已是第一首")
    }

    console.log("顺序播放", index, playList.value[index])
    return index
  }

  //随机播放
  function randomPlay(index: number) {
    const length = playList.value.length
    if (length === 0 || length === 1) return 0
    const randomNum = Math.floor(Math.random() * length)
    if (index === randomNum) return randomPlay(index)
    index = randomNum
    console.log("随机播放", index, playList.value[index])
    return index
  }

  //单曲循环
  function singleLoop(index: number, isNext: boolean, isAuto: boolean) {
    if (isAuto) {
      //自动切换，循环当前音乐
      console.log("单曲循环")
      return index
    } else {
      //手动切换
      console.log("单曲循环,手动切换下一首")
      return listLoop(index, isNext)
    }
  }

  return {
    toggleMode,
    togglePlayingIndex,
  }
}
