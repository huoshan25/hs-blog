import {INestApplication, Injectable} from '@nestjs/common';
import {AppConfig} from '../config/app.config';
import {LoggerService} from '../logger/logger.service';
import {CategoryService} from '@/modules/category/service/category.service';

/**
 * 应用启动服务
 * 负责配置和启动 NestJS 应用
 */
@Injectable()
export class BootstrapService {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly logger: LoggerService,
    private readonly categoryService: CategoryService,
  ) {
    this.logger.setContext('Bootstrap');
  }

  /**
   * 配置应用
   * @param app NestJS 应用实例
   */
  async setup(app: INestApplication) {
    // 配置全局前缀
    app.setGlobalPrefix(this.appConfig.apiPrefix);

    // 配置跨域
    if (this.appConfig.enableCors) {
      app.enableCors({
        origin: this.appConfig.corsOrigin,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      });
    }

    this.logger.log('应用配置完成');
  }

  /**
   * 初始化应用数据
   * @param app NestJS 应用实例
   */
  async initializeData(app: INestApplication) {
    try {
      // 初始化分类数据
      await this.categoryService.seedDefaultCategories();
      this.logger.log('分类数据初始化完成');

      // 在这里可以添加其他数据初始化逻辑
      // 例如：标签、用户角色等

      this.logger.log('应用数据初始化完成');
    } catch (error) {
      this.logger.error('应用数据初始化失败', error.stack);
    }
  }

  /**
   * 启动应用
   * @param app NestJS 应用实例
   */
  async start(app: INestApplication) {
    const port = this.appConfig.port;
    await app.listen(port);

    this.logger.log(`应用已启动: http://localhost:${port}`);
    this.logger.log(`前台API文档: http://localhost:${port}/portal-api-docs`);
    this.logger.log(`后台API文档: http://localhost:${port}/admin-api-docs`);
    this.logger.log(`Knife4j 文档: http://localhost:${port}/doc.html`);
  }
}
