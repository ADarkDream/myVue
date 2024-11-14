//导航栏的方法
import { emitter } from "@/utils/emitter";
import type { NoticeActiveNum } from "@/types/global";

export default {
    /**
     * 显示网站公告界面
     */
    showNotice: ({ show_num, active_num }: NoticeActiveNum) =>
        emitter.emit('showNotice', { show_num, active_num }),

    /**
     * 从地址中获取哈希参数(#key=value&key=value)
     * @param fullpath -route.fullpath 
     * @returns Object 所有哈希参数组成的对象
     */
    get_hash_param: (fullpath: string) => {
        //提取出没有#的参数
        const hash = fullpath.split('#')[1] || ''
        //格式化哈希参数
        const params = new URLSearchParams(hash)
        // 获取所有参数并构造一个对象
        const paramObject: Record<string, string> = {}
        for (const [key, value] of params.entries()) {
            paramObject[key] = value
        }
        // 返回参数对象
        return paramObject
    },
    /**
     * 检查网址是否属于某个域名
     * @param url -要检查的网址链接
     * @param domain -要匹配的域名
     */
    isURLFromDomain: (url: string, domain: string) => {
        try {
            console.log(`检查网址${url}是否属于${domain}`);
            const parsedUrl = new URL(url)
            const flag = parsedUrl.hostname.endsWith(`.${domain}`) || url === domain
            console.log('检查结果为：', flag)
            return flag
        } catch (error) {
            console.log('检查出错，结果为：', false)
            return false
        }
    }


}

