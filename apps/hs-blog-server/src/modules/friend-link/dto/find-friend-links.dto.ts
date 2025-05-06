import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FriendLinkStatus } from '../entities/friend-link.entity';

export class FindFriendLinksDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(FriendLinkStatus)
  status?: FriendLinkStatus;

  @IsOptional()
  @IsString()
  category?: string;
} 