// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive, ref } from "vue";
import type { CloudSongInfo, MusicList, SearchResult } from "@/types/music";
import axios from "axios";
import type { ResultData } from "@/types/global";


// 定义并暴露一个store
export const useMusicSearchStore = defineStore('music_search', () => {
    //是否显示搜索面板
    const isShowSearchPanel = ref(false)
    const hotWords = ref<string[]>([])

    //搜索参数
    const searchConfig = reactive(
        {
            s: '',//搜索关键词
            type: 1,// 1: 单曲(默认), 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
            limit: 20,//限制条数
            offset: 0//偏移量，是5则去掉前5条，是limit的N倍数则为第N页
        })

    //搜索结果
    const searchResult = ref<CloudSongInfo[]>([])
    //搜索结果条数
    const songCount = ref(0)

    //获得搜索热词
    const getHotWords = async () => {
        try {
            const result = await axios<ResultData<{ hots: string[] }>>({
                url: '/music_api/search/hot',
            })
            console.log(result)
            const { status, msg, data } = result.data
            hotWords.value = data!.hots
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }
    getHotWords()

    //搜索函数
    const search = async () => {
        try {
            const result = await axios<ResultData<{ musicList: SearchResult }>>({
                url: '/searchCloudMusic',
                params: searchConfig
            })
            const { data } = result.data
            if (data) {
                searchResult.value = data.musicList.songs
                songCount.value = data.musicList.songCount
                return data.musicList
            }
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }


    return { isShowSearchPanel, hotWords, searchConfig, searchResult, songCount, search, getHotWords }
})
