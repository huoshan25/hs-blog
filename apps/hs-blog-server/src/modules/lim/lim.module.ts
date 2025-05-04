import { Module } from '@nestjs/common';
import { LimService } from './service/lim.service';
import { ConfigModule } from '@nestjs/config';
import { LimConfigService } from './service/lim-config.service';
import { OssUploadService } from '../oss/ali/service/ossUpload.service';
import { OssModule } from '../oss/oss.module';
import { TtsModule } from '../tts/tts.module';
import {LimAdminController} from "@/modules/lim/controller/lim-admin.controller";
import {LimBlogController} from "@/modules/lim/controller/lim-blog.controller";

@Module({
  imports: [ConfigModule, OssModule, TtsModule],
  controllers: [LimAdminController, LimBlogController],
  providers: [LimConfigService, LimService, OssUploadService],
})

export class LimModule {}