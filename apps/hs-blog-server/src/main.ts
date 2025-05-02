import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { generateSwaggerDocument } from '@/config/swagger';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';
import { HttpExceptionFilterInterceptors } from '@/core/interceptors/http-exception.interceptors';
import { TransformInterceptors } from '@/core/interceptors/transform.interceptors';
import { CustomValidationPipe } from '@/common/pipes/validation.pipe';
import { CategoryService } from '@/modules/category/service/category.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const bootstrapService = app.get(BootstrapService);
  // 注入CategoriesService并调用seedDefaultCategories方法
  const categoriesService = app.get(CategoryService);
  await categoriesService.seedDefaultCategories();

  /**配置静态资源目录*/
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/',
  });

  /**把自定义过滤器应用为全局过滤器*/
  app.useGlobalFilters(new HttpExceptionFilterInterceptors());

  /*统一响应*/
  app.useGlobalInterceptors(new TransformInterceptors());

  /*全局通用管道配置*/
  app.useGlobalPipes(new CustomValidationPipe());

  await bootstrapService.setup(app);

  generateSwaggerDocument(app);

  await bootstrapService.start(app);
}

bootstrap();
