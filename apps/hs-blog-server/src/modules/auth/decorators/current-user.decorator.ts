import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * 当前用户装饰器
 * 
 * 用于从请求中获取当前登录用户信息
 * 同时确保用户ID是有效的数字
 * 
 * @example
 * // 在控制器方法中使用
 * @Get('profile')
 * async getProfile(@CurrentUser() user: User) {
 *   // user已经经过验证，如果未登录则为null
 *   // user.id已经确保是有效数字
 *   return this.userService.getProfile(user.id);
 * }
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  
  // 确保用户存在且ID是有效数字
  if (user && user.id !== undefined) {
    // 确保ID是数字类型
    user.id = Number(user.id);
    
    // 如果转换后是NaN，则将ID设为undefined
    if (isNaN(user.id)) {
      user.id = undefined;
    }
  }
  
  return user;
});
