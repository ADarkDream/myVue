// 引入defineStore用于创建store
import { defineStore } from 'pinia'

import type { CloudSongInfo } from "@/types/music"
import { ref, computed, watch, nextTick, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { useMusicListStore } from "@/store/music/useMusicListStore"
import { usePlayConfigStore } from '@/store/music/usePlayConfigStore'
import useMusicPlay from '@/hooks/music/useMusicPlay'

const musicListStore = useMusicListStore()
const playConfigStore = usePlayConfigStore()

//是否正在播放的标志
const isPlaying = computed({
    get: () => musicListStore.isPlaying,
    set: (val: boolean) => musicListStore.isPlaying = val
})
const isLoading = computed({
    get: () => musicListStore.isLoading,
    set: (val: boolean) => musicListStore.isLoading = val
})


// const playList = computed(() => musicListStore.playList)
const { defaultPlayList, playList, playIdList } = toRefs(musicListStore)

//当前播放的歌的序号
const playingIndex = computed({
    get: () => musicListStore.playingIndex,
    set: (val: number) => musicListStore.playingIndex = val
}
)


//当前播放的歌曲信息
const thisMusic = computed(() => musicListStore.thisMusic)


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

    const testData = ref()
    let gainNode = ref()


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


    //如果音乐有id没地址，则要通过id获取最新的src，然后重新赋值
    const resetUrl = async (song: CloudSongInfo) => {
        if (song.src) return
        //获取播放链接
        const newSong = await useMusicPlay().getMusicUrl(song)
        if (newSong) {
            const index = musicListStore.addMusicList([newSong], { isReplace: true })
            console.log(`播放第${index + 1}首歌：${playList.value[index].name}`)
            ElMessage.info(`播放：${playList.value[index].name}`)
            //切换到添加的这首歌
            // await toggleMusic({index})
        } else return ElMessage.warning('暂不支持VIP音乐')
    }


    //播放和暂停
    //pause=true则必定暂停，pause默认则看isPlaying.valueisReplay=true则从头开始播放
    async function play({ pause = false, isReplay = false, isStop = false }: {
        pause?: boolean,
        isReplay?: boolean,
        isStop?: boolean
    }) {
        const length = playList.value.length
        if (length === 0) return ElMessage.info('歌曲列表为空')
        else if (playingIndex.value < 0 || playingIndex.value > length) {
            playingIndex.value = 0
            ElMessage.info('歌曲不存在,已跳转到第一首')
        }
        await resetUrl(playList.value[playingIndex.value])

        if (audioContext.state === "suspended") {
            await audioContext.resume()
        }

        console.log('是否强制暂停：', pause, '是否强制重新播放：', isReplay, '是否强制停止播放：', isStop)
        if (pause || isPlaying.value) {//暂停
            isPlaying.value = false
            audioElement.value?.pause()
            infoBarActive.value = false
            controlPanelActive.value = false
            //关闭播放时间计时器
            clearInterval(timer1.value)
            console.log('播放暂停')
        } else {//播放
            if (!audioElement.value) return
            infoBarActive.value = true
            controlPanelActive.value = true
            isPlaying.value = true
            // 重新加载新歌曲(来自toggleMusic)
            if (isReplay) {
                audioElement.value.load()
                // 绑定新的 `canplay` 事件监听器，确保加载完成后再播放
                audioElement.value.addEventListener('canplay', handleCanPlay)
            } else await handleCanPlay()
            //设置当前播放歌曲的音量
            gainNode.value.gain.value = volume.value

            if (isStop) {//停止播放，播放进度重置并暂停
                if (!audioElement.value) return
                infoBarActive.value = false
                controlPanelActive.value = false
                isPlaying.value = false
                audioElement.value.currentTime = 0
                duration.value = 0
                //关闭播放时间计时器
                if (timer1.value) clearInterval(timer1.value)
                audioElement.value.pause()
                ElMessage.info('停止播放')
            } else {//暂停或播放
                isLoading.value = false
                await nextTick(() => isScroll())

                duration.value = audioElement.value?.duration
                //关闭播放时间计时器
                if (timer1.value) clearInterval(timer1.value)
                //开启播放时间计时器,显示当前播放时长
                timer1.value = setInterval(() => playing(), 1000)
                console.log('播放开始')
            }

        }
    }

    //监听播放进度
    const playing = async () => {
        currentTime.value = audioElement.value?.currentTime
        if ("setPositionState" in navigator.mediaSession) {
            testData.value = {
                duration: duration.value || 0,        // 音频总时长
                playbackRate: audioElement.value?.playbackRate || 1.0, // 播放速率
                position: audioElement.value?.currentTime    // 当前播放进度
            }
            // console.log('当前播放时间', testData.value.position)
            navigator.mediaSession.setPositionState(testData.value)
        }
        //切换下一首
        if (audioElement.value?.currentTime === duration.value) {
            await toggleMusic({})
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

    //判断歌曲和歌手名是否超出长度限制，是否滚动
    const isScroll = () => {
        if (musicName.value) {//歌曲名滚动
            //内容(歌名)长度
            const nameSW = musicName.value.scrollWidth
            //盒子长度
            const nameCW = musicName.value.clientWidth
            //歌曲名和歌手名超出距离
            const scrollNamePosition = nameSW - nameCW
            isScrollName.value = scrollNamePosition > 0
            console.log('歌曲名是否超出容器', isScrollName.value, nameSW, nameCW)
            //如果超出了，修改滚动距离
            if (isScrollName.value) {

                //滚动时间
                let scrollTime = Number((scrollNamePosition / 20).toFixed(0))
                console.log('超出' + scrollNamePosition + 'px');
                console.log('滚动' + scrollTime + 's');
                scrollTime = scrollTime > 7 ? scrollTime : 7

                transformX.value = {
                    // '--scrollNamePosition': (scrollNamePosition - 20) + '%',
                    '--scrollTime': scrollTime + 's'
                }
            }
        }
    }


    //切换音乐
    const toggleMusic = async ({ isNext = true, isAuto = true, index }: {
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
        if (index && Number.isInteger(index) && index >= 0) {//判断非负整数
            playingIndex.value = index
            console.log(`即将播放：${playList.value[index].name}`)
        }
        //按模式切歌
        else playConfigStore.togglePlayingIndex(isNext, isAuto)

        //获取要播放的这一首歌
        const song = playList.value[playingIndex.value]
        console.log('即将播放', song)
        // if (song?.fee === 1 && !song.src) {
        //     musicListStore.deleteMusicFromPlayList(song.cloud_music_id)
        //     return ElMessage.warning('暂不支持VIP音乐')
        // }
        await resetUrl(song)

        //如果当前不是播放状态，则播放
        if (!isPlaying.value) await play({ isReplay: true })
    }

    const reTry = async (retryCount = 0) => {
        if (!audioElement.value) return
        await audioElement.value.play().catch(async (err) => {
            if (retryCount < 5) { // 限制重试次数
                console.error("播放失败，一秒后重试")
                console.log(err)
                // 等待 1 秒
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 递归再次尝试播放
                await reTry(retryCount + 1)
            } else {
                ElMessage.error('多次播放失败，切换下一首')
                await toggleMusic({})
            }
        })
    }

    const handleCanPlay = async () => {
        if (!audioElement.value) return
        // 播放新歌曲
        await reTry()

        isLoading.value = false
        // 解绑 `canplay` 事件监听器，防止多次触发
        audioElement.value.removeEventListener('canplay', handleCanPlay)

        // 更新歌曲时长
        duration.value = audioElement.value.duration
    }

    //添加并播放新音乐(链接)【需要修改新增的播放链接的信息】
    const addMusic = async (url: string) => {
        // if (!newMusic.value.src) return ElMessage.error('音乐链接不能为空')
        const reg = /(https?:\/\/)?(([0-9a-z.]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%\/.\-_]*)?(\?[0-9a-z=&%_\-]*)?(#[0-9a-z=&%_\-]*)?/ig
        if (!reg.test(url)) return ElMessage.error('请输入一个网址链接')
        //去除响应式
        const songInfo = {
            id: undefined,
            cloud_music_id: undefined,
            name: '',
            status: undefined,
            artists: [{ name: '', pic_url: '' }],
            album: { name: '', pic_url: '' },
            src: url
        }

        const index = musicListStore.addMusicList([songInfo], {})
        //切换到最后一首
        await toggleMusic({ index })
    }

    //添加并播放新音乐(网易云音乐ID)
    const addCloudMusic = async (cloud_music_id: number, isPlay = false) => {
        try {
            if (!cloud_music_id) return
            const { isError, songs } = await addCloudMusicList([cloud_music_id])
            console.log('songs', isError, songs)
            if (isError) return
            //songs为空，addCloudMusicList过滤时
            if (!songs?.length) return // ElMessage.warning('添加的音乐需要VIP，暂不支持')

            //添加到播放列表
            const index = musicListStore.addMusicList(songs, { isReplace: true })
            //如果添加一首歌且选择播放，切换到添加的这首歌
            if (songs.length === 1 && isPlay) {
                await toggleMusic({ index })
            }

        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }


    //批量获取音乐信息
    const addCloudMusicList = async (idList: number[]): Promise<{
        isError: boolean,
        songs?: CloudSongInfo[]
    }> => {
        let isError = false
        if (idList.length === 0) {
            ElMessage.error('请求的idList不能为空')
            return { isError }
        }
        idList.forEach(id => {
            // 尝试将id转换为数字
            const num = Number(id)
            // 检查是否成功转换为数字，并且是一个正整数
            if (isNaN(num) || !Number.isInteger(num) || num < 0) {
                console.log(num, isNaN(num), !Number.isInteger(num), num <= 0);

                isError = true
            }
        }
        )
        if (isError) {
            console.log(idList);

            ElMessage.error('含有不合法的id,id应为纯数字')
            return { isError }
        }

        const { status, data, msg } = await useMusicPlay().getCloudMusic(idList)
        //清洗掉返回数据中没有播放地址的歌曲信息（过滤掉src不存在的song）

        if (status === 1 && data) {
            if (!data.songsInfo) return { isError: true }
            const songs = data.songsInfo
            //过滤地址不存在的歌
            // const songs = data.songsInfo.filter(song => song.src !== undefined && song.src !== '')
            return { isError: false, songs }
        }
        return { isError: true }
    }


    //获取本地的播放列表备份
    const getLocalMusicList = async () => {
        let list = localStorage.getItem('music_id_list')
        //判断是否是整数且在模式列表范围内
        if (!!list) {
            playIdList.value = JSON.parse(list) || []
            // const { isError, songs } = await addCloudMusicList(playIdList.value)

            const { status, data, msg } = await useMusicPlay().getPlayList(playIdList.value)
            if (status === 1 && data?.songsInfo) {
                //重新排序
                // const newSongsInfo = data.songsInfo.map(song)
                playList.value = data.songsInfo

                return
            } else playIdList.value = []
        }
        playList.value.forEach(song => playIdList.value.push(song.id))
    }




    //修改系统媒体控制的歌曲信息
    const setMediaInfo = ({ title, artist, album, pic_url }: Record<string, string>) => {
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
            // thisMusic.value = playList.value[playingIndex.value]
            console.log('thisMusic', thisMusic.value)
            setMediaInfo({
                title: thisMusic.value.name,
                artist: thisMusic.value.artists.map(artist => artist.name).join('&') || '未知艺术家',
                album: thisMusic.value.album.name,
                pic_url: thisMusic.value.album.pic_url!
            })

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

        navigator.mediaSession.setActionHandler("play", async () => {
            await play({})
            navigator.mediaSession.playbackState = "playing"
        })
        navigator.mediaSession.setActionHandler("pause", async () => {
            await play({})
            navigator.mediaSession.playbackState = "paused"
        })
        navigator.mediaSession.setActionHandler("stop", async () => {
            await play({ pause: true })
        })
        //跳转到指定播放点
        // navigator.mediaSession.setActionHandler("seekto", () => {
        //     toggleMusic({isNext:false,isAuto:false})
        // })
        //上一首
        navigator.mediaSession.setActionHandler("previoustrack", async () => {
            await toggleMusic({ isNext: false, isAuto: false })
        })
        //下一首
        navigator.mediaSession.setActionHandler("nexttrack", async () => {
            await toggleMusic({ isNext: true, isAuto: false })
        })
    }

    return {
        audioContext,
        audioElement,
        gainNode,
        infoBarActive, controlPanelActive,
        isScrollName,
        transformX,
        currentTime,
        duration,
        volume,
        isShowPlayer,
        isLock,
        isShowVolumePanel,
        getLocalMusicList,
        setAudioElement,
        setNameElement,
        isScroll,
        lockThePlayer,
        togglePlayerVisible,
        toggleVolumePanelVisible,
        addCloudMusicList,
        play,
        changeVolume,
        changeCurrentTime,
        toggleMusic,
        addCloudMusic,
        addMusic
    }
}, { persist: true })
