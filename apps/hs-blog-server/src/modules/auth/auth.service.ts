import { LoggerService } from '@/core/logger/logger.service';
import { RedisService } from '@/core/redis/redis.service';
import { EmailService } from '@/modules/email/service/email.service';
import { EmailVerificationService } from '@/modules/email/service/email-verification.service';
import { UserRole } from '@/enum/user-role.enum';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { AuthConfig } from './auth.config';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserService } from '@/modules/user/service/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new LoggerService().setContext(AuthService.name);
  private readonly CODE_EXPIRE_TIME = 300; // 验证码过期时间（秒）

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly authConfig: AuthConfig,
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  /**
   * 生成访问令牌和刷新令牌
   * @param payload 令牌负载，包含用户ID、用户名和邮箱
   * @returns 包含访问令牌和刷新令牌的对象
   */
  async generateToken(payload: {
    sub: number;
    username: string;
    email: string;
  }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.authConfig.jwtSecret,
      expiresIn: this.authConfig.jwtExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.authConfig.refreshSecret,
      expiresIn: this.authConfig.refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getExpiresInSeconds(this.authConfig.jwtExpiresIn),
    };
  }

  /**
   * 将过期时间字符串转换为秒数
   * @param expiresIn 过期时间字符串，如 '1d', '2h', '30m'
   * @returns 过期时间的秒数
   */
  private getExpiresInSeconds(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60;
      case 'h':
        return value * 60 * 60;
      case 'm':
        return value * 60;
      case 's':
        return value;
      default:
        return 3600; // 默认1小时
    }
  }

  /**
   * 验证访问令牌
   * @param token 访问令牌
   * @returns 解码后的令牌负载
   */
  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.authConfig.jwtSecret,
      });
    } catch (error) {
      this.logger.error('令牌验证失败:', error);
      throw new UnauthorizedException('令牌无效或已过期');
    }
  }

  /**
   * 刷新令牌
   * @param token 刷新令牌
   */
  async refreshToken(token: string) {
    try {
      // 验证刷新令牌
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.authConfig.refreshSecret,
      });

      // 创建新的payload，不包含exp字段
      const newPayload = {
        sub: payload.sub,
        username: payload.username,
        email: payload.email,
      };

      // 生成新的令牌对
      return this.generateToken(newPayload);
    } catch (error) {
      this.logger.error('刷新令牌失败:', error);
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
  }

  /**
   * 发送邮箱验证码
   * @param email 目标邮箱地址
   * @returns 发送结果
   */
  async sendEmailCode(email: string) {
    /*检查邮箱是否已注册*/
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('该邮箱已被注册');
    }
    try {
      // 删除可能存在的旧验证码
      await this.emailVerificationService.deleteCode(email);

      // 生成6位随机验证码
      const code = randomInt(100000, 999999).toString();

      // 存储验证码
      await this.emailVerificationService.setCode(email, code);

      // 从邮箱地址中提取用户名
      const username = email.split('@')[0];

      // 发送验证码邮件
      await this.emailService.sendEmail({
        to: email,
        subject: 'Sky Hub 验证码',
        template: 'validate.code',
        context: {
          code,
          username,
          expireTime: this.CODE_EXPIRE_TIME / 60, // 转换为分钟
        },
      });

      return true;
    } catch (error) {
      this.logger.error('发送验证码失败:', error);
      throw new BadRequestException('发送验证码失败');
    }
  }

  /**
   * 验证邮箱验证码
   * @param email 邮箱地址
   * @param code 验证码
   */
  async verifyEmailCode(email: string, code: string) {
    try {
      const isValid = await this.emailVerificationService.verifyCode(
        email,
        code,
      );

      if (!isValid) {
        throw new BadRequestException('验证码错误或已过期');
      }
      return true;
    } catch (error) {
      this.logger.error('验证码验证失败:', error);
      throw error;
    }
  }

  /**
   * 用户登录
   * @param loginDto
   */
  async login(loginDto: LoginDto) {
    try {
      // 查找用户
      const user = await this.userService.findByUsernameOrEmail(
        loginDto.usernameOrEmail,
      );

      // 验证密码
      const isValidPassword = await this.userService.validatePassword(
        loginDto.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('密码错误');
      }

      // 生成令牌
      const payload = {
        sub: user.id,
        username: user.userName,
        email: user.email,
        role: user.role,
      };

      return this.generateToken(payload);
    } catch (error) {
      this.logger.error('登录失败:', error);
      throw error;
    }
  }

  /**
   * 用户注册
   * @param registerDto
   */
  async register(registerDto: RegisterDto) {
    try {
      // 验证邮箱验证码
      await this.verifyEmailCode(registerDto.email, registerDto.code);

      // 验证两次密码是否一致
      if (registerDto.password !== registerDto.confirmPassword) {
        throw new BadRequestException('两次输入的密码不一致');
      }

      // 创建用户
      const user = await this.userService.create({
        userName: registerDto.username,
        email: registerDto.email,
        password: registerDto.password,
      });

      // 生成令牌
      const payload = {
        sub: user.id,
        username: user.userName,
        email: user.email,
      };
      const tokens = await this.generateToken(payload);

      // 发送欢迎邮件
      await this.emailService.sendEmail({
        to: user.email,
        subject: '欢迎加入 Sky Hub',
        template: 'register.success',
        context: {
          username: user.userName,
        },
      });

      await this.emailVerificationService.deleteCode(registerDto.email);

      return tokens;
    } catch (error) {
      this.logger.error('注册失败:', error);
      throw error;
    }
  }

  /**
   * 管理员登录
   * @param loginDto 登录参数
   * @returns 登录令牌
   */
  async adminLogin(loginDto: LoginDto) {
    try {
      // 查找用户
      const user = await this.userService.findByUsernameOrEmail(
        loginDto.usernameOrEmail,
      );

      // 验证用户角色
      if (user.role !== UserRole.ADMIN) {
        throw new UnauthorizedException('该账号无管理员权限');
      }

      // 验证密码
      const isValidPassword = await this.userService.validatePassword(
        loginDto.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('密码错误');
      }

      // 生成令牌
      const payload = {
        sub: user.id,
        username: user.userName,
        email: user.email,
        role: user.role,
      };

      return this.generateToken(payload);
    } catch (error) {
      this.logger.error('管理员登录失败:', error);
      throw error;
    }
  }
}
