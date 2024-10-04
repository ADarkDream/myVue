// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {reactive, ref} from "vue";
import {CloudSongInfo, SearchResult} from "@/types/music";
import axios from "axios";
import {ResultData} from "@/types/global";


// 定义并暴露一个store
export const useMusicSearchStore = defineStore('music_search', () => {
//搜索参数
    const searchConfig = reactive(
        {
            s: '',//搜索关键词
            type:1,// 1: 单曲(默认), 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
            limit: 10,//限制条数
            offset: 0//偏移量，是5则去掉前5条，是limit的N倍数则为第N页
        })
    //搜索结果
    const searchResult = ref<CloudSongInfo[]>([])
    //搜索结果条数
    const songCount = ref(0)


    //搜索函数
    const search = async () => {
        try {
            const result = await axios<ResultData<SearchResult>>({
                url: '/searchCloudMusic',
                params: searchConfig
            })
            const {data} = result.data
            if (data) {
                searchResult.value = data.songs
                songCount.value = data.songCount
                return data
            }
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }


    return {searchConfig, searchResult, songCount, search}
})
