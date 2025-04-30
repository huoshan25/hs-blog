import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

import { ApiResponseInterfaces } from '@/core/interfaces/response.interfaces';

/**
 * 全局通用管道
 * @description 用于处理全局的数据验证逻辑
 *
 * 功能：
 * 1. 开启白名单模式(whitelist: true)：自动去除未在 DTO 中声明的属性
 * 2. 自动类型转换(transform: true)：将传入的数据转换为 DTO 中定义的类型
 * 3. 统一的错误响应格式：验证失败时返回统一的错误结构
 *
 * 错误响应示例:
 * {
 *   code: 400,
 *   message: '参数验证失败',
 *   errors: [
 *     {
 *       field: 'email',
 *       constraints: ['邮箱格式不正确', '邮箱不能为空']
 *     }
 *   ]
 * }
 */
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      /*去除未在 DTO 中声明的属性*/
      whitelist: true,
      /*自动类型转换*/
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        /*格式化验证错误信息*/
        const formatErrors = errors.map((error) => ({
          field: error.property,
          constraints: Object.values(error.constraints || {}),
        }));

        /*构造统一的错误响应*/
        const response: ApiResponseInterfaces<null, typeof formatErrors> = {
          code: 400,
          message: '参数验证失败',
          errors: formatErrors,
        };

        return new BadRequestException(response);
      },
    });
  }
}
