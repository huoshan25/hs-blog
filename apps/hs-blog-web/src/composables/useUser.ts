import { useStorage } from '@vueuse/core'
import { getUserInfo, login, register, updateUserAvatar as apiUpdateUserAvatar } from '@/api/user'
import { HttpStatus } from '~/enums/httpStatus'
import type { UserInfoRes } from '~/api/user/type'

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
  /**是否登录*/
  const isLogin = computed<boolean>(() => !!token.value && !!userInfo.value)
  /** 记住的用户名/邮箱 */
  const rememberedUser = useStorage<string>('rememberUser', '')

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
    refreshToken.value = ''
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

  /**
   * 记住用户名/邮箱
   * @param username 要记住的用户名/邮箱
   * @param remember 是否记住
   */
  const rememberUser = (username: string, remember: boolean) => {
    if (remember) {
      rememberedUser.value = username
    } else {
      rememberedUser.value = ''
    }
  }

  /**
   * 获取记住的用户名/邮箱
   * @returns 记住的用户名/邮箱
   */
  const getRememberedUser = (): string => {
    return rememberedUser.value
  }

  /**登录*/
  const fetchLogin = async (loginData: LoginReq, remember: boolean = false) => {
    const res = await login(loginData)
    if (res.code === HttpStatus.OK) {
      const accessToken = res.data.accessToken
      const refreshToken = res.data.refreshToken
      setToken(accessToken, refreshToken)
      rememberUser(loginData.usernameOrEmail, remember)
      await fetchUserInfo(accessToken)
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

  /**
   * 更新用户头像
   * @param formData 包含头像文件的表单数据
   * @returns 头像URL或null
   */
  const updateUserAvatar = async (formData: FormData) => {
    try {
      const res = await apiUpdateUserAvatar(formData)
      if (res.code === HttpStatus.OK) {
        userInfo.value.avatar = res.data.avatar
        return res
      }
      return null
    } catch (error) {
      console.error('更新头像失败', error)
      return null
    }
  }

  return {
    userInfo,
    token,
    loginModalVisible,
    isLogin,

    setUser,
    setToken,
    clearUser,
    showLoginModal,
    hideLoginModal,
    fetchLogin,
    fetchRegister,
    fetchUserInfo,
    rememberUser,
    getRememberedUser,
    updateUserAvatar
  }
}
