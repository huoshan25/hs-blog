import { ApiProperty } from '@nestjs/swagger';
import {Expose} from "class-transformer";

export class UserBioVo {
  @Expose()
  @ApiProperty({ description: '用户ID' })
  id: number;

  @Expose()
  @ApiProperty({ description: '名称' })
  name: string;

  @Expose()
  @ApiProperty({ description: '头像URL' })
  avatar: string;

  @Expose()
  @ApiProperty({ description: '背景图片URL' })
  bgImg: string;

  @Expose()
  @ApiProperty({ description: '个人描述' })
  description: string;

  @Expose()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
} 