import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { User } from '@/modules/user/entities/user.entity';
import { CommentQueryDto } from '../dto/comment-query.dto';
import { UserLevelService } from '@/modules/user/service/user-level.service';

/**
 * 定义评论积分规则
 */
const COMMENT_POINTS = {
  /**创建评论获得10积分*/
  CREATE_COMMENT: 10,
  /**回复评论获得5积分*/
  REPLY_COMMENT: 5,
};

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userLevelService: UserLevelService,
  ) {}

  /**
   * 创建评论
   * @param createCommentDto 评论内容
   * @param user 当前用户
   * @returns 创建的评论
   */
  async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      articleId: createCommentDto.articleId,
      userId: user.id,
      parentId: createCommentDto.parentId || null,
      replyToId: createCommentDto.replyToId || null,
      replyToUser: createCommentDto.replyToUser || null,
    });
    
    // 保存评论
    const savedComment = await this.commentRepository.save(comment);
    
    // 根据评论类型增加用户积分
    if (comment.parentId || comment.replyToId) {
      // 如果是回复评论，增加回复积分
      await this.userLevelService.addUserPoints(user.id, COMMENT_POINTS.REPLY_COMMENT);
    } else {
      // 如果是新评论，增加评论积分
      await this.userLevelService.addUserPoints(user.id, COMMENT_POINTS.CREATE_COMMENT);
    }
    
    return savedComment;
  }

  /**
   * 获取文章的评论列表
   * @param articleId 文章ID
   * @returns 评论列表
   */
  async findByArticleId(articleId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { articleId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 删除评论
   * @param id 评论ID
   * @param user 当前用户
   * @returns void
   */
  async remove(id: number, user: User): Promise<void> {
    // 查找评论
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 只有评论作者或管理员可以删除评论
    if (comment.userId !== user.id && user.role !== 'admin') {
      throw new UnauthorizedException('无权删除该评论');
    }

    // 如果是顶级评论（没有parentId），则找出所有子评论一并删除
    if (comment.parentId === null) {
      // 查找该评论下的所有回复评论
      const childComments = await this.commentRepository.find({
        where: { parentId: comment.id },
      });
      
      // 先删除所有子评论
      if (childComments.length > 0) {
        await this.commentRepository.remove(childComments);
      }
    }

    // 删除当前评论
    await this.commentRepository.remove(comment);
  }

  /**
   * 管理员获取所有评论列表（分页和筛选）
   * @param queryDto 查询参数
   * @returns 评论列表和总数
   */
  async findAll(queryDto: CommentQueryDto) {
    const { page = 1, pageSize = 10, keyword, articleId } = queryDto;
    const skip = (page - 1) * pageSize;
    
    // 构建查询条件
    const where: any = {};
    if (keyword) {
      where.content = Like(`%${keyword}%`);
    }
    if (articleId) {
      where.articleId = articleId;
    }
    
    // 查询评论列表
    const [items, total] = await this.commentRepository.findAndCount({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });
    
    return {
      items,
      total,
    };
  }
  
  /**
   * 管理员删除评论（不需要权限检查）
   * @param id 评论ID
   * @returns void
   */
  async adminRemove(id: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });
    
    if (!comment) {
      throw new NotFoundException('评论不存在');
    }
    
    // 如果是顶级评论（没有parentId），则找出所有子评论一并删除
    if (comment.parentId === null) {
      // 查找该评论下的所有回复评论
      const childComments = await this.commentRepository.find({
        where: { parentId: comment.id },
      });
      
      // 先删除所有子评论
      if (childComments.length > 0) {
        await this.commentRepository.remove(childComments);
      }
    }
    
    // 删除当前评论
    await this.commentRepository.remove(comment);
  }
} 