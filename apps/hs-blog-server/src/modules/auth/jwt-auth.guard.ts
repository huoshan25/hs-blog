import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthConfig } from './auth.config';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

/**
 * JWT 认证守卫
 * 处理路由的认证逻辑，包括：
 * 1. 白名单检查
 * 2. 公开路径检查
 * 3. @Public 装饰器检查
 * 4. JWT 令牌验证
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authConfig: AuthConfig,
  ) {
    super();
  }

  /**
   * 判断是否需要认证
   * @param context 执行上下文
   * @returns 是否需要认证
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 检查是否有 @Public 装饰器
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const path = request.path;

    // 检查是否是白名单路径
    const isWhitelisted = this.authConfig.whiteList.some((whitePath) => path.startsWith(whitePath));

    // 检查是否是公开前缀
    const isPublicPrefix = this.authConfig.publicPrefixes.some((prefix) => path.startsWith(prefix));

    // 如果是白名单或公开路径，不需要认证
    if (isWhitelisted || isPublicPrefix) {
      return true;
    }

    // 其他情况需要认证
    return super.canActivate(context);
  }
}
