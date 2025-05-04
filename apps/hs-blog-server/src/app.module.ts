import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/database/database.module';
import { NestConfigModule } from '@/config/config.module';
import { BootstrapModule } from '@/core/bootstrap/bootstrap.module';
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
import { CommentModule } from '@/modules/comment/comment.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    NestConfigModule,
    DatabaseModule,
    RedisModule,
    BullRootModule,
    BootstrapModule,
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
    CommentModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class AppModule {}
