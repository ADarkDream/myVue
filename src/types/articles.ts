//文章类型声明
interface Article {
    id: number,
    title: string,
    status: number,
    author: string,
    text: string,
    area: string,
    tags: string,
    created_time: number,
    updated_time: number
}

//文章评论
interface Comment {
    id: number,
    uid: number,
    articleId: number,
    comment: string,
    status: number,
    created_time: string,
}


export {Article, Comment}
