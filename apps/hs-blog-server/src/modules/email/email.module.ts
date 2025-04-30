import { BullRootModule } from '@/core/bull/bull.module';
import { LoggerService } from '@/core/logger/logger.service';
import { EmailProcessor } from '@/modules/email/processors/email.processor';
import { EmailConfigService } from '@/modules/email/service/email-config.service';
import { EmailService } from '@/modules/email/service/email.service';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullRootModule,
    /*注册队列名称*/
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [],
  providers: [EmailService, EmailConfigService, EmailProcessor, LoggerService],
  exports: [EmailService],
})
export class EmailModule {}
