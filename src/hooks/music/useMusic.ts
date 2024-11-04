//音乐
import { ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useMusicListDrawerStore } from '@/store/music/useMusicListDrawerStore'
import type { MusicListInfo } from "@/types/music";
import { json } from "stream/consumers";


export default function () {
    const musicListDrawerStore = useMusicListDrawerStore()
    const userInfoStore = useUserInfoStore()
    const { isLogin, uid } = toRefs(userInfoStore)
    const { isShowMusicListDrawer, isShowEditMusicListInfoDrawer, music_id_list, isCreateFlag, formData } = toRefs(musicListDrawerStore)
    const { reSetFormData } = musicListDrawerStore
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

    /**
  * 打开创建歌单的抽屉
  * @param is_create 创建歌单或编辑歌单信息
  */
    const showEditMusicListInfoDrawer = (is_create: boolean, music_list_info?: MusicListInfo) => {
        if (isLogin.value) {
            //如果是修改歌单信息
            if (!is_create && music_list_info) {
                //深拷贝(否则上传歌单封面会直接修改本地歌单封面)
                const tempData = JSON.stringify(music_list_info)
                formData.value = JSON.parse(tempData)
            }
            else reSetFormData()
            isCreateFlag.value = is_create
            isShowEditMusicListInfoDrawer.value = true
        }
        else ElMessage.info('请先登录')
    }




    return { formData, showMusicListDrawer, showEditMusicListInfoDrawer }
}

