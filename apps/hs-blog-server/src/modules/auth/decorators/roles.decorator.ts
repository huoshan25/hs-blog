import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@/enum/user-role.enum';

/**
 * 角色装饰器
 * @description 用于标记需要特定角色才能访问的路由
 * @param roles 允许访问的角色列表
 * @returns 装饰器
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles); 