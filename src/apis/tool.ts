import momo from "@/apis"

/**
 * 请求重定向链接
 * @param sort -公告类型数组
 * @returns
 */
export async function api_getRedirectUrl(url: string) {
  const result = await momo.get<{ redirectUrl: string }>("/getRedirectUrl", {
    url,
  })
  console.log("/getRedirectUrl返回的数据为：", result)
  return result
}
