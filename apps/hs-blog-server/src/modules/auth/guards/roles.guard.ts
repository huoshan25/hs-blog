import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '@/modules/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../auth.config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private jwtService: JwtService,
    private authConfig: AuthConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取路由所需的角色
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果路由没有指定所需角色，则允许访问
    if (!requiredRoles || requiredRoles.length === 0) {
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

      // 检查用户是否具有所需角色
      return requiredRoles.includes(user.role);
    } catch (error) {
      throw new UnauthorizedException('令牌无效或已过期');
    }
  }
} 