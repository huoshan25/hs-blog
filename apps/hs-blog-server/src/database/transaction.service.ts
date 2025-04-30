import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';

/**
 * 数据库事务服务 - 提供统一的事务管理功能
 *
 * 该服务封装了TypeORM的事务管理API，使事务操作更加便捷和一致。
 * 支持两种主要的事务执行模式：
 * 1. 使用简单的回调函数执行事务（自动提交/回滚）
 * 2. 使用查询运行器手动控制事务流程
 */
@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  /**
   * 构造函数 - 注入数据源
   * @param dataSource TypeORM数据源，由NestJS依赖注入系统提供
   */
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.logger.log('事务服务初始化完成');
  }

  /**
   * 在单个事务中执行回调函数
   *
   * 该方法会自动开启事务，执行回调，并根据执行结果提交或回滚事务。
   * 如果回调函数抛出异常，事务将自动回滚，并重新抛出异常。
   *
   * @param callback 在事务中执行的回调函数，接收EntityManager参数
   * @returns 回调函数的返回值
   * @throws 回调函数抛出的任何异常
   *
   * @example
   * // 创建用户及其关联资料
   * const result = await this.transactionService.executeInTransaction(async (manager) => {
   *   // 创建用户
   *   const user = new User();
   *   user.username = 'johndoe';
   *   user.email = 'john@example.com';
   *   const savedUser = await manager.save(user);
   *
   *   // 创建用户资料
   *   const profile = new UserProfile();
   *   profile.userId = savedUser.id;
   *   profile.fullName = 'John Doe';
   *   await manager.save(profile);
   *
   *   return savedUser;
   * });
   */
  async executeInTransaction<T>(
    callback: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction<T>(async (manager) => {
      try {
        this.logger.debug('开始执行事务');
        const result = await callback(manager);
        this.logger.debug('事务执行成功，准备提交');
        return result;
      } catch (error) {
        this.logger.error(`事务执行失败，将回滚: ${error.message}`);
        throw error;
      }
    });
  }

  /**
   * 获取TypeORM查询运行器
   *
   * 查询运行器允许手动控制事务的生命周期。
   * 注意：使用后必须手动释放查询运行器（release方法）。
   *
   * @returns 已连接的查询运行器实例
   *
   * @example
   * // 手动管理事务生命周期
   * const queryRunner = await this.transactionService.createQueryRunner();
   * try {
   *   await queryRunner.startTransaction();
   *
   *   const userRepo = queryRunner.manager.getRepository(User);
   *   await userRepo.save({ username: 'alice' });
   *
   *   await queryRunner.commitTransaction();
   * } catch (error) {
   *   if (queryRunner.isTransactionActive) {
   *     await queryRunner.rollbackTransaction();
   *   }
   *   throw error;
   * } finally {
   *   // 务必释放查询运行器
   *   await queryRunner.release();
   * }
   */
  async createQueryRunner(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    return queryRunner;
  }

  /**
   * 使用查询运行器执行事务，提供更细粒度的控制
   *
   * 该方法自动处理事务的启动、提交/回滚和查询运行器的释放，
   * 同时向回调函数提供查询运行器实例，允许更复杂的事务控制。
   *
   * @param callback 接收EntityManager和QueryRunner的回调函数
   * @returns 回调函数的返回值
   * @throws 回调函数抛出的任何异常（事务会自动回滚）
   *
   * @example
   * // 需要保存点的复杂事务
   * await this.transactionService.executeWithQueryRunner(async (manager, queryRunner) => {
   *   // 第一阶段：创建用户
   *   const user = await manager.save(User, {
   *     username: 'testuser',
   *     email: 'test@example.com'
   *   });
   *
   *   // 创建保存点
   *   await queryRunner.startTransaction();
   *
   *   try {
   *     // 第二阶段：尝试一些可能失败的操作
   *     const settings = await manager.save(UserSettings, {
   *       userId: user.id,
   *       theme: 'dark'
   *     });
   *
   *     // 如果成功，提交内部事务（保存点）
   *     await queryRunner.commitTransaction();
   *   } catch (error) {
   *     // 只回滚到保存点，保留用户创建操作
   *     if (queryRunner.isTransactionActive) {
   *       await queryRunner.rollbackTransaction();
   *     }
   *     console.log('设置创建失败，但用户已创建');
   *   }
   *
   *   // 返回创建的用户（无论设置是否创建成功）
   *   return user;
   * });
   */
  async executeWithQueryRunner<T>(
    callback: (manager: EntityManager, queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = await this.createQueryRunner();

    try {
      this.logger.debug('开始执行查询运行器事务');
      await queryRunner.startTransaction();

      const result = await callback(queryRunner.manager, queryRunner);

      // 只有在事务仍然活跃时才提交（回调可能已经提交或回滚）
      if (queryRunner.isTransactionActive) {
        this.logger.debug('查询运行器事务执行成功，准备提交');
        await queryRunner.commitTransaction();
      }

      return result;
    } catch (error) {
      this.logger.error(`查询运行器事务执行失败: ${error.message}`);
      if (queryRunner.isTransactionActive) {
        this.logger.debug('回滚查询运行器事务');
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      this.logger.debug('释放查询运行器');
      await queryRunner.release();
    }
  }

  /**
   * 检查是否已在事务中
   *
   * 用于判断当前是否处于活动事务中，以便根据情况决定是否需要创建新事务。
   * 主要用于可能嵌套调用的服务方法。
   *
   * @param manager 实体管理器实例
   * @returns 如果已在事务中返回true，否则返回false
   *
   * @example
   * async doSomething(manager?: EntityManager) {
   *   // 检查是否需要创建新事务
   *   if (manager && this.transactionService.isInTransaction(manager)) {
   *     // 已在事务中，直接使用提供的manager
   *     return this.performOperations(manager);
   *   } else {
   *     // 不在事务中，创建新事务
   *     return this.transactionService.executeInTransaction(
   *       (txManager) => this.performOperations(txManager)
   *     );
   *   }
   * }
   */
  isInTransaction(manager: EntityManager): boolean {
    return manager.queryRunner?.isTransactionActive ?? false;
  }

  /**
   * 执行事务或使用已有事务
   *
   * 如果提供了已在事务中的EntityManager，则直接使用它。
   * 否则，创建新的事务来执行操作。
   * 这在嵌套服务调用场景中特别有用。
   *
   * @param managerOrCallback 实体管理器或回调函数
   * @param callback 可选的回调函数（当第一个参数是EntityManager时）
   * @returns 回调函数的返回值
   *
   * @example
   * // 在服务方法中同时支持事务和非事务调用
   * async createUser(userData: UserDto, manager?: EntityManager) {
   *   return this.transactionService.executeWithExistingManager(
   *     manager,
   *     async (txManager) => {
   *       const user = new User();
   *       user.username = userData.username;
   *       await txManager.save(user);
   *
   *       // 调用其他服务方法，传递同一个事务
   *       await this.profileService.createProfile({
   *         userId: user.id,
   *         ...userData.profile
   *       }, txManager);
   *
   *       return user;
   *     }
   *   );
   * }
   */
  async executeWithExistingManager<T>(
    managerOrCallback: EntityManager | ((manager: EntityManager) => Promise<T>),
    callback?: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    // 检查第一个参数是否是EntityManager
    if (managerOrCallback instanceof EntityManager) {
      // 如果提供了EntityManager，使用现有事务
      const manager = managerOrCallback;
      if (!callback) {
        throw new Error('必须提供回调函数');
      }

      return callback(manager);
    } else {
      // 如果第一个参数是回调函数，创建新事务
      return this.executeInTransaction(managerOrCallback);
    }
  }

  /**
   * 获取实体仓库
   *
   * 辅助方法，用于从EntityManager获取特定实体的仓库。
   *
   * @param manager 实体管理器
   * @param entity 实体类
   * @returns 实体仓库
   *
   * @example
   * await this.transactionService.executeInTransaction(async (manager) => {
   *   // 获取用户仓库
   *   const userRepo = this.transactionService.getRepository(manager, User);
   *
   *   // 使用仓库API
   *   const user = await userRepo.findOne({ where: { id: 1 } });
   *   user.lastLoginAt = new Date();
   *   return userRepo.save(user);
   * });
   */
  getRepository<Entity>(manager: EntityManager, entity: new () => Entity): Repository<Entity> {
    return manager.getRepository(entity);
  }
}
