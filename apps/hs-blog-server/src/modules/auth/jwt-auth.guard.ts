import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

/**
 * JWT 认证守卫
 * 处理路由的认证逻辑
 * 默认所有路由都需要认证
 * 使用 @Public() 装饰器来标记不需要认证的路由
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
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

    // 如果是公开的路由，直接放行
    if (isPublic) {
      return true;
    }

    // 其他情况需要认证
    return super.canActivate(context);
  }
}
