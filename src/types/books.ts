//账本的类型声明
interface Book {
  bid: number
  uid?: number
  name: string
  intro: null | string
  status?: number
  key?: string
  isNull?: boolean
  created_time?: string
  updated_time?: string
}

//账单的简略计算(日历中)
interface BillDesc {
  noPayNum: number
  noPay: number
  hasPaidNum: number1
  hasPaid: number
}

//账单的类型声明
interface Bill {
  id: number
  bid: number
  uid: number
  gid: number
  // children?: Bill[],
  username: string
  name: string
  price: number
  desc: string
  type: string
  status?: number
  bill_date: string
  created_time: string
  updated_time: string
}

//新增账单的类型声明
interface NewBill {
  id: number
  bid: number
  gid: number
  name: string
  price: number
  bill_date: string
  desc: string
  type: string
  status?: number
}

//账单总价的类型声明
interface TotalCost {
  uid: number
  username: string
  expense: number
  income: number
  totalExpense: number
  totalIncome: number
}

//获取日期周期函数需要的参数
type DateParam = {
  theDate?: Date
  dateString?: string
}
//获取日期周期函数返回的结果
type DateValue = {
  DateRange: [string, string]
  DateString: string
  isFuture?: boolean
}

export { BillDesc, Book, Bill, NewBill, TotalCost, DateParam, DateValue }
