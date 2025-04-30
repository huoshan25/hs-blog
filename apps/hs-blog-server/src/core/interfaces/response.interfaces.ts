/**
 * 统一响应结构
 */
export interface ApiResponseInterfaces<T = unknown, E = unknown> {
  code: number;
  data?: T;
  message: string;
  errors?: E;
}
