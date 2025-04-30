import { SetMetadata } from '@nestjs/common';

/**
 * 公开接口装饰器
 * 用于标记不需要 JWT 认证的路由
 *
 * @example 使用示例
 * ```typescript
 * @Controller('users')
 * @RequireAuth()  // 整个控制器需要认证
 * export class UsersController {
 *   @Get('public')
 *   @Public()  // 这个方法不需要认证
 *   public() {}
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const IS_PUBLIC_KEY = 'isPublic';
