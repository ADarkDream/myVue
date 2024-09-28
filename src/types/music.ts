//艺术家信息
interface Artist {
    cloud_artist_id?: number,
    name: string,
    pic_url?: string
}

//专辑信息
interface Album {
    album_id?: number,
    name: string,
    pic_url?: string
    publish_time?: number
}

interface CloudSongInfo {
    cloud_music_id: number,
    name: string,
    duration?: number,//音乐时长
    comment_thread_id?: string,//获取评论时的参数
    fee?: number,//1为VIP，8为免费
    mvid?: number,//MV的id
    src: string,//播放地址
    artists: Artist[],//艺术家
    album: Album
}

interface SongInfo {
    name: string,
    // duration: number,//音乐时长
    src: string,//播放地址
    artists: { name: string , pic_url: string}[],//艺术家
    album: { name: string, pic_url: string }
}


interface SearchResult {
    songs: CloudSongInfo[],
    songCount: number
}

export type {CloudSongInfo, SongInfo, SearchResult}
