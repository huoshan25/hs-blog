import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBio } from '../entities/user-bio.entity';
import { CreateUserBioDto, UpdateUserBioDto } from '../dto/user-bio.dto';

@Injectable()
export class UserBioService {
  constructor(
    @InjectRepository(UserBio)
    private readonly userBioRepository: Repository<UserBio>,
  ) {}

  /**
   * 获取唯一的用户生物信息
   * 如果不存在则返回null
   * @returns 用户生物信息或null
   */
  async getSingleBio(): Promise<UserBio | null> {
    const bios = await this.userBioRepository.find({
      take: 1,
      order: { id: 'ASC' }
    });
    console.log(bios,'bios')
    return bios.length > 0 ? bios[0] : null;
  }

  /**
   * 创建或更新用户生物信息
   * 如果已存在则更新，不存在则创建
   * @param createUserBioDto 创建用户生物信息DTO
   * @returns 创建或更新的用户生物信息
   */
  async createOrUpdate(createUserBioDto: CreateUserBioDto): Promise<UserBio> {
    const existingBio = await this.getSingleBio();
    if (existingBio) {
      // 如果已存在记录，则更新它
      const updatedBio = Object.assign(existingBio, createUserBioDto);
      return await this.userBioRepository.save(updatedBio);
    } else {
      // 如果不存在记录，则创建新记录
      const userBio = this.userBioRepository.create(createUserBioDto);
      return await this.userBioRepository.save(userBio);
    }
  }

  /**
   * 获取用户生物信息
   * 如果不存在则抛出异常
   * @returns 用户生物信息
   */
  async getBio(): Promise<UserBio> {
    const bio = await this.getSingleBio();
    if (!bio) {
      throw new NotFoundException('用户生物信息不存在');
    }
    console.log(bio,'bio')
    return bio;
  }

  /**
   * 更新用户生物信息
   * @param updateUserBioDto 更新用户生物信息DTO
   * @returns 更新后的用户生物信息
   */
  async update(updateUserBioDto: UpdateUserBioDto): Promise<UserBio> {
    const bio = await this.getBio();
    const updatedBio = Object.assign(bio, updateUserBioDto);
    return await this.userBioRepository.save(updatedBio);
  }

  /**
   * 删除用户生物信息
   * @returns 删除结果
   */
  async remove(): Promise<void> {
    const bio = await this.getBio();
    await this.userBioRepository.remove(bio);
  }
} 