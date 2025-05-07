import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

/**
 * 评论实体
 * @description 博客文章评论
 */
@Entity('comments')
export class Comment {
  /**
   * 评论ID
   * @description 自增主键
   */
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '评论ID，自增主键',
  })
  id: number;

  /**
   * 评论内容
   * @description 评论的文本内容
   */
  @Column({
    type: 'text',
    comment: '评论内容',
  })
  content: string;

  /**
   * 关联的文章ID
   * @description 评论所属的文章ID
   */
  @Column({
    name: 'article_id',
    type: 'int',
    comment: '关联的文章ID',
  })
  articleId: number;

  /**
   * 用户ID
   * @description 发表评论的用户ID
   */
  @Column({
    name: 'user_id',
    type: 'int',
    comment: '用户ID',
  })
  userId: number;

  /**
   * 用户
   * @description 发表评论的用户
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * 父评论ID
   * @description 如果是回复其他评论，则为父评论ID；否则为null
   */
  @Column({
    name: 'parent_id',
    type: 'int',
    nullable: true,
    comment: '父评论ID，用于回复功能',
  })
  parentId: number | null;
  
  /**
   * 被回复的评论ID
   * @description 如果是回复二级评论，则记录该评论的ID
   */
  @Column({
    name: 'reply_to_id',
    type: 'int',
    nullable: true,
    comment: '被回复的评论ID，用于二级评论的回复关系',
  })
  replyToId: number | null;
  
  /**
   * 被回复的用户名
   * @description
   */
  @Column({
    name: 'reply_to_user',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '被回复的用户名，用于前端显示',
  })
  replyToUser: string | null;

  /**
   * 创建时间
   * @description 评论创建的时间戳
   */
  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  /**
   * 更新时间
   * @description 评论最后更新的时间戳
   */
  @UpdateDateColumn({
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;
} 