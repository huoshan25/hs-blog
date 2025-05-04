import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../auth.config';
import { UserService } from '@/modules/user/service/user.service';
import { UserRole } from '@/enum/user-role.enum';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_ROUTE } from '../decorators/admin.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * 管理员守卫
 * @description 用于保护管理员路由，确保只有管理员角色可以访问
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authConfig: AuthConfig,
    private userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查路由是否标记为管理员路由
    const isAdminRoute = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果不是管理员路由，则直接放行
    if (!isAdminRoute) {
      return true;
    }

    // 检查是否为公共路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果是公共路由，则直接放行
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('请提供有效的身份令牌');
    }

    const token = authHeader.substring(7);
    try {
      // 验证JWT令牌
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.authConfig.jwtSecret,
      });

      // 获取用户信息
      const user = await this.userService.findById(payload.sub);
      request.user = user;

      // 检查用户是否为管理员
      if (user.role !== UserRole.ADMIN) {
        throw new UnauthorizedException('无管理员权限');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('令牌无效或已过期或无管理员权限');
    }
  }
} 