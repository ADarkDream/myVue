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
     * 跳转到QQ登录
     */
    to_qq_login: () => {
        const oOpts = {
            appId: "102476068",
            redirectURI: "https://muxidream.cn/connect_qq/callback"
        }
        QC.Login.showPopup(oOpts)
    }
}

