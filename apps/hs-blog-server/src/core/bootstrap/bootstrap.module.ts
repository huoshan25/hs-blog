import { Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { DataInitializerService } from './data-initializer.service';
import { CategoryModule } from '@/modules/category/category.module';
import { AppConfig } from '@/core/config/app.config';
import { LoggerModule } from '@/core/logger/logger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LoggerModule, ConfigModule, CategoryModule],
  providers: [BootstrapService, DataInitializerService, AppConfig],
  exports: [BootstrapService, DataInitializerService],
})
export class BootstrapModule {}
