import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LEVEL_POINTS, UserLevel } from '@/enum/user-level.enum';

@Injectable()
export class UserLevelService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 根据积分获取对应的等级
   * @param points 用户积分
   * @returns 用户等级
   */
  getLevelByPoints(points: number): UserLevel {
    for (const [level, range] of Object.entries(LEVEL_POINTS)) {
      if (points >= range.min && points <= range.max) {
        return level as UserLevel;
      }
    }
    return UserLevel.HY_1; // 默认等级
  }

  /**
   * 获取用户当前等级的进度
   * @param points 用户积分
   * @returns 进度信息 { currentPoints, nextLevelPoints, percentage }
   */
  getLevelProgress(points: number): { 
    currentPoints: number; 
    nextLevelPoints: number; 
    percentage: number;
    currentLevel: UserLevel;
    nextLevel: UserLevel | null;
  } {
    const currentLevel = this.getLevelByPoints(points);
    const currentLevelInfo = LEVEL_POINTS[currentLevel];
    
    // 如果是最高等级
    if (currentLevel === UserLevel.HY_10) {
      return {
        currentPoints: points,
        nextLevelPoints: currentLevelInfo.max,
        percentage: 100,
        currentLevel,
        nextLevel: null,
      };
    }
    
    // 计算下一个等级
    const levels = Object.keys(LEVEL_POINTS) as UserLevel[];
    const currentIndex = levels.indexOf(currentLevel);
    const nextLevel = levels[currentIndex + 1];
    const nextLevelInfo = LEVEL_POINTS[nextLevel];
    
    // 计算百分比
    const levelRange = currentLevelInfo.max - currentLevelInfo.min;
    const pointsInLevel = points - currentLevelInfo.min;
    const percentage = Math.min(Math.round((pointsInLevel / levelRange) * 100), 100);
    
    return {
      currentPoints: points,
      nextLevelPoints: nextLevelInfo.min,
      percentage,
      currentLevel,
      nextLevel,
    };
  }

  /**
   * 增加用户积分并更新等级
   * @param userId 用户ID
   * @param pointsToAdd 要增加的积分
   * @returns 更新后的用户信息
   */
  async addUserPoints(userId: number, pointsToAdd: number): Promise<User> {
    // 验证参数
    if (!userId || isNaN(userId)) {
      throw new Error('无效的用户ID');
    }
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 更新积分
    user.points += pointsToAdd;
    
    // 更新等级
    const newLevel = this.getLevelByPoints(user.points);
    user.level = newLevel;

    return this.userRepository.save(user);
  }

  /**
   * 获取用户的等级和积分信息
   * @param userId 用户ID
   * @returns 用户等级信息
   */
  async getUserLevelInfo(userId: number): Promise<{
    level: UserLevel;
    points: number;
    progress: ReturnType<UserLevelService['getLevelProgress']>;
  }> {
    // 验证参数
    if (!userId || isNaN(userId)) {
      throw new Error('无效的用户ID');
    }
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }
    
    const progress = this.getLevelProgress(user.points);
    
    return {
      level: user.level,
      points: user.points,
      progress,
    };
  }
} 