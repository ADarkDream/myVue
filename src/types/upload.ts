/**
 * 文件上传的参数
 * @param sort -文件分类(文件夹)
 */
interface Options {
    /**
     * 文件分类(文件夹)
    */
    sort: string,
    /**
     * 显示的文件地址(如果有的话)
     */
    url: string,
    /**
     * 文件状态，0为待审核，1为正常，2为审核未通过
     */
    status: number,
    /**
     * 限制文件最大兆数(MB)
     */
    maxSize: number,
    /**
     * 文件类型,默认为图片(后缀)
     */
    type: "image" | "music"
}

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


export type { Options, Image, ImageUrlType }