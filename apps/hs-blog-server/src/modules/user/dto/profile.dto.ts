import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class SkillItemDto {
  @ApiProperty({ description: '技能名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

class SkillDto {
  @ApiProperty({ description: '技能分类名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '技能列表', type: [SkillItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillItemDto)
  items?: SkillItemDto[];
}

class ProjectDto {
  @ApiProperty({ description: '项目名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '项目描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '技术栈', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech?: string[];

  @ApiProperty({ description: '项目链接', required: false })
  @IsOptional()
  @IsString()
  link?: string;
}

class ContactDto {
  @ApiProperty({ description: '平台名称', required: false })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ description: '联系方式链接', required: false })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ description: '图标', required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}

class SeoDto {
  @ApiProperty({ description: 'SEO标题', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'SEO描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'SEO关键词', required: false })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiProperty({ description: 'OG描述', required: false })
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiProperty({ description: 'Twitter描述', required: false })
  @IsOptional()
  @IsString()
  twitterDescription?: string;
}

export class UpdateProfileDto {
  @ApiProperty({ description: '姓名', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '职位', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '个人描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '个人简介列表', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bio?: string[];

  @ApiProperty({ description: '技能列表', type: [SkillDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills?: SkillDto[];

  @ApiProperty({ description: '项目列表', type: [ProjectDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];

  @ApiProperty({ description: '联系方式列表', type: [ContactDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  @ApiProperty({ description: 'SEO信息', type: SeoDto, required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SeoDto)
  seo?: SeoDto;
}