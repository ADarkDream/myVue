export default function () {

    // 数字小于10则补0
    function addZero(value: number) {
        if (value < 10) return '0' + value
        return value
    }

    //处理时间戳,返回毫秒级(13位)时间戳
    function formatTimestamp(timestamp) {
        //如果是ISO时间戳
        console.log(timestamp)
        console.log(timestamp.toString().length)
        if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(timestamp)) {
            return (new Date(timestamp)).getTime()
        }
        //时间戳若不是13位  补全为13位
        else if (typeof timestamp === 'number' && timestamp.toString().length < 13) {
            let timestampStr = timestamp.toString()
            for (let i = timestampStr.length; i < 13; i++) {
                timestampStr += '0'
            }
            return Number(timestampStr)
        } else return timestamp
    }


    //日期比较函数，返回距今时间
    function getDiffTime(timestampVal) {
        let timestamp = formatTimestamp(timestampVal)  //处理时间戳,返回毫秒级(13位)时间戳

        const minute = 1000 * 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7,
            now = new Date().getTime(),
            year = new Date().getFullYear(),// 获取当前时间年份
            createYear = new Date(timestamp).getFullYear(), // 获取指定时间戳年份
            diffValue = now - timestamp,// 获取时间戳差值
            yearsDiff = year - createYear // 获取年份差
        // 如果本地时间反而小于变量时间
        if (diffValue < 0) return '刚刚'

        // 计算差异时间的量级
        const weekC = diffValue / week, // 相对于7天
            dayC = diffValue / day, // 相对于24小时
            hourC = diffValue / hour, // 相对于1小时
            minC = diffValue / minute // 相对于1分钟

        // 使用
        if (minC < 5) {
            return "刚刚"//五分钟内
        } else if (minC < 59) {
            return Math.ceil(minC) + "分钟前"//一小时内
        } else if (hourC < 23) {
            return Math.ceil(hourC) + "小时前"//一天内
        } else if (weekC < 1) {
            return Math.ceil(dayC) + "天前"//一周内
        } else if (weekC > 1) {//大于一周
            return (function () {
                let date = new Date(timestamp)
                if (yearsDiff < 1) {
                    return date.getMonth() + 1 + '月' + date.getDate() + '日'//一年内
                } else {
                    return date.getFullYear() + '年' + date.getMonth() + 1 + '月' + date.getDate() + '日'//大于一年，显示年份
                }
            })()
        }
    }


    //需要一个ISO时间戳("2024-05-07T11:15:22.000Z") getTime((new Date()).toISOString())
    function getTime(timestamp: string) {
        let d = new Date(timestamp)
        let month = addZero(d.getMonth())
        let day = addZero(d.getDate())
        let date = (d.getFullYear() - 2000) + '/' + month + '/' + day
        let hour =addZero(d.getHours())
        let minute = addZero(d.getMinutes())
        // let ss = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
        // let time = date + ' ' + hour + ':' + minute + ':' + ss
        // if (hour.)
        return date + ' ' + hour + ':' + minute
    }


    // 向外暴露
    return {getTime, getDiffTime}
}

