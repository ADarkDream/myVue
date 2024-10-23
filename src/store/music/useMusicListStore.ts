//歌单状态管理
import { defineStore } from 'pinia'
import { computed, reactive, ref } from "vue";
import { useBaseUrl } from "@/hooks/useBaseUrl";
import type { CloudSongInfo, MusicList, MusicListInfo, QueryCloudMusicList, QueryMusicList, QueryMusicLists, SongInfo } from "@/types/music";
import pinia from '@/store'
import musicListUtils from "@/utils/music/musicList";
import { ElMessage } from "element-plus";


const { defaultUrl } = useBaseUrl(pinia)

// 定义并暴露一个store
export const useMusicListStore = defineStore('music_list', () => {
    //默认播放列表
    const defaultPlayList = ref<CloudSongInfo[]>([
        {
            id: 1,
            cloud_music_id: 0,
            name: '未命名',
            status: 1,
            artists: [{ name: '川川尾巴小心不要被扯掉了' }],
            album: {
                name: '',
                pic_url: defaultUrl + '/music/album-art/%E4%B8%93%E8%BE%91%E5%9B%BE-%E5%B7%9D%E5%B7%9D%E5%B0%BE%E5%B7%B4%E5%B0%8F%E5%BF%83%E4%B8%8D%E8%A6%81%E8%A2%AB%E6%89%AF%E6%8E%89%E4%BA%86.jpg'
            },
            src: defaultUrl + '/music/files/%E6%9C%AA%E5%91%BD%E5%90%8D-%E5%B7%9D%E5%B7%9D%E5%B0%BE%E5%B7%B4%E5%B0%8F%E5%BF%83%E4%B8%8D%E8%A6%81%E8%A2%AB%E6%89%AF%E6%8E%89%E4%BA%86.m4a'
        },
    ])

    //播放列表
    const playList = ref<CloudSongInfo[]>([
        {
            id: 1,
            cloud_music_id: 0,
            name: '未命名',
            status: 1,
            artists: [{ name: '川川尾巴小心不要被扯掉了' }],
            album: {
                name: '',
                pic_url: defaultUrl + '/music/album-art/%E4%B8%93%E8%BE%91%E5%9B%BE-%E5%B7%9D%E5%B7%9D%E5%B0%BE%E5%B7%B4%E5%B0%8F%E5%BF%83%E4%B8%8D%E8%A6%81%E8%A2%AB%E6%89%AF%E6%8E%89%E4%BA%86.jpg'
            },
            src: defaultUrl + '/music/files/%E6%9C%AA%E5%91%BD%E5%90%8D-%E5%B7%9D%E5%B7%9D%E5%B0%BE%E5%B7%B4%E5%B0%8F%E5%BF%83%E4%B8%8D%E8%A6%81%E8%A2%AB%E6%89%AF%E6%8E%89%E4%BA%86.m4a'
        }
    ])

    //播放列表的数据库音乐id数组
    const playIdList = ref<number[]>([])

    //数据库歌单id（key）和网易云歌单id（value）键值对
    const connectionObj = reactive<{ [key: number]: number }>({})

    //歌单歌曲对象
    const musicListObj = reactive<{ [key: string]: CloudSongInfo[] }>({})

    //歌单信息对象
    const musicListInfoObj = reactive<{ [key: string]: MusicListInfo }>({})

    //当前歌单的信息
    const musicListInfo = ref<MusicListInfo>()

    //当前歌单的音乐列表
    const musicList = ref<CloudSongInfo[]>([])


    //当前播放的歌的序号
    const playingIndex = ref(0)

    //当前播放的歌曲信息
    const thisMusic = computed(() => playList.value[playingIndex.value])


    //播放列表序号和id对应的对象,id为键，index为值
    const playListIndex = computed(() => {
        const obj = {} as Record<number, number>
        playList.value.forEach((song, index) => obj[song.cloud_music_id] = index)
        return obj
    })

    //是否正在播放的标志
    const isPlaying = ref(false)
    const isLoading = ref(false)


    //新的歌单加入播放列表,isCover=true将整个播放列表替换为新的,isReplace=true,将同id的歌替换掉
    const addMusicList = (newMusicList: CloudSongInfo[], { isCover = false, isReplace = true }) => {
        //如果是添加单首歌，返回index
        let index = playList.value.length - 1

        //isCover=true或播放列表为空，将整个播放列表替换为新的
        if (isCover || !playList.value?.length) {
            playList.value = newMusicList
            setLocalMusicIdList()
            return index = 0
        }
        //获取播放列表中所有歌曲的id值
        const idList = Object.keys(playListIndex.value)

        newMusicList.forEach(song => {
            //如果新添加的歌曲已经在播放列表中存在
            if (idList.includes(song.cloud_music_id.toString())) {
                index = playListIndex.value[song.cloud_music_id]
                //isReplace=true,将同id的歌替换掉
                if (isReplace) {
                    playList.value[index] = song
                } else return//否则跳过同id的歌
            } else {
                playList.value.push(song)
                index = playList.value.length - 1
            }
        })
        setLocalMusicIdList()
        return index
    }

    //删除播放列表中指定id的歌
    const deleteMusicFromPlayList = (id: number) => {
        //获取要删除的歌在歌单列表的序号
        const index = playListIndex.value[id]
        if (index === playingIndex.value) {
            //toggleMusic({})
            return ElMessage.error('不能删除当前播放的歌曲')
        }
        else if (index < playingIndex.value) {
            playingIndex.value--
            console.log(index)
            console.log(playingIndex.value)
            console.warn('删除的是播放歌曲之前的歌')
        }
        playList.value.splice(index, 1)
        setLocalMusicIdList()
    }

    //删除播放列表中指定id的歌
    const clearPlayList = () => {
        //清空播放列表
        playList.value = defaultPlayList.value
        setLocalMusicIdList()
    }

    //根据用户uid或歌单id，获取单个或多个歌单信息的信息
    const getMusicListsInfo = async ({ isLogin, user_id, music_list_id }: QueryMusicLists, latest = false) => {
        //如果查询单个歌单，且歌单对象中有这个歌单的信息，且不要最新的(用缓存)
        if (!latest && music_list_id && Object.keys(musicListInfoObj).includes(music_list_id.toString())) {
            console.log(`已加载本地缓存的歌单${music_list_id}的信息`)
            return { status: 1, list: [musicListInfoObj[music_list_id.toString()]], msg: `已加载本地缓存的歌单${music_list_id}的信息` }
        }

        //查询多个歌单，或查询最新的情况(不要缓存)下
        const { status, list, msg } = await musicListUtils.getMusicListsInfo({ isLogin, user_id, music_list_id })
        //处理请求后的信息
        if (status === 1) list?.forEach(MusicListInfo => {
            const { music_list_id, cloud_music_list_id } = MusicListInfo
            //添加两个歌单的id键值对信息
            connectionObj[music_list_id] = cloud_music_list_id!
            //向信息对象中添加
            musicListInfoObj[music_list_id] = MusicListInfo

        })
        //存入本地
        sessionStorage.setItem('connectionObj', JSON.stringify(connectionObj))
        sessionStorage.setItem('musicListInfoObj', JSON.stringify(musicListInfoObj))
        return { status, list, msg }
    }




    //搜索数据库的歌单及音乐信息
    const getMusicList = async ({ music_list_id, limit, offset }: QueryMusicList) => {
        let localInfo = false
        let localList = false
        //如果歌单对象中有这个歌单的信息
        if (Object.keys(musicListInfoObj).includes(music_list_id.toString())) {
            musicListInfo.value = musicListInfoObj[music_list_id.toString()]
            localInfo = true
            console.log(`已加载本地缓存的歌单${music_list_id}的信息`)
        }
        if (Object.keys(musicListObj).includes(music_list_id.toString())) {
            musicList.value = musicListObj[music_list_id.toString()]
            localList = true
            console.log(`已加载本地缓存的歌单${music_list_id}的音乐列表`)
        }

        if (localInfo && localList) return
        console.log(`本地缓存没有歌单${music_list_id}的信息,查询服务器`)
        const data = await musicListUtils.getMusicList({ music_list_id, limit, offset })
        //处理请求后的信息
        if (data) set_and_save_data(data, music_list_id)
    }

    //搜索网易云的歌单及音乐信息
    const getCloudMusicList = async ({ cloud_music_list_id, limit, offset, latest }: QueryCloudMusicList) => {
        const { status, data, msg } = await musicListUtils.getCloudMusicList({ cloud_music_list_id, limit, offset, latest }) as { status: number, data?: MusicList, msg: string }
        //处理请求后的信息
        if (status === 1 && data) {
            const music_list_id = data.musicListInfo.music_list_id
            set_and_save_data(data, music_list_id)
        }
        return { status, msg }
    }

    //处理请求后的歌单信息或歌曲列表，存入对象，更新当前，并存入sessionStorage
    const set_and_save_data = ({ musicListInfo: ml_info, songsInfo }: MusicList, music_list_id: number) => {
        //如果存在
        if (ml_info && music_list_id) {
            //添加两个歌单的id键值对信息
            connectionObj[music_list_id] = ml_info.cloud_music_list_id!
            //向信息对象中添加
            musicListInfoObj[music_list_id] = ml_info
            //更新当前
            musicListInfo.value = ml_info
            //存入本地
            sessionStorage.setItem('connectionObj', JSON.stringify(connectionObj))
            sessionStorage.setItem('musicListInfoObj', JSON.stringify(musicListInfoObj))
        }
        if (songsInfo) {
            //向信息对象中添加
            musicListObj[music_list_id] = songsInfo
            //更新当前
            musicList.value = songsInfo
            //存入本地
            sessionStorage.setItem('musicListInfoObj', JSON.stringify(musicListInfoObj))
        }
    }

    //读取sessionStorage存储的数据并设置
    const get_session_and_set_data = () => {
        //如果本地存了歌单信息，读取并设置
        const ml_info_obj = sessionStorage.getItem('musicListInfoObj')
        if (ml_info_obj) {
            const obj = JSON.parse(ml_info_obj)
            // console.log('musicListInfoObj', obj)
            const keys = Object.keys(obj)
            keys.forEach(key => {
                musicListInfoObj[key] = obj[key]
            })
        }
        const ml_obj = sessionStorage.getItem('musicListObj')
        if (ml_obj) {
            const obj = JSON.parse(ml_obj)
            // console.log('musicListObj', obj)
            const keys = Object.keys(obj)
            keys.forEach(key => {
                musicListObj[key] = obj[key]
            })
        }
        const c_obj = sessionStorage.getItem('connectionObj')
        if (c_obj) {
            const obj = JSON.parse(c_obj)
            // console.log('connectionObj', obj)
            const keys = Object.keys(obj)
            keys.forEach(key => {
                connectionObj[Number(key)] = obj[key]
            })
        }
    }
    get_session_and_set_data()


    const setLocalMusicIdList = () => {
        //获取播放列表中所有歌曲的id值
        // 会乱序
        // playIdList.value = Object.keys(playListIndex.value).map(Number)
        playIdList.value = playList.value.map(song => song.id)
        localStorage.setItem('music_id_list', JSON.stringify(playIdList.value))
    }



    return {
        defaultPlayList,
        playList,
        playIdList,
        isPlaying,
        isLoading,
        playListIndex,
        playingIndex,
        thisMusic,
        musicListInfo,
        musicList,
        connectionObj,
        musicListInfoObj,
        musicListObj,
        addMusicList,
        deleteMusicFromPlayList,
        clearPlayList,
        getMusicList,
        getMusicListsInfo,
        getCloudMusicList
    }
}, {
    persist: true
})
