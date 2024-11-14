/**
 * 是否是开发环境
 */
const is_dev = process.env.NODE_ENV === 'development'

const config = {
    /**
     * 项目主要地址
     */
    host: is_dev ? 'http://127.0.0.1:5173' : 'https://muxidream.cn',
    /**
     * QQ OAuth的主要地址
     */
    host_qq: 'https://graph.qq.com',
    /**
     * QQ OAuth登录的参数
     */
    options_qq: {
        appId: "102483810",
        redirectURI: is_dev ? 'http://127.0.0.1:5173' : "https://muxidream.cn/oauth?reffer=qq",
    },


}
export default config