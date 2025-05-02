import { RedisModule } from '@/core/redis/redis.module';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { EmailModule } from '@/modules/email/email.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserBlogController } from '@/modules/user/controller/user-blog.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
    EmailModule,
    forwardRef(() => AuthModule),
    DatabaseModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserBlogController],
})
export class UserModule {}
