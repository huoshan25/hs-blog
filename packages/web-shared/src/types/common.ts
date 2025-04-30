/**
 * 通用类型定义
 */

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应结构
 */
export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * API响应基础结构
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: number;
}

/**
 * 列表项的基础接口
 */
export interface BaseItem {
  id: string | number;
  name?: string;
  createTime?: string | number | Date;
  updateTime?: string | number | Date;
}

/**
 * 树形数据节点
 */
export interface TreeNode<T = any> {
  id: string | number;
  label: string;
  children?: TreeNode<T>[];
  parentId?: string | number | null;
  [key: string]: any;
} 