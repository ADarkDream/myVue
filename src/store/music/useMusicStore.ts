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
            cloud_music_id: 505307631,
           name: "call of silence（Cover Piano）",
            comment_thread_id: "R_SO_4_505307631",
            mvid: 0,
            duration: 165.048,
            src: null,
            fee: 0,
            album: {
                album_id: 36157973,
               name: "进击的巨人",
                pic_url: "https://p1.music.126.net/Hkn1zp8PDoMuVOYhS593rw==/109951163022600482.jpg",
                publish_time: "2017-09-10T09:54:43.000Z"
            },
            artists: [
                {
                    cloud_artist_id: 12383184,
                   name: "向晚丶",
                    pic_url: "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg"
                }
            ]
        },
        {
            cloud_music_id: 2123822354,
           name: "我要你 (我要你在我身旁)",
            comment_thread_id: "R_SO_4_2123822354",
            mvid: 0,
            duration: 193.648,
            src: "",
            fee: 8,
            album: {
                album_id: 185077517,
               name: "TA·说",
                pic_url: "https://p1.music.126.net/d_AC9BDLrl98XyLDWrfbWg==/109951169311058334.jpg",
                publish_time: "2024-02-08T16:00:00.000Z"
            },
            artists: [
                {
                    cloud_artist_id: 1054159,
                   name: "任素汐",
                    pic_url: "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg"
                }
            ]
        },
        {
            cloud_music_id: 2604907727,
           name: "会开花的云 (Live版)",
            comment_thread_id: "R_SO_4_2604907727",
            mvid: 0,
            duration: 241.616,
            src: "",
            fee: 8,
            album: {
                album_id: 241207097,
               name: "天赐的声音第五季 第11期",
                pic_url: "https://p1.music.126.net/yokTdCD6kPIyJJyUIXa7mw==/109951169749390081.jpg",
                publish_time: "2024-07-04T16:00:00.000Z"
            },
            artists: [
                {
                    cloud_artist_id: 9939,
                   name: "弦子",
                    pic_url: "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg"
                },
                {
                    cloud_artist_id: 33709222,
                   name: "姚晓棠",
                    pic_url: "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg"
                }
            ]
        },
        {
            cloud_music_id: 1981095072,
           name: "神姬",
            duration: 223.69,
            comment_thread_id: "R_SO_4_1981095072",
            src: "",
            fee: 8,
            mvid: 0,
            artists: [
                {
                    cloud_artist_id: 13037895,
                   name: "EinWil",
                    pic_url: "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg"
                },
                {
                    cloud_artist_id: 12361498,
                   name: "Jayx",
                    pic_url: "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg"
                }
            ],
            album: {
                album_id: 151519735,
               name: "神姬",
                pic_url: "https://p1.music.126.net/_pFAZXzV7zKYSfnvHHNj6w==/109951167874823513.jpg",
                publish_time: "2022-09-13T13:23:24.252Z"
            }
        }
    ])

//当前播放的歌的序号
    const playingIndex = ref(0)

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


    return {playList, isPlaying, isLoading, playListIndex,playingIndex, addMusicList, deleteMusic}
})
