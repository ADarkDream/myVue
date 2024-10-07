// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {useMusicListStore} from "@/store/music/useMusicListStore";
import {ElMessage} from "element-plus";

const musicStore = useMusicListStore()
const playList = computed(() => musicStore.playList)
//当前播放的歌的序号
const playingIndex = computed({
        get: () => musicStore.playingIndex,
        set: (val: number) => musicStore.playingIndex = val
    }
)

// 定义并暴露一个store
export const usePlayConfigStore = defineStore('play_config', () => {
//播放模式
    const modeList = [
        {
            index: 0,
            name: 'listLoop',
            img: '',
        },
        {
            index: 1,
            name: 'sequentialPlay',
            img: '',
        },
        {
            index: 2,
            name: 'randomPlay',
            img: '',
        },
        {
            index: 3,
            name: 'singleLoop',
            img: '',
        }]
//当前播放模式的序号
    const modeIndex = ref(0)
//音量0~2，1为100%
    const volume = ref(1)

    //切换模式
    function toggleMode  ()  {
        //此为最后一个模式，切换回第一个
        if (modeIndex.value >= modeList.length-1) {
            modeIndex.value = 0
        } else modeIndex.value++
    }

    //按模式切歌
    function togglePlayingIndex  (isNext, isAuto)  {
        if (modeIndex.value === 0) {
            listLoop(isNext)
        } else if (modeIndex.value === 1) {
            sequentialPlay(isNext)
        } else if (modeIndex.value === 2) {
            randomPlay()
        } else if (modeIndex.value === 3) {
            singleLoop(isNext, isAuto)
        }
    }


    //列表循环
    function listLoop  (isNext: boolean)  {
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
    function sequentialPlay  (isNext: boolean) {
        if (isNext) playingIndex.value++
        else playingIndex.value--
        //下一首，此为最后一首或上一首，此为第一首
        if (playingIndex.value >= playList.value.length) {
            //换成默认的信息，空白信息
            playingIndex.value--
            return //ElMessage.info('当前是最后一首')
        } else if (playingIndex.value <= 0) {
            playingIndex.value++
            return //ElMessage.info('当前是第一首')
        }

        // console.log('顺序播放', playingIndex.value, playList.value[playingIndex.value])
    }

//随机播放
    function randomPlay  ()  {
        const randomNum = Math.floor(Math.random() * (playList.value.length))
        if (playingIndex.value === randomNum && playList.value.length !== 1) return randomPlay
        playingIndex.value = randomNum
        // console.log('顺序播放', playingIndex.value, playList.value[playingIndex.value])
    }

//单曲循环
    function singleLoop  (isNext: boolean, isAuto: boolean)  {
        //自动切换，循环当前音乐
        if (isAuto) {
            // if (audioElement.value) audioElement.value.currentTime = 0
            // console.log('单曲循环', playingIndex.value, playList.value[playingIndex.value])
            //手动切换
        } else {
            listLoop(isNext)
        }
    }

    return {
        modeList,
        modeIndex,
        volume,
        toggleMode,
        togglePlayingIndex,
    }
}, {  persist: [
    {
      pick: ['modeIndex'],
      storage: localStorage,
    },
    {
      pick: ['volume'],
      storage: localStorage,
    },
  ],})
