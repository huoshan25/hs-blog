import {
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

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
export const ApiResponseArray = <TModel extends Type<any>>(
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
 * 分页数据结构类
 * 用于Swagger文档
 */
export class PaginatedResponseBase<T> {
  @ApiProperty({ description: '总记录数', example: 100 })
  total: number;

  @ApiProperty({ description: '当前页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页条数', example: 10 })
  pageSize: number;

  @ApiProperty({ description: '总页数', example: 10 })
  totalPages: number;

  @ApiProperty({ description: '是否有下一页', example: true })
  hasNext: boolean;

  @ApiProperty({ description: '是否有上一页', example: false })
  hasPrevious: boolean;

  @ApiProperty({ description: '数据列表', isArray: true })
  items: T[];
}

/**
 * 用于生成包含分页数据结构的Swagger文档
 * 支持自定义分页数据字段名
 *
 * @param model 分页数据元素的类型（通常是VO类）
 * @param dataField 分页数据的字段名，默认为'items'
 * @param status HTTP状态码，默认为200
 * @returns 装饰器
 *
 * @example
 * // 使用默认分页结构 - data.items
 * @ApiResponsePaginated(UserVo)
 * async getUsers() {
 *   const users = await this.userService.findPaginated();
 *   return {
 *     code: 200,
 *     message: '获取成功',
 *     data: {
 *       items: [...], // 数据列表
 *       total: 100,   // 总记录数
 *       page: 1,      // 当前页码
 *       pageSize: 10  // 每页条数
 *     }
 *   };
 * }
 *
 * @example
 * // 使用自定义分页结构 - data.records
 * @ApiResponsePaginated(UserVo, 'records')
 * async getUsersCustom() {
 *   const users = await this.userService.findCustomPaginated();
 *   return {
 *     code: 200,
 *     message: '获取成功',
 *     data: {
 *       records: [...], // 数据列表 (使用records字段)
 *       total: 100,     // 总记录数
 *       current: 1,     // 当前页码
 *       size: 10        // 每页条数
 *     }
 *   };
 * }
 */
export const ApiResponsePaginated = <TModel extends Type<any>>(
  model: TModel,
  dataField: string = 'items',
  status: number = 200,
) => {
  // 创建一个动态类，包含自定义字段名的分页结构
  class PaginatedResponse {
    @ApiProperty({
      description: '数据列表',
      type: 'array',
      items: { $ref: getSchemaPath(model) },
    })
    [dataField]: any[];

    @ApiProperty({ description: '总记录数', example: 100 })
    total: number;

    // 可选的其他分页字段
    @ApiProperty({ description: '当前页码', example: 1, required: false })
    page?: number;

    @ApiProperty({ description: '当前页码', example: 1, required: false })
    current?: number;

    @ApiProperty({ description: '每页条数', example: 10, required: false })
    pageSize?: number;

    @ApiProperty({ description: '每页条数', example: 10, required: false })
    size?: number;
  }

  return applyDecorators(
    ApiExtraModels(ApiResponseBase, model, PaginatedResponse),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseBase) },
          {
            properties: {
              code: { type: 'number', example: 200 },
              message: { type: 'string', example: '操作成功' },
              data: { $ref: getSchemaPath(PaginatedResponse) },
            },
          },
        ],
      },
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
