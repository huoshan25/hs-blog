import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiHeader, ApiUnauthorizedResponse } from '@nestjs/swagger';

/**
 * 管理员路由元数据键
 */
export const IS_ADMIN_ROUTE = 'isAdminRoute';

/**
 * 管理员装饰器
 * @description 用于标记只有管理员才能访问的路由
 * @returns 装饰器
 */
export const Admin = () => {
  return applyDecorators(
    // 设置元数据标记这是管理员路由
    SetMetadata(IS_ADMIN_ROUTE, true),
    // Swagger文档配置
    ApiHeader({
      name: 'Authorization',
      description: '管理员JWT令牌，格式: Bearer {token}',
      required: true,
    }),
    ApiUnauthorizedResponse({ description: '无管理员权限或令牌无效' }),
  );
}; 