import { Module } from '@nestjs/common';
import { OssConfigService } from './ali/service/ossConfig.service';
import { OssUploadService } from './ali/service/ossUpload.service';
import { OssFileManagementService } from './ali/service/ossFileManagement.service';
import { AliAdminController } from '@/modules/oss/ali/controller/ali-admin.controller';

@Module({
  controllers: [AliAdminController],
  providers: [OssConfigService, OssUploadService, OssFileManagementService],
  exports: [OssFileManagementService, OssUploadService, OssConfigService],
})
export class OssModule {}
