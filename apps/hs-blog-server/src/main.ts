import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { generateSwaggerDocument } from '@/config/swagger';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';
import { HttpExceptionFilterInterceptors } from '@/core/interceptors/http-exception.interceptors';
import { TransformInterceptors } from '@/core/interceptors/transform.interceptors';
import { CustomValidationPipe } from '@/common/pipes/validation.pipe';
import { LoggerService } from '@/core/logger/logger.service';

async function bootstrap() {
  const logger = new LoggerService().setContext('main');
  
  try {
    logger.log('开始创建应用实例...');
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    logger.log('获取BootstrapService...');
    const bootstrapService = app.get(BootstrapService);

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

    await bootstrapService.initializeData(app);

    generateSwaggerDocument(app);

    await bootstrapService.start(app);
    
    logger.log('应用启动完成!');
  } catch (error) {
    logger.error(`应用启动失败: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error('无法启动应用:', err);
  process.exit(1);
});
