import type {loginReq, loginReqRes, UserInfoRes} from '@/api/user/type.ts'

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
