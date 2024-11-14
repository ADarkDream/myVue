import axios from "axios"
import { ElMessage } from "element-plus"
import config from "@/config"
import titleDiv from "../titleDiv"
import type { ResultData } from "@/types/global"
declare const QC: any

export default {
    /**
     * 请求后端，登录QQ
     */
    login_by_qq: async (access_token: string, expired_time: Date) => {
        const flag = QC.Login.check()
        if (!flag || !access_token || !expired_time) {
            ElMessage.warning('登录失败！')
            return false
        }
        // !外部是否需要await
        // QC.Login.getMe(async (appId: string, accessToken: string) => {
        //     console.log('appId', appId);
        //     console.log('accessToken', accessToken);
        // QC.api()
        try {
            const result = await axios<ResultData<undefined>>({
                url: '/login_qq',
                method: "POST",
                data: { access_token, expired_time }
            })
            console.log('/login_by_qq返回的数据为：', result.data)
            const { status } = result.data
            return status === 200
        } catch (err) {
            console.error('login_by_qq出错了')
            console.error(err);
            return false
        }
    },
    /**
     * 清洗从回调地址链接中返回的QQ OAuth参数
     */
    clean_qq_path: (fullpath: string) => {
        try {
            // 获取用户凭证和过期时间
            const { access_token, expires_in, state } = titleDiv.get_hash_param(fullpath)
            // console.log(access_token, expires_in, state);

            if (!access_token || !expires_in) throw Error('QQ登录参数缺失')
            const [type, key] = state.split('_')

            //计算过期时间
            const time_now = (new Date()).getTime()
            const expired_time = new Date(time_now + Number(expires_in) * 1000)
            // console.log(access_token, expired_time)
            return { access_token, expired_time, type, key }
        } catch (err) {
            throw Error('clean_qq_path出错了')
        }
    }
}