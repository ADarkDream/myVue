//搜索数据库的歌单及音乐信息
import axios from "axios";
import { ElMessage } from "element-plus";
import type { ResultData } from "@/types/global";
import type { MusicListInfo, QueryCloudMusicList, MusicList, QueryMusicList, QueryMusicLists } from "@/types/music";

const musicList = {
    //搜索数据库歌单的歌
    getMusicList: async ({ music_list_id, limit, offset }: QueryMusicList) => {
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
    },
    //搜索网易云的歌单及音乐信息
    getCloudMusicList: async ({ cloud_music_list_id, limit, offset, latest }: QueryCloudMusicList) => {
        try {
            const result = await axios<ResultData<MusicList>>({
                url: '/getCloudMusicList',
                params: { cloud_music_list_id, limit, offset, latest },
            })
            console.log('搜索网易云的歌单及音乐信息', result.data)
            const { status, msg, data } = result.data
            if (status === 200) {
                return { status: 1, data: data! }
            } else if (status === 300)
                return { status: 0, msg }
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
            return { status: 0, msg: error }
        }
    },
    // 用户获取歌单列表的信息,有user_id查询该用户的所有歌单，有music_list_id查询单个歌单，如果不是自己则只能查公开歌单
    getMusicListsInfo: async ({ isLogin, user_id, music_list_id }: QueryMusicLists) => {
        try {
            const result = await axios<ResultData<{ music_lists: MusicListInfo[] }>>({
                url: isLogin ? '/getUserMusicListsInfo' : '/getMusicListsInfo',
                params: {
                    user_id, music_list_id
                }
            })
            console.log(result.data)
            const { status, msg, data } = result.data
            //查询无结果
            if (status === 300) return { status: 2, msg }
            //查询成功
            return { status: 1, list: data!.music_lists, msg }
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
            return { status: 0, msg: '查询歌单信息失败' }
        }
    },
    //用户创建歌单
    createMusicList: async (formData: { name: string, pic_url: string, status: number }) => {
        if (!formData.name) return ElMessage.info('歌单名称不能为空')
        try {
            const result = await axios({
                url: '/addMusicList',
                method: 'post',
                data: formData
            })
            console.log(result.data)
            return result.data
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }
}
export default musicList
