import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { LoggerService } from '@/core/logger/logger.service';
import { UserConfigService } from '@/modules/user/service/user-config.service';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new LoggerService().setContext(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userConfigService: UserConfigService,
  ) {}

  async onModuleInit() {
    this.createAdminUser();
  }

  /**
   * 初始化创建管理员用户
   */
  async createAdminUser() {
    const adminUser = this.userConfigService.adminUserConfig;

    const existingUsername = await this.userRepository.findOne({
      where: { userName: adminUser.userName },
    });
    if (existingUsername) {
      this.logger.warn('用户名已存在');
      return;
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email: adminUser.email },
    });
    if (existingEmail) {
      this.logger.warn('邮箱已存在');
      return;
    }
    
    const hashedPassword = await this.hashPassword(adminUser.password);
    
    const adminUserToSave = {
      ...adminUser,
      password: hashedPassword
    };
    
    return this.userRepository.save(adminUserToSave);
  }

  /**
   * 创建用户
   * @param createUserDto 用户创建信息
   * @returns 创建的用户
   * @throws ConflictException 当用户名或邮箱已存在时
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查用户名是否已存在
    const existingUsername = await this.userRepository.findOne({
      where: { userName: createUserDto.userName },
    });
    if (existingUsername) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('邮箱已被注册');
    }

    // 加密密码
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // 创建用户
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  /**
   * 根据ID查找用户
   * @param id 用户ID
   * @returns 用户信息
   * @throws NotFoundException 当用户不存在时
   */
  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      // relations: ['posts', 'likes', 'favorites'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  /**
   * 根据用户名或邮箱查找用户
   * @param usernameOrEmail 用户名或邮箱
   * @returns 用户信息
   * @throws NotFoundException 当用户不存在时
   */
  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.userName = :usernameOrEmail', { usernameOrEmail })
      .orWhere('user.email = :usernameOrEmail', { usernameOrEmail })
      .getOne();

    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param updateUserDto 更新信息
   * @returns 更新后的用户信息
   * @throws NotFoundException 当用户不存在时
   * @throws ConflictException 当用户名或邮箱已存在时
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // // 如果要更新密码，需要加密
    // if (updateUserDto.password) {
    //   updateUserDto.password = await this.hashPassword(updateUserDto.password);
    // }

    // 如果要更新用户名，检查是否已存在
    if (updateUserDto.userName && updateUserDto.userName !== user.userName) {
      const existingUsername = await this.userRepository.findOne({
        where: { userName: updateUserDto.userName },
      });
      if (existingUsername) {
        throw new ConflictException('用户名已存在');
      }
    }

    // 如果要更新邮箱，检查是否已存在
    // if (updateUserDto.email && updateUserDto.email !== user.email) {
    //   const existingEmail = await this.userRepository.findOne({
    //     where: { email: updateUserDto.email },
    //   });
    //   if (existingEmail) {
    //     throw new ConflictException('邮箱已被注册');
    //   }
    // }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  /**
   * 验证密码
   * @param password 用户输入的密码
   * @param hashedPassword 数据库中存储的加密密码
   * @returns 密码是否匹配
   */
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * 加密密码
   * @param password 原始密码
   * @returns 加密后的密码
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  /**
   * 获取用户统计信息
   * @param userId 用户ID
   * @returns 用户的统计信息和基本信息
   */
  async getUserStats(userId: number) {
    const user = await this.findById(userId)
    return {
      ...user,
    };
  }

  /**
   * 根据邮箱查找用户
   * @param email 邮箱地址
   * @returns 用户信息
   * @throws NotFoundException 当用户不存在时
   */
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }
}
