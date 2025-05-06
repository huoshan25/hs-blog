import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum FriendLinkStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Entity('friend_links')
export class FriendLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  url: string;

  @Column({ length: 255 })
  avatar: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({
    type: 'enum',
    enum: FriendLinkStatus,
    default: FriendLinkStatus.PENDING
  })
  status: FriendLinkStatus;

  @Column({ nullable: true, length: 500 })
  rejectReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 