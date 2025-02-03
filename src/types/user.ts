/**
 * 服务器返回的Token中的用户信息
 */
interface TokenUserInfo {
  uid: number
  username: string
  isAdmin?: "1"
  email: string
  headImgUrl: string
  bgUrl: string
  tokenVersion: number
}

/**
 * 服务器返回的Token格式
 */
interface Token {
  /**
   * 用户信息
   */
  value: TokenUserInfo
  /**
   * token生效时间
   */
  iat: number
  /**
   * token过期时间
   */
  exp: number
}

/**
 * 用户信息
 */
interface UserInfo {
  uid?: number
  username: string
  email: string
  password?: string
  headImgId?: number
  headImgUrl?: string
  headImgStatus?: number
  bgUrl: string
  bgId?: number
  bgStatus?: number
  signature?: string
  isSuperAdmin?: number
  created_time?: string
  updated_time?: string
  [key: string]: unknown
}

/**
 * 管理员信息
 */
interface AdminInfo {
  uid?: number
  username: string
  email: string
  headImgId?: number
  headImgUrl?: string
  isSupperAdmin?: boolean
  [key: string]: unknown
}

export type { TokenUserInfo, Token, UserInfo, AdminInfo }
