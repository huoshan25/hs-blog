import { RedisModule } from '@/core/redis/redis.module';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { EmailModule } from '@/modules/email/email.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserBlogController } from '@/modules/user/controller/user-blog.controller';
import { ProfileService } from '@/modules/user/service/profile.service';
import { UserService } from '@/modules/user/service/user.service';
import { Profile } from '@/modules/user/entities/profile.entity';
import { UserAdminController } from '@/modules/user/controller/user-admin.controller';
import { UserConfigService } from "@/modules/user/service/user-config.service";
import { UserBio } from '@/modules/user/entities/user-bio.entity';
import { UserBioService } from '@/modules/user/service/user-bio.service';
import { UserBioAdminController } from '@/modules/user/controller/user-bio-admin.controller';
import { OssModule } from '@/modules/oss/oss.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, UserBio]),
    RedisModule,
    EmailModule,
    forwardRef(() => AuthModule),
    DatabaseModule,
    OssModule,
  ],
  providers: [UserService, ProfileService, UserConfigService, UserBioService],
  exports: [UserService, UserBioService],
  controllers: [UserBlogController, UserAdminController, UserBioAdminController],
})
export class UserModule {}
