import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './service/category.service';
import { Category } from './entities/category.entity';
import { ArticleModule } from '../article/article.module';
import { OssModule } from '../oss/oss.module';
import { CategoryAdminController } from '@/modules/category/controller/category-admin.controller';
import { CategoryBlogController } from '@/modules/category/controller/category-blog.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    ArticleModule, //导入文章模块1
    OssModule,
  ],
  controllers: [CategoryAdminController, CategoryBlogController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
