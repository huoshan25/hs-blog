import { useStorage } from '@vueuse/core'
import { login, register } from '@/api/user'
import { HttpStatus } from '~/enums/httpStatus'

export interface UserInfo {
  id: number
  username: string
  avatar: string | null
  email: string
}

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
  const user = useStorage<UserInfo | null>('user', () => null)
  /** 访问令牌 */
  const token = useStorage<string>('token', () => '')
  /** 刷新token */
  const refreshToken = useStorage<string>('refreshToken', () => '')
  /** 登录模态框状态 */
  const loginModalVisible = useState<boolean>('loginModalVisible', () => false)

  /** 设置用户信息 */
  const setUser = (userInfo: UserInfo) => {
    user.value = userInfo
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
    user.value = null
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

  /**登录*/
  const fetchLogin = async (loginData: LoginReq) => {
    const res = await login(loginData)
    if (res.code === HttpStatus.OK) {
      setToken(res.data.accessToken, res.data.refreshToken)
      hideLoginModal()
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
    user,
    token,
    loginModalVisible,

    setUser,
    setToken,
    clearUser,
    showLoginModal,
    hideLoginModal,
    fetchLogin,
    fetchRegister
  }
}
