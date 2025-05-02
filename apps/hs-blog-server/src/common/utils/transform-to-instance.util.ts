import { Type } from '@nestjs/common';
import { plainToInstance, ClassTransformOptions } from 'class-transformer';

/**
 * 工具函数：将数据转换为指定类的实例
 * 
 * 用于将普通JavaScript对象(如API返回数据)转换为指定类的实例对象，
 * 以便利用类中定义的方法和类型校验能力。
 * 
 * 支持处理:
 * - 单个对象
 * - 对象数组
 * - null/undefined (直接返回原值)
 * 
 * @param cls 要转换成的目标类
 * @param data 要转换的数据 (可以是单个对象或对象数组)
 * @param options 转换选项，控制转换行为
 * @returns 转换后的类实例或类实例数组
 * 
 * @example
 * // 转换单个对象
 * const userDto = transformToInstance(UserDto, userData);
 * 
 * @example
 * // 转换对象数组
 * const userDtos = transformToInstance(UserDto, usersData);
 * 
 * @example
 * // 使用自定义转换选项
 * const userDto = transformToInstance(UserDto, userData, { 
 *   excludeExtraneousValues: true,
 *   enableImplicitConversion: false
 * });
 */
export function transformToInstance<T>(cls: Type<T>, data: any, options: ClassTransformOptions): T | T[] {
  // 处理null或undefined值
  if (data === null || data === undefined) {
    return data;
  }
  
  // 对数组和单个对象使用相同的转换逻辑
  // plainToInstance已经内部处理了数组情况
  return plainToInstance(cls, data, options);
} 