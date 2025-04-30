import { UseInterceptors, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';

export function TransformToVo(voClass: Type<any>) {
  return UseInterceptors({
    intercept: (_, next) => {
      return next.handle().pipe(
        map((data) => {
          // 处理分页数据结构
          if (data.data?.items) {
            return {
              ...data,
              data: {
                ...data.data,
                items: plainToInstance(voClass, data.data.items, {
                  excludeExtraneousValues: false,
                  enableImplicitConversion: true,
                }),
              },
            };
          }
          
          // 处理普通数据结构
          return {
            ...data,
            data: Array.isArray(data.data)
              ? plainToInstance(voClass, data.data, {
                  excludeExtraneousValues: false,
                  enableImplicitConversion: true,
                })
              : plainToInstance(voClass, data.data, {
                  excludeExtraneousValues: false,
                  enableImplicitConversion: true,
                }),
          };
        }),
      );
    },
  });
}