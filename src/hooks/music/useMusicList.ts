//搜索数据库的歌单及音乐信息
import axios from "axios";
import type { ResultData } from "@/types/global";
import type { CloudSongInfo, MusicListInfo, QueryCloudMusicList, MusicList, QueryMusicList } from "@/types/music";

export default function () {
    //搜索数据库歌单的歌
    const getMusicList = async ({ music_list_id, limit = 50, offset }: QueryMusicList) => {
        try {
            const result = await axios<ResultData<MusicList>>({
                url: '/getMusicList',
                params: { music_list_id, limit, offset },
            })
            console.log('搜索数据库歌单的歌', result.data)
            const { status, msg, data } = result.data
            return data as MusicList
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }

    //搜索网易云的歌单及音乐信息
    const getCloudMusicList = async ({ cloud_music_list_id, limit, offset, latest }: QueryCloudMusicList) => {
        try {
            const result = await axios<ResultData<MusicList>>({
                url: '/getCloudMusicList',
                params: { cloud_music_list_id, limit, offset, latest },
            })
            console.log('搜索网易云的歌单及音乐信息', result.data)
            const { status, msg, data } = result.data
            return data as MusicList
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }

    return { getMusicList, getCloudMusicList }
}

