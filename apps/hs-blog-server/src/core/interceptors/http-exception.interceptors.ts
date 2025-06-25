import { ApiResponseInterfaces } from '@/core/interfaces/response.interfaces';
import { NodeEnv } from '@/enum/node-env.enum';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';

/**
 * 全局异常过滤器
 * 处理所有未捕获的异常，包括 HTTP 异常、数据库异常和其他运行时异常
 */
@Catch()
export class HttpExceptionFilterInterceptors implements ExceptionFilter {
  /**
   * 捕获并处理异常
   * @param exception - 捕获到的异常对象
   * @param host - 提供请求/响应上下文的参数主机
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // HTTP 异常处理
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as Record<string, any>;

      // 优先使用异常中的自定义code，如果没有则使用HTTP状态码
      const errorCode = (typeof exceptionResponse === 'object' && exceptionResponse.code !== undefined)
        ? exceptionResponse.code
        : status;

      const errorResponse: ApiResponseInterfaces = {
        code: errorCode,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exceptionResponse.message || exception.message,
        errors: typeof exceptionResponse === 'object' ? exceptionResponse.errors : undefined,
        data: exceptionResponse.data || null,
      };

      response.status(status).json(errorResponse);
      return;
    }

    // 数据库异常处理
    if (exception instanceof QueryFailedError || exception instanceof TypeORMError) {
      const errorResponse: ApiResponseInterfaces = {
        code: HttpStatus.BAD_REQUEST,
        message: exception.message,
        errors: process.env.NODE_ENV === NodeEnv.Development ? exception : undefined,
        data: null,
      };

      response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
      return;
    }

    /*其他未知异常处理*/
    const errorResponse: ApiResponseInterfaces = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception instanceof Error ? exception.message : '服务器内部错误',
      data: null,
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
