import { useStorage } from '@vueuse/core'
import {getUserInfo, login, register, type UserInfoRes} from '@/api/user'
import { HttpStatus } from '~/enums/httpStatus'

export interface LoginReq {
  usernameOrEmail: string
  password: string
}

export interface RegisterReq {
  username: string
  password: string
  confirmPassword: string
  email: string
  code: string
  agreeTerms?: boolean
}

export const useUser = () => {
  /** 用户信息 */
  const userInfo = useStorage<UserInfoRes>('user', {} as UserInfoRes)
  /** 访问令牌 */
  const token = useStorage<string>('token', () => '')
  /** 刷新token */
  const refreshToken = useStorage<string>('refreshToken', () => '')
  /** 登录模态框状态 */
  const loginModalVisible = useState<boolean>('loginModalVisible', () => false)

  /** 设置用户信息 */
  const setUser = (user: UserInfoRes) => {
    userInfo.value = user
  }

  /**
   * 设置token
   * @param t jwt token
   * @param ft 刷新token
   */
  const setToken = (t: string, ft: string) => {
    token.value = t
    refreshToken.value = ft
  }

  /** 清除用户信息 */
  const clearUser = () => {
    userInfo.value = null
    token.value = ''
  }

  /** 显示登录框 */
  const showLoginModal = () => {
    loginModalVisible.value = true
  }

  /** 隐藏登录框 */
  const hideLoginModal = () => {
    loginModalVisible.value = false
  }

  /**获取用户信息*/
  const fetchUserInfo = async (accessToken?: string) => {
    const res = await getUserInfo(accessToken)
    if (res.code === HttpStatus.OK) {
      setUser(res.data)
    }
  }

  /**登录*/
  const fetchLogin = async (loginData: LoginReq) => {
    const res = await login(loginData)
    if (res.code === HttpStatus.OK) {
      const accessToken = res.data.accessToken
      const refreshToken = res.data.refreshToken
      setToken(accessToken, refreshToken)
      hideLoginModal()
      await fetchUserInfo(accessToken)
      return true
    }
    return false
  }

  /**注册*/
  const fetchRegister = async (registerData: RegisterReq) => {
    const res = await register(registerData)
    if (res.code === HttpStatus.OK) {
      setToken(res.data.accessToken, res.data.refreshToken)
      hideLoginModal()
      return true
    }
    return false
  }

  return {
    userInfo,
    token,
    loginModalVisible,

    setUser,
    setToken,
    clearUser,
    showLoginModal,
    hideLoginModal,
    fetchLogin,
    fetchRegister,
    fetchUserInfo
  }
}
