import { BullModuleOptions } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfig {
  constructor(private configService: ConfigService) {}

  createBullOptions(): BullModuleOptions {
    return {
      redis: {
        host: this.configService.get('REDIS_HOST', 'localhost'),
        port: this.configService.get('REDIS_PORT', 6379),
        password: this.configService.get('REDIS_PASSWORD', ''),
        db: this.configService.get('REDIS_DB', 0),
      },
      defaultJobOptions: {
        attempts: this.configService.get('BULL_JOB_ATTEMPTS', 3),
        removeOnComplete: this.configService.get('BULL_REMOVE_ON_COMPLETE', true),
        removeOnFail: this.configService.get('BULL_REMOVE_ON_FAIL', false),
      },
    };
  }
}
