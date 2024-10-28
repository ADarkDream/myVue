//音乐播放相关的方法
import { computed, toRefs } from "vue";
import { ElMessage } from "element-plus";
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { usePlayConfigStore } from "@/store/music/usePlayConfigStore";
//hooks
import useMusicPlay from "@/hooks/music/useMusicPlay";



export default function () {

    const musicListStore = useMusicListStore()
    // const musicPlayStore = useMusicPlayStore()
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
            name: 'listLoop',
            c_name: '列表循环',
            img: '',
        },
        {
            index: 1,
            name: 'sequentialPlay',
            c_name: '顺序播放',
            img: '',
        },
        {
            index: 2,
            name: 'randomPlay',
            c_name: '随机播放',
            img: '',
        },
        {
            index: 3,
            name: 'singleLoop',
            c_name: '单曲循环',
            img: '',
        }
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
    function listLoop(isNext: boolean) {
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
    async function sequentialPlay(isNext: boolean) {
        if (isNext) playingIndex.value++
        else playingIndex.value--
        //下一首，此为最后一首或上一首，此为第一首
        if (playingIndex.value >= playList.value.length) {
            //换成默认的信息，空白信息
            playingIndex.value = 0
            await useMusicPlay().play({ isStop: true })
            return //ElMessage.info('当前是最后一首')
        } else if (playingIndex.value <= 0) {
            playingIndex.value++
            return //ElMessage.info('当前是第一首')
        }

        // console.log('顺序播放', playingIndex.value, playList.value[playingIndex.value])
    }

    //随机播放
    function randomPlay() {
        const randomNum = Math.floor(Math.random() * (playList.value.length))
        if (playingIndex.value === randomNum && playList.value.length !== 1) return randomPlay
        playingIndex.value = randomNum
        // console.log('顺序播放', playingIndex.value, playList.value[playingIndex.value])
    }

    //单曲循环
    function singleLoop(isNext: boolean, isAuto: boolean) {
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
        toggleMode,
        togglePlayingIndex,
    }
}
