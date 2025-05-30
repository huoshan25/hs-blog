import type {
  loginReq,
  loginReqRes,
  putUserBioReq,
  UserBioRes,
  UserInfoRes,
} from '@/api/user/type.ts'

/** 获取用户信息 */
export async function getUserInfo() {
  return request.get<UserInfoRes>('/user')
}

/**
 * 登录接口
 * @param params
 */
export async function getLogin(params: loginReq) {
  return await request.post<loginReqRes>('/auth/login', params)
}

/**获取用户卡片信息*/
export async function getUserBio() {
  return await request.get<UserBioRes>('/user/bio')
}

/**更新用户卡片信息*/
export async function putUserBio(params: putUserBioReq) {
  return await request.put('/user/bio', params)
}
