import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 令牌过期异常
 * 用于处理JWT令牌过期的情况，返回自定义状态码
 */
export class TokenExpiredException extends HttpException {
  constructor(message: string = '令牌无效或已过期') {
    super(
      {
        code: -102,
        message,
        data: null
      },
      HttpStatus.UNAUTHORIZED
    );
  }
} 