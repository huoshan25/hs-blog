import { useStorage } from '@vueuse/core'
import type { UserInfoRes } from '@/api/user/type.ts'
import { getUserInfo } from '@/api/user'

export const useUser = () => {
  /** 用户信息 */
  const userInfo = useStorage<UserInfoRes | null>('userInfo', {} as UserInfoRes)
  /** 访问令牌 */
  const token = useStorage('token', '')
  const refreshToken = useStorage('refreshToken', '')

  /** 获取用户信息 */
  const fetchUserInfo = async () => {
    const res = await getUserInfo()
    if (res.code === 200) {
      userInfo.value = res.data
    }
  }

  /**
   * 设置token
   * @param t jwt token
   * @param rt refresh token
   */
  const setToken = (t: string, rt: string) => {
    token.value = t
    refreshToken.value = rt
  }

  /**清除用户信息*/
  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
  }

  return {
    userInfo,
    token,
    refreshToken,

    fetchUserInfo,
    clearUserInfo,
    setToken
  }
}
