import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * 认证配置服务
 * 负责从环境变量中读取认证相关的配置
 */
@Injectable()
export class AuthConfig {
  constructor(private configService: ConfigService) {}

  /**
   * JWT 签名密钥
   * 用于签名和验证 JWT token
   */
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'your-secret-key';
  }

  /**
   * JWT 访问令牌过期时间
   * 默认 5 天
   */
  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') || '5d';
  }

  /**
   * 刷新令牌签名密钥
   * 用于签名和验证刷新令牌
   */
  get refreshSecret(): string {
    return this.configService.get<string>('REFRESH_SECRET') || 'your-refresh-secret';
  }

  /**
   * 刷新令牌过期时间
   * 默认 7 天
   */
  get refreshExpiresIn(): string {
    return this.configService.get<string>('REFRESH_EXPIRES_IN') || '7d';
  }
}
