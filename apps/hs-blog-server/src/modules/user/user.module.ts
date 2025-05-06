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
import {UserConfigService} from "@/modules/user/service/user-config.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    RedisModule,
    EmailModule,
    forwardRef(() => AuthModule),
    DatabaseModule,
  ],
  providers: [UserService, ProfileService, UserConfigService],
  exports: [UserService],
  controllers: [UserBlogController, UserAdminController],
})
export class UserModule {}
