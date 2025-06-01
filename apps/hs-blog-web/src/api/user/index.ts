interface Skills {
  name: string;
  items: { name: string }[];
}

interface Projects {
  name: string;
  description: string;
  tech: string[];
  link: string;
}

interface Contacts {
  platform: string;
  link: string;
  icon: string;
}

export interface Seo {
  title: string;
  description: string;
  keywords: string;
  ogDescription: string;
  twitterDescription: string;
}

export interface ProfileInfoRes {
  name: string;
  title: string;
  description: string;
  bio: string[];
  skills: Skills[];
  projects: Projects[];
  contacts: Contacts[];
  seo: Seo;
}

export interface LoginReq {
  usernameOrEmail: string;
  password: string;
}

export interface LoginRes {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
}

/** 注册请求参数 */
export interface RegisterReq {
  /** 用户名 */
  username: string
  /** 邮箱 */
  email: string
  /** 密码 */
  password: string
  /** 确认密码 */
  confirmPassword: string
  /** 验证码 */
  code: string
}

export interface UserInfoRes {
  id: number;
  userName: string;
  email: string;
  avatar: string;
}

export interface RegisterRes {
  accessToken: string;
  refreshToken: string;
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

/**
 * 获取关于信息
 */
export async function getProfileInfo() {
  return await fetchRequest.get<ProfileInfoRes>("/user/personal-profile-info");
}

/** 获取用户信息 */
export async function getUserInfo(accessToken?: string) {
  const {token} = useUser()
  const options: any = {};

  options.headers = {
    Authorization: `Bearer ${accessToken || token.value}`
  };
  
  return await fetchRequest.get<UserInfoRes>('/user/profile', undefined, options);
}

/** 登录 */
export async function login(params: LoginReq) {
  return await fetchRequest.post<LoginRes>('/auth/login', params);
}

/** 获取邮箱验证码 */
export async function getEmailCode(params: { email: string }) {
  return await fetchRequest.post("/auth/send-code", params);
}

/** 注册 */
export async function register(params: RegisterReq) {
  return await fetchRequest.post<RegisterRes>("/auth/register", params);
}

/** 刷新token令牌 */
export async function getRefreshToken(params: { refreshToken: string }) {
  return await fetchRequest.post<LoginRes>('/user/refresh-token', params);
}

/**获取用户卡片信息*/
export async function getUserBio() {
  return await fetchRequest.get<UserBioRes>('/user/bio')
}