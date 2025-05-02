import { UseInterceptors, Type } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { transformToInstance } from "@/common/utils/transform-to-instance.util";

/**
 * TransformToVo装饰器
 * 
 * 用于将控制器返回的数据自动转换为指定的VO类实例
 * 支持处理任意结构的响应数据，包括单个对象、数组、嵌套对象等
 * 
 * @param voClass 目标VO类
 * @param options 类转换选项，可选
 * @param transformConfig 转换配置，可选
 * @returns NestJS拦截器装饰器
 * 
 * @example
 * // 单个对象转换 - 基本用法
 * //@TransformToVo(UserVo)
 * async getUser(id: number) {
 *   const user = await this.userService.findById(id);
 *   return { code: 200, message: '获取成功', data: user };
 * }
 * 
 * @example
 * // 自定义转换选项
 * //@TransformToVo(UserVo, { excludeExtraneousValues: true })
 * async getUsers() {
 *   const users = await this.userService.findAll();
 *   return { code: 200, message: '获取成功', data: users };
 * }
 * 
 * @example
 * // 分页结构 items
 * //@TransformToVo(UserVo, undefined, { path: 'data.items' })
 * async getUsersWithItems() {
 *   // 返回结构如: { data: { items: [...], total: 100 } }
 *   const users = await this.userService.findPaginated();
 *   return { code: 200, message: '获取成功', data: users };
 * }
 * 
 * @example
 * // 分页结构 records
 * //@TransformToVo(UserVo, undefined, { path: 'data.records' })
 * async getUsersWithRecords() {
 *   // 返回结构如: { data: { records: [...], totalCount: 100 } }
 *   const users = await this.userService.findWithRecords();
 *   return { code: 200, message: '获取成功', data: users };
 * }
 * 
 * @example
 * // 多路径转换（多字段转换）
 * //@TransformToVo(UserVo, undefined, { paths: ['data.list', 'data.recommendList'] })
 * async getUsersMultipleArrays() {
 *   // 转换多个数组: { data: { list: [...], recommendList: [...] } }
 *   const data = await this.userService.getComplexData();
 *   return { code: 200, message: '获取成功', data };
 * }
 * 
 * @example
 * // 根据条件转换
 * //@TransformToVo(UserVo, undefined, { shouldTransform: (value, key, parentValue) => key === 'name' })
 * async getUsersWithCondition() {
 *   // 只转换 name 字段
 *   const users = await this.userService.findWithCondition();
 *   return { code: 200, message: '获取成功', data: users };
 */
export function TransformToVo(
  voClass: Type<any>,
  options: ClassTransformOptions = {
    excludeExtraneousValues: true,
    enableImplicitConversion: true
  },
  transformConfig: TransformConfig = {}
) {
  return UseInterceptors({
    intercept: (_, next) => {
      return next.handle().pipe(
        map((data) => {
          try {
            // 没有data字段的情况
            if (!data) {
              return data;
            }

            // 使用多路径转换
            if (transformConfig.paths && transformConfig.paths.length > 0) {
              let result = { ...data };

              for (const path of transformConfig.paths) {
                const valueToTransform = getValueByPath(data, path);
                if (valueToTransform) {
                  const transformed = transformToInstance(voClass, valueToTransform, options);
                  result = setValueByPath(result, path, transformed);
                }
              }

              return result;
            }

            // 使用单路径转换
            if (transformConfig.path) {
              const valueToTransform = getValueByPath(data, transformConfig.path);
              if (valueToTransform) {
                const transformed = transformToInstance(voClass, valueToTransform, options);
                return setValueByPath(data, transformConfig.path, transformed);
              }
              return data;
            }

            // 使用条件转换
            if (transformConfig.shouldTransform) {
              return transformNestedArrays(data, voClass, options, transformConfig.shouldTransform);
            }

            // 默认转换方式：直接转换 data 字段
            if (data.data !== undefined) {
              return {
                ...data,
                data: transformToInstance(voClass, data.data, options),
              };
            }

            // 如果没有 data 字段，则转换整个对象
            return transformToInstance(voClass, data, options);
          } catch (error) {
            console.error('TransformToVo转换失败:', error);
            throw error;
          }
        }),
        catchError(err => {
          console.error('TransformToVo拦截器错误:', err);
          return throwError(() => err);
        })
      );
    },
  });
}

/**
 * 转换配置接口
 */
export interface TransformConfig {
  /**
   * 需转换的数据路径，支持点语法，如 'data.items'
   * 如果不提供，则尝试转换整个 data 字段
   */
  path?: string;
  
  /**
   * 需转换的多个数据路径，支持点语法，同时转换多个字段
   * 优先级高于 path
   */
  paths?: string[];
  
  /**
   * 根据条件决定是否转换某个字段
   * @param value 当前值
   * @param key 当前键
   * @param parentValue 父对象
   * @returns 如果返回 true，则转换该字段
   */
  shouldTransform?: (value: any, key: string, parentValue: any) => boolean;
}

/**
 * 根据路径获取嵌套对象中的值
 */
function getValueByPath(obj: any, path: string): any {
  if (!path) return obj;
  return path.split('.').reduce((prev, curr) => prev && prev[curr], obj);
}

/**
 * 根据路径设置嵌套对象中的值
 */
function setValueByPath(obj: any, path: string, value: any): any {
  if (!path) return value;
  
  const result = { ...obj };
  const parts = path.split('.');
  let current = result;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    current[part] = { ...current[part] };
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
  return result;
}

/**
 * 递归转换对象中的数组
 */
function transformNestedArrays(obj: any, voClass: Type<any>, options: ClassTransformOptions, shouldTransform?: (value: any, key: string, parentValue: any) => boolean): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return transformToInstance(voClass, obj, options);
  }
  
  const result = { ...obj };
  
  for (const key in result) {
    const value = result[key];
    
    if (Array.isArray(value) && (!shouldTransform || shouldTransform(value, key, obj))) {
      result[key] = transformToInstance(voClass, value, options);
    } else if (value && typeof value === 'object') {
      result[key] = transformNestedArrays(value, voClass, options, shouldTransform);
    }
  }
  
  return result;
}