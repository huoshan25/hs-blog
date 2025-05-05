export interface UserInfoRes {
  /**用户名*/
  username: string
}

export interface loginReq {
  /**用户名*/
  usernameOrEmail: string
  /**密码*/
  password: string
}

export interface loginReqRes {
  accessToken: string
  refreshToken: string
}

export interface registerReq extends loginReq{
  confirmPassword: string
}