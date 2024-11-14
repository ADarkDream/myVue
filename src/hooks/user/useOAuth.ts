import { ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { useOAuthStore } from "@/store/user/useOAuthStore";
import myFunction from "@/utils/myFunction";
import config from "@/config";


/**
 * QQ的JS_SDK
 */
declare const QC: any


export default function () {
    const OAuthStore = useOAuthStore()
    const { oauth_window, timer, listener } = toRefs(OAuthStore)
    /**
     * 跳转到 QQ OAuth登录
     */
    const to_qq_oauth = async (is_oauth = false, isPC = true) => {
        if (is_oauth) {//打开新窗口登录
            const type = 'login'
            const key = myFunction.generateRandomCode()
            const state = type + '_' + key
            const url = process.env.NODE_ENV === 'development' ? config.host + `/oauth?reffer=qq&#access_token=BB3E00F21390900B9BD788D7B2A8A2DA&expires_in=5184000&state=${state}&display=${isPC ? 'pc' : 'mobile'}` : `https://graph.qq.com/oauth2.0/show?which=Login&client_id=${config.options_qq.appId}&response_type=token&scope=all&redirect_uri=${config.options_qq.redirectURI}&state=${state}&display=${isPC ? 'pc' : 'mobile'}`
            //计算居中
            const winWidth = screen.width;  //获取屏幕宽度
            const winHeight = screen.height;  //获取屏幕高度
            const newWinWidth = 750
            const newWinHeight = 500

            //获取新窗口距离屏幕左侧的位置
            const left = (winWidth - newWinWidth) / 2;
            //获取新窗口距离屏幕顶部的位置
            const top = (winHeight - newWinHeight) / 2;
            oauth_window.value = window.open(url, "TencentLogin", `width=${newWinWidth},height=${newWinHeight},top=${top},left=${left},menubar=0,scrollbars=1, resizable = 1, status = 1, titlebar = 0, toolbar = 0, location = 1`);
            if (oauth_window.value) {
                //定时器发送验证信息
                timer.value = setInterval(() => {
                    console.log('发送验证')
                    oauth_window.value.postMessage({ role: 'visitor', step: 0, data: { type, key } }, 'http://127.0.0.1:5173')
                }, 1000)

                //监听器接收信息
                listener.value = (event: MessageEvent) => {
                    const { role, step, data } = event.data
                    if (role !== 'verifier') return//本页面属于visitor，返回消息的页面属于 verifier，防止同站循环发送接收
                    //收到关闭请求
                    // console.log(event.data);
                    console.log('父窗口收到回信step：', step)
                    //关闭计时器(发验证信)
                    if (step === 0) clearInterval(timer.value)

                    //收到OAuth验证结果的信息
                    else if (step === 1) {
                        if (data.verify) ElMessage.success('登录成功')
                        else ElMessage.error('登录失败')
                        removeEventListener('message', listener.value)
                    }
                    //关闭登录窗口
                    oauth_window.value.close()
                }

                oauth_window.value.addEventListener('message', listener.value)
            }
        } else//跳转到新窗口登录
            QC.Login.showPopup({
                appId: config.options_qq.appId,
                redirectURI: config.options_qq.redirectURI
            })
    }

    return { to_qq_oauth }
}
