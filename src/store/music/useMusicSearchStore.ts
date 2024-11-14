// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive, ref } from "vue";
import type { CloudSongInfo, Album, MusicList, SearchResult } from "@/types/music";
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
    const searchResult = ref<CloudSongInfo[] | Album[]>([])
    //搜索结果条数
    const totalNum = ref(0)
    //当前显示的结果的类型
    const searchResultType = ref(1)

    //获得搜索热词
    const getHotWords = async () => {
        if (hotWords.value.length !== 0) return //已获取热词
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


    //搜索函数
    const search = async () => {
        try {
            const result = await axios<ResultData<SearchResult<CloudSongInfo | Album>>>({
                url: '/searchCloudMusic',
                params: searchConfig
            })
            const { data } = result.data
            if (!data) return
            const { type } = searchConfig
            if (type === 1) {//单曲列表
                searchResultType.value = 1
                searchResult.value = data.list //as CloudSongInfo[]
                totalNum.value = data.totalNum
            } else if (type === 10) {//专辑列表
                searchResultType.value = 10
                searchResult.value = data.list
                totalNum.value = data.totalNum
            }


            return data
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }


    return { isShowSearchPanel, hotWords, searchConfig, searchResult, searchResultType, totalNum, search, getHotWords }
})
