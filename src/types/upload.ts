/**
 * 数据库图库的图片信息
 */
interface Image {
    id: number,
    uid: number,
    sort: string,
    status: number,
    imgUrl: string,
    imgPath: string,
    imgMD5: string,
    imgName: string;
    created_time: string,
    updated_time: string,
}

/**
 * 向服务器传递的图片参数
 */
interface ImageUrlType {
    imgId?: number,//数据库的图片id
    imgUrl?: string,
    imgName?: string,
    sort: string,
    md5?: string
}


export type { Image, ImageUrlType }