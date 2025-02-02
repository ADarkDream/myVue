//音乐播放相关的方法
import momo from "@/apis"
import { ElMessage } from "element-plus";
//utils
import myFunction from "@/utils/myFunction";
import regex from "@/utils/regexRules";
//apis
import { api_getRedirectUrl } from "@/apis/tool";
//types
import type { CloudSongInfo } from "@/types/music";

const { copyText } = myFunction

const musicPlay = {
    //如果音乐有id没src，则要通过id获取最新的src，然后重新赋值
    getMusicUrl: async (song: CloudSongInfo) => {
        try {
            const { id, cloud_music_id, fee, status } = song
            //获取播放链接
            const result = await momo.get<{ playInfo: { id: number, cloud_music_id: number, src: string } }>('/getPlayInfo',
                { id, cloud_music_id, fee, status },
            )
            console.log('获取播放链接信息：', result)
            const { data } = result
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
            const result = await momo.get<{ songsInfo: CloudSongInfo[], errorIdList: string[] }>('/getCloudMusic', { idList },)
            // console.log(result)
            const { code, data, msg } = result
            console.log('获取的音乐信息：', data)
            if (code === 200 || code === 300) {
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
            const result = await momo.get<{ songsInfo: CloudSongInfo[] }>('/getPlayList', { musicIdList })
            // console.log(result)
            const { code, data, msg } = result
            console.log('获取的音乐信息：', data)
            if (code === 200 || code === 300) {
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
    },
    /**校验分享链接或歌单、歌曲id并返回*/
    getMusicIdByLink: async (str: string, isSong: boolean) => {
        //将输入的文字中的链接匹配出来
        str = str.toString().match(regex.url) ? str.match(regex.url)![0] : ''

        let id = 0

        if (regex.url.test(str)) {//是网址
            const reg = isSong ? regex.song : regex.palylist

            //如果是歌曲链接，判断是否是短连接(重定向获取真实链接)
            console.log("aaa", isSong, regex.song_short.test(str));

            if (isSong && regex.song_short.test(str)) {
                const result = await api_getRedirectUrl(str)
                const { code, msg, data } = result
                if (code === 200 && data) str = data.redirectUrl
                else {
                    console.error(msg)
                    return id
                }
            }
            console.log('str', str);

            const match = str.match(reg)
            if (match) {//如果匹配
                id = Number(match[1])
            }
        } else {
            id = Number(str)
        }

        return id
    }
}
export default musicPlay