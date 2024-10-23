// 引入defineStore用于创建store
import { defineStore } from 'pinia'

import { ref } from 'vue'
import { ElMessage } from 'element-plus'




// 定义并暴露一个store
export const useMusicPlayStore = defineStore('music_play', () => {
    const audioContext = new AudioContext()

    //媒体元素
    const audioElement = ref<HTMLAudioElement>()

    //修改媒体元素
    const setAudioElement = (el: HTMLAudioElement) => {
        audioElement.value = el
    }


    //歌名和歌手名DOM元素
    const musicName = ref<HTMLDivElement>()
    //修改媒体元素
    const setNameElement = (el: HTMLDivElement) => {
        musicName.value = el
    }

    //是否滚动歌名
    const isScrollName = ref(false)
    //滚动距离
    const transformX = ref({
        // '--scrollNamePosition': 50 + '%',
        '--scrollTime': 7 + 's'
    })

    //是否显示控制面板
    const infoBarActive = ref(false)
    //是否旋转专辑图
    const controlPanelActive = ref(false)

    //锁住播放器面板
    const isLock = ref(false)


    //是否显示播放器
    const isShowPlayer = ref(true)
    const timer_player = ref<NodeJS.Timeout>()
    const time_player = ref(10)

    //显示音量控制面板
    const isShowVolumePanel = ref(false)
    const timer_volume = ref<NodeJS.Timeout>()
    const time_volume = ref(5)
    //音量0~1，1为100%
    const volume = ref(1)

    //播放进度
    const currentTime = ref(audioElement.value?.currentTime)
    //音乐总时长
    const duration = ref(audioElement.value?.duration)
    //计算当前播放时长的定时器
    const timer1 = ref<NodeJS.Timeout>()

    const gainNode = ref()


    //切换播放器显示状态【定时器】
    const togglePlayerVisible = () => {
        //如果有定时器，先重置防止重复
        if (timer_player.value) clearInterval(timer_player.value)
        //当前是可见的，且未锁住
        if (isShowPlayer.value && !isLock.value) {
            //重置倒计时
            time_player.value = 10
            //开启定时器
            timer_player.value = setInterval(() => {
                console.log(`还有${time_player.value}S隐藏播放器`)
                time_player.value--
                //倒计时为0
                if (time_player.value <= 0) {
                    if (isShowPlayer.value && !isLock.value) {
                        isShowPlayer.value = false   //没锁住则隐藏
                    }
                    //如果是锁住的，则不隐藏播放器
                    //清除定时器
                    clearInterval(timer_player.value)
                }
            }, 1000)
        } else if (!isShowPlayer.value) { //当前不可见，显示播放器并开启定时器
            isShowPlayer.value = true
            togglePlayerVisible()
        }
    }

    //切换音量控制面板显示状态【定时器】
    const toggleVolumePanelVisible = () => {
        //如果有定时器，先重置防止重复
        if (timer_volume.value) clearInterval(timer_volume.value)
        //当前是可见的
        if (isShowVolumePanel.value) {
            //重置倒计时
            time_volume.value = 5
            //开启定时器
            timer_volume.value = setInterval(() => {
                console.log(`还有${time_volume.value}S隐藏音量控制面板`)
                time_volume.value--
                //倒计时为0
                if (time_volume.value <= 0) {
                    if (isShowVolumePanel.value) { //未隐藏则隐藏
                        isShowVolumePanel.value = false
                    }
                    //清除定时器
                    clearInterval(timer_volume.value)
                }
            }, 1000)
        } else if (!isShowVolumePanel.value) { //当前不可见，显示播放器并开启定时器
            isShowVolumePanel.value = true
            toggleVolumePanelVisible()
        }
    }

    //锁定播放器使其不隐藏
    const lockThePlayer = () => {
        if (isLock.value) {
            isLock.value = false
            ElMessage.info('取消锁定，10秒后自动隐藏')
            togglePlayerVisible()
        } else {
            isLock.value = true
            ElMessage.success('播放器已锁定(取消自动隐藏)')
        }
    }


    //修改音量
    const changeVolume = (value: number) => {
        console.log('音量变化', value)
        gainNode.value.gain.value = value
        volume.value = value
    }

    //修改播放进度
    const changeCurrentTime = (newCurrentTime: number) => {
        if (audioElement.value) {
            audioElement.value.currentTime = newCurrentTime
        }
    }




    return {
        audioContext,
        audioElement,
        gainNode,
        musicName,
        infoBarActive,
        controlPanelActive,
        isScrollName,
        transformX,
        currentTime,
        duration,
        volume,
        isShowPlayer,
        isLock,
        isShowVolumePanel,
        timer1,
        setAudioElement,
        setNameElement,
        lockThePlayer,
        togglePlayerVisible,
        toggleVolumePanelVisible,
        changeVolume,
        changeCurrentTime,
    }
}, {
    persist: true
})
