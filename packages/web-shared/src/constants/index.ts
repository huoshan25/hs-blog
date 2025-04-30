/**
 * 通用状态枚举
 */
export enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

/**
 * 文章类型枚举
 */
export enum ArticleTypeEnum {
  NEWS = 'news',
  BLOG = 'blog',
  TUTORIAL = 'tutorial',
}

/**
 * API请求状态
 */
export enum ApiStatusEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading',
}

/**
 * 公共常量定义
 */
export const APP_NAME = 'HSBlog';
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * 正则表达式常量
 */
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PHONE: /^1[3-9]\d{9}$/,
}; 