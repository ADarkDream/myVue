/**正则表达式*/
const regexRules = {
  /**网址规则*/
  url: /https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]*)?/,
  /**歌单链接规则*/
  palylist: /https?:\/\/(?:[a-zA-Z0-9-]+\.)?music\.163\.com\/(?:m\/|#\/)?(?:[a-zA-Z0-9\/]+\/)?playlist\?id=([0-9]+)/,
  /**歌曲链接规则*/
  song: /https?:\/\/(?:[a-zA-Z0-9-]+\.)?music\.163\.com\/(?:m\/|#\/)?(?:[a-zA-Z0-9\/]+\/)?song\?id=([0-9]+)/,
  /**歌曲链接规则(短连接，需要重定向检查)*/
  song_short: /https?:\/\/(?:[a-zA-Z0-9-]+\.)?163cn\.tv\/[a-zA-Z0-9]+/,
}

export default regexRules
