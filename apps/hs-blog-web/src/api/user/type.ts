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
  /**等级*/
  level: string;
  /**职位*/
  position: string;
  createdAt: string;
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
 * 用户等级信息响应
 */
export interface UserLevelRes {
  level: string;
  points: number;
  currentPoints: number;
  nextLevelPoints: number;
  percentage: number;
  currentLevel: string;
  nextLevel: string | null;
}
