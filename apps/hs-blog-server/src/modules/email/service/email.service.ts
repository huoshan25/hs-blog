import { LoggerService } from '@/core/logger/logger.service';
import { NodeEnv } from '@/enum/node-env.enum';
import { EmailConfigService } from '@/modules/email/service/email-config.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { IEmailOptions, IEmailResult } from '../interfaces/email.interface';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  private transporter: nodemailer.Transporter;
  private readonly maxRetries = 3;

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly emailConfigService: EmailConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(EmailService.name);
  }

  async onModuleInit() {
    try {
      const smtpConfig = this.emailConfigService.getSmtpConfig();

      this.transporter = nodemailer.createTransport({
        ...smtpConfig,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      });

      // 只在生产环境验证连接
      if (process.env.NODE_ENV === NodeEnv.Production) {
        await this.transporter.verify();
        this.logger.log('邮件服务器连接建立');
      } else {
        this.logger.log('开发环境：跳过邮件服务器连接验证');
      }
      this.logger.log('邮件服务器连接建立');
    } catch (error) {
      this.logger.error(`邮件服务器连接失败: ${error}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.transporter.close();
  }

  /**
   * 发送邮件
   * @param options
   */
  async sendEmail(options: IEmailOptions): Promise<IEmailResult> {
    // 添加到队列
    const job = await this.emailQueue.add('send-email', options, {
      attempts: this.maxRetries,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });

    return { success: true, messageId: job.id.toString() };
  }

  /**
   * 处理邮件
   * @param options
   */
  async processEmail(options: IEmailOptions): Promise<IEmailResult> {
    try {
      // 合并网站配置到上下文
      const context = {
        ...options.context,
        ...this.emailConfigService.getWebsiteConfig(),
      };

      const html = await this.renderTemplate(options.template, context);

      const mailOptions: nodemailer.SendMailOptions = {
        from: `${this.emailConfigService.alias} <${this.emailConfigService.user}>`,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        html,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error('发送邮件失败:', error);
      return {
        success: false,
        error,
      };
    }
  }

  /**
   * 渲染邮件模板
   * @param templateName 模板名称
   * @param context 上下文数据
   * @private
   */
  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    try {
      const cwd = process.cwd();
      this.logger.debug(`当前工作目录: ${cwd}`);

      // 根据环境确定模板路径
      let templatePath: string;
      if (process.env.NODE_ENV === NodeEnv.Production) {
        // 生产环境：使用编译后的 dist 目录
        templatePath = path.join(cwd, 'dist/modules/email/templates', `${templateName}.ejs`);
      } else {
        // 开发环境：使用源码目录
        templatePath = path.join(cwd, 'src/modules/email/templates', `${templateName}.ejs`);
      }

      this.logger.debug(`尝试加载模板文件: ${templatePath}`);
      this.logger.debug(`模板名称: ${templateName}`);
      this.logger.debug(`上下文数据: ${JSON.stringify(context)}`);

      return await ejs.renderFile(templatePath, context, {
        cache: process.env.NODE_ENV === NodeEnv.Production,
      });
    } catch (error) {
      this.logger.error(`模板渲染失败: ${error.message}`);
      this.logger.error(`错误堆栈: ${error.stack}`);
      throw new Error(`未能呈现电子邮件模板: ${error.message}`);
    }
  }
}
