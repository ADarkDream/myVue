import { toRefs } from "vue"
import { ElMessage } from "element-plus"
import { useOAuthStore } from "@/store/user/useOAuthStore"
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import myFunction from "@/utils/myFunction"
import oauth from "@/utils/user/oauth"
import config from "@/config"
import { PostMessageCheck, Step_1 } from "@/types/oauth"
import { useRouter, useRoute } from "vue-router"

/**
 * QQ的JS_SDK
 */
declare const QC: any

export default function () {
  const route = useRoute()
  const router = useRouter()
  const OAuthStore = useOAuthStore()
  const userInfoStore = useUserInfoStore()
  const { updateLocalUserInfo } = userInfoStore
  const { oauth_window, timer } = toRefs(OAuthStore)

  /**
   * 发送到数据库
   * @param access_token
   * @param expired_time
   * @param type
   * @param pathname
   */
  const to_login_by_qq = async ({
    access_token,
    expired_time,
    type,
    pathname,
  }: {
    access_token: string
    expired_time: Date
    type: string
    pathname?: string
  }) => {
    try {
      //登录、绑定或注册
      const { flag, userInfo, msg } = await oauth.qq_oauth(access_token, expired_time, type)
      //登录
      if (flag && userInfo) {
        updateLocalUserInfo(userInfo)
        //成功提示信息
        ElMessage.success(`用户 ${userInfo.username} 登录成功`)

        setTimeout(() => {
          if (pathname) {
            //移动端传路径返回
            router.replace({ name: pathname })
            // if (type === 'connect') router.replace({ name: 'userInfo' })
          } else location.reload()
        }, 1500)

        //绑定
      } else if (flag) ElMessage.success(msg)
    } catch (err) {
      console.error("to_login_by_qq出错了:")
      console.error(err)
    }
  }

  /**
   * 处理其他窗口返回的信息
   * @param event
   * @returns
   */
  const receiveMessage = async (event: MessageEvent) => {
    try {
      const { role, step, data } = event.data as PostMessageCheck
      console.log("父窗口收到", event.data)
      console.log("origin", event.origin)
      if (role !== "verifier" || step !== 1) return //本页面属于visitor，返回消息的页面属于 verifier，防止同站循环发送接收
      //收到关闭请求
      console.log("父窗口收到回信step：", event.data)
      //清除监听器
      if (timer.value) clearInterval(timer.value)
      //关闭登录窗口
      oauth_window.value.close()

      const { reffer, ...info } = data as Step_1
      console.log(reffer)
      if (reffer === "qq") {
        to_login_by_qq(info)

        // removeEventListener('message', listener.value)
      }
    } catch (err) {
      console.error("receiveMessage出错了:")
      console.error(err)
    }
  }

  /**
   * 跳转到 QQ OAuth登录
   */
  const to_qq_oauth = async ({ is_oauth = false, isPC = true, type = "login" }) => {
    const key = myFunction.generateRandomCode()
    const state = type + "_" + key //自定义验证参数
    const display = isPC ? "pc" : "mobile" //返回的界面样式

    const redirect_uri = encodeURIComponent(
      config.options_qq.redirectURI + (isPC ? "" : "&display=mobile&pathname=" + (route.name?.toString() || "home"))
    )

    //生产环境的验证地址, 移动端需要将回调地址转码
    const oauth_url = `https://graph.qq.com/oauth2.0/${isPC ? "show?which=Login&" : "authorize?"}client_id=${config.options_qq.appId}&response_type=token&scope=all&redirect_uri=${redirect_uri}&state=${state}&display=${display}`

    const url = import.meta.env.DEV
      ? import.meta.env.VITE_BASE_IP +
        `/oauth?reffer=qq&#access_token=BB3E00F21390900B9BD788D7B2A8A2DA&expires_in=5184000&state=${state}&display=${display}`
      : oauth_url

    if (isPC) {
      //PC端
      //计算居中
      const winWidth = screen.width //获取屏幕宽度
      const winHeight = screen.height //获取屏幕高度
      const newWinWidth = 750
      const newWinHeight = 500

      //获取新窗口距离屏幕左侧的位置
      const left = (winWidth - newWinWidth) / 2
      //获取新窗口距离屏幕顶部的位置
      const top = (winHeight - newWinHeight) / 2
      oauth_window.value = window.open(
        url,
        "TencentLogin",
        `width=${newWinWidth},height=${newWinHeight},top=${top},left=${left},menubar=0,scrollbars=1, resizable = 1, status = 1, titlebar = 0, toolbar = 0, location = 1`
      )
    } //移动端
    else return (location.href = url)

    if (oauth_window.value) {
      //定时器发送验证信息
      timer.value = setInterval(() => {
        console.log("发送验证", import.meta.env.VITE_BASE_IP)
        oauth_window.value.postMessage({ role: "visitor", step: 0, data: { type, key } })
      }, 1000)

      //监听器接收信息
      window.addEventListener("message", receiveMessage, false)
    }
  }
  // QC.Login.showPopup(config.options_qq)

  return { to_qq_oauth, to_login_by_qq }
}
