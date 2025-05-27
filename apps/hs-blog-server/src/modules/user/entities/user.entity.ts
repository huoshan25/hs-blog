import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '@/enum/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '用户ID，自增主键',
  })
  id: number;

  @Column({
    name: 'user_name',
    unique: true,
    length: 50,
    comment: '用户名，唯一，最大长度50',
  })
  userName: string;

  @Column({
    unique: true,
    length: 100,
    comment: '邮箱地址，唯一，最大长度100',
  })
  email: string;

  @Column({
    select: false,
    length: 100,
    comment: '加密后的密码，默认不返回，最大长度100',
  })
  password: string;

  @Column({
    nullable: true,
    length: 255,
    comment: '头像URL，可选，最大长度255',
  })
  avatar: string;

  @Column({
    nullable: true,
    length: 500,
    comment: '个人简介，可选，最大长度500',
  })
  bio: string;

  @Column({
    type: 'varchar',
    default: UserRole.USER,
    length: 10,
    comment: '用户角色，admin: 管理员，user: 普通用户',
  })
  role: UserRole;

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
