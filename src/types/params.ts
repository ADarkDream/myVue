/**登录请求参数*/
interface LoginParams {
  email: string
  password: string
  isAdmin?: boolean
}

/**注册请求参数*/
interface RegisterParams {
  email: string
  password: string
  username: string
  code: string
}

export type { LoginParams, RegisterParams }
