//音乐
import { toRefs } from "vue";
import { ElMessage } from "element-plus";
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useMusicListDrawerStore } from '@/store/music/useMusicListDrawerStore'


export default function () {
    const musicListDrawerStore = useMusicListDrawerStore()
    const userInfoStore = useUserInfoStore()
    const { isLogin } = toRefs(userInfoStore)
    const { isShowMusicListDrawer, music_id_list } = toRefs(musicListDrawerStore)
    /**
     * 显示歌单列表的抽屉
     */
    const showMusicListDrawer = (musicIdList: number[]) => {
        if (isLogin.value) {
            isShowMusicListDrawer.value = true
            music_id_list.value = musicIdList
        } else {
            ElMessage.info('请先登录')
        }
    }

    return { showMusicListDrawer }
}

