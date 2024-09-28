// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {useBaseUrlStore} from "@/store/useBaseUrlStore";
import {CloudSongInfo} from "@/types/music";

const {defaultUrl} = useBaseUrlStore()

// 定义并暴露一个store
export const useMusicStore = defineStore('music', () => {
    //播放列表
    const playList = ref<CloudSongInfo[]>([
        {
            cloud_music_id: 0,
            name: '未命名',
            artists: [{name: '川川尾巴小心不要被扯掉了'}],
            album: {
                name: '',
                pic_url: defaultUrl + '/music/album-art/%E4%B8%93%E8%BE%91%E5%9B%BE-%E5%B7%9D%E5%B7%9D%E5%B0%BE%E5%B7%B4%E5%B0%8F%E5%BF%83%E4%B8%8D%E8%A6%81%E8%A2%AB%E6%89%AF%E6%8E%89%E4%BA%86.jpg'
            },
            src: defaultUrl + '/music/files/%E6%9C%AA%E5%91%BD%E5%90%8D-%E5%B7%9D%E5%B7%9D%E5%B0%BE%E5%B7%B4%E5%B0%8F%E5%BF%83%E4%B8%8D%E8%A6%81%E8%A2%AB%E6%89%AF%E6%8E%89%E4%BA%86.m4a'
        },
        {
            cloud_music_id: 0,
            name: '大鱼',
            artists: [{name: '周深'}],
            album: {name: '', pic_url: ''},
            src: defaultUrl + '/music/files/%E5%A4%A7%E9%B1%BC-%E5%91%A8%E6%B7%B1.mp3'
        },
        {
            cloud_music_id: 1981095072,
            name: '神姬',
            artists: [{name: 'EinWil'}, {name: 'Jayx'}],
            album: {name: '', pic_url: ''},
            src: ''// defaultUrl + '/music/files/%E7%A5%9E%E5%A7%AC-EinWil%26Jayx.m4a'
        },
        {
            cloud_music_id: 505307631,
            name: 'call of silence（Cover Piano）',
            artists: [{name: '向晚丶'}],
            album: {name: '', pic_url: ''},
            src: ''
        },
        {
            cloud_music_id: 2604907727,
            name: '会开花的云 (Live版)',
            artists: [{name: '姚晓棠'}, {name: '弦子'}],
            album: {name: '', pic_url: 'http://p1.music.126.net/yokTdCD6kPIyJJyUIXa7mw==/109951169749390081.jpg'},
            src: ''
        },
        {
            cloud_music_id: 2123822354,
            name: '我要你 (我要你在我身旁)',
            artists: [{name: ''}, {name: ''}],
            album: {name: '', pic_url: ''},
            src: ''
        }
    ])

//当前播放的歌的序号
//     const playingIndex = ref(0)

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
    const addMusicList = (newMusicList: CloudSongInfo[], {isCover = false, isReplace = false}) => {
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
        return index
    }

    //删除播放列表中指定id的歌
    const deleteMusic = (id: number) => {
        playList.value.splice(playListIndex.value[id], 1)
    }


    return {playList, isPlaying, isLoading, playListIndex, addMusicList, deleteMusic}
})
