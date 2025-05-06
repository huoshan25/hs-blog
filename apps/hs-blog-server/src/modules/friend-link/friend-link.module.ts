import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendLink } from './entities/friend-link.entity';
import { FriendLinkService } from './service/friend-link.service';
import { FriendLinkBlogController } from './controller/friend-link-blog.controller';
import { FriendLinkAdminController } from './controller/friend-link-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FriendLink])],
  controllers: [FriendLinkBlogController, FriendLinkAdminController],
  providers: [FriendLinkService],
  exports: [FriendLinkService],
})
export class FriendLinkModule {} 