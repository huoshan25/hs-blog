import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class ArticleLikeDto {
  @ApiProperty({ description: '文章ID', example: 1 })
  @IsInt()
  @IsPositive()
  articleId: number;
}

export class ArticleLikeResponseDto {
  @ApiProperty({ description: '是否已点赞', example: true })
  liked: boolean;

  @ApiProperty({ description: '文章点赞数', example: 42 })
  likeCount: number;
} 