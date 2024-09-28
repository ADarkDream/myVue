// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {useBaseUrlStore} from "@/store/useBaseUrlStore";
import {useMusicStore} from "@/store/music/useMusicStore";
const musicStore=useMusicStore()
const playList = computed(() => musicStore.playList)

// 定义并暴露一个store
export const usePlayConfigStore = defineStore('play_config', () => {
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
//音量0~2，1为100%
    const volume = ref(1)

    //切换模式
    const toggleMode = () => {
        modeIndex.value++
        //此为最后一个模式，切换回第一个
        if (modeIndex.value >= modeList.length) {
            modeIndex.value = 0
        }
        console.log('切换播放模式，当前为：', modeIndex.value, modeList[modeIndex.value])
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

    return {modeList, modeIndex, volume, toggleMode}
}, {persist: true})
