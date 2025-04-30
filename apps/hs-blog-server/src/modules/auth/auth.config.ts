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

  /**
   * 白名单路径列表
   * 这些路径不需要任何认证就可以访问
   */
  get whiteList(): string[] {
    const whiteListStr = this.configService.get<string>('AUTH_WHITE_LIST');
    return whiteListStr ? JSON.parse(whiteListStr) : [];
  }

  /**
   * 公开路径前缀列表
   * 这些路径前缀下的所有路径都是公开的
   */
  get publicPrefixes(): string[] {
    const prefixesStr = this.configService.get<string>('AUTH_PUBLIC_PREFIXES');
    return prefixesStr ? JSON.parse(prefixesStr) : [];
  }

  /**
   * 受保护路径前缀列表
   * 这些路径前缀下的所有路径都需要认证
   */
  get protectedPrefixes(): string[] {
    const prefixesStr = this.configService.get<string>('AUTH_PROTECTED_PREFIXES');
    return prefixesStr ? JSON.parse(prefixesStr) : [];
  }

  /**
   * 异常路径列表
   * 这些路径会被特殊处理，不受其他规则影响
   */
  get exceptions(): string[] {
    return this.configService.get<string[]>('AUTH_EXCEPTIONS') || [];
  }
}
