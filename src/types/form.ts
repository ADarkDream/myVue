/**登录表格参数*/
interface loginForm {
  email: string
  password: string
  policy: false
}

/**注册表格参数*/
interface registerForm {
  username: string
  email: string
  password: string
  checkPassword: string
  code: string
  policy: false
}

export type { loginForm, registerForm }
