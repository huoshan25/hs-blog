import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { TokenExpiredException } from '@/common/exceptions/token-expired.exception';

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
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否有 @Public 装饰器
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 无论是否是公开路由，都尝试验证token
    try {
      // 调用父类的canActivate方法尝试验证token
      await super.canActivate(context);
    } catch (error) {
      // 如果是公开路由，即使验证失败也放行
      if (isPublic) {
        return true;
      }
      
      // 如果是token过期相关错误，抛出自定义异常
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        throw new TokenExpiredException();
      }
      
      // 其他错误直接抛出
      throw error;
    }

    // 验证成功或者是公开路由，放行
    return true;
  }

  /**
   * 处理请求
   * 即使是公开路由，如果提供了有效的 token，也会解析出用户信息
   * @param err 错误
   * @param user 用户
   * @param info 信息
   * @param context 上下文
   * @returns 用户
   */
  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    // 检查是否有 @Public 装饰器
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果是公开路由且验证失败，不抛出异常
    if (isPublic) {
      if (user) {
        // 有用户信息就设置
        request.user = user;
      }
      // 即使没有用户信息也放行
      return user;
    }
    
    // 处理JWT相关错误
    if (info instanceof Error) {
      if (info.name === 'TokenExpiredError' || info.name === 'JsonWebTokenError') {
        throw new TokenExpiredException();
      }
    }
    
    // 有错误但不是JWT错误
    if (err) {
      throw err;
    }
    
    // 没有用户信息
    if (!user) {
      throw new TokenExpiredException();
    }
    
    return user;
  }
}
