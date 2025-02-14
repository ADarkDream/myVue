import { Bill } from "@/types/books"
import { TableColumnCtx } from "element-plus"

interface ResultData<T> {
  code: number
  msg: string
  data?: T
}

//el-table表格排序，handleSortChange传参声明
interface Sort<T> {
  column?: T
  prop: string
  order: "ascending" | "descending"
}

//el-table筛选的类型声明
type TableFilterItem<T> = {
  text: string
  value: T
}

//el-table合并列的类型声明
interface SpanMethodProps<T> {
  row: T
  column: TableColumnCtx<T>
  rowIndex: number
  columnIndex: number
}

//el-table表格统计的类型声明
interface SummaryMethodProps<T = Bill> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

//公告
interface Notice {
  id: number
  title: string
  sort: string
  content: string
  created_time: string
  updated_time: string
  status: number
  time?: string
}

/**
 * 打开公告列表的序号
 * @param show_num 公告页面序号
 * @param active_num 折叠面板序号
 */
type NoticeActiveNum = {
  /**
   * 公告页面序号
   */
  show_num: number
  /**
   * 折叠面板序号
   */
  active_num?: number
}

/**树节点结构*/
export type TreeItem = {
  label: string
  value: any
  children?: TreeItem[]
}
