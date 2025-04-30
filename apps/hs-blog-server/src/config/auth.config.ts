import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  // 刷新令牌配置
  refresh: {
    secret: process.env.REFRESH_SECRET,
    expiresIn: process.env.REFRESH_EXPIRES_IN,
  },
  // 白名单配置
  whiteList: JSON.parse(process.env.AUTH_WHITE_LIST || '[]'),
  // 公开路径前缀
  publicPrefixes: JSON.parse(process.env.AUTH_PUBLIC_PREFIXES || '[]'),
  // 受保护路径前缀
  protectedPrefixes: JSON.parse(process.env.AUTH_PROTECTED_PREFIXES || '[]'),
}));
