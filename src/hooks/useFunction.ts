import {ref} from "vue";
import {ElMessage} from "element-plus";


export default function () {
    //复制备案号并跳转
    function copyWebsiteRecord(text: string, url: string) {
        navigator.clipboard.writeText(text).then(
            () => {
                ElMessage.success('备案号已复制到剪贴板')
                setTimeout(() => {
                    window.open(url)
                }, 1500)
            },
            () => {
                alert('备案号复制失败,请自行复制')
                setTimeout(() => {
                    window.open(url)
                }, 1500)
            }
        )
    }

    function copyText(text: string, msg: string, url?: string) {
        navigator.clipboard.writeText(text).then(
            () => {
                ElMessage.success(msg + '已复制到剪贴板')
                if (url !== undefined) setTimeout(() => {
                    window.open(url)
                }, 1500)
            },
            () => {
                alert(msg + '复制失败,请自行复制')
                if (url !== undefined) setTimeout(() => {
                    window.open(url)
                }, 1500)
            }
        )
    }

    // 向外暴露
    return {copyWebsiteRecord,copyText}
}
