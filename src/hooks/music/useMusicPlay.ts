import { computed, nextTick, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore"
import { useMusicPlayStore } from "@/store/music/useMusicPlayStore"
import { useMusicConfigStore } from "@/store/music/useMusicConfigStore";
//hooks
import usePlayConfig from '@/hooks/music/usePlayConfig'
//utils
import useMusicPlay from '@/utils/music/musicPlay'
import musicList from "@/utils/music/musicList"
//types
import type { CloudSongInfo } from "@/types/music"







export default function () {

    const useMusicConfig = useMusicConfigStore()
    const musicListStore = useMusicListStore()
    const musicPlayStore = useMusicPlayStore()
    const { togglePlayingIndex } = usePlayConfig()

    //是否正在播放的标志
    const playList = computed({
        get: () => musicListStore.playList,
        set: (val: CloudSongInfo[]) => musicListStore.playList = val
    })


    const { isPlaying, isLoading, playingIndex, thisMusic } = toRefs(musicListStore)
    const { is_show_player_before_play } = toRefs(useMusicConfig)

    const { audioContext, audioElement, musicName, isScrollName, transformX, infoBarActive, controlPanelActive, volume,
        currentTime, duration, gainNode, timer1,
    } = toRefs(musicPlayStore)

    const { togglePlayerVisible } = musicPlayStore
    //如果音乐有id没地址，则要通过id获取最新的src，然后重新赋值
    const resetUrl = async (song: CloudSongInfo) => {
        if (song.src) return
        //获取播放链接
        const newSong = await useMusicPlay.getMusicUrl(song)
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
        if (length === 0) return ElMessage.error('播放列表为空')
        else if (playingIndex.value < 0 || playingIndex.value > length) {
            playingIndex.value = 0
            ElMessage.info('歌曲不存在,已跳转到第一首')
        }
        await resetUrl(playList.value[playingIndex.value])

        if (audioContext.value.state === "suspended") {
            await audioContext.value.resume()
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
            if (is_show_player_before_play.value) togglePlayerVisible()
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
            navigator.mediaSession.setPositionState({
                duration: duration.value || 0,        // 音频总时长
                playbackRate: audioElement.value?.playbackRate || 1.0, // 播放速率
                position: audioElement.value?.currentTime    // 当前播放进度
            })
        }
        //切换下一首
        if (audioElement.value?.currentTime === duration.value) {
            await toggleMusic({})
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
        index = Number(index)
        if (Number.isInteger(index) && index >= 0) {//判断非负整数
            musicListStore.setThisMusic(index)
            // console.log(`即将播放：${playList.value[index].name}`)
        }
        //按模式切歌
        else togglePlayingIndex(isNext, isAuto)

        //获取要播放的这一首歌
        musicListStore.setThisMusic(playingIndex.value)
        console.log('即将播放', thisMusic.value)
        // if (song?.fee === 1 && !song.src) {
        //     musicListStore.deleteMusicFromPlayList(song.id)
        //     return ElMessage.warning('暂不支持VIP音乐')
        // }
        await resetUrl(thisMusic.value)

        //如果当前不是播放状态，则播放
        if (!isPlaying.value) await play({ isReplay: true })
    }

    const reTry = async (retryCount = 0) => {
        if (!audioElement.value) return
        //可能是播放链接失效了，重新获取
        if (retryCount === 1) {
            const song = thisMusic.value
            song.src = ''
            await resetUrl(song)
        }
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

    //添加并播放新音乐(网易云音乐ID或者上传的音乐id)
    const addMusicToPlay = async (id: number, isPlay = false, isCustom = false) => {
        try {
            if (!id) return
            const { isError, songs } = await addCloudMusicList([id], isCustom)
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
    const addCloudMusicList = async (idList: number[], isCustom = false): Promise<{
        isError: boolean,
        songs?: CloudSongInfo[]
    }> => {
        const isError = !musicList.checkIdList(idList)
        if (isError) {
            return { isError }
        }
        let result
        if (isCustom) {
            result = await useMusicPlay.getPlayList(idList)
        } else {
            result = await useMusicPlay.getCloudMusic(idList)
        }

        const { status, data, msg } = result
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



    return {
        addCloudMusicList,
        play,
        toggleMusic,
        addMusicToPlay,
        addMusic
    }
}
