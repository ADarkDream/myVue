import momo from "@/apis"
import { ElMessage } from "element-plus"
import titleDiv from "../titleDiv"
import { UserInfo } from "@/types/user"
declare const QC: any

export default {
    /**
     * 请求后端，提交QQ认证的token信息
     * @param access_token -用户的身份认证
     * @param expired_time -身份认证有效期
     * @param type -本次认证的功能(登录/绑定/注册？)
     * @returns 
     */
    qq_oauth: async (access_token: string, expired_time: Date, type = 'login') => {
        let msg = '登录'
        let url = '/login_qq'
        if (type === 'connect') {
            msg = '绑定'
            url = '/connect_qq'
        }
        // else if (type==='')
        const flag = QC.Login.check()
        if (!flag || !access_token || !expired_time) {
            ElMessage.warning(msg + '失败！')
            return { flag: false, msg: msg + '失败！' }
        }
        // !外部是否需要await
        // QC.Login.getMe(async (appId: string, accessToken: string) => {
        //     console.log('appId', appId);
        //     console.log('accessToken', accessToken);
        // QC.api()
        try {
            const result = await momo.post<{ userInfo: UserInfo }>(url,
                { access_token, expired_time }
            )
            console.log('qq_oauth返回的数据为：', result)
            const { code, msg, data } = result
            //登录成功
            if (code === 200 && data) return { flag: true, userInfo: data.userInfo, msg }
            //绑定成功
            else if (code === 200) return { flag: true, msg }
            //失败
            else return { flag: false, msg }
        } catch (err) {
            console.error('qq_oauth验证出现错误')
            console.error(err)
            return { flag: false, msg: 'QQ OAuth验证出现错误' }
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