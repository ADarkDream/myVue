//导航栏的方法
import { emitter } from "@/utils/emitter";
import type { NoticeActiveNum } from "@/types/global";

export default {
    /**
     * 显示网站公告界面
     */
    showNotice: ({ show_num, active_num }: NoticeActiveNum) =>
        emitter.emit('showNotice', { show_num, active_num })


}

