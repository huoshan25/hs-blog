import { EmailConfigDto } from '@/modules/email/dto/email-config.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailConfigService {
  private readonly config: EmailConfigDto;

  constructor(private configService: ConfigService) {
    const emailConfig = {
      alias: this.configService.get('MAIL_ALIAS', '火山博客'),
      host: this.configService.get('MAIL_HOST', 'smtp.163.com'),
      port: this.configService.get('MAIL_PORT', 465),
      secure: this.configService.get('MAIL_SECURE'),
      user: this.configService.get('MAIL_USER'),
      pass: this.configService.get('MAIL_PASSWORD'),
      appName: this.configService.get('APP_NAME', '火山博客'),
      appUrl: this.configService.get('APP_URL', 'http://localhost:3000'),
      appDescription: this.configService.get('APP_DESCRIPTION', '火山个人博客'),
      appLogoUrl: this.configService.get(
        'APP_LOGO_URL',
        'http://localhost:3000/static/images/logo.png',
      ),
    };

    // 验证配置
    if (!emailConfig.user || !emailConfig.pass) {
      throw new Error('缺少必需的电子邮件配置：MAIL_USER 或 MAIL_PASSWORD');
    }

    this.config = emailConfig;
  }

  get alias(): string {
    return this.config.alias;
  }

  get host(): string {
    return this.config.host;
  }

  get port(): number {
    return this.config.port;
  }

  get secure(): boolean {
    return this.config.secure;
  }

  get user(): string {
    return this.config.user;
  }

  get pass(): string {
    return this.config.pass;
  }

  get appName(): string {
    return this.config.appName;
  }

  get appUrl(): string {
    return this.config.appUrl;
  }

  get appDescription(): string {
    return this.config.appDescription;
  }

  get appLogoUrl(): string {
    return this.config.appLogoUrl;
  }

  getSmtpConfig() {
    return {
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    };
  }

  getWebsiteConfig() {
    return {
      appName: this.appName,
      appUrl: this.appUrl,
      appDescription: this.appDescription,
      appLogoUrl: this.appLogoUrl,
    };
  }
}
