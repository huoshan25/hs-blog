import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CommentQueryDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  pageSize?: number = 10;

  @ApiProperty({ description: '关键词搜索', example: '评论内容', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ description: '文章ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  articleId?: number;
} 