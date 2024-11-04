//搜索并存储歌单及音乐信息
import { toRefs } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useMusicListDrawerStore } from "@/store/music/useMusicListDrawerStore";
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
//utils
import musicListUtils from '@/utils/music/musicList'
//types
import type { QueryCloudMusicList, QueryMusicLists, MusicList, QueryMusicList, CreateMusicListInfo, MusicListInfo } from "@/types/music";

export default function () {
    const musicListStore = useMusicListStore()
    const musicListDrawerStore = useMusicListDrawerStore()
    const userInfoStore = useUserInfoStore()
    const { musicList, musicListInfo, musicListObj, musicListInfoObj, connectionObj } = toRefs(musicListStore)
    const { updateMusicIdList } = musicListStore
    const { isShowMusicListDrawer, isShowEditMusicListInfoDrawer, music_id_list } = toRefs(musicListDrawerStore)
    const { uid } = toRefs(userInfoStore)

    //根据用户uid或歌单id，获取单个或多个歌单信息的信息
    const getMusicListsInfo = async ({ is_login, user_id, music_list_id }: QueryMusicLists, latest = false) => {
        //如果查询单个歌单，且歌单对象中有这个歌单的信息，且不要最新的(用缓存)
        if (!latest && music_list_id && Object.keys(musicListInfoObj).includes(music_list_id.toString())) {
            console.log(`已加载本地缓存的歌单${music_list_id}的信息`)
            return { status: 1, list: [musicListInfoObj.value[music_list_id]], msg: `已加载本地缓存的歌单${music_list_id}的信息` }
        }

        //查询多个歌单，或查询最新的情况(不要缓存)下
        const { status, list, msg } = await musicListUtils.getMusicListsInfo({ is_login, user_id, music_list_id })
        //处理请求后的信息
        if (status === 1) {
            const newIdList: number[] = []
            list?.forEach(MusicListInfo => {
                const { music_list_id, cloud_music_list_id } = MusicListInfo
                //添加两个歌单的id键值对信息
                connectionObj.value[music_list_id] = cloud_music_list_id!
                //向信息对象中添加
                musicListInfoObj.value[music_list_id.toString()] = MusicListInfo
                //收集获取的歌单id
                newIdList.push(music_list_id)
            }
            )

            if (newIdList.length === 0) console.log('');
            //如果是用户的歌单
            //todo 应该用uid判断?
            else if (is_login) {//新增用户的歌单
                updateMusicIdList(newIdList, true, 'my')
            } else {//公开的歌单
                updateMusicIdList(newIdList, true, 'public')
            }
            //todo还差用户收藏的歌单 
        }
        return { status, list, msg }
    }


    //搜索数据库的歌单及音乐信息
    const getMusicList = async ({ music_list_id, limit, offset, is_login }: QueryMusicList, latest = false) => {
        let localInfo = false
        let localList = false
        //如果歌单对象中有这个歌单的信息
        if (!latest && Object.keys(musicListInfoObj.value).includes(music_list_id.toString())) {
            musicListInfo.value = musicListInfoObj.value[music_list_id.toString()]
            localInfo = true
            console.log(`已加载本地缓存的歌单${music_list_id}的信息`)
        }
        if (!latest && Object.keys(musicListObj.value).includes(music_list_id.toString())) {
            musicList.value = musicListObj.value[music_list_id.toString()]
            localList = true
            console.log(`已加载本地缓存的歌单${music_list_id}的音乐列表`)
        }
        console.log(musicListInfoObj.value, music_list_id);

        if (localInfo && localList) return { status: 1, msg: '已获取本地缓存数据' }
        console.log(`本地缓存没有歌单${music_list_id}的信息,查询服务器`)
        const { status, msg, data } = await musicListUtils.getMusicList({ music_list_id, limit, offset, is_login })
        //处理请求后的信息
        if (status === 1 && data) save_music_info(data, music_list_id)
        return { status, msg }
    }

    //搜索网易云的歌单及音乐信息
    const getCloudMusicList = async ({ cloud_music_list_id, limit, offset, latest }: QueryCloudMusicList) => {
        const { status, data, msg } = await musicListUtils.getCloudMusicList({ cloud_music_list_id, limit, offset, latest }) as { status: number, data?: MusicList, msg: string }
        //处理请求后的信息
        if (status === 1 && data) {
            const music_list_id = data.musicListInfo.music_list_id
            save_music_info(data, music_list_id)
        }
        return { status, msg }
    }

    //处理请求后的歌单信息或歌曲列表，存入对象，更新当前
    const save_music_info = ({ musicListInfo: ml_info, songsInfo }: MusicList, music_list_id: number) => {
        //如果存在
        if (ml_info && music_list_id) {
            //添加两个歌单的id键值对信息
            connectionObj.value[music_list_id] = ml_info.cloud_music_list_id!
            //向信息对象中添加
            musicListInfoObj.value[music_list_id.toString()] = ml_info

            //更新当前
            musicListInfo.value = ml_info
        }
        if (songsInfo) {
            //向信息对象中添加
            musicListObj.value[music_list_id.toString()] = songsInfo
            //更新当前
            musicList.value = songsInfo
        }
    }

    /**
     * 收藏歌曲
     * @param music_list_id -数据库的歌单id
     */
    const connectMusicToList = async (music_list_id: number) => {
        const { status } = await musicListUtils.connectMusicToList(music_id_list.value, music_list_id)
        if (status === 200) {
            ElMessage.success('添加成功')
            isShowMusicListDrawer.value = false//关闭歌单列表
            //更新歌单信息
            //向信息对象中添加
            getMusicListsInfo({ is_login: true, user_id: uid.value, music_list_id }, true)
            // musicListInfoObj.value[music_list_id.toString()] = MusicListInfo

        } else if (status === 300) return// ElMessage.info(msg)
        else ElMessage.error('添加失败')
    }


    /**
    * 删除歌曲
    * @param music_list_id -数据库的歌单id
    */
    const deleteMusicFromList = async (music_list_id: number, index: number) => {
        const { status } = await musicListUtils.deleteMusicFromList(music_id_list.value, music_list_id)
        if (status === 1) {
            ElMessage.success('删除成功')
            //todo 关闭选中状态

            //更新歌单信息
            if (musicListInfo.value) {
                //更新歌曲数量
                const newSongCount = musicListInfo.value.songsCount - music_id_list.value.length
                musicListInfo.value.songsCount = newSongCount

                musicListInfoObj.value[music_list_id.toString()] = musicListInfo.value
                //更新歌单数据
                const newMusicList = musicList.value.filter(songInfo => {
                    return !music_id_list.value.includes(songInfo.id)
                })
                musicList.value = newMusicList
                musicListObj.value[music_list_id.toString()] = newMusicList
            }
        }
        else ElMessage.error('删除失败')
    }

    /**
     * 创建歌单
     */
    const createMusicList = async (formData: MusicListInfo) => {
        try {
            const { status, msg, music_list_info } = await musicListUtils.createMusicList(formData)
            if (status === 1 && music_list_info) {
                const { music_list_id } = music_list_info
                ElMessage.success(msg)
                musicListInfoObj.value[music_list_id] = music_list_info
                updateMusicIdList([music_list_id], true, 'my')
                if (formData.status === 2) //如果是公开歌单，则同步增加
                    updateMusicIdList([music_list_id], true, 'public')
                isShowEditMusicListInfoDrawer.value = false
            } else ElMessage.error(msg)
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }

    /**
      * 修改歌单信息
      */
    const updateMusicList = async (formData: MusicListInfo) => {
        try {
            const { status } = await musicListUtils.updateMyMusicListInfo(formData)
            if (status === 1) {//修改成功
                const { music_list_id } = formData
                const music_list_info = musicListInfoObj.value[music_list_id]
                const old_status = music_list_info.status
                const new_status = formData.status
                console.log('修改了歌单权限')
                if (old_status !== new_status) {//修改了歌单权限
                    updateMusicIdList([music_list_id], new_status === 2, 'public')
                }
                //添加新的歌单信息
                musicListInfoObj.value[music_list_id] = Object.assign(music_list_info, formData)
                //关闭修改抽屉
                isShowEditMusicListInfoDrawer.value = false
            }
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    }

    /**
     * 删除歌单(status=0)
     * @param musicListInfo 
     * @returns {{status:0|1}}
     */
    const deleteMusicList = async (musicListInfo: MusicListInfo) => {
        try {
            const { name, music_list_id } = musicListInfo
            const confirmResult = await ElMessageBox.confirm(
                '确认删除歌单《' + name + '》吗?',
                'Warning',
                {
                    confirmButtonText: '确认删除',
                    cancelButtonText: '取消删除',
                    type: 'warning',
                    showClose: false
                }
            )
            if (confirmResult === 'confirm') {
                // 用户点击了确认按钮，执行删除操作  
                const result = await musicListUtils.updateMyMusicListInfo({ music_list_id, status: 0 })
                if (result.status === 1) {
                    delete connectionObj.value[music_list_id]
                    delete musicListObj.value[music_list_id.toString()]
                    delete musicListInfoObj.value[music_list_id]
                }
                return { status: result.status }
            } else if (confirmResult === 'cancel') {
                // 用户点击了取消按钮，不做任何操作  
                return { status: 0 }
            }
            return { status: 0 }
        } catch (err) {
            console.error('deleteMusicList出错了:')
            console.error(err)
            return { status: 0 }
        }
    }





    return { getMusicListsInfo, getMusicList, getCloudMusicList, connectMusicToList, deleteMusicFromList, createMusicList, updateMusicList, deleteMusicList }
}

