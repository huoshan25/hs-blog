import { forwardRef, Logger, Module } from '@nestjs/common';
import { ArticleService } from './service/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Category } from '../category/entities/category.entity';
import { OssModule } from '../oss/oss.module';
import { ArticleTag } from './entities/article-tag.entity';
import { TagModule } from '../tag/tag.module';
import { ArticleContentService } from './service/article-content.service';
import { ArticleAdminController } from '@/modules/article/controller/article-admin.controller';
import { ArticleBlogController } from '@/modules/article/controller/article-blog.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Category, ArticleTag]),
    forwardRef(() => TagModule),
    OssModule,
  ],
  controllers: [ArticleAdminController, ArticleBlogController],
  providers: [ArticleService, Logger, ArticleContentService],
  exports: [TypeOrmModule, ArticleContentService],
})
export class ArticleModule {}
