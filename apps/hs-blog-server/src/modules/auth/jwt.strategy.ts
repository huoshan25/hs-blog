import {LoggerService} from '@/core/logger/logger.service';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UserService} from '@/modules/user/service/user.service';

/**
 * JWT 策略
 * 用于验证 JWT 令牌并获取用户信息
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new LoggerService().setContext(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * 验证令牌并返回用户信息
   * @docs
   * 1, PassportStrategy 基类期望子类实现一个名为 validate 的方法，这是 Passport.js 与 NestJS 集成的约定
   * 2, 当认证流程执行时，Passport 框架会自动查找并调用这个 validate 方法
   * 3, 这个方法的返回值会被 Passport 自动设置为 request.user
   * @param payload JWT 令牌负载
   * @returns 用户信息
   * @throws UnauthorizedException 当用户不存在或令牌无效时
   */
  async validate(payload: { sub: number; username: string; email: string }) {
    try {
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        this.logger.warn(`用户不存在: ${payload.sub}`);
        throw new UnauthorizedException('用户不存在');
      }
      return user;
    } catch (error) {
      this.logger.error('令牌验证失败:', error);
      throw new UnauthorizedException('无效的令牌');
    }
  }
}
