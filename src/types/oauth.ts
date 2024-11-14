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

export type { CallbackOAuth, QQOAuthCheck }
