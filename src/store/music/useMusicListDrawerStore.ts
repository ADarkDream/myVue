// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive, ref, toRefs } from "vue";

import { useUserInfoStore } from '../user/useUserInfoStore';
import type { MusicListInfo } from '@/types/music';



// 定义并暴露一个store
export const useMusicListDrawerStore = defineStore('music_list_drawer', () => {
    const userInfoStore = useUserInfoStore()
    const { isLogin, uid } = toRefs(userInfoStore)


    /**
     * 要是否显示搜索面板
     */
    const isShowMusicListDrawer = ref(false)


    /**
     * 要收藏或要删除的数据库音乐id数组(选中状态的id数组)
     */
    const music_id_list = ref<number[]>([])

    /**
     * 是否显示编辑歌单信息的抽屉
     */
    const isShowEditMusicListInfoDrawer = ref(false)

    /**
     * 创建歌单或编辑歌单信息的标记
     */
    const isCreateFlag = ref(true)

    const formData = ref<MusicListInfo>({
        music_list_id: 0,
        name: '',
        uid: uid.value!,
        pic_url: '',
        default_cover_url: '',
        description: '',
        status: 1,
        songsCount: 0,
        created_time: new Date(),
        updated_time: new Date()
    })

    /**
     * 重置formData
     */
    const reSetFormData = () => {
        formData.value = {
            music_list_id: 0,
            name: '',
            uid: uid.value!,
            pic_url: '',
            default_cover_url: '',
            description: '',
            status: 1,
            songsCount: 0,
            created_time: new Date(),
            updated_time: new Date()
        }
    }

    return { isShowMusicListDrawer, music_id_list, isShowEditMusicListInfoDrawer, isCreateFlag, formData, reSetFormData }
})
