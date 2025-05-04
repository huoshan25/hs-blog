import { RedisModule } from '@/core/redis/redis.module';
import { EmailModule } from '@/modules/email/email.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthBlogController } from "@/modules/auth/controller/auth-blog.controller";
import { AuthAdminController } from '@/modules/auth/controller/auth-admin.controller';
import { User } from '../user/entities/user.entity';
import { RolesGuard } from './guards/roles.guard';
import { AdminGuard } from './guards/admin.guard';

/**
 * 认证模块
 * 提供 JWT 认证相关的功能，包括：
 * 1. 令牌生成和验证
 * 2. 路由保护
 * 3. 全局认证守卫
 */
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        verifyOptions: {
          ignoreExpiration: false,
        },
        signOptions: {
          //过期时间
          expiresIn: configService.get('JWT_EXPIRES_IN'),
          // 签名算法
          algorithm: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    EmailModule,
    RedisModule,
    UserModule,
  ],
  controllers: [
    AuthBlogController,
    AuthAdminController,
  ],
  providers: [
    AuthService,
    AuthConfig,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    RolesGuard,
    AdminGuard,
  ],
  exports: [AuthService, AuthConfig, JwtModule, RolesGuard, AdminGuard],
})
export class AuthModule {}
