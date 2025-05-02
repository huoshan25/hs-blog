import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/database/database.module';
import { NestConfigModule } from '@/config/config.module';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';
import { LoggerService } from '@/core/logger/logger.service';
import { AppConfig } from '@/core/config/app.config';
import { RedisModule } from '@/core/redis/redis.module';
import { BullRootModule } from '@/core/bull/bull.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { EmailModule } from '@/modules/email/email.module';
import { UserModule } from '@/modules/user/user.module';
import { OssModule } from '@/modules/oss/oss.module';
import { LimModule } from '@/modules/lim/lim.module';
import { TtsModule } from '@/modules/tts/tts.module';
import { UrlPreviewModule } from '@/modules/url-preview/url-preview.module';
import { ArticleModule } from '@/modules/article/article.module';
import { CategoryModule } from '@/modules/category/category.module';
import { TagModule } from '@/modules/tag/tag.module';

@Module({
  imports: [
    NestConfigModule,
    DatabaseModule,
    RedisModule,
    BullRootModule,
    AuthModule,
    EmailModule,
    UserModule,
    LimModule,
    OssModule,
    TtsModule,
    UrlPreviewModule,
    ArticleModule,
    CategoryModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService, BootstrapService, LoggerService, AppConfig],
})
export class AppModule {}
