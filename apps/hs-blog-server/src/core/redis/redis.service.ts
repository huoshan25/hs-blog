import { LoggerService } from '@/core/logger/logger.service';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly logger = new LoggerService().setContext(RedisService.name);
  private retryCount = 0;

  constructor(private configService: ConfigService) {
    const redisConfig = this.configService.get('redis');
    const logger = this.logger;
    
    this.redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
      retryStrategy: (times) => {
        this.retryCount = times;
        const maxRetryTimes = 10;
        if (times > maxRetryTimes) {
          logger.error(`Redis连接失败，已达到最大重试次数(${maxRetryTimes})，不再重试`);
          return null;
        }
        
        // 指数退避策略，重试间隔呈指数增长
        const delay = Math.min(Math.pow(2, times) * 100, 5000); // 最大延迟5秒
        logger.log(`Redis连接失败，${delay}ms后第${times}次重试（最大${maxRetryTimes}次）`);
        return delay;
      },
      connectTimeout: 5000, // 设置连接超时时间为5秒
      maxRetriesPerRequest: 3 // 每个请求的最大重试次数
    });

    this.redis.on('connect', () => {
      this.logger.log('Redis客户端连接成功');
      this.retryCount = 0; // 连接成功后重置计数器
    });

    this.redis.on('error', (error) => {
      this.logger.error(`Redis客户端错误: ${error.message}，当前重试次数: ${this.retryCount}`);
    });

    this.redis.on('close', () => {
      this.logger.warn('Redis连接关闭');
    });

    this.redis.on('reconnecting', () => {
      this.logger.log('Redis正在尝试重新连接');
    });

    this.redis.on('end', () => {
      this.logger.warn('Redis连接终止，不会自动重连');
    });
  }

  getClient(): Redis {
    return this.redis;
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  /**
   * 设置键值对
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒）
   */
  async set(key: string, value: string | number | Buffer, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.set(key, value, 'EX', ttl);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      this.logger.error(`设置失败 ${key}:`, error);
      throw error;
    }
  }

  /**
   * 获取值
   * @param key 键
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      this.logger.error(`获取失败 ${key}:`, error);
      throw error;
    }
  }

  /**
   * 删除键
   * @param key 键
   */
  async del(key: string | string[]): Promise<void> {
    try {
      await this.redis.del(Array.isArray(key) ? key : [key]);
    } catch (error) {
      this.logger.error(`删除失败 ${key}:`, error);
      throw error;
    }
  }

  /**
   * 设置哈希表字段
   * @param key 键
   * @param field 字段
   * @param value 值
   */
  async hset(key: string, field: string, value: string | number): Promise<void> {
    try {
      await this.redis.hset(key, field, value);
    } catch (error) {
      this.logger.error(`设置哈希表字段失败 ${key}:${field}:`, error);
      throw error;
    }
  }

  /**
   * 获取哈希表字段
   * @param key 键
   * @param field 字段
   */
  async hget(key: string, field: string): Promise<string | null> {
    try {
      return await this.redis.hget(key, field);
    } catch (error) {
      this.logger.error(`获取哈希表字段失败 ${key}:${field}:`, error);
      throw error;
    }
  }

  /**
   * 检查键是否存在
   * @param key 键
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`检查键是否存在失败 ${key}:`, error);
      throw error;
    }
  }

  /**
   * 设置键的过期时间
   * @param key 键
   * @param seconds 过期时间（秒）
   */
  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.redis.expire(key, seconds);
    } catch (error) {
      this.logger.error(`设置过期时间失败 ${key}:`, error);
      throw error;
    }
  }

  /**
   * 原子递增
   * @param key 键
   * @param increment 增量
   */
  async incr(key: string, increment = 1): Promise<number> {
    try {
      return increment === 1 ? await this.redis.incr(key) : await this.redis.incrby(key, increment);
    } catch (error) {
      this.logger.error(`递增失败 ${key}:`, error);
      throw error;
    }
  }

  /**
   * 设置键值对，如果键不存在
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒）
   */
  async setnx(key: string, value: string | number, ttl?: number): Promise<boolean> {
    try {
      const result = await this.redis.setnx(key, value);
      if (result === 1 && ttl) {
        await this.expire(key, ttl);
      }
      return result === 1;
    } catch (error) {
      this.logger.error(`设置键值对失败(键不存在时) ${key}:`, error);
      throw error;
    }
  }
}
