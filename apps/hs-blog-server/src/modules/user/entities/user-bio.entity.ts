import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_bio')
export class UserBio {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '用户ID，自增主键',
  })
  id: number;

  @Column({
    name: 'name',
    unique: true,
    length: 50,
    comment: '名称',
  })
  name: string;

  @Column({
    name: 'avatar',
    comment: '头像url',
    nullable: true,
    length: 255,
  })
  avatar: string;

  @Column({
    name: 'bg_img',
    comment: '卡片背景图片地址',
    nullable: true,
    length: 255,
  })
  bgImg: string;

  @Column({
    name: 'description',
    length: 200,
    nullable: true,
    comment: '描述',
  })
  description: string;

  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;
}
