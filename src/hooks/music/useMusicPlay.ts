//音乐播放相关的方法
import axios from "axios";
import {ResultData} from "@/types/global";
import {CloudSongInfo, MusicListInfo} from "@/types/music";

export default function () {
//如果音乐有id没src，则要通过id获取最新的src，然后重新赋值
    const getMusicUrl = async (song: CloudSongInfo) => {
        try {
            //获取播放链接
            const result = await axios<ResultData<{ playInfo: { cloud_music_id: number, src: string } }>>({
                url: '/getPlayInfo',
                params: {cloud_music_id: song.cloud_music_id, fee: song.fee},
            })
            console.log('获取播放链接信息：', result)
            const {data} = result.data
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
    }

//根据网易云音乐id数组，批量获取音乐信息(不含播放链接和歌词)
    const getCloudMusic = async (idList: number[]) => {
        try {
            const result = await axios<ResultData<{ songsInfo: CloudSongInfo[], errorIdList: string[] }>>({
                url: '/getCloudMusic',
                params: {idList},
            })
            console.log(result)
            const {data} = result.data
            console.log('获取的音乐信息：', data)
            return data as { songsInfo: CloudSongInfo[], errorIdList: string[] }
        } catch (error) {
            console.error('发生错误：')
            console.error(error)
        }
    }


    return {getMusicUrl, getCloudMusic}
}
