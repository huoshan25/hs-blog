import { ArticleTypeEnum, StatusEnum } from '../constants';

/**
 * 通用分页请求参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 通用分页响应
 */
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 通用API响应
 */
export interface ApiResponse<T = any> {
  data: T;
  code: number;
  message: string;
  success: boolean;
}

/**
 * 文章基本信息
 */
export interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  type: ArticleTypeEnum;
  status: StatusEnum;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

/**
 * 用户信息
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  status: StatusEnum;
  createdAt: string;
  updatedAt: string;
} 