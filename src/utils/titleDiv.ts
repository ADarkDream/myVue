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
     * @param url -要检查的网址链接(几级都可以)
     * @param domain -要匹配的域名
     * - "http://www.example.com", "example.com" // true
     * - "http://sub.example.com", "example.com" // true
     */
    isURLFromDomain: (url: string, domain: string) => {
        try {
            console.log(`检查网址${url}是否属于${domain}`);
            const parsedUrl = new URL(url)
            // 移除可能的 'www.' 前缀以进行更通用的匹配
            const hostnameWithoutWWW = parsedUrl.hostname.replace(/^www\./, '');
            // 检查是否完整匹配或作为子域名匹配
            const flag = hostnameWithoutWWW === domain || hostnameWithoutWWW.endsWith(`.${domain}`);
            console.log('检查结果为：', flag)
            return flag
        } catch (error) {
            console.log('检查出错，结果为：', false)
            return false
        }
    },
    /**
     * 清除全部cookie
     */
    delAllCookie: () => {
        const cookies = document.cookie.split(";")

        cookies.forEach(cookie => {
            const [name] = cookie.split("=");
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        })

        if (cookies.length > 0) {
            const domain = `.${location.host.split('.').slice(-2).join('.')}` // 顶级域名
            cookies.forEach(cookie => {
                const [name] = cookie.split("=")
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`
            })
        }
        console.log('已删除全部本地cookie');
    },
}

