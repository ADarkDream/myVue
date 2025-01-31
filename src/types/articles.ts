/**请求论坛文章列表的参数 */
interface ArticleParams {
    title: string,
    author: string,
    area: string,
    tags: string,
}

/**管理界面的文章类型*/
interface Article {
    id: number,
    title: string,
    status: number,
    author: string,
    coverUrl: string,
    authorId?: number,
    text: string,
    area: string,
    tags: string,
    created_time: Date,
    updated_time: Date
}

//管理界面的文章评论
interface Comment {
    id: number,
    uid: number,
    articleId: number,
    comment: string,
    status: number,
    created_time: string,
}


//文章界面的评论
interface CommentInfo {
    id: number,
    observer: string,
    uid: number,
    comment: string,
    created_time: string,
    headImgUrl: string
}

export type { ArticleParams, Article, Comment, CommentInfo }
