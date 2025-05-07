import {ConflictException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FriendLink, FriendLinkStatus } from '../entities/friend-link.entity';
import { CreateFriendLinkDto } from '../dto/create-friend-link.dto';
import { UpdateFriendLinkStatusDto } from '../dto/update-friend-link-status.dto';
import { FindFriendLinksDto } from '../dto/find-friend-links.dto';

@Injectable()
export class FriendLinkService {
  constructor(
    @InjectRepository(FriendLink)
    private friendLinkRepository: Repository<FriendLink>,
  ) {}

  /**
   * 创建友链申请
   * @param createFriendLinkDto 友链申请数据
   */
  async create(createFriendLinkDto: CreateFriendLinkDto): Promise<FriendLink> {
    const friendLink = this.friendLinkRepository.create({
      ...createFriendLinkDto,
      status: FriendLinkStatus.PENDING,
    });
    return this.friendLinkRepository.save(friendLink);
  }

  /**
   * 获取所有已批准的友链
   */
  async findAllApproved(): Promise<FriendLink[]> {
    return this.friendLinkRepository.find({
      where: { status: FriendLinkStatus.APPROVED },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 获取所有友链
   * @param findFriendLinksDto
   */
  async findAll(findFriendLinksDto?: FindFriendLinksDto) {
    const { name, status, category } = findFriendLinksDto || {};
    
    // 构建查询条件
    const whereConditions: any = {};
    
    if (name) {
      whereConditions.name = Like(`%${name}%`);
    }
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (category) {
      whereConditions.category = category;
    }
    
    return this.friendLinkRepository.find({
      where: whereConditions,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 查找单个友链
   * @param id 友链ID
   */
  async findOne(id: number): Promise<FriendLink> {
    return this.friendLinkRepository.findOneBy({ id });
  }

  /**
   * 更新友链状态
   * @param id 友链ID
   * @param updateStatusDto 状态更新数据
   */
  async updateStatus(id: number, updateStatusDto: UpdateFriendLinkStatusDto): Promise<FriendLink> {
    const friendLink = await this.friendLinkRepository.findOneBy({ id });
    
    if (!friendLink) {
      throw new Error('友链不存在');
    }

    // 更新状态
    friendLink.status = updateStatusDto.status;
    
    // 如果拒绝，记录拒绝原因
    if (updateStatusDto.status === FriendLinkStatus.REJECTED && updateStatusDto.rejectReason) {
      friendLink.rejectReason = updateStatusDto.rejectReason;
    }

    return this.friendLinkRepository.save(friendLink);
  }

  /**
   * 删除友链
   * @param id 友链ID
   */
  async remove(id: number): Promise<void> {
    await this.friendLinkRepository.delete(id);
  }

  /**
   * 检查友链是否存在
   * @param url 网站URL
   */
  async checkExists(url: string): Promise<boolean> {
    const count = await this.friendLinkRepository.count({
      where: { url },
    });

    if (count) {
      throw new ConflictException('该网站已申请过友链，请勿重复提交');
    }

    return count > 0;
  }
} 