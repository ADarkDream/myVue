export default function () {
    // let timestamp = ref<string>()

    //格式化时间戳,将TS 国际时间转化为北京时间
    //需要一个ISO时间戳("2024-05-07T11:15:22.000Z") getTime((new Date()).toISOString())
    function getTime(timestamp: string) {
        let d = new Date(timestamp);
        let month = d.getMonth() > 8 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1);
        let day = d.getDate() >9 ? d.getDate() : '0' + d.getDate()
        let date = (d.getFullYear() - 2000) + '/' + month + '/' + day
        let hour = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();
        let minute = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
        // let ss = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
        // let time = date + ' ' + hour + ':' + minute + ':' + ss;
        // if (hour.)
        console.log(day)
        return date + ' ' + hour + ':' + minute;
    }

    // 向外暴露
    return {getTime}
}

