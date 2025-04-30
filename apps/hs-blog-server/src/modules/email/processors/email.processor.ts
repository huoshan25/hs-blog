import { LoggerService } from '@/core/logger/logger.service';
import { EmailService } from '@/modules/email/service/email.service';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

/**
 * 邮件处理器
 * 用于处理邮件队列中的任务
 */
@Processor('email')
export class EmailProcessor {
  /*创建日志记录器实例*/
  private readonly logger = new LoggerService().setContext(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * 处理发送邮件的任务
   * @param job 队列任务对象，包含发送邮件所需的数据
   * @returns 邮件发送结果
   */
  @Process('send-email')
  async handleSendEmail(job: Job) {
    this.logger.debug(`开始处理任务 ${job.id}, 类型: ${job.name}`);
    try {
      const result = await this.emailService.processEmail(job.data);
      this.logger.debug(`任务 ${job.id} 邮件发送成功`);
      return result;
    } catch (error) {
      this.logger.error(`任务 ${job.id} 处理失败:`, error);
      throw error;
    }
  }
}
