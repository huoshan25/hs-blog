import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

/**
 * 用户实体
 * @description 用户信息表，存储用户的基本信息、认证信息等
 */
@Entity('users')
export class User {
  /**
   * 用户ID
   * @description 自增主键
   */
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '用户ID，自增主键',
  })
  id: number;

  /**
   * 用户名
   * @description 用户登录和显示的用户名，唯一
   */
  @Column({
    name: 'user_name',
    unique: true,
    length: 50,
    comment: '用户名，唯一，最大长度50',
  })
  userName: string;

  /**
   * 邮箱
   * @description 用户邮箱地址，用于登录和接收通知，唯一
   */
  @Column({
    unique: true,
    length: 100,
    comment: '邮箱地址，唯一，最大长度100',
  })
  email: string;

  /**
   * 密码
   * @description 加密后的用户密码，默认不返回
   */
  @Column({
    select: false,
    length: 100,
    comment: '加密后的密码，默认不返回，最大长度100',
  })
  password: string;

  /**
   * 头像
   * @description 用户头像URL，可选
   */
  @Column({
    nullable: true,
    length: 255,
    comment: '头像URL，可选，最大长度255',
  })
  avatar: string;

  /**
   * 个人简介
   * @description 用户的个人简介，可选
   */
  @Column({
    nullable: true,
    length: 500,
    comment: '个人简介，可选，最大长度500',
  })
  bio: string;

  /**
   * 创建时间
   * @description 用户账号创建的时间戳
   */
  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  /**
   * 更新时间
   * @description 用户信息最后更新的时间戳
   */
  @UpdateDateColumn({
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;
}
