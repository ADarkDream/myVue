interface ResultData<T> {
    status: number,
    msg: string,
    data?: T
}

//el-table表格排序，handleSortChange传参声明
interface Sort {
  prop: string
  order: 'ascending' | 'descending'
}

//el-table筛选的类型声明
type TableFilterItem<T> = {
    text: string,
    value: T
}




//公告
interface Notice {
    id: number,
    title: string,
    sort: string,
    content: string,
    created_time: string,
    updated_time: string,
    status: number,
    time?: string
}

//打开公告列表的序号
type NoticeActiveNum = {
    showNum?: string,
    activeNum?: string
}
