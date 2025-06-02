import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleLike } from '../entities/article-like.entity';
import { Article } from '../entities/article.entity';
import { User } from '../../user/entities/user.entity';
import { ArticleLikeResponseDto } from '../dto/article-like.dto';
import { UserLevelService } from '@/modules/user/service/user-level.service';

// 定义点赞积分规则
const LIKE_POINTS = 2; // 点赞获得2积分

@Injectable()
export class ArticleLikeService {
  constructor(
    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly userLevelService: UserLevelService,
  ) {}

  /**
   * 点赞或取消点赞文章
   * @param articleId 文章ID
   * @param user 当前用户
   * @returns 点赞结果
   */
  async toggleLike(articleId: number, user: User) {
    const article = await this.articleRepository.findOne({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 检查用户是否已点赞
    const existingLike = await this.articleLikeRepository.findOne({
      where: { articleId, userId: user.id },
    });

    let liked: boolean;

    if (existingLike) {
      await this.articleLikeRepository.remove(existingLike);

      article.like_count = Math.max(0, article.like_count - 1);
      await this.articleRepository.save(article);
      
      liked = false;
    } else {
      const newLike = this.articleLikeRepository.create({
        articleId,
        userId: user.id,
      });
      await this.articleLikeRepository.save(newLike);

      article.like_count += 1;
      await this.articleRepository.save(article);
      
      // 增加用户积分
      await this.userLevelService.addUserPoints(user.id, LIKE_POINTS);
      
      liked = true;
    }

    return {
      liked,
      likeCount: article.like_count,
    };
  }

  /**
   * 检查用户是否已点赞文章
   * @param articleId 文章ID
   * @param userId 用户ID
   * @returns 是否已点赞
   */
  async checkUserLiked(articleId: number, userId: number): Promise<boolean> {
    const existingLike = await this.articleLikeRepository.findOne({
      where: { articleId, userId },
    });
    
    return !!existingLike;
  }

  /**
   * 获取文章点赞状态
   * @param articleId 文章ID
   * @param userId 用户ID
   * @returns 点赞状态
   */
  async getLikeStatus(articleId: number, userId: number): Promise<ArticleLikeResponseDto> {
    const article = await this.articleRepository.findOne({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    let liked = false;
    if (userId) {
      liked = await this.checkUserLiked(articleId, userId);
    }

    return {
      liked,
      likeCount: article.like_count,
    };
  }
} 