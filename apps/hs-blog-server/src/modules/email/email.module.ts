import { BullRootModule } from '@/core/bull/bull.module';
import { LoggerService } from '@/core/logger/logger.service';
import { RedisModule } from '@/core/redis/redis.module';
import { EmailProcessor } from '@/modules/email/processors/email.processor';
import { EmailConfigService } from '@/modules/email/service/email-config.service';
import { EmailService } from '@/modules/email/service/email.service';
import { EmailVerificationService } from '@/modules/email/service/email-verification.service';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullRootModule,
    RedisModule,
    /*注册队列名称*/
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [],
  providers: [EmailService, EmailConfigService, EmailProcessor, LoggerService, EmailVerificationService],
  exports: [EmailService, EmailVerificationService],
})
export class EmailModule {}
