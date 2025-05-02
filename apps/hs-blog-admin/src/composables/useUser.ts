import { useStorage } from '@vueuse/core'
import type { UserInfoRes } from '@/api/user/type.ts'
import { getUserInfo } from '@/api/user'

export const useUser = () => {
  /** 用户信息 */
  const userInfo = useStorage<UserInfoRes | null>('userInfo', {} as UserInfoRes)
  /** 访问令牌 */
  const token = useStorage('token', '')
  /** 获取用户信息 */
  const fetchUserInfo = async () => {
    const res = await getUserInfo()
    if (res.code === 200) {
      userInfo.value = res.data
    }
  }

  return {
    userInfo: readonly(userInfo),
    token: readonly(token),

    fetchUserInfo,
  }
}
