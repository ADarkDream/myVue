import axios from "axios";
import {reactive} from "vue";
import {ElMessage} from "element-plus";

export default function () {
    let urlList = reactive<{
        id: number,
        url: string,
        img: string,
        detail: string,
        name: string,
    }[]>([])

    async function getImgUrl(className: string) {
        try {
            const result = await axios({url: '/getUrlList', params: {className},})
            const {data, msg} = result.data
            urlList.splice(0, urlList.length, ...data)
            // Object.assign(urlList, data)
            // ElMessage.success(msg)
            console.log('查询到的云端数据如下：')
            console.log(urlList)
        } catch (err) {
            throw err
        }
    }

    // 向外暴露
    return {getImgUrl, urlList}
}

