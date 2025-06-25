import type { LoginRes, ProfileInfoRes, RegisterRes, UserBioRes, UserInfoRes, UserLevelRes } from '~/api/user/type'

/**获取关于信息*/
export async function getProfileInfo() {
  return await fetchRequest.get<ProfileInfoRes>('/user/personal-profile-info')
}

/** 获取用户信息 */
export async function getUserInfo(accessToken?: string) {
  const { token } = useUser()
  const options: any = {}

  options.headers = {
    Authorization: `Bearer ${accessToken || token.value}`
  }

  return await fetchRequest.get<UserInfoRes>('/user/profile', undefined, options)
}

/** 登录 */
export async function login(params: LoginReq) {
  return await fetchRequest.post<LoginRes>('/auth/login', params)
}

/** 获取邮箱验证码 */
export async function getEmailCode(params: { email: string }) {
  return await fetchRequest.post('/auth/send-code', params)
}

/** 注册 */
export async function register(params: RegisterReq) {
  return await fetchRequest.post<RegisterRes>('/auth/register', params)
}

/** 刷新token令牌 */
export async function getRefreshToken(params: { refreshToken: string }) {
  return await fetchRequest.post<LoginRes>('/auth/refresh-token', params)
}

/**获取用户卡片信息*/
export async function getUserBio() {
  return await fetchRequest.get<UserBioRes>('/user/bio')
}

/**获取用户信息*/
export async function getUser(params: { id: string }) {
  return await fetchRequest.get<UserInfoRes>('/user/info', params)
}

/**
 * 获取当前用户的等级信息
 */
export async function getCurrentUserLevelInfo() {
  return await fetchRequest.get<UserLevelRes>('/user/level/me')
}

/**
 * 更新用户头像
 * @param formData 包含头像文件的表单数据
 */
export async function updateUserAvatar(formData: FormData) {
  const options = {
  }
  return await fetchRequest.post<any>('/user/avatar', formData, options)
}

/**
 * 修改用户密码
 * @param params 密码修改参数
 */
export async function updatePassword(params: {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}) {
  return await fetchRequest.put('/user/password', params)
}

/**
 * 更新用户基本信息
 * @param params 用户信息参数
 */
export async function updateUserInfo(params: {
  userName?: string
  email?: string
  position?: string
}) {
  return await fetchRequest.put('/user/profile', params)
}