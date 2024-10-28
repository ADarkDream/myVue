//音乐播放相关的方法
import axios from "axios";
import { ElMessage } from "element-plus";
//hooks
import useFunction from "@/hooks/useFunction";
//types
import type { ResultData } from "@/types/global";
import type { CloudSongInfo } from "@/types/music";

const { copyText } = useFunction()

const musicPlay = {
    //如果音乐有id没src，则要通过id获取最新的src，然后重新赋值
    getMusicUrl: async (song: CloudSongInfo) => {
        try {
            const { id, cloud_music_id, fee, status } = song
            //获取播放链接
            const result = await axios<ResultData<{ playInfo: { cloud_music_id: number, src: string } }>>({
                url: '/getPlayInfo',
                params: { id, cloud_music_id, fee, status },
            })
            console.log('获取播放链接信息：', result)
            const { data } = result.data
            if (data) {
                //合并歌曲信息和播放地址信息
                const newSong = Object.assign(song, data.playInfo)
                console.log('newSong', newSong)
                return newSong
            }
        } catch (err) {
            console.error('获取播放链接出错')
            console.error(err)
        }
    },

    //根据网易云音乐id数组，批量获取音乐信息(不含播放链接和歌词)
    getCloudMusic: async (idList: number[]) => {
        try {
            const result = await axios<ResultData<{ songsInfo: CloudSongInfo[], errorIdList: string[] }>>({
                url: '/getCloudMusic',
                params: { idList },
            })
            // console.log(result)
            const { status, data, msg } = result.data
            console.log('获取的音乐信息：', data)
            if (status === 200 || status === 300) {
                if (data?.songsInfo) return { status: 1, data: data as { songsInfo: CloudSongInfo[], errorIdList: string[] }, msg }
                return { status: 0, msg }
            }

            return { status: 0, msg: '未知错误' }
        } catch (error) {
            console.error('发生错误：')
            console.error(error)
            return { status: 0, msg: '发生错误' }
        }
    },

    //根据数据库音乐id数组，批量获取音乐信息(不含播放链接和歌词)
    getPlayList: async (musicIdList: number[]) => {
        try {
            const result = await axios<ResultData<{ songsInfo: CloudSongInfo[] }>>({
                url: '/getPlayList',
                params: { musicIdList },
            })
            // console.log(result)
            const { status, data, msg } = result.data
            console.log('获取的音乐信息：', data)
            if (status === 200 || status === 300) {
                if (data?.songsInfo) return { status: 1, data: data as { songsInfo: CloudSongInfo[], errorIdList: string[] }, msg }
                return { status: 0, msg }
            }

            return { status: 0, msg: '未知错误' }
        } catch (error) {
            console.error('发生错误：')
            console.error(error)
            return { status: 0, msg: '发生错误' }
        }
    },
    //分享音乐链接
    shareMusicLink: (songInfo: CloudSongInfo) => {
        if (songInfo.cloud_music_id) {
            copyText('https://muxidream.cn/music?c_id=' + songInfo.cloud_music_id, '播放链接')
        } else if (songInfo.id) {
            copyText('https://muxidream.cn/music?id=' + songInfo.id, '播放链接')
        } else ElMessage.info('歌曲信息错误')
    }
}
export default musicPlay