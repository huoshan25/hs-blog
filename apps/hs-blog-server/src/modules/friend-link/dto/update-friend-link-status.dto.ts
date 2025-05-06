import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { FriendLinkStatus } from '../entities/friend-link.entity';

export class UpdateFriendLinkStatusDto {
  @IsNotEmpty({ message: '状态不能为空' })
  @IsEnum(FriendLinkStatus, { message: '无效的友链状态' })
  status: FriendLinkStatus;

  @IsOptional()
  @IsString({ message: '拒绝原因必须是字符串' })
  @MaxLength(500, { message: '拒绝原因不能超过500个字符' })
  rejectReason?: string;
} 