import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CategoryService } from '@/modules/category/service/category.service';

/**
 * 数据初始化服务
 * 负责在应用启动时初始化必要的数据
 */
@Injectable()
export class DataInitializerService implements OnModuleInit {
  private readonly logger = new Logger(DataInitializerService.name);

  constructor(
    private readonly categoryService: CategoryService,
    // 可以在这里注入其他需要初始化数据的服务
  ) {
    this.logger.log('DataInitializerService构造函数被调用');
  }

  /**
   * NestJS生命周期钩子，在模块初始化时自动调用
   */
  async onModuleInit() {
    this.logger.log('DataInitializerService.onModuleInit被调用');
    await this.initializeAllData();
  }

  /**
   * 初始化所有必要的数据
   */
  async initializeAllData() {
    try {
      this.logger.log('开始初始化所有数据...');
      await this.initializeCategories();

      this.logger.log('所有数据初始化完成');
    } catch (error) {
      this.logger.error('数据初始化过程中发生错误', error.stack);
    }
  }

  /**
   * 初始化分类数据
   */
  private async initializeCategories() {
    try {
      this.logger.log('开始初始化分类数据...');
      if (!this.categoryService) {
        this.logger.error('CategoryService未被正确注入!');
        return;
      }
      
      await this.categoryService.seedDefaultCategories();
      this.logger.log('分类数据初始化完成');
    } catch (error) {
      this.logger.error(`分类数据初始化失败: ${error.message}`, error.stack);
      // 不要重新抛出错误，以避免整个初始化过程失败
    }
  }

  // 可以添加其他初始化方法，如标签、角色等
} 