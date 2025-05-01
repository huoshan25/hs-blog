import { RedisService } from '@/core/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/core/logger/logger.service';

@Injectable()
export class EmailVerificationService {
  private readonly logger = new LoggerService().setContext(EmailVerificationService.name);
  private readonly CODE_PREFIX = 'email:code:';
  private readonly CODE_EXPIRE_TIME = 300; // 验证码过期时间（秒）

  constructor(
    private readonly redisService: RedisService
  ) {}

  /**
   * 设置邮箱验证码
   * @param email 邮箱
   * @param code 验证码
   */
  async setCode(email: string, code: string): Promise<void> {
    try {
      const key = `${this.CODE_PREFIX}${email}`;
      await this.redisService.set(key, code, this.CODE_EXPIRE_TIME);
      this.logger.debug(`邮箱${email}的验证码已设置: ${code}`);
    } catch (error) {
      this.logger.error(`设置邮箱验证码失败: ${email}`, error);
      throw error;
    }
  }

  /**
   * 获取邮箱验证码
   * @param email 邮箱
   */
  async getCode(email: string): Promise<string | null> {
    try {
      const key = `${this.CODE_PREFIX}${email}`;
      const code = await this.redisService.get(key);
      this.logger.debug(`获取邮箱${email}的验证码: ${code}`);
      return code;
    } catch (error) {
      this.logger.error(`获取邮箱验证码失败: ${email}`, error);
      throw error;
    }
  }

  /**
   * 验证邮箱验证码
   * @param email 邮箱
   * @param code 验证码
   */
  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      const storedCode = await this.getCode(email);
      if (!storedCode) {
        this.logger.debug(`邮箱${email}的验证码不存在或已过期`);
        return false;
      }
      const isValid = storedCode === code;
      this.logger.debug(`验证邮箱${email}的验证码 - 输入: ${code}, 存储: ${storedCode}, 结果: ${isValid}`);
      return isValid;
    } catch (error) {
      this.logger.error(`验证邮箱验证码失败: ${email}`, error);
      throw error;
    }
  }

  /**
   * 删除邮箱验证码
   * @param email 邮箱
   */
  async deleteCode(email: string): Promise<void> {
    try {
      const key = `${this.CODE_PREFIX}${email}`;
      await this.redisService.del(key);
      this.logger.debug(`删除邮箱${email}的验证码`);
    } catch (error) {
      this.logger.error(`删除邮箱验证码失败: ${email}`, error);
      throw error;
    }
  }
} 