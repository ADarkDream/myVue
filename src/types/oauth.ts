/**
 * QQ OAuth回调获得的参数
 */
type CallbackOAuth = {
    /**
     * QQ用户的凭证
     */
    access_token: string,
    /**
     * QQ用户的凭证有效截止期
     */
    expired_time: Date,
    /**
     * 自定义的通信类型
     */
    type: string,
    /**
     * 自定义的随机加密验证字符串
     */
    key: string
}

/**
 * QQ OAuth窗口通信验证参数
 */
interface QQOAuthCheck {
    /**
     * 窗口来源的 HOST
     */
    origin: string,
    /**
     * 自定义的通信类型
     */
    type: string,
    /**
     * 自定义的随机加密验证字符串
     */
    key: string
}

/**
 * postMessage窗口通信验证参数
 */
interface PostMessageCheck {
    /**
     * 发信者身份
     */
    role: 'visitor' | 'verifier',
    /**
     * 发信进程
     */
    step: number,
    data: Step_0 | Step_1
}
/**
 * 发信进程 0
 */
type Step_0 = { type: string, key: string }
/**
 * 发信进程 1
 */
type Step_1 = { verify: number, msg: string }

export type { CallbackOAuth, QQOAuthCheck, PostMessageCheck, Step_0, Step_1 }
