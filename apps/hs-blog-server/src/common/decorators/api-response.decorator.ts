import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export class ApiResponseBase<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 用于生成包含单个对象响应的Swagger文档
 *
 * @param model 响应对象的类型（需要是一个类，通常是VO类）
 * @param status HTTP状态码，默认为200
 * @returns 装饰器
 *
 * @example
 * // 返回单个用户对象
 * @ApiResponseObject(UserVo)
 * async getUser(@Param('id') id: number) {
 *   const user = await this.userService.findById(id);
 *   return {
 *     code: 200,
 *     message: '获取成功',
 *     data: user
 *   };
 * }
 */
export const ApiResponseObject = <TModel extends Type<any>>(
  model: TModel,
  status: number = 200,
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseBase, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseBase) },
          {
            properties: {
              code: { type: 'number', example: 200 },
              message: { type: 'string', example: '操作成功' },
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
      type: model,
    }),
  );
};

/**
 * 用于生成包含对象数组响应的Swagger文档
 *
 * @param model 数组元素的类型（需要是一个类，通常是VO类）
 * @param status HTTP状态码，默认为200
 * @returns 装饰器
 *
 * @example
 * // 返回用户列表
 * @ApiResponseArray(UserVo)
 * async getUsers() {
 *   const users = await this.userService.findAll();
 *   return {
 *     code: 200,
 *     message: '获取成功',
 *     data: users
 *   };
 * }
 */
export const ApiResponseArray = <TModel extends Type<any>>(model: TModel, status: number = 200) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseBase, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseBase) },
          {
            properties: {
              code: { type: 'number', example: 200 },
              message: { type: 'string', example: '操作成功' },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
      type: [model],
    }),
  );
};

/**
 * 用于生成包含基本数据类型响应的Swagger文档
 *
 * @param type 响应数据的类型，可选值: 'string' | 'number' | 'boolean' | 'object'
 * @param example 示例值，用于在Swagger文档中展示
 * @param status HTTP状态码，默认为200
 * @returns 装饰器
 *
 * @example
 * // 返回字符串
 * @ApiResponsePrimitive('string', '操作已完成')
 * async deleteUser(@Param('id') id: number) {
 *   await this.userService.delete(id);
 *   return {
 *     code: 200,
 *     message: '删除成功',
 *     data: '用户已删除'
 *   };
 * }
 *
 * // 返回数字
 * @ApiResponsePrimitive('number', 42)
 * async getCount() {
 *   const count = await this.userService.count();
 *   return {
 *     code: 200,
 *     message: '获取成功',
 *     data: count
 *   };
 * }
 */
export const ApiResponsePrimitive = (
  type: 'string' | 'number' | 'boolean' | 'object',
  example: any = '',
  status: number = 200,
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseBase),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseBase) },
          {
            properties: {
              code: { type: 'number', example: 200 },
              message: { type: 'string', example: '操作成功' },
              data: { type, example },
            },
          },
        ],
      },
    }),
  );
};
