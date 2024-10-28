// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive, ref } from "vue";
import type { CloudSongInfo, MusicList, SearchResult } from "@/types/music";
import axios from "axios";
import type { ResultData } from "@/types/global";


// 定义并暴露一个store
export const useMusicListDrawerStore = defineStore('music_list_drawer', () => {
    //是否显示搜索面板
    const isShowMusicListDrawer = ref(false)
    //要收藏的数据库音乐id数组
    const music_id_list = ref<number[]>([])

    return { isShowMusicListDrawer, music_id_list }
})
