import { UseGuards, applyDecorators } from '@nestjs/common';

import { JwtAuthGuard } from '../jwt-auth.guard';

/**
 * 需要认证的装饰器
 * 用于标记需要 JWT 认证的控制器或路由
 *
 * @example 使用示例
 * ```typescript
 * @Controller('users')
 * @RequireAuth()  // 整个控制器都需要认证
 * export class UsersController {
 *   @Get()
 *   findAll() {}  // 这个方法也需要认证
 *
 *   @Get('public')
 *   @Public()  // 这个方法不需要认证
 *   public() {}
 * }
 * ```
 */
export function RequireAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
