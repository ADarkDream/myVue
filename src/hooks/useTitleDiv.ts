import { toRefs } from "vue"
import { ElMessage } from "element-plus"
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useResponsiveStore } from "@/store/useResponsiveStore"

//utils
import myFunction from "@/utils/myFunction"

//导航栏的方法
export default function () {
  const userInfoStore = useUserInfoStore()
  const { bgUrl, localBgUrl, useUserBGUrl } = toRefs(userInfoStore)
  const responsiveStore = useResponsiveStore()
  const { isDark, isPC } = toRefs(responsiveStore)
  const { getBG } = myFunction
  const body = document.querySelector("body") as HTMLBodyElement
  /**
   * 切换背景图(夜间模式不切换)
   * @param newBgUrl -传入新的用户自定义图片并更新
   * @param getNewBg -获取随机一张新的重返未来1999壁纸作为本地背景图
   */
  const toggleBG = async ({ newBgUrl, getNewBg }: { newBgUrl?: string; getNewBg?: boolean }) => {
    if (newBgUrl) bgUrl.value = newBgUrl

    let url = useUserBGUrl.value ? bgUrl.value : localBgUrl.value

    if (isDark.value) {
      url = ""
      console.log("当前是夜间模式，不使用壁纸")
      ElMessage.info("当前是夜间模式，不会切换背景")
    } else {
      if (getNewBg) {
        //获取随机一张新的重返未来1999
        if (useUserBGUrl.value) {
          //关闭用户自定义的图片背景
          useUserBGUrl.value = false
          ElMessage.info("已取消自定义背景设置")
        }
        const resImgList = await getBG(isPC.value ? 1 : 0)
        if (resImgList.length > 0) {
          localBgUrl.value = resImgList[0].imgUrl
          url = localBgUrl.value
        }
        console.log(
          "当前背景图片地址是：" +
            localBgUrl.value +
            "\r\n如需更多壁纸请前往重返未来1999官网：" +
            "https://re.bluepoch.com/home/detail.html#wallpaper"
        )
      }
      console.log(`使用了${useUserBGUrl.value ? "自定义" : "本地"}壁纸：`, url)
    }
    body.style.backgroundImage = url ? `url('${url}')` : ""
  }
  return { toggleBG }
}
