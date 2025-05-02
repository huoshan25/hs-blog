import type {UserInfoRes} from '@/api/user/type.ts'

/** 获取用户信息 */
export async function getUserInfo() {
  return request.get<UserInfoRes>('/user/profile')
}
