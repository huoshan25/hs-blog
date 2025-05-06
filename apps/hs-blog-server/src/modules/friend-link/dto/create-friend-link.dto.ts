import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateFriendLinkDto {
  @IsNotEmpty({ message: '网站名称不能为空' })
  @IsString({ message: '网站名称必须是字符串' })
  @MaxLength(100, { message: '网站名称不能超过100个字符' })
  name: string;

  @IsNotEmpty({ message: '网站地址不能为空' })
  @IsUrl({}, { message: '请输入有效的URL' })
  @MaxLength(255, { message: '网站地址不能超过255个字符' })
  url: string;

  @IsNotEmpty({ message: '头像地址不能为空' })
  @IsUrl({}, { message: '请输入有效的头像URL' })
  @MaxLength(255, { message: '头像地址不能超过255个字符' })
  avatar: string;

  @IsNotEmpty({ message: '网站描述不能为空' })
  @IsString({ message: '网站描述必须是字符串' })
  @MaxLength(500, { message: '网站描述不能超过500个字符' })
  description: string;

  @IsNotEmpty({ message: '网站分类不能为空' })
  @IsString({ message: '网站分类必须是字符串' })
  @MaxLength(100, { message: '网站分类不能超过100个字符' })
  category: string;

  @IsOptional()
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @MaxLength(100, { message: '邮箱地址不能超过100个字符' })
  email?: string;
} 