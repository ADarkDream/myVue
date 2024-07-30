interface UserInfo {
  uid: number,
  username?: string,
  email?: string,
  password?: string,
  headImgId?: number,
  headImgUrl?: string,
  headImgStatus?: number,
  bgUrl?: string,
  bgId?: any,
  bgStatus?: any,
  signature?: string,
  isSuperAdmin?: number,
  created_time?: string,
  updated_time?: string,
}

export {UserInfo}