import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  /**
   * 创建评论
   * @param createCommentDto 评论内容
   * @param user 当前用户
   * @returns 创建的评论
   */
  async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    // 创建评论实体
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      articleId: createCommentDto.articleId,
      userId: user.id,
      parentId: createCommentDto.parentId || null,
    });

    // 保存评论
    return this.commentRepository.save(comment);
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

    await this.commentRepository.remove(comment);
  }
} 