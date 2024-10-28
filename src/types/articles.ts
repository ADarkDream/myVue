//管理界面的文章类型
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
    created_time: number,
    updated_time: number
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

export { Article, Comment, CommentInfo }
