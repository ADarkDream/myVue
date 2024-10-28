//搜索并存储歌单及音乐信息
import { toRefs } from "vue";
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useMusicListDrawerStore } from "@/store/music/useMusicListDrawerStore";
//utils
import musicListUtils from '@/utils/music/musicList'
//types
import type { QueryCloudMusicList, QueryMusicLists, MusicList, QueryMusicList } from "@/types/music";
import axios from "axios";
import { ElMessage } from "element-plus";

export default function () {
    const musicListStore = useMusicListStore()
    const musicListDrawerStore = useMusicListDrawerStore()
    const { musicList, musicListInfo, myMusicIdList, musicListObj, musicListInfoObj, connectionObj } = toRefs(musicListStore)
    const { isShowMusicListDrawer, music_id_list } = toRefs(musicListDrawerStore)
    //根据用户uid或歌单id，获取单个或多个歌单信息的信息
    const getMusicListsInfo = async ({ is_login, user_id, music_list_id }: QueryMusicLists, latest = false) => {
        //如果查询单个歌单，且歌单对象中有这个歌单的信息，且不要最新的(用缓存)
        if (!latest && music_list_id && Object.keys(musicListInfoObj).includes(music_list_id.toString())) {
            console.log(`已加载本地缓存的歌单${music_list_id}的信息`)
            return { status: 1, list: [musicListInfoObj.value[music_list_id]], msg: `已加载本地缓存的歌单${music_list_id}的信息` }
        }

        //查询多个歌单，或查询最新的情况(不要缓存)下
        const { status, list, msg } = await musicListUtils.getMusicListsInfo({ is_login, user_id, music_list_id })
        //处理请求后的信息
        if (status === 1) list?.forEach(MusicListInfo => {
            const { music_list_id, cloud_music_list_id } = MusicListInfo
            //添加两个歌单的id键值对信息
            connectionObj.value[music_list_id] = cloud_music_list_id!
            //向信息对象中添加
            musicListInfoObj.value[music_list_id.toString()] = MusicListInfo
            //如果是用户的歌单
            if (is_login)
                myMusicIdList.value.push(music_list_id)
        })
        return { status, list, msg }
    }


    //搜索数据库的歌单及音乐信息
    const getMusicList = async ({ music_list_id, limit, offset, is_login }: QueryMusicList) => {
        let localInfo = false
        let localList = false
        //如果歌单对象中有这个歌单的信息
        if (Object.keys(musicListInfoObj.value).includes(music_list_id.toString())) {
            musicListInfo.value = musicListInfoObj.value[music_list_id.toString()]
            localInfo = true
            console.log(`已加载本地缓存的歌单${music_list_id}的信息`)
        }
        if (Object.keys(musicListObj.value).includes(music_list_id.toString())) {
            musicList.value = musicListObj.value[music_list_id.toString()]
            localList = true
            console.log(`已加载本地缓存的歌单${music_list_id}的音乐列表`)
        }
        console.log(musicListInfoObj.value, music_list_id);

        if (localInfo && localList) return
        console.log(`本地缓存没有歌单${music_list_id}的信息,查询服务器`)
        const data = await musicListUtils.getMusicList({ music_list_id, limit, offset, is_login })
        //处理请求后的信息
        if (data) save_music_info(data, music_list_id)
    }

    //搜索网易云的歌单及音乐信息
    const getCloudMusicList = async ({ cloud_music_list_id, limit, offset, latest }: QueryCloudMusicList) => {
        const { status, data, msg } = await musicListUtils.getCloudMusicList({ cloud_music_list_id, limit, offset, latest }) as { status: number, data?: MusicList, msg: string }
        //处理请求后的信息
        if (status === 1 && data) {
            const music_list_id = data.musicListInfo.music_list_id
            save_music_info(data, music_list_id)
        }
        return { status, msg }
    }

    //处理请求后的歌单信息或歌曲列表，存入对象，更新当前
    const save_music_info = ({ musicListInfo: ml_info, songsInfo }: MusicList, music_list_id: number) => {
        //如果存在
        if (ml_info && music_list_id) {
            //添加两个歌单的id键值对信息
            connectionObj.value[music_list_id] = ml_info.cloud_music_list_id!
            //向信息对象中添加
            musicListInfoObj.value[music_list_id.toString()] = ml_info

            //更新当前
            musicListInfo.value = ml_info
        }
        if (songsInfo) {
            //向信息对象中添加
            musicListObj.value[music_list_id.toString()] = songsInfo
            //更新当前
            musicList.value = songsInfo
        }
    }

    /**
     * 收藏歌曲
     * @param music_list_id -数据库的歌单id
     */
    const connectMusicToList = async (music_list_id: number) => {
        const { status } = await musicListUtils.connectMusicToList(music_id_list.value, music_list_id)
        if (status === 200) {
            ElMessage.success('添加成功')
            isShowMusicListDrawer.value = false//关闭歌单列表
        } else if (status === 300) return// ElMessage.info(msg)
        else ElMessage.error('添加失败')
    }

    return { getMusicListsInfo, getMusicList, getCloudMusicList, connectMusicToList }
}

