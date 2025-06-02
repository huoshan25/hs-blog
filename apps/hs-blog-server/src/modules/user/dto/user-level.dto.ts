import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { UserLevel } from '@/enum/user-level.enum';

export class AddUserPointsDto {
  @ApiProperty({ description: '要增加的积分', example: 10 })
  @IsInt()
  @IsPositive()
  points: number;
}

export class UserLevelResponseDto {
  @ApiProperty({ description: '用户等级', enum: UserLevel, example: UserLevel.HY_1 })
  level: UserLevel;

  @ApiProperty({ description: '用户积分', example: 150 })
  points: number;

  @ApiProperty({ description: '当前等级积分', example: 150 })
  currentPoints: number;

  @ApiProperty({ description: '下一等级所需积分', example: 501 })
  nextLevelPoints: number;

  @ApiProperty({ description: '当前等级进度百分比', example: 30 })
  percentage: number;

  @ApiProperty({ description: '当前等级', enum: UserLevel, example: UserLevel.HY_1 })
  currentLevel: UserLevel;

  @ApiProperty({ description: '下一等级', enum: UserLevel, example: UserLevel.HY_2, nullable: true })
  nextLevel: UserLevel | null;
} 