import { ApiResponseInterfaces } from '@/core/interfaces/response.interfaces';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 响应数据转换拦截器
 * 统一处理响应格式，确保所有响应都符合 ApiResponse 接口规范
 * @template T - 响应数据的类型
 */
@Injectable()
export class TransformInterceptors<T> implements NestInterceptor<T, ApiResponseInterfaces<T>> {
  /**
   * 拦截并转换响应数据
   * @param context - 执行上下文，包含请求和响应对象
   * @param next - 调用处理器，处理后续逻辑
   * @returns 转换后的响应数据流
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseInterfaces<T>> {
    const response = context.switchToHttp().getResponse();
    const contentType = response.getHeader('Content-Type');
    const handler = context.getHandler();
    const skipTransform = Reflect.getMetadata('skipResponseTransform', handler);

    // 如果设置了跳过转换，直接返回原始数据
    if (skipTransform) {
      return next.handle();
    }

    // SSE 流处理
    if (contentType?.includes('text/event-stream')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const code =
          data?.code ??
          (response.statusCode >= HttpStatus.BAD_REQUEST ? response.statusCode : HttpStatus.OK);

        return {
          code,
          data: data?.data,
          message: data?.message || (code >= HttpStatus.BAD_REQUEST ? '请求失败!' : '请求成功!'),
          errors: data?.errors ?? null,
        };
      }),
    );
  }
}
