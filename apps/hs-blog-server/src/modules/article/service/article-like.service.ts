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
    // 验证参数
    if (!articleId || isNaN(articleId)) {
      throw new NotFoundException('无效的文章ID');
    }
    
    if (!user || !user.id) {
      throw new NotFoundException('用户未登录');
    }
    
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
    if (userId && !isNaN(userId)) {
      liked = await this.checkUserLiked(articleId, userId);
    }

    return {
      liked,
      likeCount: article.like_count,
    };
  }

  /**
   * 获取用户点赞的文章列表
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页条数
   * @returns 点赞的文章列表及分页信息
   */
  async getUserLikedArticles(userId: number, page: number = 1, limit: number = 10) {
    if (!userId) {
      return {
        items: [],
        total: 0,
        page,
        limit
      };
    }
    
    // 使用左连接查询用户点赞的文章，并获取文章详情
    const [items, total] = await this.articleLikeRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.article', 'article')
      .leftJoinAndSelect('article.category_id', 'category')
      .leftJoinAndSelect('article.articleTags', 'articleTags')
      .leftJoinAndSelect('articleTags.tag', 'tag')
      .where('like.userId = :userId', { userId })
      .andWhere('article.status = :status', { status: 2 }) // ArticleStatus.PUBLISH
      .orderBy('like.createdAt', 'DESC') // 按点赞时间倒序
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const articles = items.map(like => {
      const { article } = like;
      const { category_id, articleTags, content, likes, ...rest } = article;
      
      return {
        ...rest,
        category_id: category_id?.id,
        category_name: category_id?.name || '未分类',
        tags: articleTags?.map(at => ({
          id: at.tag.id,
          name: at.tag.name
        })) || [],
        liked: true
      };
    });
    
    return {
      items: articles,
      total,
      page,
      limit
    };
  }
} 