export interface UserInfoRes {
  id: number;
  userName: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
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

export interface putUserBioReq {
  name: string;
  avatar: string;
  bgImg: string;
  description?: string;
}

export interface UserBioRes {
  id: number;
  name: string;
  avatar: string;
  bgImg: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}