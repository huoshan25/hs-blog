import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '用户名', example: 'johndoe', required: false })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(2, { message: '用户名长度不能小于2位' })
  userName?: string;

  // @ApiProperty({ description: '邮箱地址', example: 'john@example.com', required: false })
  // @IsOptional()
  // @IsEmail()
  // email?: string;

  // @ApiProperty({ description: '密码', example: 'password123', required: false })
  // @IsOptional()
  // @IsString()
  // @MinLength(6)
  // @MaxLength(20)
  // password?: string;

  @ApiProperty({
    description: '头像URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string;

  @ApiProperty({ description: '个人简介', example: '这是一段个人简介', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
