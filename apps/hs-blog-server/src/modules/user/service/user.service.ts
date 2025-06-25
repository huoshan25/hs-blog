import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { LoggerService } from '@/core/logger/logger.service';
import { UserConfigService } from '@/modules/user/service/user-config.service';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';

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

    if (updateUserDto.userName && updateUserDto.userName !== user.userName) {
      const existingUsername = await this.userRepository.findOne({
        where: { userName: updateUserDto.userName },
      });
      if (existingUsername) {
        throw new ConflictException('用户名已存在');
      }
    }

    await this.userRepository.update(id, updateUserDto);

    return this.findById(id);
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

  /**
   * 更新用户头像
   * @param userId 用户ID
   * @param avatarUrl 头像URL
   * @returns 更新后的用户信息
   */
  async updateAvatar(userId: number, avatarUrl: string): Promise<User> {
    const user = await this.findById(userId);
    user.avatar = avatarUrl;
    return this.userRepository.save(user);
  }

  /**
   * 更新用户密码
   * @param userId 用户ID
   * @param passwordDto 密码更新DTO
   * @returns 更新后的用户信息
   */
  async updatePassword(userId: number, passwordDto: UpdateUserPasswordDto): Promise<User> {
    // 获取用户信息，包括密码
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证旧密码
    const isPasswordValid = await this.validatePassword(
      passwordDto.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('旧密码不正确');
    }

    // 验证新密码与确认密码是否一致
    if (passwordDto.newPassword !== passwordDto.confirmPassword) {
      throw new ConflictException('新密码与确认密码不一致');
    }

    // 加密新密码
    const hashedPassword = await this.hashPassword(passwordDto.newPassword);
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }
}
