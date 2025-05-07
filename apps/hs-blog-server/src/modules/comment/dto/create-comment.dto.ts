import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '评论内容', example: '这是一条评论' })
  @IsString()
  @IsNotEmpty({ message: '评论内容不能为空' })
  @MaxLength(1000, { message: '评论内容不能超过1000个字符' })
  content: string;

  @ApiProperty({ description: '文章ID', example: 1 })
  @IsInt()
  @IsNotEmpty({ message: '文章ID不能为空' })
  articleId: number;

  @ApiProperty({ 
    description: '父评论ID，用于回复功能', 
    example: 1, 
    required: false 
  })
  @IsOptional()
  @IsInt()
  parentId?: number;
  
  @ApiProperty({
    description: '被回复的评论ID，主要用于二级评论的回复关系',
    example: 2,
    required: false
  })
  @IsOptional()
  @IsInt()
  replyToId?: number;
  
  @ApiProperty({
    description: '被回复的用户名，用于前端显示',
    example: '张三',
    required: false
  })
  @IsOptional()
  @IsString()
  replyToUser?: string;
} 