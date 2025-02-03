//保留精度的计算
import { BigNumber } from "bignumber.js"
//hooks
import useTimestamp from "@/hooks/useTimestamp"
//types
import type { DateParam, DateValue } from "@/types/books"

const { formatDate } = useTimestamp()

// 加法
export function numPlus(a: number, b: number) {
  const A = new BigNumber(a)
  const B = BigNumber(b)
  return A.plus(B).toNumber() //结果需要用toNumber转为普通数字
}

// 减法
export function numMinus(a: number, b: number) {
  const A = new BigNumber(a)
  const B = BigNumber(b)
  return A.minus(B).toNumber()
}

// 乘法
export function numTimes(a: number, b: number) {
  const A = new BigNumber(a)
  const B = BigNumber(b)
  return A.times(B).toNumber()
}

// 除法
export function numDiv(a: number, b: number) {
  const A = new BigNumber(a)
  const B = BigNumber(b)
  return A.div(B).toNumber()
}

//获取本周的日期区间，从周一到周日
export function getDayDateRange({ theDate, dateString }: DateParam, flag?: string): DateValue {
  let date
  // 将日期字符串转换为Date对象
  if (dateString && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) date = new Date(dateString)
  else if (theDate) date = theDate
  else date = new Date() // 如果两者都未提供，则默认为当前日期

  //判断是要当前、过去还是未来时间
  if (flag === "now") {
    date = new Date()
  } else if (flag === "minus") {
    date = new Date(date.setDate(date.getDate() - 1))
  } else if (flag === "plus") {
    date = new Date(date.setDate(date.getDate() + 1))
    if (date >= new Date()) return { isFuture: true }
  }

  // 返回格式化的日期字符串(YYYY-MM-DD)
  const newDateString = formatDate(date)
  // 返回本周的日期区间
  return {
    DateRange: [newDateString, newDateString],
    DateString: newDateString,
  }
}

//获取和切换周范围，周一至周日
export function getWeekDateRange({ theDate, dateString }: DateParam, flag?: string): DateValue {
  let date
  // 将日期字符串转换为Date对象
  if (dateString && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) date = new Date(dateString)
  else if (theDate) date = theDate
  else date = new Date() // 如果两者都未提供，则默认为当前日期

  //判断是要当前、过去还是未来时间
  if (flag === "now") {
    date = new Date()
  } else if (flag === "minus") {
    date = new Date(date.setDate(date.getDate() - 7))
  } else if (flag === "plus") {
    date = new Date(date.setDate(date.getDate() + 7))
    if (date >= new Date()) return { isFuture: true }
  }

  // 获取给定日期是周几（0表示周日，1表示周一，...，6表示周六）
  const dayOfWeek = date.getDay()

  // 计算本周的星期一
  const monday = new Date(date)
  monday.setDate(date.getDate() - dayOfWeek + 1) // 减去当前是周几（0-6），然后加1得到周一

  // 计算本周的星期日
  // 注意：由于getDay()返回的是0-6，所以我们需要加6天来得到下周的周日，但我们要的是本周的，所以需要减去1天
  const sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6) // 实际上是从周一算起加6天

  // 返回格式化的日期字符串(YYYY-MM-DD)
  const mondayStr = formatDate(monday)
  const sundayStr = formatDate(sunday)
  const newDateString = formatDate(date)
  // 返回本周的日期区间
  return {
    DateRange: [mondayStr, sundayStr],
    DateString: newDateString,
  }
}

//获取和切换月范围
export function getMonthDateRange({ theDate, dateString }: DateParam, flag?: string): DateValue {
  let date
  // 将日期字符串转换为Date对象
  if (dateString && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) date = new Date(dateString)
  else if (theDate) date = theDate
  else date = new Date() // 如果两者都未提供，则默认为当前日期

  //判断是要当前、过去还是未来时间
  if (flag === "now") {
    date = new Date()
  } else if (flag === "minus") {
    date = new Date(date.setMonth(date.getMonth() - 1))
  } else if (flag === "plus") {
    date = new Date(date.setMonth(date.getMonth() + 1))
    if (date >= new Date()) return { isFuture: true }
  }

  // 获取当前月份的1号
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)

  // 获取当前月份的最后一天，注意月份需要+1且日期设置为0
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  // 返回格式化的日期字符串(YYYY-MM-DD)
  const firstDay = formatDate(firstDayOfMonth)
  const lastDay = formatDate(lastDayOfMonth)
  const newDateString = formatDate(date)
  // 返回本月的日期区间
  return {
    DateRange: [firstDay, lastDay],
    DateString: newDateString,
  }
}

//region获取该月份第一天所在周的周一，及最后一天所在周的周日
export function getAllMonthDateRange({ theDate, dateString }: DateParam, flag?: string): DateValue {
  let date

  // 将日期字符串或已存在的Date对象转换为Date对象
  if (dateString && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    date = new Date(dateString)
  } else if (theDate) {
    date = theDate
  } else {
    // 如果两者都未提供，则默认为当前日期
    date = new Date()
  }

  // 根据flag调整日期
  if (flag === "now") {
    date = new Date()
  } else if (flag === "minus") {
    date = new Date(date.setMonth(date.getMonth() - 1))
  } else if (flag === "plus") {
    date = new Date(date.setMonth(date.getMonth() + 1))
    if (date >= new Date()) {
      return { isFuture: true } // 如果日期是未来日期，直接返回
    }
  }

  const mondayOfFirstWeek = getMondayOfFirstWeek(date)
  const sundayOfLastWeek = getSundayOfLastWeek(date)
  const startDay = formatDate(mondayOfFirstWeek)
  const endDay = formatDate(sundayOfLastWeek)
  console.log("该月份第一天所在周的周一: " + startDay)
  console.log("该月份最后一天所在周的周日: " + endDay)
  const DateString = formatDate(new Date(date.getFullYear(), date.getMonth(), 1))
  // 返回日期区间和日期字符串
  return {
    DateRange: [startDay, endDay],
    DateString,
  }
}

//获取该月份第一天所在周的周一
function getMondayOfFirstWeek(date) {
  // 获取该日期的月份的第一天
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  // 获取第一天是星期几
  const dayOfWeek = firstOfMonth.getDay()
  // 如果是周日，将其视为7
  const daysToMonday = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1
  // 计算第一天所在周的周一
  const monday = new Date(firstOfMonth)
  monday.setDate(firstOfMonth.getDate() - daysToMonday)
  return monday
}

//获取该月份最后一天所在周的周日
function getSundayOfLastWeek(date) {
  // 获取该日期的月份的最后一天
  const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0) // 0 表示上个月最后一天
  // 获取最后一天是星期几
  const dayOfWeek = lastOfMonth.getDay()
  // 如果是周日，将其视为7
  const daysToSunday = 7 - (dayOfWeek === 0 ? 7 : dayOfWeek)
  // 计算最后一天所在周的周日
  const sunday = new Date(lastOfMonth)
  sunday.setDate(lastOfMonth.getDate() + daysToSunday)
  return sunday
}

//endregion
