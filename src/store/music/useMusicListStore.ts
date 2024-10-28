//歌单状态管理
import { defineStore } from 'pinia'
import { computed, reactive, ref } from "vue";
import { useBaseUrl } from "@/hooks/useBaseUrl";
import type { CloudSongInfo, MusicList, MusicListInfo, QueryCloudMusicList, QueryMusicList, QueryMusicLists } from "@/types/music";
import musicListUtils from "@/utils/music/musicList";
import { ElMessage } from "element-plus";



// 定义并暴露一个store
export const useMusicListStore = defineStore('music_list', () => {
    const { defaultUrl } = useBaseUrl()
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

    //数据库歌单id（key）和网易云歌单id（value）键值对
    const connectionObj = reactive<{ [key: number]: number }>({})

    //歌单歌曲对象
    const musicListObj = reactive<{ [key: string]: CloudSongInfo[] }>({})

    //歌单信息对象
    const musicListInfoObj = reactive<{ [key: string]: MusicListInfo }>({})

    /**
     * 用户创建的歌单id列表
     */
    const myMusicIdList = ref<number[]>([])

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
        playList.value.forEach((song, index) => obj[song.id] = index)
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
            return index = 0
        }
        //获取播放列表中所有歌曲的id值
        const idList = Object.keys(playListIndex.value)

        newMusicList.forEach(song => {
            //如果新添加的歌曲已经在播放列表中存在
            if (idList.includes(song.id.toString())) {
                index = playListIndex.value[song.id]
                //isReplace=true,将同id的歌替换掉
                if (isReplace) {
                    playList.value[index] = song
                } else return//否则跳过同id的歌
            } else {
                playList.value.push(song)
                index = playList.value.length - 1
            }
        })
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
    }

    //清空播放列表
    const clearPlayList = () => {
        playList.value = defaultPlayList.value
    }


    return {
        defaultPlayList,
        playList,
        isPlaying,
        isLoading,
        playListIndex,
        playingIndex,
        thisMusic,
        musicListInfo,
        musicList,
        myMusicIdList,
        connectionObj,
        musicListInfoObj,
        musicListObj,
        addMusicList,
        deleteMusicFromPlayList,
        clearPlayList,
    }
}, {
    persist: [{
        pick: ['playList', 'playingIndex', 'playListIndex', 'musicListInfo', 'musicList', 'myMusicidList', 'connectionObj'],
        storage: localStorage
    }]
})
