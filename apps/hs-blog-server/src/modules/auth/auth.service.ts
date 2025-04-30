import { LoggerService } from '@/core/logger/logger.service';
import { RedisService } from '@/core/redis/redis.service';
import { EmailService } from '@/modules/email/service/email.service';
import { UserService } from '@/modules/user/user.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { AuthConfig } from './auth.config';
import { LoginDto, LoginResponseDto, RegisterDto } from './dto/auth.dto';

/**
 * 认证服务
 * 处理令牌的生成、验证和刷新，以及用户认证相关的功能
 */
@Injectable()
export class AuthService {
  private readonly logger = new LoggerService().setContext(AuthService.name);
  private readonly CODE_EXPIRE_TIME = 300; // 验证码过期时间（秒）
  private readonly CODE_PREFIX = 'email:code:';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly authConfig: AuthConfig,
    private readonly userService: UserService,
  ) {}

  /**
   * 生成访问令牌和刷新令牌
   * @param payload 令牌负载，包含用户ID、用户名和邮箱
   * @returns 包含访问令牌和刷新令牌的对象
   */
  async generateToken(payload: { sub: number; username: string; email: string }) {
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
    };
  }

  /**
   * 验证访问令牌
   * @param token 访问令牌
   * @returns 解码后的令牌负载
   * @throws UnauthorizedException 当令牌无效或已过期时
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
   * @returns 新的访问令牌和刷新令牌
   * @throws UnauthorizedException 当刷新令牌无效或已过期时
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
      // 生成6位随机验证码
      const code = randomInt(100000, 999999).toString();

      // 存储验证码到Redis
      const key = `${this.CODE_PREFIX}${email}`;
      await this.redisService.set(key, code, this.CODE_EXPIRE_TIME);

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
   * @returns 验证结果
   * @throws BadRequestException 当验证码无效或已过期时
   */
  async verifyEmailCode(email: string, code: string) {
    try {
      const key = `${this.CODE_PREFIX}${email}`;
      const savedCode = await this.redisService.get(key);

      if (!savedCode) {
        throw new BadRequestException('验证码已过期');
      }

      if (savedCode !== code) {
        throw new BadRequestException('验证码错误');
      }

      // 验证成功后删除验证码
      await this.redisService.del(key);
      return true;
    } catch (error) {
      this.logger.error('验证码验证失败:', error);
      throw error;
    }
  }

  /**
   * 用户登录
   * @param loginDto 登录信息
   * @returns 访问令牌和刷新令牌
   * @throws UnauthorizedException 当用户名或密码错误时
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      // 查找用户
      const user = await this.userService.findByUsernameOrEmail(loginDto.usernameOrEmail);

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
      };

      return this.generateToken(payload);
    } catch (error) {
      this.logger.error('登录失败:', error);
      throw error;
    }
  }

  /**
   * 用户注册
   * @param registerDto 注册信息
   * @returns 访问令牌和刷新令牌
   * @throws BadRequestException 当验证码错误或密码不匹配时
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

      return tokens;
    } catch (error) {
      this.logger.error('注册失败:', error);
      throw error;
    }
  }
}
