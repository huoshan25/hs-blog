import { RedisModule } from '@/core/redis/redis.module';
import { EmailModule } from '@/modules/email/email.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfig } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

/**
 * 认证模块
 * 提供 JWT 认证相关的功能，包括：
 * 1. 令牌生成和验证
 * 2. 路由保护
 * 3. 全局认证守卫
 */
@Module({
  imports: [
    ConfigModule, // 导入配置模块
    JwtModule.registerAsync({
      // 异步注册 JWT 模块
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // 从环境变量获取 JWT 密钥
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') }, // 从环境变量获取过期时间
      }),
      inject: [ConfigService],
    }),
    EmailModule,
    RedisModule,
    UserModule,
  ],
  controllers: [AuthController], // 注册控制器
  providers: [
    AuthService,
    AuthConfig,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ], // 注册服务和配置
  exports: [AuthService, AuthConfig, JwtModule], // 导出服务和配置供其他模块使用
})
export class AuthModule {}
