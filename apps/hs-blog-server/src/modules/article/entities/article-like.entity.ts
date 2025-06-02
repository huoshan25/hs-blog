import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Article } from './article.entity';
import { User } from '../../user/entities/user.entity';

@Entity('article_likes')
@Unique(['articleId', 'userId'])
export class ArticleLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'article_id',
    comment: '文章ID',
  })
  articleId: number;

  @Column({
    name: 'user_id',
    comment: '用户ID',
  })
  userId: number;

  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @ManyToOne(() => Article, article => article.likes)
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 