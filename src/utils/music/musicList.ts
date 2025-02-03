//搜索数据库的歌单及音乐信息
import momo from "@/apis"
import { ElMessage } from "element-plus"
import type {
  MusicListInfo,
  QueryCloudMusicList,
  MusicList,
  QueryMusicList,
  QueryMusicLists,
  CloudSongInfo,
  CreateMusicListInfo,
} from "@/types/music"

const musicList = {
  /**
   * 检查id数组是否合规
   * @param idList
   * @returns 布尔值
   */
  checkIdList: (idList: number[]) => {
    if (idList.length === 0) {
      ElMessage.error("请求的idList不能为空")
      return false
    }
    idList.forEach(id => {
      // 尝试将id转换为数字
      const num = Number(id)
      // 检查是否成功转换为数字，并且是一个正整数
      if (isNaN(num) || !Number.isInteger(num) || num < 0) {
        console.log("idList的id:" + id + "不是有效id")
        ElMessage.error("含有不合法的id,id应为纯数字")
        return false
      }
    })
    return true
  },
  /**
   * 获取用户上传的公开音乐列表
   * @returns songsInfo[]
   */
  getCustomMusicList: async () => {
    try {
      const result = await momo.get<{ songsInfo: CloudSongInfo[] }>("/getCustomMusicList")
      console.log("/getCustomMusicList返回的数据为：", result)
      const { code, msg, data } = result
      if (code === 200 && data) return data.songsInfo as CloudSongInfo[]
    } catch (err) {
      console.error("出错了:")
      console.error(err)
    }
  },
  /**
   * 搜索数据库歌单的歌
   * @param music_list_id,数据库歌单id
   * @param limit,限制返回歌曲条数
   * @param offset,偏移量
   * @param is_login -是否登录，切换接口
   * @returns
   */
  getMusicList: async ({ music_list_id, limit, offset, is_login }: QueryMusicList) => {
    try {
      const result = await momo.get<MusicList>(is_login ? "/getMyMusicList" : "/getMusicList", { music_list_id, limit, offset })
      console.log("搜索数据库歌单的歌", result)
      const { code, msg, data } = result
      if ((code === 200 || code === 300) && data) return { status: 1, msg, data: data }
      else return { status: 0, msg }
    } catch (error) {
      console.log("发生错误：")
      console.dir(error)
      return { status: 0, msg: error as string }
    }
  },

  /**
   * 搜索网易云的歌单及音乐信息
   * @param cloud_music_list_id,网易云歌单id
   * @param limit,限制返回歌曲条数
   * @param offset,偏移量
   * @param latest -是否获取最新数据
   * @returns
   */
  getCloudMusicList: async ({ cloud_music_list_id, limit, offset, latest }: QueryCloudMusicList) => {
    try {
      const result = await momo.get<MusicList>("/getCloudMusicList", { cloud_music_list_id, limit, offset, latest })
      console.log("搜索网易云的歌单及音乐信息", result)
      const { code, msg, data } = result
      if (code === 200 && data) {
        return { status: 1, data: data }
      } // else if (code === 300)
      //    return { status: 0, msg }
      else return { status: 0, msg }
    } catch (error) {
      console.log("发生错误：")
      console.dir(error)
      return { status: 0, msg: error as string }
    }
  },
  // 用户获取歌单列表的信息,有user_id查询该用户的所有歌单，有music_list_id查询单个歌单，如果不是自己则只能查公开歌单
  getMusicListsInfo: async ({ is_login, user_id, music_list_id }: QueryMusicLists) => {
    try {
      const result = await momo.get<{ music_lists: MusicListInfo[] }>(
        is_login ? "/getUserMusicListsInfo" : "/getMusicListsInfo",
        { user_id, music_list_id }
      )
      console.log(result)
      const { code, msg, data } = result
      //查询无结果
      if (code === 300) return { status: 2, msg }
      //查询成功
      return { status: 1, list: data!.music_lists, msg }
    } catch (error) {
      console.log("发生错误：")
      console.dir(error)
      return { status: 0, msg: "查询歌单信息失败" }
    }
  },

  /**
   * 用户创建歌单
   * @param formData
   * @returns
   */
  createMusicList: async (formData: MusicListInfo) => {
    try {
      const result = await momo.post<{ music_list_info: MusicListInfo }>("/addMusicList", formData)
      console.log(result)
      const { code, msg, data } = result
      if (code === 200 && data) return { status: 1, msg, music_list_info: data.music_list_info }
      return { status: 0, msg }
    } catch (error) {
      console.log("发生错误：")
      console.dir(error)
      return { status: 0, msg: "发生错误，创建歌单失败" }
    }
  },
  /**
   * 更新歌单信息或删除歌单(status=0)
   * @param newData
   * @returns {{status:0|1}}
   */
  updateMyMusicListInfo: async (newData: MusicListInfo | { status: number }) => {
    try {
      const result = await momo.post("/updateMyMusicListInfo", newData)
      console.log("/updateMyMusicListInfo返回的数据为：", result)
      const { code, msg } = result
      if (code === 200) {
        ElMessage.success(msg)
        return { status: 1 }
      }
      return { status: 0 }
    } catch (err) {
      console.error("updateMyMusicListInfo出错了:")
      console.error(err)
      ElMessage.error((newData.status === 0 ? "删除" : "更新") + "歌单信息失败")
      return { status: 0 }
    }
  },
  /**
   * 批量收藏音乐到歌单
   * @param music_id_list -要收藏的数据库歌曲id列表
   * @param music_list_id -数据库歌单id
   * @returns
   */
  connectMusicToList: async (music_id_list: number[], music_list_id: number) => {
    try {
      const result = await momo.post("/addCloudMusicToList", { music_id_list, music_list_id })
      console.log("/connectMusicToList", result)
      return result
    } catch (err) {
      console.error("connectMusicList出错了:")
      console.error(err)
    }
  },
  /**
   * 批量删除歌单中的音乐
   * @param music_id_list -要收藏的数据库歌曲id列表
   * @param music_list_id -数据库歌单id
   * @returns {status:0|1}
   * - `returns`：0删除失败，1删除成功
   */
  deleteMusicFromList: async (music_id_list: number[], music_list_id: number) => {
    try {
      const result = await momo.delete("/deleteMusicFromList", { music_list_id, music_id_list })
      console.log("/deleteMusicFromList返回的数据为：", result)
      // const { code, msg, data } = result
      return { status: 1 }
    } catch (err) {
      console.error("deleteMusicFromList出错了:")
      console.error(err)
      return { status: 0 }
    }
  },

  /**
   * 跳转到网易云歌单详情界面
   * @param cloud_music_list_id -网易云歌单id
   */
  goToCloudMusicList: (cloud_music_list_id: number) => window.open("https://music.163.com/#/playlist?id=" + cloud_music_list_id),

  /**
   * 跳转到网易云歌曲详情界面
   * @param cloud_music_list_id -网易云歌曲id
   */
  goToCloudMusic: (cloud_music_id: number) => window.open("https://music.163.com/#/song?id=" + cloud_music_id),
}
export default musicList
