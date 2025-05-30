import { Injectable, NotFoundException } from '@nestjs/common';
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

  /** 获取唯一的用户信息 */
  async getSingleBio(): Promise<UserBio | null> {
    const bios = await this.userBioRepository.find({
      take: 1,
      order: { id: 'ASC' },
    });
    return bios.length > 0 ? bios[0] : null;
  }

  /** 创建或更新用户信息 */
  async createOrUpdate(createUserBioDto: CreateUserBioDto): Promise<UserBio> {
    const existingBio = await this.getSingleBio();
    if (existingBio) {
      const updatedBio = Object.assign(existingBio, createUserBioDto);
      return await this.userBioRepository.save(updatedBio);
    } else {
      const userBio = this.userBioRepository.create(createUserBioDto);
      return await this.userBioRepository.save(userBio);
    }
  }

  /** 获取用户信息 */
  async getBio(): Promise<UserBio> {
    const bio = await this.getSingleBio();
    if (!bio) {
      throw new NotFoundException('用户信息不存在');
    }
    return bio;
  }

  /** 更新用户信息 */
  async update(updateUserBioDto: UpdateUserBioDto): Promise<UserBio> {
    const bio = await this.getBio();
    const updatedBio = Object.assign(bio, updateUserBioDto);
    return await this.userBioRepository.save(updatedBio);
  }

  /** 删除用户信息 */
  async remove(): Promise<void> {
    const bio = await this.getBio();
    await this.userBioRepository.remove(bio);
  }
}
