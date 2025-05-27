import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserBioDto {
  @ApiProperty({ description: '用户名称', example: '张三' })
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称必须是字符串' })
  @MaxLength(50, { message: '名称长度不能超过50个字符' })
  name: string;

  @ApiProperty({ description: '头像URL', required: false, example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString({ message: '头像URL必须是字符串' })
  @MaxLength(255, { message: '头像URL长度不能超过255个字符' })
  avatar?: string;

  @ApiProperty({ description: '背景图片URL', required: false, example: 'https://example.com/bg.jpg' })
  @IsOptional()
  @IsString({ message: '背景图片URL必须是字符串' })
  @MaxLength(255, { message: '背景图片URL长度不能超过255个字符' })
  bgImg?: string;

  @ApiProperty({ description: '个人描述', required: false, example: '这是我的个人介绍' })
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  @MaxLength(200, { message: '描述长度不能超过200个字符' })
  description?: string;
}

export class UpdateUserBioDto extends CreateUserBioDto {} 