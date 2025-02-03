//歌单状态管理
import { defineStore } from "pinia"
import { computed, reactive, ref } from "vue"
import type {
  CloudSongInfo,
  MusicList,
  MusicListInfo,
  QueryCloudMusicList,
  QueryMusicList,
  QueryMusicLists,
  SongInfo,
} from "@/types/music"
import musicListUtils from "@/utils/music/musicList"
import { ElMessage } from "element-plus"

// 定义并暴露一个store
export const useMusicListStore = defineStore(
  "music_list",
  () => {
    //默认播放列表
    const defaultPlayList = ref<CloudSongInfo[]>([
      {
        id: 1,
        cloud_music_id: 0,
        name: "未命名",
        status: 1,
        artists: [{ name: "川川尾巴小心不要被扯掉了" }],
        album: {
          name: "川川老师的作品集",
          pic_url:
            import.meta.env.VITE_QINIUTHUMBNAIL_URL +
            "/music/album-art/%E4%B8%93%E8%BE%91%E5%9B%BE-%E5%B7%9D%E5%B7%9D%E5%B0%BE%E5%B7%B4%E5%B0%8F%E5%BF%83%E4%B8%8D%E8%A6%81%E8%A2%AB%E6%89%AF%E6%8E%89%E4%BA%86.jpg",
        },
        src:
          import.meta.env.VITE_QINIU_URL +
          "/music/files/%E6%9C%AA%E5%91%BD%E5%90%8D-%E5%B7%9D%E5%B7%9D%E5%B0%BE%E5%B7%B4%E5%B0%8F%E5%BF%83%E4%B8%8D%E8%A6%81%E8%A2%AB%E6%89%AF%E6%8E%89%E4%BA%86.m4a",
      },
    ])

    //播放列表
    const playList = ref<CloudSongInfo[]>([...defaultPlayList.value])

    /**
     * - 歌单关系和键值对
     * - 数据库歌单id(key:number)
     * - 网易云歌单id(value)
     */
    const connectionObj = reactive<{ [key: number]: number }>({})
    /**
     * - 歌单歌曲对象
     * - 数据库歌单id(key:string)
     * - 歌曲列表CloudSongInfo(value)
     */
    const musicListObj = reactive<{ [key: string]: CloudSongInfo[] }>({})
    /**
     * - 歌单信息对象
     * - 数据库歌单id(key:string)
     * - 歌单信息列表MusicListInfo(value)
     */
    const musicListInfoObj = reactive<{ [key: string]: MusicListInfo }>({})

    /**
     * 公开的歌单id列表
     */
    const publicMusicIdList = ref<number[]>([])
    /**
     * 公开的歌单列表
     */
    const publicMusicListInfo = computed<MusicListInfo[]>(() =>
      publicMusicIdList.value.map(id => musicListInfoObj[id.toString()]).filter(info => info !== undefined)
    )
    /**
     * 用户创建的歌单id列表
     */
    const myMusicIdList = ref<number[]>([])
    /**
     * 用户创建的歌单列表
     */
    const myMusicListInfo = computed<MusicListInfo[]>(() =>
      myMusicIdList.value.map(id => musicListInfoObj[id.toString()]).filter(info => info !== undefined)
    )

    /**
     * 当前歌单的信息
     */
    const musicListInfo = ref<MusicListInfo>()

    /**
     * 当前歌单的音乐列表
     */
    const musicList = ref<CloudSongInfo[]>([])

    //当前播放的歌的序号
    const playingIndex = ref(0)

    //当前播放的歌曲信息
    const thisMusic = ref<CloudSongInfo>(defaultPlayList.value[0])

    //播放列表序号和id对应的对象,id为键，index为值
    const playListIndex = computed(() => {
      const obj = {} as Record<number, number>
      playList.value.forEach((song, index) => (obj[song.id] = index))
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
        return (index = 0)
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
          } else return //否则跳过同id的歌
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
      // if (index === playingIndex.value) {
      //     //toggleMusic({})
      //     return ElMessage.error('不能删除当前播放的歌曲')
      // }
      // else if (index < playingIndex.value) {
      if (playingIndex.value !== 0) playingIndex.value--
      // console.warn('删除的是播放歌曲之前的歌')
      // }
      playList.value.splice(index, 1)
    }

    /**
     * 修改当前播放的歌曲
     * @param index
     * @param isOnMounted
     * @returns
     */
    const setThisMusic = async (index: number, isOnMounted = false) => {
      try {
        console.log(index, isOnMounted, playingIndex.value, playList.value)
        const length = playList.value.length
        if (!index) index = 0
        //播放序号超出播放列表长度
        if (index > length || length === 0) {
          //网站加载时
          console.log("playList.value", playList.value)

          if (isOnMounted && length === 0) {
            playList.value = defaultPlayList.value
            index = 0
          } else if (length === 0) return ElMessage.info("播放列表为空！")
          else {
            ElMessage.info("目标歌曲不存在，已切换播放")
            index = length - 1
          }
        }

        playingIndex.value = index
        thisMusic.value = playList.value[playingIndex.value]
        console.log("设置当前播放歌曲:", playingIndex.value, thisMusic.value)
      } catch (err) {
        console.error("setThisMusic出错了:")
        console.error(err)
      }
    }

    //清空播放列表
    const clearPlayList = () => {
      playList.value = defaultPlayList.value
      // playingIndex.value = 0
    }

    /**
     * 给歌单信息列表赋新值,并根据id降序排列(从新到旧)
     * @param idList -歌单的新值
     * @param flag 公开/用户/用户收藏的歌单
     */
    const setMusicIdList: (idList: number[], flag: "public" | "my" | "connect") => void = (idList, flag = "public") => {
      let tempList = idList
      //歌单按id降序排列(从新到旧)
      if (idList.length > 1) tempList = idList.sort((a, b) => b - a)

      //直接赋值
      if (flag === "public") publicMusicIdList.value = tempList
      else if (flag === "my") myMusicIdList.value = tempList
      //else if (flag === 'connect')
    }

    /**
     * 添加、删除歌单列表中的id并降序排列(从新到旧)，然后更新歌单列表
     * @param idList 要添加或删除的id列表
     * @param isAdd 添加/删除
     * @param flag 公开/用户/用户收藏的歌单
     */
    const updateMusicIdList: (idList: number[], isAdd: boolean, flag: "public" | "my" | "connect") => void = (
      idList,
      isAdd = true,
      flag = "public"
    ) => {
      let tempList = publicMusicIdList.value //公开的
      if (flag === "my") tempList = myMusicIdList.value //用户的
      // else if (flag = 'connect') tempList = //用户收藏的

      const tempSet = new Set(tempList)

      if (isAdd)
        //添加
        idList.forEach(id => tempSet.add(id)) // 删除
      else idList.forEach(id => tempSet.delete(id))

      // console.log('updateMusicIdList', flag, [...tempSet]);

      setMusicIdList([...tempSet], flag)
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
      publicMusicListInfo,
      myMusicListInfo,
      connectionObj,
      musicListInfoObj,
      musicListObj,
      addMusicList,
      deleteMusicFromPlayList,
      clearPlayList,
      setMusicIdList,
      updateMusicIdList,
      setThisMusic,
    }
  },
  {
    persist: [
      {
        pick: ["playList", "playingIndex", "playListIndex", "musicListInfo", "musicList", "myMusicidList", "connectionObj"],
        storage: localStorage,
      },
    ],
  }
)
