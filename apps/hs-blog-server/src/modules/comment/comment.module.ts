import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentService } from './service/comment.service';
import { CommentBlogController } from './controller/comment-blog.controller';
import { CommentAdminController } from './controller/comment-admin.controller';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), AuthModule],
  controllers: [CommentBlogController, CommentAdminController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
