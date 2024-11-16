import { connect } from "http2"

const config = {
    /**
     * QQ OAuth的主要地址
     */
    host_qq: 'https://graph.qq.com',
    /**
     * QQ OAuth登录的参数
     */
    options_qq: {
        appId: "102483810",
        redirectURI: "https://muxidream.cn/oauth?reffer=qq",
    },
    /** 
     * OAuth通信的类型参数
     */
    oauth_type: {
        login: '登录',
        connect: '绑定'
    } as Record<string, string>

}
export default config