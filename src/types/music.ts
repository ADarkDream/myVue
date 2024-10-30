//艺术家信息
interface Artist {
    cloud_artist_id?: number,
    name: string,
    pic_url?: string
}

/**
 * 专辑信息
 */
interface Album {
    album_id?: number,
    name: string,
    pic_url?: string
    publish_time?: string
}


/**
 * 歌单的信息
 */
interface MusicListInfo {
    music_list_id: number,
    cloud_music_list_id?: number,
    name: string,
    uid: number,
    /**
     * 歌单自定义的封面
     */
    pic_url: string,
    /**
    * 歌单最后一首歌的专辑封面
    */
    default_cover_url: string,
    description?: string,
    status: number,
    songsCount: number,
    created_time: Date,
    updated_time: Date,
}


/**
 * 歌单的数据结构
 * @param musicListInfo
 * @param songsInfo
 */
interface MusicList {
    musicListInfo: MusicListInfo,
    songsInfo: CloudSongInfo[]
}

/**
 * 创建和修改歌单的信息
 */
interface CreateMusicListInfo {
    music_list_id?: number,
    cloud_music_list_id?: number,
    name?: string,
    uid?: number,
    /**
     * 歌单自定义的封面
     */
    pic_url?: string,
    description?: string,
    status?: 0 | 1 | 2,
}



//请求数据库歌单列表信息的结构
interface QueryMusicLists {
    is_login: boolean,
    user_id?: number,
    music_list_id?: number
}


//请求数据库歌单数据的结构
interface QueryMusicList {
    music_list_id: number,
    limit?: number,
    offset?: number,
    is_login: boolean
}

//请求网易云歌单数据的结构
interface QueryCloudMusicList {
    music_list_id?: number,
    cloud_music_list_id: number,
    limit?: number,
    offset?: number,
    latest?: number
}

//网易云音乐信息(筛选后)
interface CloudSongInfo {
    id: number,
    cloud_music_id?: number,
    name: string,
    duration?: number,//音乐时长
    comment_thread_id?: string,//获取评论时的参数
    fee?: number,//1为VIP，8为免费
    mvid?: number,//MV的id
    src: string,//播放地址
    status: 0 | 1,//0代表网易云音乐，1代表上传的音乐
    artists: Artist[],//艺术家
    album: Album
}


interface SongInfo {
    name: string,
    // duration: number,//音乐时长
    src: string,//播放地址
    artists: { name: string, pic_url: string }[],//艺术家
    album: { name: string, pic_url: string }
}


//搜索音乐返回的结果
interface SearchResult {
    songs: CloudSongInfo[],
    songCount: number
}

export type { CloudSongInfo, SongInfo, SearchResult, MusicListInfo, CreateMusicListInfo, MusicList, QueryMusicLists, QueryMusicList, QueryCloudMusicList }
