import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { ArticleStatus, ArticleType } from '../entities/article.entity';
import { Transform } from 'class-transformer';
import { Category } from '../../category/entities/category.entity';

export class CreateArticleDto {
  @IsNotEmpty({ message: "文章标题必填" })
  readonly title: string;

  @ValidateIf(o => o.type === ArticleType.ORIGINAL)
  @IsNotEmpty({ message: "文章内容必填" })
  readonly content: string;

  @IsNotEmpty({ message: "文章分类必填" })
  readonly category_id: Category;

  @ValidateIf(o => o.type === ArticleType.ORIGINAL)
  @IsNotEmpty({ message: "缺少文章描述" })
  @MaxLength(100, { message: "文章摘要不能超过100个字符" })
  readonly description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tagNames?: string[];

  @IsNotEmpty({ message: "文章状态必填" })
  @IsEnum(ArticleStatus, { message: "错误状态码" })
  @Transform(({ value }) => parseInt(value, 10))
  readonly status: number;

  @IsNotEmpty({ message: "临时UUID必填" })
  @IsString()
  readonly articleUUID: string;
}